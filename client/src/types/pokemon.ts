export interface PokemonData {
  types: string[];
  stats: {
    H: number;
    A: number;
    B: number;
    C: number;
    D: number;
    S: number;
  };
  abilities: string[];
  sprite: string;
  shinySprite?: string;
  learnset: string[];
}

export interface MoveData {
  power: number;
  type: string;
  category: "Physical" | "Special" | "Status";
}

export interface NatureData {
  inc?: string;
  dec?: string;
}

export interface DamageResult {
  damage: number;
  minDamage: number;
  maxDamage: number;
  percentage: number;
  maxPercentage: number;
  effectiveness: number;
  isCritical: boolean;
}
