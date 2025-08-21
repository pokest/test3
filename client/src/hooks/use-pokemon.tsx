import { useState, useCallback } from 'react';
import { Pokemon } from '@shared/schema';
import { createDefaultPokemon, calculateDamage } from '@/lib/damage-calculator';
import { 
  POKEMON_NAMES_JP, 
  getPokemonDataByJpName, 
  getPokemonMoves 
} from '@/lib/pokemon-json-data';
import { DamageResult } from '@/types/pokemon';

export const usePokemon = () => {
  const [attacker, setAttacker] = useState<Pokemon>(() => {
    const pokemon = createDefaultPokemon("フシギダネ");
    if (!pokemon.natureModifiers) {
      pokemon.natureModifiers = { A: 1.0, B: 1.0, C: 1.0, D: 1.0, S: 1.0 };
    }
    return pokemon;
  });
  const [defender, setDefender] = useState<Pokemon>(() => {
    const pokemon = createDefaultPokemon("ヒトカゲ");
    if (!pokemon.natureModifiers) {
      pokemon.natureModifiers = { A: 1.0, B: 1.0, C: 1.0, D: 1.0, S: 1.0 };
    }
    return pokemon;
  });
  const [selectedMove, setSelectedMove] = useState<string>("たいあたり");
  const [damageResult, setDamageResult] = useState<DamageResult | null>(null);

  const calculateDamageResult = useCallback((
    customAttacker?: Pokemon,
    customDefender?: Pokemon,
    customMove?: string,
    field?: {
      weather?: string;
      terrain?: string;
      isCritical?: boolean;
      isTerastallized?: boolean;
    }
  ) => {
    const attackerPokemon = customAttacker || attacker;
    const defenderPokemon = customDefender || defender;
    const move = customMove || selectedMove;

    const result = calculateDamage(attackerPokemon, defenderPokemon, move, field);
    setDamageResult(result);
    return result;
  }, [attacker, defender, selectedMove]);

  const updateAttacker = useCallback((updates: Partial<Pokemon>) => {
    setAttacker(prev => ({ ...prev, ...updates }));
  }, []);

  const updateDefender = useCallback((updates: Partial<Pokemon>) => {
    setDefender(prev => ({ ...prev, ...updates }));
  }, []);

  const updateAttackerEV = useCallback((stat: keyof Pokemon['evs'], value: number) => {
    setAttacker(prev => ({
      ...prev,
      evs: { ...prev.evs, [stat]: value }
    }));
  }, []);

  const updateDefenderEV = useCallback((stat: keyof Pokemon['evs'], value: number) => {
    setDefender(prev => ({
      ...prev,
      evs: { ...prev.evs, [stat]: value }
    }));
  }, []);

  const updateAttackerNature = useCallback((stat: keyof Pokemon['natureModifiers'], modifier: number) => {
    setAttacker(prev => ({
      ...prev,
      natureModifiers: { ...prev.natureModifiers, [stat]: modifier }
    }));
  }, []);

  const updateDefenderNature = useCallback((stat: keyof Pokemon['natureModifiers'], modifier: number) => {
    setDefender(prev => ({
      ...prev,
      natureModifiers: { ...prev.natureModifiers, [stat]: modifier }
    }));
  }, []);

  // Calculate total EVs
  const getTotalEVs = useCallback((pokemon: Pokemon) => {
    return Object.values(pokemon.evs).reduce((sum, ev) => sum + ev, 0);
  }, []);

  const switchPokemon = useCallback((type: 'attacker' | 'defender', pokemonName: string) => {
    const newPokemon = createDefaultPokemon(pokemonName);
    if (type === 'attacker') {
      setAttacker(newPokemon);
      // Update selected move if current move is not learnable
      const pokemonData = getPokemonDataByJpName(pokemonName);
      const learnset = pokemonData ? getPokemonMoves(pokemonData) : [];
      if (!learnset.includes(selectedMove)) {
        setSelectedMove(learnset[0] || "たいあたり");
      }
    } else {
      setDefender(newPokemon);
    }
  }, [selectedMove]);

  const getPokemonStats = useCallback((pokemon: Pokemon) => {
    const data = getPokemonDataByJpName(pokemon.name);
    if (!data) return null;

    // Use the new formula with nature modifiers
    return {
      hp: Math.floor(data.hp + 31/2 + pokemon.evs.H/8) + 60,
      attack: Math.floor((Math.floor(data.attack + 31/2 + pokemon.evs.A/8) + 5) * pokemon.natureModifiers.A),
      defense: Math.floor((Math.floor(data.defense + 31/2 + pokemon.evs.B/8) + 5) * pokemon.natureModifiers.B),
      specialAttack: Math.floor((Math.floor(data['special-attack'] + 31/2 + pokemon.evs.C/8) + 5) * pokemon.natureModifiers.C),
      specialDefense: Math.floor((Math.floor(data['special-defense'] + 31/2 + pokemon.evs.D/8) + 5) * pokemon.natureModifiers.D),
      speed: Math.floor((Math.floor(data.speed + 31/2 + pokemon.evs.S/8) + 5) * pokemon.natureModifiers.S)
    };
  }, []);

  return {
    attacker,
    defender,
    selectedMove,
    damageResult,
    setSelectedMove,
    switchPokemon,
    updateAttacker,
    updateDefender,
    updateAttackerEV,
    updateDefenderEV,
    updateAttackerNature,
    updateDefenderNature,
    getTotalEVs,
    calculateDamageResult,
    getPokemonStats,
    availablePokemon: POKEMON_NAMES_JP
  };
};
