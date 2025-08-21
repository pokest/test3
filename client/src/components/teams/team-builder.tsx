import { useState } from 'react';
import { PlusCircle, Plus, Edit, Trash2, Save, Copy, Download, Share2, Upload } from 'lucide-react';
import { Team, Pokemon } from '@shared/schema';
import { createDefaultPokemon } from '@/lib/damage-calculator';
import { POKEMON_NAMES_JP, getPokemonDataByJpName } from '@/lib/pokemon-json-data';
import { TeamPreview } from './team-preview';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/use-auth';
import { PokemonSelector } from '@/components/calculator/pokemon-selector';
import { PokemonEditDialog } from './pokemon-edit-dialog';

interface TeamBuilderProps {
  teams: Team[];
  activeTeam: Team;
  onTeamUpdate: (team: Team) => void;
  onTeamCreate: () => void;
  onTeamImport: (teamData: string) => void;
  onTeamShare?: (team: Team) => void;
}

export const TeamBuilder: React.FC<TeamBuilderProps> = ({
  teams,
  activeTeam,
  onTeamUpdate,
  onTeamCreate,
  onTeamImport,
  onTeamShare
}) => {
  const { user } = useAuth();
  const [editingTeamName, setEditingTeamName] = useState(false);
  const [teamName, setTeamName] = useState(activeTeam.name);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [importData, setImportData] = useState('');
  const [showPokemonSelector, setShowPokemonSelector] = useState(false);
  const [editingPokemon, setEditingPokemon] = useState<{ pokemon: Pokemon; index: number } | null>(null);

  const handleAddPokemon = (slotIndex: number) => {
    setSelectedSlot(slotIndex);
    setShowPokemonSelector(true);
  };

  const handlePokemonSelect = (pokemonName: string) => {
    if (selectedSlot === null) return;

    const newPokemon = createDefaultPokemon(pokemonName);
    const updatedPokemons = [...activeTeam.pokemons];
    
    if (updatedPokemons.length <= selectedSlot) {
      // Extend array if needed
      while (updatedPokemons.length <= selectedSlot) {
        updatedPokemons.push(newPokemon);
      }
    } else {
      updatedPokemons[selectedSlot] = newPokemon;
    }

    onTeamUpdate({
      ...activeTeam,
      pokemons: updatedPokemons,
      updatedAt: new Date()
    });
    
    setSelectedSlot(null);
    setShowPokemonSelector(false);
  };

  const handleRemovePokemon = (slotIndex: number) => {
    const updatedPokemons = [...activeTeam.pokemons];
    updatedPokemons.splice(slotIndex, 1);
    
    onTeamUpdate({
      ...activeTeam,
      pokemons: updatedPokemons,
      updatedAt: new Date()
    });
  };

  const handleEditPokemon = (pokemon: Pokemon, index: number) => {
    setEditingPokemon({ pokemon, index });
  };

  const handlePokemonUpdate = (updatedPokemon: Pokemon) => {
    if (!editingPokemon) return;
    
    const updatedPokemons = [...activeTeam.pokemons];
    updatedPokemons[editingPokemon.index] = updatedPokemon;
    
    onTeamUpdate({
      ...activeTeam,
      pokemons: updatedPokemons,
      updatedAt: new Date()
    });
    
    setEditingPokemon(null);
  };

  const handleSaveTeamName = () => {
    onTeamUpdate({
      ...activeTeam,
      name: teamName,
      updatedAt: new Date()
    });
    setEditingTeamName(false);
  };

  const handleExportTeam = () => {
    const teamData = btoa(JSON.stringify(activeTeam));
    navigator.clipboard.writeText(teamData);
    alert('チームデータをクリップボードにコピーしました！');
  };

  const handleImportTeam = () => {
    if (importData.trim()) {
      onTeamImport(importData);
      setImportData('');
    }
  };

  const typeColors: Record<string, string> = {
    'ノーマル': 'bg-gray-500',
    'ほのお': 'bg-red-500',
    'みず': 'bg-blue-500',
    'でんき': 'bg-yellow-500',
    'くさ': 'bg-green-500',
    'こおり': 'bg-cyan-500',
    'かくとう': 'bg-red-600',
    'どく': 'bg-purple-500',
    'じめん': 'bg-yellow-600',
    'ひこう': 'bg-indigo-400',
    'エスパー': 'bg-pink-500',
    'むし': 'bg-green-400',
    'いわ': 'bg-yellow-700',
    'ゴースト': 'bg-purple-600',
    'ドラゴン': 'bg-indigo-600',
    'あく': 'bg-gray-800',
    'はがね': 'bg-gray-400',
    'フェアリー': 'bg-pink-400'
  };

  return (
    <div className="space-y-6">
      {/* Team Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-[hsl(var(--pokemon-psychic))] to-purple-600 rounded-lg flex items-center justify-center">
            <PlusCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            {editingTeamName ? (
              <div className="flex items-center gap-2">
                <Input
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="text-2xl font-bold bg-[hsl(var(--gaming-panel))]"
                  data-testid="input-team-name"
                />
                <Button onClick={handleSaveTeamName} size="sm">
                  <Save className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <h1 
                className="text-2xl font-bold cursor-pointer hover:text-[hsl(var(--pokemon-electric))] transition-colors"
                onClick={() => setEditingTeamName(true)}
                data-testid="text-team-title"
              >
                {activeTeam.name}
              </h1>
            )}
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={onTeamCreate}
            className="bg-[hsl(var(--gaming-accent))] hover:bg-blue-600 text-white font-bold py-2 px-4 transition-all flex items-center gap-2"
            data-testid="button-create-team"
          >
            <PlusCircle className="w-4 h-4" />
            新規作成
          </Button>
          <Button
            onClick={handleImportTeam}
            variant="outline"
            className="text-white font-bold py-2 px-4 transition-all flex items-center gap-2"
            data-testid="button-import-team"
          >
            <Upload className="w-4 h-4" />
            インポート
          </Button>
          {onTeamShare && (
            <Button
              onClick={() => onTeamShare(activeTeam)}
              variant="outline"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 transition-all flex items-center gap-2"
              data-testid="button-share-team"
            >
              <Share2 className="w-4 h-4" />
              グループシェア
            </Button>
          )}
        </div>
      </div>

      {/* Import Section */}
      <div className="bg-[hsl(var(--gaming-card))] rounded-xl p-4 border border-gray-700">
        <div className="flex gap-2">
          <Input
            value={importData}
            onChange={(e) => setImportData(e.target.value)}
            placeholder="チームデータを貼り付けてください"
            className="flex-1 bg-[hsl(var(--gaming-panel))] border-gray-600"
            data-testid="input-import-data"
          />
          <Button onClick={handleImportTeam} disabled={!importData.trim()}>
            インポート
          </Button>
        </div>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Team Slots */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[hsl(var(--gaming-card))] rounded-xl p-6 border border-gray-700">
            <h2 className="text-lg font-bold mb-4">パーティ構成</h2>
            
            <div className="grid gap-4">
              {Array.from({ length: 6 }, (_, index) => {
                const pokemon = activeTeam.pokemons[index];
                const pokemonData = pokemon ? getPokemonDataByJpName(pokemon.name) : null;
                
                if (pokemon && pokemonData) {
                  return (
                    <div
                      key={index}
                      className="bg-[hsl(var(--gaming-panel))] rounded-lg p-4 border-2 border-[hsl(var(--pokemon-electric))] border-opacity-50"
                      data-testid={`slot-filled-${index}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative group cursor-pointer">
                          <div className="w-16 h-16 bg-gray-600 rounded-lg flex items-center justify-center text-xs text-white font-bold">
                            {pokemon.name.slice(0, 3)}
                          </div>
                          {pokemon.isShiny && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-[hsl(var(--pokemon-fire))] rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold">{pokemon.name}</h3>
                            <span className="text-sm text-gray-400">@{pokemon.item}</span>
                          </div>
                          <div className="flex gap-1 mb-2">
                            {pokemonData?.types_ja?.split(',').map((type: string, typeIndex: number) => (
                              <span
                                key={typeIndex}
                                className={`px-2 py-0.5 text-white text-xs rounded ${typeColors[type.trim()] || 'bg-gray-500'}`}
                              >
                                {type.trim()}
                              </span>
                            ))}
                          </div>
                          <div className="text-sm text-gray-400">
                            {pokemon.moves.join(' / ')}
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditPokemon(pokemon, index)}
                            className="p-1 text-gray-400 hover:text-white transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemovePokemon(index)}
                            className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                            data-testid={`button-remove-${index}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                }
                
                return (
                  <div
                    key={index}
                    className="bg-[hsl(var(--gaming-panel))] rounded-lg p-4 border-2 border-dashed border-gray-600 hover:border-gray-500 transition-colors cursor-pointer group"
                    onClick={() => handleAddPokemon(index)}
                    data-testid={`slot-empty-${index}`}
                  >
                    <div className="flex items-center justify-center h-16 text-gray-500 group-hover:text-gray-400 transition-colors">
                      <div className="text-center">
                        <Plus className="w-8 h-8 mx-auto mb-1" />
                        <div className="text-sm">ポケモンを追加</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Pokemon Selection Modal */}
          {selectedSlot !== null && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-[hsl(var(--gaming-card))] rounded-xl p-6 max-w-md w-full max-h-96 overflow-y-auto">
                <h3 className="text-xl font-bold mb-4">ポケモンを選択</h3>
                <div className="grid grid-cols-2 gap-2">
                  {POKEMON_NAMES_JP.map((name: string) => (
                    <Button
                      key={name}
                      variant="outline"
                      onClick={() => handlePokemonSelect(name)}
                      className="text-left justify-start"
                      data-testid={`button-select-${name}`}
                    >
                      {name}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  onClick={() => setSelectedSlot(null)}
                  className="w-full mt-4"
                  data-testid="button-cancel-select"
                >
                  キャンセル
                </Button>
              </div>
            </div>
          )}
          
          {/* Team Actions */}
          <div className="bg-[hsl(var(--gaming-card))] rounded-xl p-6 border border-gray-700">
            <h3 className="font-bold mb-4">チーム操作</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button
                onClick={handleSaveTeamName}
                variant="outline"
                className="flex items-center justify-center gap-2"
                data-testid="button-save-team"
              >
                <Save className="w-4 h-4" />
                保存
              </Button>
              <Button
                variant="outline"
                className="flex items-center justify-center gap-2"
                data-testid="button-copy-team"
              >
                <Copy className="w-4 h-4" />
                複製
              </Button>
              <Button
                onClick={handleExportTeam}
                variant="outline"
                className="flex items-center justify-center gap-2"
                data-testid="button-export-team"
              >
                <Download className="w-4 h-4" />
                エクスポート
              </Button>
              {onTeamShare && (
                <Button
                  onClick={() => onTeamShare(activeTeam)}
                  className="bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
                  data-testid="button-share-team"
                >
                  <Share2 className="w-4 h-4" />
                  共有
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {/* Team Preview & Stats */}
        <div>
          <TeamPreview team={activeTeam} />
          
          {/* Saved Teams */}
          <div className="bg-[hsl(var(--gaming-card))] rounded-xl p-6 border border-gray-700 mt-4">
            <h3 className="font-bold mb-4">保存済みチーム</h3>
            <div className="space-y-2">
              {teams.map((team) => (
                <div
                  key={team.id}
                  className={`bg-[hsl(var(--gaming-panel))] rounded-lg p-3 cursor-pointer hover:bg-gray-700 transition-colors ${
                    team.id === activeTeam.id ? 'border border-[hsl(var(--pokemon-electric))]' : ''
                  }`}
                  data-testid={`saved-team-${team.id}`}
                >
                  <div className="font-medium">{team.name}</div>
                  <div className="text-sm text-gray-400">
                    {team.pokemons.length}体 | {team.updatedAt.toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pokemon Edit Dialog */}
      <PokemonEditDialog
        pokemon={editingPokemon?.pokemon || null}
        isOpen={!!editingPokemon}
        onClose={() => setEditingPokemon(null)}
        onSave={handlePokemonUpdate}
      />
    </div>
  );
};
