import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User as FirebaseUser, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { User } from '@shared/schema';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signUp: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              id: firebaseUser.uid,
              uid: firebaseUser.uid,
              username: userData.username,
              displayName: userData.username,
              createdAt: userData.createdAt?.toDate() || new Date(),
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (username: string, password: string) => {
    try {
      // バリデーション
      if (username.length < 3) {
        throw new Error("ユーザー名は3文字以上で入力してください。");
      }
      if (password.length < 6) {
        throw new Error("パスワードは6文字以上で入力してください。");
      }

      const fakeEmail = `${username.toLowerCase()}@pokeapp.local`;
      console.log("Signing in with email:", fakeEmail);
      
      await signInWithEmailAndPassword(auth, fakeEmail, password);
      console.log("Sign in successful");
    } catch (error: any) {
      console.error("SignIn error:", error);
      
      // Firebase特有のエラーメッセージを日本語に変換
      if (error?.code) {
        switch (error.code) {
          case 'auth/user-not-found':
            throw new Error("このユーザー名は登録されていません。");
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
          case 'auth/invalid-login-credentials':
            throw new Error("パスワードが間違っています。");
          case 'auth/too-many-requests':
            throw new Error("ログイン試行回数が多すぎます。しばらく待ってから再試行してください。");
          case 'auth/user-disabled':
            throw new Error("このアカウントは無効になっています。");
          default:
            throw new Error(`ログインエラー: ${error.message}`);
        }
      }
      
      // その他のエラー
      throw error;
    }
  };

  const signUp = async (username: string, password: string) => {
    try {
      // バリデーション
      if (username.length < 3) {
        throw new Error("ユーザー名は3文字以上で入力してください。");
      }
      if (password.length < 6) {
        throw new Error("パスワードは6文字以上で入力してください。");
      }

      const fakeEmail = `${username.toLowerCase()}@pokeapp.local`;
      console.log("Creating user with email:", fakeEmail);
      
      // まず Firebase Auth でユーザーを作成
      const userCredential = await createUserWithEmailAndPassword(auth, fakeEmail, password);
      const firebaseUser = userCredential.user;

      console.log("User created successfully, saving data...");

      // 認証後にFirestoreに保存（認証済みなのでアクセス可能）
      try {
        // ユーザー名の重複チェック（認証済み状態で実行）
        const usernameRef = doc(db, "usernames", username.toLowerCase());
        const usernameDoc = await getDoc(usernameRef);
        
        if (usernameDoc.exists()) {
          // ユーザー名が既に使用されている場合、作成したユーザーを削除
          await firebaseUser.delete();
          throw new Error("このユーザー名は既に使用されています。");
        }

        // Save user data
        await setDoc(doc(db, "users", firebaseUser.uid), {
          username: username,
          createdAt: new Date()
        });

        // Reserve username
        await setDoc(usernameRef, {
          uid: firebaseUser.uid
        });

        console.log("User data saved successfully");
      } catch (firestoreError: any) {
        console.error("Firestore error:", firestoreError);
        // Firestoreエラーの場合、作成したユーザーを削除
        try {
          await firebaseUser.delete();
        } catch (deleteError) {
          console.error("Error deleting user:", deleteError);
        }
        throw firestoreError;
      }
    } catch (error: any) {
      console.error("SignUp error:", error);
      
      // Firebase特有のエラーメッセージを日本語に変換
      if (error?.code) {
        switch (error.code) {
          case 'auth/weak-password':
            throw new Error("パスワードが弱すぎます。6文字以上で設定してください。");
          case 'auth/email-already-in-use':
            throw new Error("このユーザー名は既に使用されています。");
          case 'auth/invalid-email':
            throw new Error("無効なユーザー名です。");
          case 'auth/operation-not-allowed':
            throw new Error("アカウント作成が無効になっています。管理者にお問い合わせください。");
          case 'auth/too-many-requests':
            throw new Error("リクエストが多すぎます。しばらく待ってから再試行してください。");
          case 'permission-denied':
            throw new Error("データベースアクセスエラーが発生しました。しばらく待ってから再試行してください。");
          default:
            throw new Error(`認証エラー: ${error.message}`);
        }
      }
      
      // その他のエラー
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
