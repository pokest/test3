import pokemonDataJson from '@/data/pokemon-data.json';
import moveDataJson from '@/data/move-data.json';

// ポケモンデータの型定義
export interface PokemonDataEntry {
  name: string;
  url: string;
  name_en: string;
  name_ja: string;
  hp: number;
  attack: number;
  defense: number;
  'special-attack': number;
  'special-defense': number;
  speed: number;
  moves_en: string;
  moves_ja: string;
  abilities_en: string;
  abilities_ja: string;
  types_en: string;
  image_url: string;
}

// 技データの型定義
export interface MoveDataEntry {
  name_en: string;
  name_ja: string;
  power: number | null;
  type: string;
  class: 'physical' | 'special' | 'status';
  desc_ja: string;
}

// JSONデータをロード
export const POKEMON_JSON_DATA = pokemonDataJson as PokemonDataEntry[];
export const MOVE_JSON_DATA = moveDataJson as Record<string, MoveDataEntry>;

// ポケモン名リストを生成（日本語名）
export const POKEMON_NAMES_JP = POKEMON_JSON_DATA.map(pokemon => pokemon.name_ja).sort();

// ポケモン名から英語名に変換するマップ
export const JP_TO_EN_NAME_MAP = POKEMON_JSON_DATA.reduce((acc, pokemon) => {
  acc[pokemon.name_ja] = pokemon.name_en;
  return acc;
}, {} as Record<string, string>);

// 英語名から日本語名に変換するマップ
export const EN_TO_JP_NAME_MAP = POKEMON_JSON_DATA.reduce((acc, pokemon) => {
  acc[pokemon.name_en] = pokemon.name_ja;
  return acc;
}, {} as Record<string, string>);

// ポケモンデータを英語名で取得
export const getPokemonDataByEnName = (englishName: string): PokemonDataEntry | null => {
  return POKEMON_JSON_DATA.find(pokemon => pokemon.name_en === englishName) || null;
};

// ポケモンデータを日本語名で取得（フォルム対応）
export const getPokemonDataByJpName = (japaneseName: string): PokemonDataEntry | null => {
  // 完全一致を優先
  const exactMatch = POKEMON_JSON_DATA.find(pokemon => pokemon.name_ja === japaneseName);
  if (exactMatch) return exactMatch;
  
  // フォルム名が含まれている場合、英語名でも検索
  if (japaneseName.includes('（')) {
    const baseName = japaneseName.split('（')[0];
    const formPart = japaneseName.match(/（(.+)）/)?.[1];
    
    if (formPart) {
      // 日本語フォルム名から英語フォルム名に逆変換
      const reverseTranslationMap = Object.fromEntries(
        Object.entries(FORM_NAME_TRANSLATIONS).map(([en, ja]) => [ja, en])
      );
      const englishFormPart = reverseTranslationMap[formPart];
      
      if (englishFormPart) {
        // 英語ベース名を取得（既存のポケモンから）
        const baseNameEn = POKEMON_JSON_DATA.find(p => p.name_ja === baseName)?.name_en.split('-')[0];
        if (baseNameEn) {
          const targetEnglishName = `${baseNameEn}-${englishFormPart}`;
          const formMatch = POKEMON_JSON_DATA.find(pokemon => 
            pokemon.name_en.toLowerCase() === targetEnglishName.toLowerCase()
          );
          if (formMatch) return formMatch;
        }
      }
    }
  }
  
  return null;
};

// ポケモンの覚える技リストを取得（日本語名）
export const getPokemonMoves = (pokemonData: PokemonDataEntry): string[] => {
  if (!pokemonData.moves_ja) return [];
  return pokemonData.moves_ja.split(',').map(move => move.trim()).filter(move => move.length > 0);
};

// ポケモンの覚える技リスト（英語名）
export const getPokemonMovesEn = (pokemonData: PokemonDataEntry): string[] => {
  if (!pokemonData.moves_en) return [];
  return pokemonData.moves_en.split(',').map(move => move.trim()).filter(move => move.length > 0);
};

