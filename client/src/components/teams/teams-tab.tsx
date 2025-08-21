import { Team } from '@shared/schema';
import { TeamBuilder } from './team-builder';

interface TeamsTabProps {
  teams: Team[];
  activeTeam: Team;
  onTeamUpdate: (team: Team) => void;
  onTeamCreate: () => void;
  onTeamImport: (teamData: string) => void;
  onTeamShare?: (team: Team) => void;
}

export const TeamsTab: React.FC<TeamsTabProps> = (props) => {
  return (
    <main className="flex-1 overflow-auto p-4 pb-20 md:pb-4" data-testid="tab-teams">
      <div className="max-w-7xl mx-auto">
        <TeamBuilder {...props} />
      </div>
    </main>
  );
};
