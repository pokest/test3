import { Calculator, Users, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TabType } from '@/pages/home';

interface MobileTabBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const MobileTabBar: React.FC<MobileTabBarProps> = ({
  activeTab,
  onTabChange
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[hsl(var(--gaming-card))] border-t border-gray-700 px-4 py-2 z-40">
      <div className="flex justify-around">
        <Button
          variant="ghost"
          onClick={() => onTabChange('calculator')}
          className={`flex flex-col items-center gap-1 p-2 ${
            activeTab === 'calculator' 
              ? 'text-[hsl(var(--gaming-accent))]' 
              : 'text-gray-400'
          }`}
          data-testid="tab-calculator-mobile"
        >
          <Calculator className="w-5 h-5" />
          <span className="text-xs">計算</span>
        </Button>
        <Button
          variant="ghost"
          onClick={() => onTabChange('teams')}
          className={`flex flex-col items-center gap-1 p-2 ${
            activeTab === 'teams' 
              ? 'text-[hsl(var(--gaming-accent))]' 
              : 'text-gray-400'
          }`}
          data-testid="tab-teams-mobile"
        >
          <Users className="w-5 h-5" />
          <span className="text-xs">チーム</span>
        </Button>
        <Button
          variant="ghost"
          onClick={() => onTabChange('chat')}
          className={`flex flex-col items-center gap-1 p-2 ${
            activeTab === 'chat' 
              ? 'text-[hsl(var(--gaming-accent))]' 
              : 'text-gray-400'
          }`}
          data-testid="tab-chat-mobile"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-xs">チャット</span>
        </Button>
      </div>
    </div>
  );
};
