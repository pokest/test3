import { useState } from 'react';
import { UserPlus, UserCheck, Users, Plus } from 'lucide-react';
import { useFriends } from '@/hooks/use-friends';
import { UserSearch } from './user-search';
import { FriendRequest } from './friend-request';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';

interface ChatSidebarProps {
  onChatSelect: (chat: { id: string; name: string; type: 'dm' | 'group' }) => void;
  activeChat?: { id: string; name: string; type: 'dm' | 'group' } | null;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  onChatSelect,
  activeChat
}) => {
  const { user } = useAuth();
  const { friends, friendRequests, acceptRequest, declineRequest } = useFriends();
  const [isUserSearchOpen, setIsUserSearchOpen] = useState(false);

  if (!user) return null;

  const startChat = (friendId: string, friendUsername: string) => {
    onChatSelect({
      id: `${[user.uid, friendId].sort().join('_')}`,
      name: friendUsername,
      type: 'dm'
    });
  };

  return (
    <div className="w-64 bg-[hsl(var(--gaming-card))] flex flex-col p-3">
      {isUserSearchOpen && (
        <UserSearch onClose={() => setIsUserSearchOpen(false)} />
      )}
      
      <Button
        onClick={() => setIsUserSearchOpen(true)}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg mb-4"
        data-testid="button-add-friend"
      >
        <UserPlus className="w-4 h-4 mr-2" />
        フレンドを追加
      </Button>
      
      <div className="flex-grow overflow-y-auto">
        <h3 className="text-gray-400 text-sm font-bold mb-2">ダイレクトメッセージ</h3>
        
        {/* Friends List */}
        {friends.map((friend) => (
          <div
            key={friend.id}
            onClick={() => startChat(friend.friendId, friend.username)}
            className={`p-2 rounded-md cursor-pointer hover:bg-gray-700 transition-colors ${
              activeChat?.name === friend.username ? 'bg-gray-900' : ''
            }`}
            data-testid={`friend-${friend.username}`}
          >
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-r from-[hsl(var(--pokemon-electric))] to-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold">
                    {friend.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                {friend.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[hsl(var(--gaming-panel))]"></div>
                )}
              </div>
              <div className="flex-1">
                <div className="font-medium">{friend.username}</div>
                <div className="text-xs text-gray-400">{friend.status}</div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Friend Requests */}
        {friendRequests.length > 0 && (
          <div className="mt-4">
            <h3 className="text-yellow-400 text-sm font-bold mb-2">保留中のリクエスト</h3>
            {friendRequests.map((req) => (
              <FriendRequest
                key={req.id}
                request={req}
                onAccept={acceptRequest}
                onDecline={declineRequest}
              />
            ))}
          </div>
        )}
        
        {/* Groups Section */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm font-bold">グループ</h3>
            <Button
              size="sm"
              variant="ghost"
              className="text-gray-400 hover:text-white p-1"
              data-testid="button-create-group"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Sample groups would be listed here */}
          <div className="text-sm text-gray-500">グループはありません</div>
        </div>
      </div>
      
      {/* User Status */}
      <div className="mt-auto p-2 bg-[hsl(var(--gaming-panel))] rounded-md flex items-center">
        <div className="w-8 h-8 bg-gradient-to-r from-[hsl(var(--pokemon-water))] to-[hsl(var(--pokemon-psychic))] rounded-full flex items-center justify-center">
          <span className="text-sm font-bold">
            {user.username.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="font-bold ml-2">{user.username}</span>
      </div>
    </div>
  );
};
