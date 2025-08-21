import { Pokemon } from '@shared/schema';
import { DamageResult } from '@/types/pokemon';
import { 
  getPokemonDataByJpName, 
  getMoveDataByJpName, 
  TYPE_EN_TO_JP,
  getPokemonMoves
} from './pokemon-json-data';

export const calculateStat = (base: number, iv: number = 31, ev: number = 0, level: number = 50, natureMod: number = 1): number => {
  return Math.floor(Math.floor((2 * base + iv + Math.floor(ev / 4)) * level / 100 + 5) * natureMod);
};

export const calculateHP = (base: number, iv: number = 31, ev: number = 0, level: number = 50): number => {
  if (base === 1) return 1;
  return Math.floor((2 * base + iv + Math.floor(ev / 4)) * level / 100) + level + 10;
};

// 実際のフォーミュラに合わせたステータス計算
export const calculateActualStat = (base: number, ev: number = 0, level: number = 50, isHP: boolean = false, natureModifier: number = 1.0): number => {
  const iv = 31; // 個体値は31固定
  
  if (isHP) {
    // HP計算式: (種族値 + 31/2 + 努力値/8) + 60
    return Math.floor(base + iv/2 + ev/8) + 60;
  } else {
    // その他ステータス計算式: ((種族値 + 31/2 + 努力値/8) + 5) * 補正（小数点以下切り捨て）
    return Math.floor((Math.floor(base + iv/2 + ev/8) + 5) * natureModifier);
  }
};

// Simplified type effectiveness - you would need to implement proper type chart
const TYPE_EFFECTIVENESS: Record<string, Record<string, number>> = {
  "ノーマル": { "いわ": 0.5, "はがね": 0.5, "ゴースト": 0 },
  "ほのお": { "ほのお": 0.5, "みず": 0.5, "くさ": 2, "こおり": 2, "むし": 2, "いわ": 0.5, "ドラゴン": 0.5, "はがね": 2 },
  "みず": { "ほのお": 2, "みず": 0.5, "くさ": 0.5, "じめん": 2, "いわ": 2, "ドラゴン": 0.5 },
  "でんき": { "みず": 2, "でんき": 0.5, "くさ": 0.5, "じめん": 0, "ひこう": 2, "ドラゴン": 0.5 },
  "くさ": { "ほのお": 0.5, "みず": 2, "でんき": 1, "くさ": 0.5, "どく": 0.5, "じめん": 2, "ひこう": 0.5, "むし": 0.5, "いわ": 2, "ドラゴン": 0.5, "はがね": 0.5 },
  "こおり": { "ほのお": 0.5, "みず": 0.5, "くさ": 2, "こおり": 0.5, "じめん": 2, "ひこう": 2, "ドラゴン": 2, "はがね": 0.5 },
  "かくとう": { "ノーマル": 2, "でんき": 1, "こおり": 2, "どく": 0.5, "じめん": 1, "ひこう": 0.5, "エスパー": 0.5, "むし": 0.5, "いわ": 2, "ゴースト": 0, "ドラゴン": 1, "あく": 2, "はがね": 2, "フェアリー": 0.5 },
  "どく": { "くさ": 2, "どく": 0.5, "じめん": 0.5, "いわ": 0.5, "ゴースト": 0.5, "はがね": 0, "フェアリー": 2 },
  "じめん": { "ほのお": 2, "でんき": 2, "くさ": 0.5, "どく": 2, "ひこう": 0, "むし": 0.5, "いわ": 2, "はがね": 2 },
  "ひこう": { "でんき": 0.5, "くさ": 2, "こおり": 1, "かくとう": 2, "じめん": 1, "いわ": 0.5, "はがね": 0.5 },
  "エスパー": { "かくとう": 2, "どく": 2, "エスパー": 0.5, "あく": 0, "はがね": 0.5 },
  "むし": { "ほのお": 0.5, "くさ": 2, "かくとう": 0.5, "どく": 0.5, "じめん": 1, "ひこう": 0.5, "エスパー": 2, "ゴースト": 0.5, "あく": 2, "はがね": 0.5, "フェアリー": 0.5 },
  "いわ": { "ほのお": 2, "こおり": 2, "かくとう": 0.5, "じめん": 0.5, "ひこう": 2, "むし": 2, "はがね": 0.5 },
  "ゴースト": { "ノーマル": 0, "エスパー": 2, "ゴースト": 2, "あく": 0.5 },
  "ドラゴン": { "ドラゴン": 2, "はがね": 0.5, "フェアリー": 0 },
  "あく": { "かくとう": 0.5, "エスパー": 2, "ゴースト": 2, "あく": 0.5, "フェアリー": 0.5 },
  "はがね": { "ほのお": 0.5, "みず": 0.5, "でんき": 0.5, "こおり": 2, "いわ": 2, "はがね": 0.5, "フェアリー": 2 },
  "フェアリー": { "ほのお": 0.5, "かくとう": 2, "どく": 0.5, "ドラゴン": 2, "あく": 2, "はがね": 0.5 }
};