// ひらがな・カタカナ変換マップ
const hiraganaToKatakana: Record<string, string> = {
  'あ': 'ア', 'い': 'イ', 'う': 'ウ', 'え': 'エ', 'お': 'オ',
  'か': 'カ', 'き': 'キ', 'く': 'ク', 'け': 'ケ', 'こ': 'コ',
  'が': 'ガ', 'ぎ': 'ギ', 'ぐ': 'グ', 'げ': 'ゲ', 'ご': 'ゴ',
  'さ': 'サ', 'し': 'シ', 'す': 'ス', 'せ': 'セ', 'そ': 'ソ',
  'ざ': 'ザ', 'じ': 'ジ', 'ず': 'ズ', 'ぜ': 'ゼ', 'ぞ': 'ゾ',
  'た': 'タ', 'ち': 'チ', 'つ': 'ツ', 'て': 'テ', 'と': 'ト',
  'だ': 'ダ', 'ぢ': 'ヂ', 'づ': 'ヅ', 'で': 'デ', 'ど': 'ド',
  'な': 'ナ', 'に': 'ニ', 'ぬ': 'ヌ', 'ね': 'ネ', 'の': 'ノ',
  'は': 'ハ', 'ひ': 'ヒ', 'ふ': 'フ', 'へ': 'ヘ', 'ほ': 'ホ',
  'ば': 'バ', 'び': 'ビ', 'ぶ': 'ブ', 'べ': 'ベ', 'ぼ': 'ボ',
  'ぱ': 'パ', 'ぴ': 'ピ', 'ぷ': 'プ', 'ぺ': 'ペ', 'ぽ': 'ポ',
  'ま': 'マ', 'み': 'ミ', 'む': 'ム', 'め': 'メ', 'も': 'モ',
  'や': 'ヤ', 'ゆ': 'ユ', 'よ': 'ヨ',
  'ら': 'ラ', 'り': 'リ', 'る': 'ル', 'れ': 'レ', 'ろ': 'ロ',
  'わ': 'ワ', 'ゐ': 'ヰ', 'ゑ': 'ヱ', 'を': 'ヲ', 'ん': 'ン',
  'ゃ': 'ャ', 'ゅ': 'ュ', 'ょ': 'ョ', 'っ': 'ッ'
};

const katakanaToHiragana: Record<string, string> = Object.fromEntries(
  Object.entries(hiraganaToKatakana).map(([h, k]) => [k, h])
);

// ローマ字変換マップ
const romajiToHiragana: Record<string, string> = {
  // ポケモン名の直接マッピング
  'pikachu': 'ぴかちゅう',
  'fushigidane': 'ふしぎだね',
  'hitokage': 'ひとかげ',
  'zenigame': 'ぜにがめ',
  // 技名の直接マッピング
  'taiatari': 'たいあたり',
  'hakaichuu': 'はかいちゅう',
  'kaminari': 'かみなり',
  'naminori': 'なみのり',
  'hanabira': 'はなびら',
  // 基本文字
  'a': 'あ', 'i': 'い', 'u': 'う', 'e': 'え', 'o': 'お',
  'ka': 'か', 'ki': 'き', 'ku': 'く', 'ke': 'け', 'ko': 'こ',
  'ga': 'が', 'gi': 'ぎ', 'gu': 'ぐ', 'ge': 'げ', 'go': 'ご',
  'sa': 'さ', 'shi': 'し', 'su': 'す', 'se': 'せ', 'so': 'そ',
  'za': 'ざ', 'ji': 'じ', 'zu': 'ず', 'ze': 'ぜ', 'zo': 'ぞ',
  'ta': 'た', 'chi': 'ち', 'tsu': 'つ', 'te': 'て', 'to': 'と',
  'da': 'だ', 'di': 'ぢ', 'du': 'づ', 'de': 'で', 'do': 'ど',
  'na': 'な', 'ni': 'に', 'nu': 'ぬ', 'ne': 'ね', 'no': 'の',
  'ha': 'は', 'hi': 'ひ', 'hu': 'ふ', 'fu': 'ふ', 'he': 'へ', 'ho': 'ほ',
  'ba': 'ば', 'bi': 'び', 'bu': 'ぶ', 'be': 'べ', 'bo': 'ぼ',
  'pa': 'ぱ', 'pi': 'ぴ', 'pu': 'ぷ', 'pe': 'ぺ', 'po': 'ぽ',
  'ma': 'ま', 'mi': 'み', 'mu': 'む', 'me': 'め', 'mo': 'も',
  'ya': 'や', 'yu': 'ゆ', 'yo': 'よ',
  'ra': 'ら', 'ri': 'り', 'ru': 'る', 're': 'れ', 'ro': 'ろ',
  'wa': 'わ', 'wo': 'を', 'n': 'ん'
};

