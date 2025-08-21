import { useState, useEffect, useRef } from 'react';
import { Send, Share2, UserPlus, Users, Crown } from 'lucide-react';
import { collection, query, where, onSnapshot, addDoc, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
import { Group, Message, Team } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { TeamPreview } from '@/components/teams/team-preview';

interface GroupChatProps {
  group: Group;
  onShareTeam?: (team: Team) => void;
}

export const GroupChat: React.FC<GroupChatProps> = ({ group, onShareTeam }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [inviteUserId, setInviteUserId] = useState('');
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load group messages
  useEffect(() => {
    const messagesQuery = query(
      collection(db, 'messages'),
      where('chatId', '==', `group_${group.id}`),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const messagesList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      })) as Message[];
      setMessages(messagesList);
      setLoading(false);
    });

    return unsubscribe;
  }, [group.id]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    await addDoc(collection(db, 'messages'), {
      chatId: `group_${group.id}`,
      text: newMessage.trim(),
      senderId: user.uid,
      senderName: user.displayName || 'Anonymous',
      timestamp: new Date(),
      type: 'text'
    });

    setNewMessage('');
  };

  const shareTeam = async (team: Team) => {
    if (!user) return;

    await addDoc(collection(db, 'messages'), {
      chatId: `group_${group.id}`,
      text: `構築「${team.name}」をシェアしました`,
      senderId: user.uid,
      senderName: user.displayName || 'Anonymous',
      timestamp: new Date(),
      type: 'team_share',
      teamData: JSON.stringify(team)
    });
  };

  const handleInviteUser = async () => {
    if (!inviteUserId.trim()) return;

    try {
      // This would normally validate the user ID and send an invite
      // For now, we'll just close the dialog
      setIsInviteDialogOpen(false);
      setInviteUserId('');
    } catch (error) {
      console.error('Failed to invite user:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const isOwner = group.ownerId === user?.uid;

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">メッセージを読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="bg-[hsl(var(--gaming-panel))] border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-gray-400" />
            <div>
              <h2 className="font-bold text-lg">{group.name}</h2>
              {group.description && (
                <p className="text-sm text-gray-400">{group.description}</p>
              )}
            </div>
            {isOwner && <Crown className="w-4 h-4 text-yellow-400" />}
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm text-gray-400">
              メンバー: {group.memberIds.length}
            </div>
            {isOwner && (
              <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white hover:bg-gray-700"
                    data-testid="button-invite-user"
                  >
                    <UserPlus className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[hsl(var(--gaming-panel))] border-gray-600 text-white">
                  <DialogHeader>
                    <DialogTitle>ユーザーを招待</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="user-id">ユーザーID</Label>
                      <Input
                        id="user-id"
                        value={inviteUserId}
                        onChange={(e) => setInviteUserId(e.target.value)}
                        placeholder="招待するユーザーIDを入力"
                        className="bg-[hsl(var(--gaming-dark))] border-gray-600 text-white"
                        data-testid="input-invite-user-id"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleInviteUser}
                        disabled={!inviteUserId.trim()}
                        className="flex-1 bg-[hsl(var(--gaming-accent))] hover:bg-blue-600"
                        data-testid="button-send-invite"
                      >
                        招待を送信
                      </Button>
                      <Button
                        onClick={() => setIsInviteDialogOpen(false)}
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        data-testid="button-cancel-invite"
                      >
                        キャンセル
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>まだメッセージがありません</p>
            <p className="text-sm">最初のメッセージを送信しましょう</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.senderId === user?.uid ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.senderId === user?.uid
                    ? 'bg-[hsl(var(--gaming-accent))] text-white'
                    : 'bg-[hsl(var(--gaming-panel))] text-gray-200'
                }`}
                data-testid={`message-${message.id}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium">{message.senderName}</span>
                  <span className="text-xs opacity-60">
                    {message.timestamp.toLocaleTimeString('ja-JP', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                
                {message.type === 'team_share' && message.teamData ? (
                  <div className="space-y-2">
                    <p className="text-sm">{message.text}</p>
                    <div className="bg-black/20 rounded p-2">
                      <div className="text-xs font-medium mb-1">構築詳細:</div>
                      {(() => {
                        try {
                          const team = JSON.parse(message.teamData) as Team;
                          return (
                            <div className="text-xs space-y-1">
                              <div>構築名: {team.name}</div>
                              <div>ポケモン数: {team.pokemons.length}</div>
                            </div>
                          );
                        } catch {
                          return <div className="text-xs text-red-400">構築データの読み込みに失敗しました</div>;
                        }
                      })()}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm">{message.text}</p>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-[hsl(var(--gaming-panel))] border-t border-gray-700 p-4">
        <div className="flex gap-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="メッセージを入力..."
            className="flex-1 bg-[hsl(var(--gaming-dark))] border-gray-600 text-white resize-none"
            rows={1}
            data-testid="textarea-new-message"
          />
          <Button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="bg-[hsl(var(--gaming-accent))] hover:bg-blue-600 px-4"
            data-testid="button-send-message"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};