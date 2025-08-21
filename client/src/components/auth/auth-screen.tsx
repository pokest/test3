import { useState } from 'react';
import { Zap, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const AuthScreen = () => {
  const { signIn, signUp } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!/^[a-zA-Z0-9_]{3,15}$/.test(username)) {
      setError("ユーザー名は3〜15文字の半角英数字とアンダースコア(_)のみ使用できます。");
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        await signUp(username, password);
      } else {
        await signIn(username, password);
      }
    } catch (err: any) {
      console.error("Authentication error:", err);
      
      // エラーメッセージの表示
      if (err.message && typeof err.message === 'string') {
        setError(err.message);
      } else if (err.code) {
        // Firebase特有のエラーコードを処理
        switch (err.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
          case 'auth/invalid-login-credentials':
            setError("ユーザー名またはパスワードが間違っています。");
            break;
          case 'auth/weak-password':
            setError("パスワードは6文字以上で設定してください。");
            break;
          case 'auth/email-already-in-use':
            setError("このユーザー名は既に使用されています。");
            break;
          case 'auth/too-many-requests':
            setError("ログイン試行回数が多すぎます。しばらく待ってから再試行してください。");
            break;
          default:
            setError(`認証エラー: ${err.message || err.code}`);
        }
      } else {
        setError("予期しないエラーが発生しました。しばらくしてから再度お試しください。");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[hsl(var(--gaming-dark))] z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20"></div>
      <div className="relative max-w-md w-full">
        <div className="bg-[hsl(var(--gaming-card))] p-8 rounded-2xl shadow-2xl border border-gray-700 animate-slide-up">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[hsl(var(--pokemon-electric))] to-[hsl(var(--pokemon-fire))] rounded-full mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[hsl(var(--pokemon-electric))] to-[hsl(var(--pokemon-fire))] bg-clip-text text-transparent">
              PokeCalc
            </h1>
            <p className="text-gray-400 mt-2">Pokemon Battle Calculator & Chat</p>
          </div>
          
          <div className="space-y-6">
            <div className="flex bg-[hsl(var(--gaming-panel))] rounded-lg p-1">
              <Button
                type="button"
                variant="ghost"
                className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                  !isSignUp 
                    ? 'bg-[hsl(var(--gaming-accent))] text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setIsSignUp(false)}
                data-testid="button-login-tab"
              >
                ログイン
              </Button>
              <Button
                type="button"
                variant="ghost"
                className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                  isSignUp 
                    ? 'bg-[hsl(var(--gaming-accent))] text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setIsSignUp(true)}
                data-testid="button-signup-tab"
              >
                新規登録
              </Button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  ユーザー名
                </label>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="半角英数字と_のみ"
                  required
                  className="w-full bg-[hsl(var(--gaming-panel))] border-gray-600 text-white placeholder-gray-400 focus:border-[hsl(var(--pokemon-electric))] focus:ring-1 focus:ring-[hsl(var(--pokemon-electric))]"
                  data-testid="input-username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  パスワード
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="6文字以上"
                  required
                  className="w-full bg-[hsl(var(--gaming-panel))] border-gray-600 text-white placeholder-gray-400 focus:border-[hsl(var(--pokemon-electric))] focus:ring-1 focus:ring-[hsl(var(--pokemon-electric))]"
                  data-testid="input-password"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[hsl(var(--gaming-accent))] to-[hsl(var(--pokemon-water))] hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 transition-all transform hover:scale-105 flex items-center justify-center gap-2 disabled:bg-gray-500"
                data-testid="button-submit"
              >
                {loading ? (
                  '処理中...'
                ) : isSignUp ? (
                  <>
                    <UserPlus className="w-5 h-5" />
                    登録する
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    ログインする
                  </>
                )}
              </Button>
              {error && (
                <p className="text-red-400 text-sm text-center" data-testid="text-error">
                  {error}
                </p>
              )}
            </form>
            
            <div className="text-center">
              <p className="text-sm text-gray-400">
                {isSignUp ? 'アカウントをお持ちですか？' : 'アカウントをお持ちでないですか？'}
              </p>
              <Button
                type="button"
                variant="link"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-[hsl(var(--pokemon-electric))] hover:text-[hsl(var(--pokemon-fire))] transition-colors"
                data-testid="button-toggle-mode"
              >
                {isSignUp ? 'ログイン' : '新規登録はこちら'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