export const getTypeEffectiveness = (moveType: string, defenderTypes: string[]): number => {
  let effectiveness = 1;
  
  defenderTypes.forEach(type => {
    const multiplier = TYPE_EFFECTIVENESS[moveType]?.[type] ?? 1;
    effectiveness *= multiplier;
  });
  
  return effectiveness;
};

export const getEffectivenessText = (effectiveness: number): string => {
  if (effectiveness > 1) return "効果はばつぐんだ！";
  if (effectiveness < 1 && effectiveness > 0) return "効果はいまひとつだ...";
  if (effectiveness === 0) return "効果がないようだ...";
  return "効果は普通だ...";
};

export const calculateDamage = (
  attacker: Pokemon,
  defender: Pokemon,
  moveName: string,
  field: {
    weather?: string;
    terrain?: string;
    isCritical?: boolean;
    isTerastallized?: boolean;
  } = {}
): DamageResult => {
  const moveData = getMoveDataByJpName(moveName);
  const attackerData = getPokemonDataByJpName(attacker.name);
  const defenderData = getPokemonDataByJpName(defender.name);
  
  if (!moveData || !attackerData || !defenderData || !moveData.power || moveData.power === 0) {
    return {
      damage: 0,
      minDamage: 0,
      maxDamage: 0,
      percentage: 0,
      maxPercentage: 0,
      effectiveness: 1,
      isCritical: false
    };
  }

  // Simplified nature system - default to no modifier
  const getStat = (pokemon: Pokemon, stat: keyof typeof pokemon.ivs) => {
    if (!attackerData || !defenderData) return 100; // fallback
    
    let base: number;
    if (pokemon === attacker) {
      switch (stat) {
        case 'H': base = attackerData.hp; break;
        case 'A': base = attackerData.attack; break;
        case 'B': base = attackerData.defense; break;
        case 'C': base = attackerData['special-attack']; break;
        case 'D': base = attackerData['special-defense']; break;
        case 'S': base = attackerData.speed; break;
        default: base = 100;
      }
    } else {
      switch (stat) {
        case 'H': base = defenderData.hp; break;
        case 'A': base = defenderData.attack; break;
        case 'B': base = defenderData.defense; break;
        case 'C': base = defenderData['special-attack']; break;
        case 'D': base = defenderData['special-defense']; break;
        case 'S': base = defenderData.speed; break;
        default: base = 100;
      }
    }
    
    return stat === 'H' 
      ? calculateActualStat(base, pokemon.evs.H, pokemon.level, true)
      : calculateActualStat(base, pokemon.evs[stat], pokemon.level, false, pokemon.natureModifiers[stat]);
  };

  // Determine attack and defense stats
  const isPhysical = moveData.class === "physical";
  const attackStat = isPhysical ? getStat(attacker, 'A') : getStat(attacker, 'C');
  const defenseStat = isPhysical ? getStat(defender, 'B') : getStat(defender, 'D');

  // Apply stat boosts
  const getBoostMultiplier = (rank: number) => rank >= 0 ? (2 + rank) / 2 : 2 / (2 - rank);
  
  let attackRank = isPhysical ? attacker.boosts.A : attacker.boosts.C;
  let defenseRank = isPhysical ? defender.boosts.B : defender.boosts.D;
  
  if (field.isCritical) {
    attackRank = Math.max(0, attackRank);
    defenseRank = Math.min(0, defenseRank);
  }

  const finalAttack = Math.floor(attackStat * getBoostMultiplier(attackRank));
  const finalDefense = Math.floor(defenseStat * getBoostMultiplier(defenseRank));

  // Base damage calculation
  let power = moveData.power || 0;
  
  // Get move type from JSON data
  const moveTypeJp = moveData.type || "ノーマル";
  
  // Terrain boosts
  if (field.terrain === "エレキ" && moveTypeJp === "でんき") power = Math.floor(power * 1.3);
  if (field.terrain === "グラス" && moveTypeJp === "くさ") power = Math.floor(power * 1.3);

  let baseDamage = Math.floor(Math.floor(Math.floor(attacker.level * 2 / 5 + 2) * power * finalAttack / finalDefense) / 50) + 2;

  // Weather effects
  let weatherMod = 1;
  if ((field.weather === "はれ" && moveTypeJp === "ほのお") || 
      (field.weather === "あめ" && moveTypeJp === "みず")) {
    weatherMod = 1.5;
  }
  if ((field.weather === "はれ" && moveTypeJp === "みず") || 
      (field.weather === "あめ" && moveTypeJp === "ほのお")) {
    weatherMod = 0.5;
  }

  baseDamage = Math.floor(baseDamage * weatherMod);

  // Critical hit
  if (field.isCritical) {
    baseDamage = Math.floor(baseDamage * 1.5);
  }

  // STAB (Same Type Attack Bonus)
  let stabMod = 1.0;
  const attackerTypesJp = getPokemonDataByJpName(attacker.name)?.types_en?.split(',').map(type => TYPE_EN_TO_JP[type.trim()] || type.trim()) || [];
  
  if (field.isTerastallized) {
    if (attacker.teraType === moveTypeJp) {
      stabMod = attackerTypesJp.includes(moveTypeJp) ? 2.0 : 1.5;
    }
  } else if (attackerTypesJp.includes(moveTypeJp)) {
    stabMod = 1.5;
  }

  baseDamage = Math.floor(baseDamage * stabMod);

  // Type effectiveness
  const defenderTypesJp = getPokemonDataByJpName(defender.name)?.types_en?.split(',').map(type => TYPE_EN_TO_JP[type.trim()] || type.trim()) || [];
  const defenderTypes = field.isTerastallized && defender.teraType !== "なし" 
    ? [defender.teraType] 
    : defenderTypesJp;
  
  const effectiveness = getTypeEffectiveness(moveTypeJp, defenderTypes);
  baseDamage = Math.floor(baseDamage * effectiveness);

  // Random factor (85% - 100%)
  const minDamage = Math.floor(baseDamage * 0.85);
  const maxDamage = baseDamage;

  // Calculate percentages
  const defenderHP = getStat(defender, 'H');
  const minPercentage = Math.round((minDamage / defenderHP) * 100 * 10) / 10;
  const maxPercentage = Math.round((maxDamage / defenderHP) * 100 * 10) / 10;

  return {
    damage: Math.floor((minDamage + maxDamage) / 2),
    minDamage,
    maxDamage,
    percentage: minPercentage,
    maxPercentage,
    effectiveness,
    isCritical: field.isCritical || false
  };
};

export const createDefaultPokemon = (name: string = "フシギダネ"): Pokemon => {
  const data = getPokemonDataByJpName(name);
  if (!data) throw new Error(`Pokemon ${name} not found`);

  const moves = getPokemonMoves(data);

  return {
    id: crypto.randomUUID(),
    name,
    level: 50,
    item: "なし",
    ability: data.abilities_ja ? data.abilities_ja.split(',')[0]?.trim() || "なし" : "なし",
    teraType: "なし",
    nature: "がんばりや",
    ivs: { H: 31, A: 31, B: 31, C: 31, D: 31, S: 31 },
    evs: { H: 0, A: 0, B: 0, C: 0, D: 0, S: 0 },
    moves: moves.slice(0, 4),
    boosts: { A: 0, B: 0, C: 0, D: 0, S: 0 },
    natureModifiers: { A: 1.0, B: 1.0, C: 1.0, D: 1.0, S: 1.0 },
    isShiny: false
  };
};
