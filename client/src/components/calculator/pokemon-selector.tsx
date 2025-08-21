import { useState, useMemo } from 'react';
import { ChevronDown, ExternalLink, Sparkles, Check } from 'lucide-react';
import { Pokemon } from '@shared/schema';
import { 
  getPokemonDataByJpName,
  getEnhancedPokemonList,
  matchesSearch,
  getYakkunImageUrl,
  getYakkunPageUrl,
  getPokemonTypesJp
} from '@/lib/pokemon-json-data';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { cn } from '@/lib/utils';

interface PokemonSelectorProps {
  pokemon: Pokemon;
  onPokemonChange: (pokemonName: string) => void;
  onShinyToggle: (isShiny: boolean) => void;
  type: 'attacker' | 'defender';
}

export const PokemonSelector: React.FC<PokemonSelectorProps> = ({
  pokemon,
  onPokemonChange,
  onShinyToggle,
  type
}) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  
  // 日本語名でポケモンデータを取得
  const pokemonData = getPokemonDataByJpName(pokemon.name);
  
  // 拡張されたポケモンリスト（フォルム情報を含む）
  const enhancedPokemonList = useMemo(() => getEnhancedPokemonList(), []);
  
  // フィルタリングされたポケモンリスト
  const filteredPokemon = useMemo(() => {
    if (!searchValue.trim()) return enhancedPokemonList;
    
    return enhancedPokemonList.filter(pokemon => {
      // displayNameとnameの両方でマッチング
      return matchesSearch(pokemon.displayName, searchValue) || 
             matchesSearch(pokemon.name, searchValue);
    });
  }, [searchValue, enhancedPokemonList]);
  
  if (!pokemonData) {
    return <div>Pokemon data not found</div>;
  }

  const handleYakkunClick = () => {
    window.open(getYakkunPageUrl(pokemonData), '_blank');
  };

  const spriteUrl = getYakkunImageUrl(pokemonData, pokemon.isShiny);

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
    <div className="space-y-4">
      {/* Pokemon Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          ポケモン選択
        </label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between bg-[hsl(var(--gaming-panel))] border-gray-600 text-white hover:bg-[hsl(var(--gaming-panel))] focus:border-[hsl(var(--pokemon-electric))]"
              data-testid={`button-select-pokemon-${type}`}
            >
              {pokemon.name || "ポケモンを選択..."}
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0 bg-white border-gray-300" align="start">
            <Command className="bg-white" shouldFilter={false}>
              <CommandInput 
                placeholder="ポケモン名を入力..." 
                className="text-gray-900 placeholder-gray-500"
                value={searchValue}
                onValueChange={setSearchValue}
                data-testid={`input-pokemon-search-${type}`}
              />
              <CommandEmpty className="text-gray-600 p-2">該当するポケモンが見つかりません。</CommandEmpty>
              <CommandGroup className="max-h-64 overflow-y-auto">
                {filteredPokemon.map((pokemonItem) => (
                  <CommandItem
                    key={pokemonItem.uniqueId}
                    value={pokemonItem.displayName}
                    onSelect={() => {
                      // displayNameを渡してフォルム情報を保持
                      onPokemonChange(pokemonItem.displayName);
                      setOpen(false);
                      setSearchValue('');
                    }}
                    className="cursor-pointer text-gray-900 hover:bg-gray-100"
                    data-testid={`option-pokemon-${pokemonItem.uniqueId}`}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        pokemon.name === pokemonItem.displayName ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {pokemonItem.displayName}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      
      {/* Pokemon Image & Info */}
      <div className="flex items-center gap-4 bg-[hsl(var(--gaming-panel))] rounded-lg p-4">
        <div className="relative group">
          <img
            src={spriteUrl}
            alt={pokemon.name}
            className="w-16 h-16 pixelated cursor-pointer group-hover:scale-110 transition-transform"
            onClick={handleYakkunClick}
            data-testid={`img-pokemon-${type}`}
          />
          {pokemon.isShiny && (
            <div className="absolute -top-1 -left-1">
              <Sparkles className="w-4 h-4 text-yellow-400" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg" data-testid={`text-pokemon-name-${type}`}>
              {pokemon.name}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleYakkunClick}
              className="p-1 h-auto text-gray-400 hover:text-white hover:bg-gray-700"
              data-testid={`button-yakkun-${type}`}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex gap-2 mt-1">
            {getPokemonTypesJp(pokemonData).map((pokemonType: string, index: number) => (
              <span
                key={index}
                className={`px-2 py-1 text-white text-xs rounded-full ${typeColors[pokemonType] || 'bg-gray-500'}`}
                data-testid={`text-type-${index}-${pokemonType.toLowerCase()}`}
              >
                {pokemonType}
              </span>
            ))}
          </div>
          <div className="text-sm text-gray-400 mt-1">
            Lv.{pokemon.level} | {pokemon.ability}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onShinyToggle(!pokemon.isShiny)}
            className={`px-3 py-1 text-xs ${
              pokemon.isShiny 
                ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400' 
                : 'bg-gray-800 border-gray-600 text-gray-400'
            }`}
            data-testid={`button-shiny-toggle-${type}`}
          >
            <Sparkles className="w-3 h-3 mr-1" />
            色違い
          </Button>
        </div>
      </div>
    </div>
  );
};
