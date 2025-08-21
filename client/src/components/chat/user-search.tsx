import { useState } from 'react';
import { Search, X, UserPlus } from 'lucide-react';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface UserSearchProps {
  onClose: () => void;
}

export const UserSearch: React.FC<UserSearchProps> = ({ onClose }) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim() === '' || !user) return;
    
    setLoading(true);
    setStatus('検索中...');
    
    try {
      const q = query(collection(db, 'users'), where('username', '==', searchTerm));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        setStatus('ユーザーが見つかりませんでした。');
        setResults([]);
      } else {
        setResults(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setStatus('');
      }
    } catch (error) {
      console.error('Search error:', error);
      setStatus('検索でエラーが発生しました。');
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (targetId: string) => {
    if (!user) return;
    
    try {
      // Check if friendship already exists
      const q1 = query(
        collection(db, 'friendships'), 
        where('users', '==', [user.uid, targetId].sort())
      );
      const existing = await getDocs(q1);
      
      if (!existing.empty) {
        alert('既にフレンドか、リクエストを送信済みです。');
        return;
      }

      await addDoc(collection(db, 'friendships'), {
        users: [user.uid, targetId].sort(),
        status: 'pending',
        requestedBy: user.uid,
        createdAt: serverTimestamp()
      });
      
      alert('フレンドリクエストを送信しました。');
    } catch (error) {
      console.error('Error sending friend request:', error);
      alert('エラーが発生しました。');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-[hsl(var(--gaming-card))] rounded-lg p-4 w-full max-w-md flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold">フレンドを追加</h3>
          <Button
            onClick={onClose}
            variant="destructive"
            size="sm"
            data-testid="button-close-search"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ユーザー名で検索"
            className="flex-1 bg-[hsl(var(--gaming-panel))] border-gray-600"
            data-testid="input-search-user"
          />
          <Button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
            data-testid="button-search"
          >
            <Search className="w-5 h-5" />
          </Button>
        </form>
        
        <div>
          {status && (
            <p className="text-gray-400 mb-2" data-testid="text-search-status">
              {status}
            </p>
          )}
          <div className="space-y-2">
            {results.map((result) => (
              <div
                key={result.id}
                className="flex items-center justify-between p-2 bg-[hsl(var(--gaming-panel))] rounded"
                data-testid={`result-user-${result.username}`}
              >
                <span>{result.username}</span>
                {result.id !== user?.uid && (
                  <Button
                    onClick={() => handleSendRequest(result.id)}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-sm"
                    data-testid={`button-add-friend-${result.username}`}
                  >
                    <UserPlus className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
