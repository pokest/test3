import { PokemonData, MoveData, NatureData } from '@/types/pokemon';

// Yakkun.com image URLs for Pokemon
const getYakkunImageUrl = (pokemonName: string, isShiny: boolean = false): string => {
  const yakkunIds: Record<string, string> = {
    'カイリュー': '149',
    'ハピナス': '242',
    'ハバタクカミ': '987',
    'サーフゴー': '999',
    'パオジアン': '1002',
    'オーガポン': '1017',
    'ウーラオス': '892',
    'ガチグマ': '901'
  };
  
  const yakkunId = yakkunIds[pokemonName] || '1';
  const shinyParam = isShiny ? '_s' : '';
  return `https://yakkun.com/sv/icon/${yakkunId}${shinyParam}.gif`;
};

export const POKEMON_DATA: Record<string, PokemonData> = {
  "カイリュー": {
    types: ["ドラゴン", "ひこう"],
    stats: { H: 91, A: 134, B: 95, C: 100, D: 100, S: 80 },
    abilities: ["せいしんりょく", "マルチスケイル"],
    sprite: getYakkunImageUrl("カイリュー", false),
    shinySprite: getYakkunImageUrl("カイリュー", true),
    learnset: ["しんそく", "げきりん", "じしん", "アイアンヘッド", "りゅうのまい", "つるぎのまい", "かえんほうしゃ", "10まんボルト", "れいとうビーム"]
  },
  "ハピナス": {
    types: ["ノーマル"],
    stats: { H: 255, A: 10, B: 10, C: 75, D: 135, S: 55 },
    abilities: ["しぜんかいふく", "てんのめぐみ"],
    sprite: getYakkunImageUrl("ハピナス", false),
    shinySprite: getYakkunImageUrl("ハピナス", true),
    learnset: ["タマゴうみ", "ちきゅうなげ", "でんじは", "どくどく", "かえんほうしゃ", "れいとうビーム", "10まんボルト", "サイコキネシス"]
  },
  "ハバタクカミ": {
    types: ["ゴースト", "フェアリー"],
    stats: { H: 55, A: 55, B: 55, C: 135, D: 135, S: 135 },
    abilities: ["こだいかっせい"],
    sprite: getYakkunImageUrl("ハバタクカミ", false),
    shinySprite: getYakkunImageUrl("ハバタクカミ", true),
    learnset: ["ムーンフォース", "シャドーボール", "サイコキネシス", "10まんボルト", "エナジーボール", "わるだくみ"]
  },
  "サーフゴー": {
    types: ["はがね", "ゴースト"],
    stats: { H: 87, A: 60, B: 95, C: 133, D: 91, S: 84 },
    abilities: ["おうごんのからだ"],
    sprite: getYakkunImageUrl("サーフゴー", false),
    shinySprite: getYakkunImageUrl("サーフゴー", true),
    learnset: ["ゴールドラッシュ", "シャドーボール", "サイコキネシス", "10まんボルト", "わるだくみ"]
  },
  "パオジアン": {
    types: ["あく", "こおり"],
    stats: { H: 80, A: 120, B: 80, C: 90, D: 65, S: 135 },
    abilities: ["わざわいのつるぎ"],
    sprite: getYakkunImageUrl("パオジアン", false),
    shinySprite: getYakkunImageUrl("パオジアン", true),
    learnset: ["つららおとし", "かみくだく", "インファイト", "せいなるつるぎ", "つるぎのまい", "ステルスロック"]
  },
  "オーガポン": {
    types: ["くさ"],
    stats: { H: 80, A: 120, B: 84, C: 60, D: 96, S: 110 },
    abilities: ["まんぷくこうげき"],
    sprite: getYakkunImageUrl("オーガポン", false),
    shinySprite: getYakkunImageUrl("オーガポン", true),
    learnset: ["ウッドハンマー", "アイビーカッジ", "とんぼがえり", "つるぎのまい", "みがわり", "やどりぎのタネ"]
  }
};

export const MOVE_DATA: Record<string, MoveData> = {
  "なし": { power: 0, type: "ノーマル", category: "Status" },
  "10まんボルト": { power: 90, type: "でんき", category: "Special" },
  "れいとうビーム": { power: 90, type: "こおり", category: "Special" },
  "かえんほうしゃ": { power: 90, type: "ほのお", category: "Special" },
  "シャドーボール": { power: 80, type: "ゴースト", category: "Special" },
  "インファイト": { power: 120, type: "かくとう", category: "Physical" },
  "じしん": { power: 100, type: "じめん", category: "Physical" },
  "しんそく": { power: 80, type: "ノーマル", category: "Physical" },
  "ゴールドラッシュ": { power: 120, type: "はがね", category: "Special" },
  "げきりん": { power: 120, type: "ドラゴン", category: "Physical" },
  "ムーンフォース": { power: 95, type: "フェアリー", category: "Special" },
  "サイコキネシス": { power: 90, type: "エスパー", category: "Special" }
};

