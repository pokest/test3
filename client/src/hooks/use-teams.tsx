import { useState, useCallback } from 'react';
import { Team, Pokemon } from '@shared/schema';
import { useAuth } from './use-auth';

export const useTeams = () => {
  const { user } = useAuth();
  
  // Default team
  const createDefaultTeam = (): Team => ({
    id: crypto.randomUUID(),
    name: '新しいチーム',
    pokemons: [],
    userId: user?.uid || '',
    isPublic: false,
    createdAt: new Date(),
    updatedAt: new Date()
  });

  const [teams, setTeams] = useState<Team[]>([createDefaultTeam()]);
  const [activeTeamIndex, setActiveTeamIndex] = useState(0);

  const activeTeam = teams[activeTeamIndex] || createDefaultTeam();

  const createTeam = useCallback(() => {
    const newTeam = createDefaultTeam();
    setTeams(prev => [...prev, newTeam]);
    setActiveTeamIndex(teams.length);
  }, [teams.length, user]);

  const updateTeam = useCallback((updatedTeam: Team) => {
    setTeams(prev => prev.map((team, index) => 
      index === activeTeamIndex ? updatedTeam : team
    ));
  }, [activeTeamIndex]);

  const importTeam = useCallback((teamData: string) => {
    try {
      const decoded = atob(teamData);
      const parsedTeam: Team = JSON.parse(decoded);
      
      // Find empty team slot or create new one
      const emptyTeamIndex = teams.findIndex(t => t.pokemons.length === 0);
      
      if (emptyTeamIndex !== -1) {
        const updatedTeam = {
          ...parsedTeam,
          id: teams[emptyTeamIndex].id,
          userId: user?.uid || '',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        setTeams(prev => prev.map((team, index) => 
          index === emptyTeamIndex ? updatedTeam : team
        ));
        setActiveTeamIndex(emptyTeamIndex);
        alert(`チーム「${parsedTeam.name}」をインポートしました。`);
      } else {
        const newTeam = {
          ...parsedTeam,
          id: crypto.randomUUID(),
          userId: user?.uid || '',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        setTeams(prev => [...prev, newTeam]);
        setActiveTeamIndex(teams.length);
        alert(`チーム「${parsedTeam.name}」をインポートしました。`);
      }
    } catch (error) {
      alert('チームのインポートに失敗しました。データが正しいか確認してください。');
    }
  }, [teams, user]);

  return {
    teams,
    activeTeam,
    createTeam,
    updateTeam,
    importTeam,
    setActiveTeamIndex
  };
};
