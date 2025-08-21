import { useState } from 'react';
import { MessageSquare, Users } from 'lucide-react';
import { Team, Group } from '@shared/schema';
import { ChatSidebar } from './chat-sidebar';
import { ChatWindow } from './chat-window';
import { GroupSidebar } from '@/components/groups/group-sidebar';
import { GroupChat } from '@/components/groups/group-chat';
import { useChat } from '@/hooks/use-chat';
import { TabType } from '@/pages/home';
import { Button } from '@/components/ui/button';

interface ChatLayoutProps {
  teams: Team[];
  onBattleResultShare: (result: any) => void;
  onTeamShare: (team: Team) => void;
  onTabChange: (tab: TabType) => void;
}

export const ChatLayout: React.FC<ChatLayoutProps> = ({
  teams,
  onBattleResultShare,
  onTeamShare,
  onTabChange
}) => {
  const { activeChat, setActiveChat } = useChat();
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [chatMode, setChatMode] = useState<'friends' | 'groups'>('friends');

  return (
    <div className="flex h-full">
      {/* Chat Mode Toggle */}
      <div className="w-12 bg-[hsl(var(--gaming-dark))] border-r border-gray-700 flex flex-col items-center py-4 gap-4">
        <Button
          variant={chatMode === 'friends' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setChatMode('friends')}
          className={`p-2 ${
            chatMode === 'friends'
              ? 'bg-[hsl(var(--gaming-accent))] text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
          data-testid="button-friends-mode"
        >
          <MessageSquare className="w-4 h-4" />
        </Button>
        <Button
          variant={chatMode === 'groups' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setChatMode('groups')}
          className={`p-2 ${
            chatMode === 'groups'
              ? 'bg-[hsl(var(--gaming-accent))] text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
          data-testid="button-groups-mode"
        >
          <Users className="w-4 h-4" />
        </Button>
      </div>

      {/* Sidebar */}
      {chatMode === 'friends' ? (
        <ChatSidebar 
          onChatSelect={setActiveChat} 
          activeChat={activeChat}
        />
      ) : (
        <GroupSidebar
          selectedGroup={selectedGroup}
          onGroupSelect={setSelectedGroup}
        />
      )}

      {/* Main Chat Area */}
      <div className="flex-1 bg-[hsl(var(--gaming-panel))] flex flex-col">
        {chatMode === 'friends' ? (
          activeChat ? (
            <ChatWindow
              chat={activeChat}
              teams={teams}
              onTeamShare={onTeamShare}
              onBattleResultShare={onBattleResultShare}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>チャットを開始するフレンドを選択してください。</p>
              </div>
            </div>
          )
        ) : (
          selectedGroup ? (
            <GroupChat
              group={selectedGroup}
              onShareTeam={onTeamShare}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>グループを選択するか、新しいグループを作成してください。</p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};
