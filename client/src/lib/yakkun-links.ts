/**
 * Generate yakkun.com URL for Pokemon
 */
export const getYakkunUrl = (pokemonName: string): string => {
  // Convert Japanese name to romanized form for yakkun.com
  const nameMapping: Record<string, string> = {
    'カイリュー': 'dragonite',
    'ハピナス': 'blissey',
    'ハバタクカミ': 'flutter_mane',
    'サーフゴー': 'gholdengo',
    'パオジアン': 'chien_pao',
    'オーガポン': 'ogerpon',
    'ウーラオス': 'urshifu',
    'ガチグマ': 'ursaluna'
  };
  
  const romanizedName = nameMapping[pokemonName] || pokemonName.toLowerCase();
  return `https://yakkun.com/sv/pokemon/${romanizedName}`;
};

/**
 * Open yakkun.com link in new tab
 */
export const openYakkunLink = (pokemonName: string): void => {
  const url = getYakkunUrl(pokemonName);
  window.open(url, '_blank', 'noopener,noreferrer');
};