// 文字変換ユーティリティ関数
const convertHiraganaToKatakana = (str: string): string => {
  return str.replace(/[あ-ん]/g, (char) => hiraganaToKatakana[char] || char);
};

const convertKatakanaToHiragana = (str: string): string => {
  return str.replace(/[ア-ン]/g, (char) => katakanaToHiragana[char] || char);
};

const convertRomajiToHiragana = (str: string): string => {
  let result = str.toLowerCase();
  
  // 完全一致をまずチェック
  if (romajiToHiragana[result]) {
    return romajiToHiragana[result];
  }
  
  // 長い組み合わせから順に変換
  const sortedKeys = Object.keys(romajiToHiragana).sort((a, b) => b.length - a.length);
  
  for (const romaji of sortedKeys) {
    result = result.replace(new RegExp(romaji, 'g'), romajiToHiragana[romaji]);
  }
  return result;
};

// 検索マッチング関数
export const matchesSearch = (target: string, searchValue: string): boolean => {
  if (!searchValue.trim()) return true;
  
  const normalizedSearch = searchValue.toLowerCase().trim();
  const normalizedTarget = target.toLowerCase();
  
  // 直接マッチ（大文字小文字無視）
  if (normalizedTarget.includes(normalizedSearch)) return true;
  
  // 英語名との直接マッチ（ポケモン名の場合）
  const pokemonData = POKEMON_JSON_DATA.find(p => p.name_ja === target);
  if (pokemonData && pokemonData.name_en.toLowerCase().includes(normalizedSearch)) {
    return true;
  }
  
  // ローマ字からポケモン名への直接マッチ
  for (const [romaji, hiragana] of Object.entries(romajiToHiragana)) {
    if (normalizedSearch === romaji) {
      const katakana = convertHiraganaToKatakana(hiragana);
      if (normalizedTarget.includes(katakana.toLowerCase())) {
        return true;
      }
    }
  }
  
  // ひらがな -> カタカナ変換でマッチ
  const katakanaSearch = convertHiraganaToKatakana(searchValue);
  if (normalizedTarget.includes(katakanaSearch.toLowerCase())) return true;
  
  // カタカナ -> ひらがな変換でマッチ
  const hiraganaSearch = convertKatakanaToHiragana(searchValue);
  if (normalizedTarget.includes(hiraganaSearch.toLowerCase())) return true;
  
  // ローマ字変換でのマッチ
  const romajiToKatakanaSearch = convertRomajiToHiragana(normalizedSearch);
  if (romajiToKatakanaSearch !== normalizedSearch) {
    // 変換された文字列でのマッチ
    if (normalizedTarget.includes(romajiToKatakanaSearch.toLowerCase())) return true;
    // さらにカタカナに変換してマッチ
    const convertedKatakana = convertHiraganaToKatakana(romajiToKatakanaSearch);
    if (normalizedTarget.includes(convertedKatakana.toLowerCase())) return true;
  }
  
  return false;
};

// 英語フォルム名から日本語フォルム名への変換マップ
const FORM_NAME_TRANSLATIONS: Record<string, string> = {
  'incarnate': 'けしん',
  'therian': 'れいじゅう',
  'altered': 'アナザー',
  'origin': 'オリジン',
  'heat': 'ヒート',
  'wash': 'ウォッシュ',
  'frost': 'フロスト',
  'fan': 'スピン',
  'mow': 'カット',
  'red-striped': 'あかすじ',
  'blue-striped': 'あおすじ',
  'sunshine': 'ポジ',
  'east': 'ひがし',
  'west': 'にし',
  'autumn': 'あき',
  'winter': 'ふゆ',
  'spring': 'はる',
  'summer': 'なつ',
  'midday': 'まひる',
  'midnight': 'まよなか',
  'dusk': 'たそがれ',
  'normal': 'ノーマル'
};

// 英語名からフォルム名を抽出して日本語に変換
const getFormNameFromEnglish = (englishName: string, japaneseName: string): string => {
  // ハイフンで分割してフォルム部分を取得
  const parts = englishName.toLowerCase().split('-');
  
  if (parts.length <= 1) {
    return japaneseName; // フォルムがない場合はそのまま
  }
  
  // 最後の部分がフォルム名
  const formPart = parts.slice(1).join('-');
  const translatedForm = FORM_NAME_TRANSLATIONS[formPart];
  
  if (translatedForm) {
    // 既に（）が含まれている場合はそのまま、ない場合は追加
    if (japaneseName.includes('（')) {
      return japaneseName;
    }
    return `${japaneseName}（${translatedForm}）`;
  }
  
  return japaneseName;
};

