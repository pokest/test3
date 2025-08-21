import { Bell, Zap, Calculator, Users, MessageSquare, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { TabType } from '@/pages/home';

interface TopNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  activeTab,
  onTabChange
}) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!user) return null;

  return (
    <header className="bg-[hsl(var(--gaming-card))] border-b border-gray-700 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-[hsl(var(--pokemon-electric))] to-[hsl(var(--pokemon-fire))] rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold">PokeCalc</h1>
        </div>
        
        {/* Navigation Tabs - Desktop */}
        <nav className="hidden md:flex bg-[hsl(var(--gaming-panel))] rounded-lg p-1">
          <Button
            variant="ghost"
            onClick={() => onTabChange('calculator')}
            className={`px-4 py-2 rounded-md font-medium transition-all flex items-center gap-2 ${
              activeTab === 'calculator' 
                ? 'bg-[hsl(var(--gaming-accent))] text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
            data-testid="tab-calculator-desktop"
          >
            <Calculator className="w-4 h-4" />
            ダメージ計算
          </Button>
          <Button
            variant="ghost"
            onClick={() => onTabChange('teams')}
            className={`px-4 py-2 rounded-md font-medium transition-all flex items-center gap-2 ${
              activeTab === 'teams' 
                ? 'bg-[hsl(var(--gaming-accent))] text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
            data-testid="tab-teams-desktop"
          >
            <Users className="w-4 h-4" />
            チーム管理
          </Button>
          <Button
            variant="ghost"
            onClick={() => onTabChange('chat')}
            className={`px-4 py-2 rounded-md font-medium transition-all flex items-center gap-2 ${
              activeTab === 'chat' 
                ? 'bg-[hsl(var(--gaming-accent))] text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
            data-testid="tab-chat-desktop"
          >
            <MessageSquare className="w-4 h-4" />
            チャット
          </Button>
        </nav>
      </div>
      
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="relative p-2 text-gray-400 hover:text-white transition-colors"
          data-testid="button-notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-[hsl(var(--pokemon-fire))] rounded-full"></span>
        </Button>
        
        <div className="flex items-center gap-2 bg-[hsl(var(--gaming-panel))] rounded-lg px-3 py-2">
          <div className="w-8 h-8 bg-gradient-to-r from-[hsl(var(--pokemon-water))] to-[hsl(var(--pokemon-psychic))] rounded-full flex items-center justify-center">
            <span className="text-sm font-bold" data-testid="user-avatar">
              {user.username.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="hidden sm:block text-sm font-medium" data-testid="user-name">
            {user.username}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-gray-400 hover:text-white transition-colors ml-2 p-1"
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};
