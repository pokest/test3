import { useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { DamageCalculator } from '@/components/calculator/damage-calculator';
import { TeamsTab } from '@/components/teams/teams-tab';
import { ChatLayout } from '@/components/chat/chat-layout';
import { useTeams } from '@/hooks/use-teams';

export type TabType = 'calculator' | 'teams' | 'chat';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('calculator');
  const { teams, activeTeam, createTeam, updateTeam, importTeam } = useTeams();

  const handleBattleResultShare = (result: {
    attacker: string;
    defender: string;
    move: string;
    damage: number;
    effectiveness: string;
  }) => {
    // This would be handled by the chat system
    console.log('Battle result to share:', result);
  };

  const handleTeamShare = (team: any) => {
    // This would be handled by the chat system
    console.log('Team to share:', team);
  };

  return (
    <MainLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'calculator' && (
        <main className="flex-1 overflow-auto p-4 pb-20 md:pb-4" data-testid="tab-calculator">
          <div className="max-w-7xl mx-auto">
            <DamageCalculator onShareResult={handleBattleResultShare} />
          </div>
        </main>
      )}
      
      {activeTab === 'teams' && (
        <TeamsTab
          teams={teams}
          activeTeam={activeTeam}
          onTeamUpdate={updateTeam}
          onTeamCreate={createTeam}
          onTeamImport={importTeam}
          onTeamShare={handleTeamShare}
        />
      )}
      
      {activeTab === 'chat' && (
        <ChatLayout
          teams={teams}
          onBattleResultShare={handleBattleResultShare}
          onTeamShare={handleTeamShare}
          onTabChange={setActiveTab}
        />
      )}
    </MainLayout>
  );
}
