import { useState, useEffect, useRef } from 'react';
import { Send, AtSign, Share2, Users, Zap } from 'lucide-react';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
import { Team } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ChatWindowProps {
  chat: {
    id: string;
    name: string;
    type: 'dm' | 'group';
  };
  teams: Team[];
  onTeamShare?: (team: Team) => void;
  onBattleResultShare?: (result: any) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  chat,
  teams,
  onTeamShare,
  onBattleResultShare
}) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showTeamSelector, setShowTeamSelector] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chat.id) return;
    
    const q = query(
      collection(db, 'chats', chat.id, 'messages'),
      orderBy('timestamp', 'asc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [chat.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !user) return;

    try {
      await addDoc(collection(db, 'chats', chat.id, 'messages'), {
        text: newMessage,
        senderId: user.uid,
        senderName: user.displayName,
        timestamp: serverTimestamp(),
        type: 'text'
      });
      
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleShareTeam = async (team: Team) => {
    if (!user) return;
    
    try {
      const teamCode = btoa(JSON.stringify(team));
      await addDoc(collection(db, 'chats', chat.id, 'messages'), {
        text: `${user.displayName}がチーム「${team.name}」を共有しました。`,
        senderId: user.uid,
        senderName: user.displayName,
        timestamp: serverTimestamp(),
        type: 'team_share',
        teamData: teamCode
      });
      
      setShowTeamSelector(false);
      if (onTeamShare) {
        onTeamShare(team);
      }
    } catch (error) {
      console.error('Error sharing team:', error);
    }
  };

  const handleImportTeam = (teamCode: string) => {
    try {
      const decoded = atob(teamCode);
      const parsedTeam = JSON.parse(decoded);
      // Team import logic would be handled by parent component
      alert(`チーム「${parsedTeam.name}」をインポートできます。`);
    } catch (error) {
      alert('チームのインポートに失敗しました。');
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <header className="p-4 border-b border-gray-700 shadow-md">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <AtSign className="w-5 h-5" />
          {chat.name}
        </h2>
      </header>
      
      {/* Messages Area */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex mb-4 ${msg.senderId === user?.uid ? 'justify-end' : ''}`}
            data-testid={`message-${msg.id}`}
          >
            <div className={msg.senderId === user?.uid ? 'text-right' : ''}>
              <span className="text-sm text-gray-400">{msg.senderName}</span>
              {msg.type === 'team_share' ? (
                <div className="mt-1 p-3 rounded-lg bg-indigo-800 max-w-sm">
                  <p>{msg.text}</p>
                  <Button
                    onClick={() => handleImportTeam(msg.teamData)}
                    size="sm"
                    className="mt-2 bg-indigo-500 hover:bg-indigo-600"
                    data-testid="button-import-shared-team"
                  >
                    チームをインポート
                  </Button>
                </div>
              ) : msg.type === 'battle_result' ? (
                <div className="mt-1 p-3 rounded-lg bg-[hsl(var(--gaming-panel))] border-l-4 border-[hsl(var(--pokemon-electric))] max-w-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-[hsl(var(--pokemon-electric))]" />
                    <span className="font-medium text-[hsl(var(--pokemon-electric))]">バトル結果</span>
                  </div>
                  <div className="text-sm text-gray-300">
                    <div>{msg.battleData?.attacker} の {msg.battleData?.move}!</div>
                    <div>
                      {msg.battleData?.defender} に{' '}
                      <span className="text-[hsl(var(--pokemon-electric))] font-bold">
                        {msg.battleData?.damage}ダメージ
                      </span>
                    </div>
                    <div className="text-gray-400 mt-1">{msg.battleData?.effectiveness}</div>
                  </div>
                </div>
              ) : (
                <div className={`mt-1 p-3 rounded-lg max-w-md ${
                  msg.senderId === user?.uid 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-[hsl(var(--gaming-panel))]'
                }`}>
                  {msg.text}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </main>
      
      {/* Message Input */}
      <footer className="p-4">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={() => setShowTeamSelector(!showTeamSelector)}
              variant="outline"
              size="sm"
              data-testid="button-share-team-toggle"
            >
              <Users className="w-5 h-5" />
            </Button>
            {onBattleResultShare && (
              <Button
                type="button"
                onClick={() => onBattleResultShare({})}
                variant="outline"
                size="sm"
                data-testid="button-share-battle"
              >
                <Zap className="w-5 h-5" />
              </Button>
            )}
          </div>
          
          <div className="flex-1 relative">
            <Input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={`${chat.name}へのメッセージ`}
              className="w-full bg-[hsl(var(--gaming-panel))] border-gray-600 text-white placeholder-gray-400 focus:border-[hsl(var(--pokemon-electric))] pr-12"
              data-testid="input-message"
            />
            <Button
              type="submit"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-[hsl(var(--pokemon-electric))] bg-transparent"
              data-testid="button-send-message"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </form>
        
        {/* Team Selector */}
        {showTeamSelector && (
          <div className="absolute bottom-full mb-2 w-48 bg-[hsl(var(--gaming-card))] rounded-lg shadow-lg p-2">
            <p className="text-xs text-gray-400 mb-1">共有するチームを選択</p>
            {teams.map((team) => (
              <Button
                key={team.id}
                onClick={() => handleShareTeam(team)}
                variant="ghost"
                className="w-full text-left justify-start p-2 hover:bg-gray-700 text-sm"
                data-testid={`button-select-team-${team.id}`}
              >
                {team.name}
              </Button>
            ))}
          </div>
        )}
      </footer>
    </div>
  );
};