export const NATURE_DATA: Record<string, NatureData> = {
  "がんばりや": {},
  "さみしがり": { inc: 'A', dec: 'B' },
  "いじっぱり": { inc: 'A', dec: 'C' },
  "やんちゃ": { inc: 'A', dec: 'D' },
  "ゆうかん": { inc: 'A', dec: 'S' },
  "ずぶとい": { inc: 'B', dec: 'A' },
  "わんぱく": { inc: 'B', dec: 'C' },
  "のうてんき": { inc: 'B', dec: 'D' },
  "のんき": { inc: 'B', dec: 'S' },
  "ひかえめ": { inc: 'C', dec: 'A' },
  "おっとり": { inc: 'C', dec: 'B' },
  "うっかりや": { inc: 'C', dec: 'D' },
  "れいせい": { inc: 'C', dec: 'S' },
  "おだやか": { inc: 'D', dec: 'A' },
  "おとなしい": { inc: 'D', dec: 'B' },
  "しんちょう": { inc: 'D', dec: 'C' },
  "なまいき": { inc: 'D', dec: 'S' },
  "おくびょう": { inc: 'S', dec: 'A' },
  "せっかち": { inc: 'S', dec: 'B' },
  "ようき": { inc: 'S', dec: 'C' },
  "むじゃき": { inc: 'S', dec: 'D' }
};

export const TYPE_CHART: Record<string, Record<string, number>> = {
  "ノーマル": { "いわ": 0.5, "ゴースト": 0, "はがね": 0.5 },
  "ほのお": { "ほのお": 0.5, "みず": 0.5, "くさ": 2, "こおり": 2, "むし": 2, "いわ": 0.5, "ドラゴン": 0.5, "はがね": 2 },
  "みず": { "ほのお": 2, "みず": 0.5, "くさ": 0.5, "じめん": 2, "いわ": 2, "ドラゴン": 0.5 },
  "でんき": { "みず": 2, "でんき": 0.5, "くさ": 0.5, "じめん": 0, "ひこう": 2, "ドラゴン": 0.5 },
  "くさ": { "ほのお": 0.5, "みず": 2, "くさ": 0.5, "どく": 0.5, "じめん": 2, "ひこう": 0.5, "むし": 0.5, "いわ": 2, "ドラゴン": 0.5, "はがね": 0.5 },
  "こおり": { "ほのお": 0.5, "みず": 0.5, "くさ": 2, "こおり": 0.5, "じめん": 2, "ひこう": 2, "ドラゴン": 2, "はがね": 0.5 },
  "かくとう": { "ノーマル": 2, "こおり": 2, "どく": 0.5, "ひこう": 0.5, "エスパー": 0.5, "むし": 0.5, "いわ": 2, "ゴースト": 0, "あく": 2, "はがね": 2, "フェアリー": 0.5 },
  "どく": { "くさ": 2, "どく": 0.5, "じめん": 0.5, "いわ": 0.5, "ゴースト": 0.5, "はがね": 0, "フェアリー": 2 },
  "じめん": { "ほのお": 2, "でんき": 2, "くさ": 0.5, "どく": 2, "ひこう": 0, "むし": 0.5, "いわ": 2, "はがね": 2 },
  "ひこう": { "でんき": 0.5, "くさ": 2, "かくとう": 2, "むし": 2, "いわ": 0.5, "はがね": 0.5 },
  "エスパー": { "かくとう": 2, "どく": 2, "エスパー": 0.5, "あく": 0, "はがね": 0.5 },
  "むし": { "ほのお": 0.5, "くさ": 2, "かくとう": 0.5, "どく": 0.5, "ひこう": 0.5, "エスパー": 2, "ゴースト": 0.5, "あく": 2, "はがね": 0.5, "フェアリー": 0.5 },
  "いわ": { "ほのお": 2, "こおり": 2, "かくとう": 0.5, "じめん": 0.5, "ひこう": 2, "むし": 2, "はがね": 0.5 },
  "ゴースト": { "ノーマル": 0, "エスパー": 2, "ゴースト": 2, "あく": 0.5 },
  "ドラゴン": { "ドラゴン": 2, "はがね": 0.5, "フェアリー": 0 },
  "あく": { "かくとう": 0.5, "エスパー": 2, "ゴースト": 2, "あく": 0.5, "フェアリー": 0.5 },
  "はがね": { "ほのお": 0.5, "みず": 0.5, "でんき": 0.5, "こおり": 2, "いわ": 2, "はがね": 0.5, "フェアリー": 2 },
  "フェアリー": { "ほのお": 0.5, "かくとう": 2, "どく": 0.5, "ドラゴン": 2, "あく": 2, "はがね": 0.5 }
};

export const ALL_TYPES = [
  "ノーマル", "ほのお", "みず", "でんき", "くさ", "こおり",
  "かくとう", "どく", "じめん", "ひこう", "エスパー", "むし",
  "いわ", "ゴースト", "ドラゴン", "あく", "はがね", "フェアリー"
];

export const ITEMS = [
  "なし", "いのちのたま", "こだわりスカーフ", "こだわりハチマキ", 
  "こだわりメガネ", "きあいのタスキ", "とつげきチョッキ", "たべのこし", 
  "しんかのきせき", "クリアチャーム"
];

export const POKEMON_NAMES = Object.keys(POKEMON_DATA);
export const NATURE_NAMES = Object.keys(NATURE_DATA);
