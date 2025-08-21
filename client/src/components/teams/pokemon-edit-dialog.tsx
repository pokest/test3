import React, { useState, useEffect } from 'react';
import { Pokemon } from '@shared/schema';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import { EVStatDisplay } from '@/components/calculator/ev-stat-display';
import { getPokemonDataByJpName, getPokemonMoves } from '@/lib/pokemon-json-data';

interface PokemonEditDialogProps {
  pokemon: Pokemon | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (pokemon: Pokemon) => void;
}

export const PokemonEditDialog: React.FC<PokemonEditDialogProps> = ({
  pokemon,
  isOpen,
  onClose,
  onSave
}) => {
  const [editedPokemon, setEditedPokemon] = useState<Pokemon | null>(null);
  const [availableMoves, setAvailableMoves] = useState<string[]>([]);

  useEffect(() => {
    if (pokemon) {
      setEditedPokemon({ ...pokemon });
      const pokemonData = getPokemonDataByJpName(pokemon.name);
      const moves = pokemonData ? getPokemonMoves(pokemonData) : [];
      setAvailableMoves(moves);
    }
  }, [pokemon]);

  if (!editedPokemon) return null;

  const pokemonData = getPokemonDataByJpName(editedPokemon.name);
  const abilities = pokemonData?.abilities_ja?.split(',').map(a => a.trim()) || ['なし'];

  const handleEVChange = (stat: keyof Pokemon['evs'], value: number) => {
    setEditedPokemon(prev => prev ? {
      ...prev,
      evs: { ...prev.evs, [stat]: value }
    } : null);
  };

  const handleNatureChange = (stat: keyof Pokemon['natureModifiers'], modifier: number) => {
    setEditedPokemon(prev => prev ? {
      ...prev,
      natureModifiers: { ...prev.natureModifiers, [stat]: modifier }
    } : null);
  };

  const handleMoveChange = (moveIndex: number, move: string) => {
    setEditedPokemon(prev => prev ? {
      ...prev,
      moves: prev.moves.map((m, i) => i === moveIndex ? move : m)
    } : null);
  };

  const handleAbilityChange = (ability: string) => {
    setEditedPokemon(prev => prev ? {
      ...prev,
      ability
    } : null);
  };

  const handleSave = () => {
    if (editedPokemon) {
      onSave(editedPokemon);
    }
  };

  const calculateActualStat = (base: number, ev: number, isHP: boolean, natureModifier: number = 1.0): number => {
    const iv = 31;
    if (isHP) {
      return Math.floor(base + iv/2 + ev/8) + 60;
    } else {
      return Math.floor((Math.floor(base + iv/2 + ev/8) + 5) * natureModifier);
    }
  };

  const getActualStats = () => {
    if (!pokemonData) return null;
    return {
      hp: calculateActualStat(pokemonData.hp, editedPokemon.evs.H, true),
      attack: calculateActualStat(pokemonData.attack, editedPokemon.evs.A, false, editedPokemon.natureModifiers.A),
      defense: calculateActualStat(pokemonData.defense, editedPokemon.evs.B, false, editedPokemon.natureModifiers.B),
      specialAttack: calculateActualStat(pokemonData['special-attack'], editedPokemon.evs.C, false, editedPokemon.natureModifiers.C),
      specialDefense: calculateActualStat(pokemonData['special-defense'], editedPokemon.evs.D, false, editedPokemon.natureModifiers.D),
      speed: calculateActualStat(pokemonData.speed, editedPokemon.evs.S, false, editedPokemon.natureModifiers.S)
    };
  };

  const actualStats = getActualStats();
  const totalEVs = Object.values(editedPokemon.evs).reduce((sum, ev) => sum + ev, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[hsl(var(--gaming-bg))] border-[hsl(var(--gaming-border))]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-bold text-white">
            {editedPokemon.name} の編集
          </DialogTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 技選択 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">技</h3>
            <div className="space-y-2">
              {editedPokemon.moves.map((move, index) => (
                <div key={index} className="space-y-1">
                  <label className="text-sm text-gray-400">技 {index + 1}</label>
                  <Select value={move} onValueChange={(value) => handleMoveChange(index, value)}>
                    <SelectTrigger className="bg-[hsl(var(--gaming-panel))] border-[hsl(var(--gaming-border))]">
                      <SelectValue placeholder="技を選択" />
                    </SelectTrigger>
                    <SelectContent className="bg-[hsl(var(--gaming-panel))] border-[hsl(var(--gaming-border))]">
                      {availableMoves.map((moveOption) => (
                        <SelectItem key={moveOption} value={moveOption}>
                          {moveOption}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>

            {/* 特性選択 */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400">特性</label>
              <Select value={editedPokemon.ability} onValueChange={handleAbilityChange}>
                <SelectTrigger className="bg-[hsl(var(--gaming-panel))] border-[hsl(var(--gaming-border))]">
                  <SelectValue placeholder="特性を選択" />
                </SelectTrigger>
                <SelectContent className="bg-[hsl(var(--gaming-panel))] border-[hsl(var(--gaming-border))]">
                  {abilities.map((ability) => (
                    <SelectItem key={ability} value={ability}>
                      {ability}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* ステータス設定 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">ステータス</h3>
              <span className="text-sm text-gray-400">
                合計努力値: {totalEVs}/510
              </span>
            </div>
            
            {actualStats && (
              <div className="grid grid-cols-2 gap-3">
                <EVStatDisplay
                  label="HP"
                  value={actualStats.hp}
                  evValue={editedPokemon.evs.H}
                  statKey="H"
                  testId="text-edit-hp"
                  showNatureButtons={false}
                  showDragBar={true}
                  onEVChange={handleEVChange}
                />
                <EVStatDisplay
                  label="攻撃"
                  value={actualStats.attack}
                  evValue={editedPokemon.evs.A}
                  statKey="A"
                  testId="text-edit-attack"
                  color="text-[hsl(var(--pokemon-fire))]"
                  natureModifier={editedPokemon.natureModifiers.A}
                  showDragBar={true}
                  onEVChange={handleEVChange}
                  onNatureChange={handleNatureChange}
                />
                <EVStatDisplay
                  label="防御"
                  value={actualStats.defense}
                  evValue={editedPokemon.evs.B}
                  statKey="B"
                  testId="text-edit-defense"
                  natureModifier={editedPokemon.natureModifiers.B}
                  showDragBar={true}
                  onEVChange={handleEVChange}
                  onNatureChange={handleNatureChange}
                />
                <EVStatDisplay
                  label="特攻"
                  value={actualStats.specialAttack}
                  evValue={editedPokemon.evs.C}
                  statKey="C"
                  testId="text-edit-special-attack"
                  natureModifier={editedPokemon.natureModifiers.C}
                  showDragBar={true}
                  onEVChange={handleEVChange}
                  onNatureChange={handleNatureChange}
                />
                <EVStatDisplay
                  label="特防"
                  value={actualStats.specialDefense}
                  evValue={editedPokemon.evs.D}
                  statKey="D"
                  testId="text-edit-special-defense"
                  natureModifier={editedPokemon.natureModifiers.D}
                  showDragBar={true}
                  onEVChange={handleEVChange}
                  onNatureChange={handleNatureChange}
                />
                <EVStatDisplay
                  label="素早"
                  value={actualStats.speed}
                  evValue={editedPokemon.evs.S}
                  statKey="S"
                  testId="text-edit-speed"
                  natureModifier={editedPokemon.natureModifiers.S}
                  showDragBar={true}
                  onEVChange={handleEVChange}
                  onNatureChange={handleNatureChange}
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            キャンセル
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-[hsl(var(--gaming-accent))] hover:bg-blue-600"
            data-testid="button-save-pokemon"
          >
            保存
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};