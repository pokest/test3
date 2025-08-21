import { ReactNode } from 'react';
import { TopNavigation } from './top-navigation';
import { MobileTabBar } from './mobile-tab-bar';
import { TabType } from '@/pages/home';

interface MainLayoutProps {
  children: ReactNode;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  activeTab, 
  onTabChange 
}) => {
  return (
    <div className="flex flex-col h-screen bg-[hsl(var(--gaming-dark))] text-gray-100">
      <TopNavigation activeTab={activeTab} onTabChange={onTabChange} />
      <div className="flex flex-1 overflow-hidden">
        {children}
      </div>
      <MobileTabBar activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
};