// 拡張されたポケモン名リスト生成（フォルム情報を含む）
export const getEnhancedPokemonList = (): Array<{name: string, displayName: string, data: PokemonDataEntry, uniqueId: string}> => {
  const pokemonMap = new Map<string, {base: string, forms: PokemonDataEntry[]}>();
  
  // ベースポケモンとフォルムをグループ化（英語名のベース部分で）
  POKEMON_JSON_DATA.forEach(pokemon => {
    const baseEnglishName = pokemon.name_en.split('-')[0];
    const baseName = pokemon.name_ja.split('（')[0];
    
    if (!pokemonMap.has(baseEnglishName)) {
      pokemonMap.set(baseEnglishName, { base: baseName, forms: [] });
    }
    pokemonMap.get(baseEnglishName)!.forms.push(pokemon);
  });
  
  const result: Array<{name: string, displayName: string, data: PokemonDataEntry, uniqueId: string}> = [];
  
  pokemonMap.forEach(({ base, forms }) => {
    if (forms.length === 1) {
      // フォルムが1つだけの場合
      const form = forms[0];
      result.push({
        name: form.name_ja,
        displayName: form.name_ja,
        data: form,
        uniqueId: `${form.name_en}`
      });
    } else {
      // 複数のフォルムがある場合
      forms.forEach((form) => {
        const displayName = getFormNameFromEnglish(form.name_en, form.name_ja);
        result.push({
          name: displayName, // displayNameをnameに設定してフォルム区別を保持
          displayName: displayName,
          data: form,
          uniqueId: `${form.name_en}`
        });
      });
    }
  });
  
  return result.sort((a, b) => a.displayName.localeCompare(b.displayName));
};

// 技データを英語名で取得
export const getMoveDataByEnName = (englishName: string): MoveDataEntry | null => {
  return MOVE_JSON_DATA[englishName] || null;
};

// タイプ名を英語から日本語に変換
export const TYPE_EN_TO_JP: Record<string, string> = {
  'normal': 'ノーマル',
  'fire': 'ほのお',
  'water': 'みず',
  'electric': 'でんき',
  'grass': 'くさ',
  'ice': 'こおり',
  'fighting': 'かくとう',
  'poison': 'どく',
  'ground': 'じめん',
  'flying': 'ひこう',
  'psychic': 'エスパー',
  'bug': 'むし',
  'rock': 'いわ',
  'ghost': 'ゴースト',
  'dragon': 'ドラゴン',
  'dark': 'あく',
  'steel': 'はがね',
  'fairy': 'フェアリー'
};

// ポケモンのタイプを日本語で取得
export const getPokemonTypesJp = (pokemonData: PokemonDataEntry): string[] => {
  if (!pokemonData.types_en) return [];
  return pokemonData.types_en.split(',')
    .map(type => type.trim())
    .map(type => TYPE_EN_TO_JP[type] || type);
};

// ヤックン画像URLを生成
export const getYakkunImageUrl = (pokemonData: PokemonDataEntry, isShiny: boolean = false): string => {
  // ポケモンの図鑑番号を取得（URLから抽出）
  const urlParts = pokemonData.url.split('/');
  const pokemonId = urlParts[urlParts.length - 2];
  
  if (isShiny) {
    return `https://yakkun.com/sm/pokemon/${pokemonId}s.gif`;
  } else {
    return `https://yakkun.com/sm/pokemon/${pokemonId}.gif`;
  }
};

// ヤックンページURLを生成
export const getYakkunPageUrl = (pokemonData: PokemonDataEntry): string => {
  const urlParts = pokemonData.url.split('/');
  const pokemonId = urlParts[urlParts.length - 2];
  return `https://yakkun.com/sm/zukan/n${pokemonId}`;
};

// 技データを日本語名で取得
export const getMoveDataByJpName = (japaneseName: string): MoveDataEntry | null => {
  // 技の英語名を日本語名から逆引きして取得
  const moveEntry = Object.values(MOVE_JSON_DATA).find(move => move.name_ja === japaneseName);
  return moveEntry || null;
};