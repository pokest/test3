import { useState, useMemo } from 'react';
import { Calculator, Sword, Shield, Zap, Send } from 'lucide-react';
import { usePokemon } from '@/hooks/use-pokemon';
import { 
  getPokemonDataByJpName, 
  getPokemonMoves, 
  getMoveDataByEnName,
  getPokemonMovesEn,
  matchesSearch,
  MOVE_JSON_DATA
} from '@/lib/pokemon-json-data';
import { getEffectivenessText } from '@/lib/damage-calculator';
import { PokemonSelector } from './pokemon-selector';
import { EVStatDisplay } from './ev-stat-display';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DamageCalculatorProps {
  onShareResult?: (result: {
    attacker: string;
    defender: string;
    move: string;
    damage: number;
    effectiveness: string;
  }) => void;
}

export const DamageCalculator: React.FC<DamageCalculatorProps> = ({ onShareResult }) => {
  const {
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
    getPokemonStats
  } = usePokemon();

  const [field, setField] = useState({
    weather: "なし",
    terrain: "なし",
    isCritical: false,
    isTerastallized: false
  });

  // Move selection state
  const [moveOpen, setMoveOpen] = useState(false);
  const [moveSearchValue, setMoveSearchValue] = useState('');

  const handleCalculate = () => {
    const result = calculateDamageResult(attacker, defender, selectedMove, field);
    console.log('Damage calculated:', result);
  };

  const handleShareResult = () => {
    if (damageResult && onShareResult) {
      onShareResult({
        attacker: attacker.name,
        defender: defender.name,
        move: selectedMove,
        damage: damageResult.damage,
        effectiveness: getEffectivenessText(damageResult.effectiveness)
      });
    }
  };

  const attackerStats = getPokemonStats(attacker);
  const defenderStats = getPokemonStats(defender);
  const attackerData = getPokemonDataByJpName(attacker.name);
  const defenderData = getPokemonDataByJpName(defender.name);
  
  if (!attackerData || !defenderData) {
    return <div>Loading...</div>;
  }

  // ポケモンが覚える技のリストを取得（日本語名）
  const attackerMovesJp = getPokemonMoves(attackerData);
  // 英語名も取得してデータ検索用に使用
  const attackerMovesEn = getPokemonMovesEn(attackerData);
  
  // 選択した技のデータを取得（英語名で検索）
  const selectedMoveEn = selectedMove ? attackerMovesEn[attackerMovesJp.indexOf(selectedMove)] : '';
  const moveData = selectedMoveEn ? getMoveDataByEnName(selectedMoveEn) : null;
  
  // フィルタリングされた技リスト
  const filteredMoves = useMemo(() => {
    if (!moveSearchValue.trim()) return attackerMovesJp;
    
    return attackerMovesJp.filter(move => 
      matchesSearch(move, moveSearchValue)
    );
  }, [moveSearchValue, attackerMovesJp]);

  // リアルタイムダメージ計算
  const realtimeDamageResult = useMemo(() => {
    if (!attacker.name || !defender.name || !selectedMove) {
      return null;
    }
    return calculateDamageResult(attacker, defender, selectedMove, field);
  }, [attacker, defender, selectedMove, field, calculateDamageResult]);

  return (
    <div className="space-y-6">
      {/* Battle Setup Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Attacker Pokemon */}
        <div className="bg-[hsl(var(--gaming-card))] rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-[hsl(var(--pokemon-fire))] to-orange-500 rounded-lg flex items-center justify-center">
              <Sword className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold">攻撃側ポケモン</h2>
          </div>
          
          <div className="space-y-4">
            <PokemonSelector
              pokemon={attacker}
              onPokemonChange={(name) => switchPokemon('attacker', name)}
              onShinyToggle={(isShiny) => updateAttacker({ isShiny })}
              type="attacker"
            />
            
            {/* Stats Display with EV Input */}
            {attackerStats && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-300">ステータス</span>
                  <span className="text-xs text-gray-400">
                    合計努力値: {getTotalEVs(attacker)}/510
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <EVStatDisplay
                    label="HP"
                    value={attackerStats.hp}
                    evValue={attacker.evs.H}
                    statKey="H"
                    testId="text-attacker-hp"
                    showNatureButtons={false}
                    onEVChange={updateAttackerEV}
                  />
                  <EVStatDisplay
                    label="攻撃"
                    value={attackerStats.attack}
                    evValue={attacker.evs.A}
                    statKey="A"
                    testId="text-attacker-attack"
                    color="text-[hsl(var(--pokemon-fire))]"
                    natureModifier={attacker.natureModifiers?.A || 1.0}
                    onEVChange={updateAttackerEV}
                    onNatureChange={updateAttackerNature}
                  />
                  <EVStatDisplay
                    label="防御"
                    value={attackerStats.defense}
                    evValue={attacker.evs.B}
                    statKey="B"
                    testId="text-attacker-defense"
                    natureModifier={attacker.natureModifiers?.B || 1.0}
                    onEVChange={updateAttackerEV}
                    onNatureChange={updateAttackerNature}
                  />
                  <EVStatDisplay
                    label="特攻"
                    value={attackerStats.specialAttack}
                    evValue={attacker.evs.C}
                    statKey="C"
                    testId="text-attacker-special-attack"
                    natureModifier={attacker.natureModifiers?.C || 1.0}
                    onEVChange={updateAttackerEV}
                    onNatureChange={updateAttackerNature}
                  />
                  <EVStatDisplay
                    label="特防"
                    value={attackerStats.specialDefense}
                    evValue={attacker.evs.D}
                    statKey="D"
                    testId="text-attacker-special-defense"
                    natureModifier={attacker.natureModifiers?.D || 1.0}
                    onEVChange={updateAttackerEV}
                    onNatureChange={updateAttackerNature}
                  />
                  <EVStatDisplay
                    label="素早"
                    value={attackerStats.speed}
                    evValue={attacker.evs.S}
                    statKey="S"
                    testId="text-attacker-speed"
                    natureModifier={attacker.natureModifiers?.S || 1.0}
                    onEVChange={updateAttackerEV}
                    onNatureChange={updateAttackerNature}
                  />
                </div>
              </div>
            )}
            
            {/* Move Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">使用技</label>
              <Popover open={moveOpen} onOpenChange={setMoveOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={moveOpen}
                    className="w-full justify-between bg-[hsl(var(--gaming-panel))] border-gray-600 text-white hover:bg-[hsl(var(--gaming-panel))] focus:border-[hsl(var(--pokemon-electric))]"
                    data-testid="button-select-move"
                  >
                    {selectedMove || "技を選択..."}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0 bg-white border-gray-300" align="start">
                  <Command className="bg-white" shouldFilter={false}>
                    <CommandInput 
                      placeholder="技名を入力..." 
                      className="text-gray-900 placeholder-gray-500"
                      value={moveSearchValue}
                      onValueChange={setMoveSearchValue}
                      data-testid="input-move-search"
                    />
                    <CommandEmpty className="text-gray-600 p-2">該当する技が見つかりません。</CommandEmpty>
                    <CommandGroup className="max-h-64 overflow-y-auto">
                      {filteredMoves.map((move) => (
                        <CommandItem
                          key={move}
                          value={move}
                          onSelect={(currentValue) => {
                            setSelectedMove(currentValue);
                            setMoveOpen(false);
                            setMoveSearchValue('');
                          }}
                          className="cursor-pointer text-gray-900 hover:bg-gray-100"
                          data-testid={`option-move-${move}`}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedMove === move ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {move}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            
            {/* Move Details */}
            {moveData && (
              <div className="bg-[hsl(var(--gaming-panel))] rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium" data-testid="text-move-name">{selectedMove}</span>
                  <span className="px-2 py-1 bg-gray-600 text-white text-xs rounded-full" data-testid="text-move-type">
                    {moveData.type}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>威力: <span className="text-white font-medium" data-testid="text-move-power">{moveData.power || '—'}</span></span>
                  <span>分類: <span className="text-white font-medium" data-testid="text-move-category">{moveData.class}</span></span>
                </div>
                {moveData.desc_ja && (
                  <div className="mt-2 text-sm text-gray-300">
                    {moveData.desc_ja}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Defender Pokemon */}
        <div className="bg-[hsl(var(--gaming-card))] rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-[hsl(var(--pokemon-water))] to-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold">防御側ポケモン</h2>
          </div>
          
          <div className="space-y-4">
            <PokemonSelector
              pokemon={defender}
              onPokemonChange={(name) => switchPokemon('defender', name)}
              onShinyToggle={(isShiny) => updateDefender({ isShiny })}
              type="defender"
            />
            
            {/* Stats Display with EV Input */}
            {defenderStats && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-300">ステータス</span>
                  <span className="text-xs text-gray-400">
                    合計努力値: {getTotalEVs(defender)}/510
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <EVStatDisplay
                    label="HP"
                    value={defenderStats.hp}
                    evValue={defender.evs.H}
                    statKey="H"
                    testId="text-defender-hp"
                    color="text-green-400"
                    showNatureButtons={false}
                    onEVChange={updateDefenderEV}
                  />
                  <EVStatDisplay
                    label="攻撃"
                    value={defenderStats.attack}
                    evValue={defender.evs.A}
                    statKey="A"
                    testId="text-defender-attack"
                    natureModifier={defender.natureModifiers?.A || 1.0}
                    onEVChange={updateDefenderEV}
                    onNatureChange={updateDefenderNature}
                  />
                  <EVStatDisplay
                    label="防御"
                    value={defenderStats.defense}
                    evValue={defender.evs.B}
                    statKey="B"
                    testId="text-defender-defense"
                    color="text-[hsl(var(--pokemon-water))]"
                    natureModifier={defender.natureModifiers?.B || 1.0}
                    onEVChange={updateDefenderEV}
                    onNatureChange={updateDefenderNature}
                  />
                  <EVStatDisplay
                    label="特攻"
                    value={defenderStats.specialAttack}
                    evValue={defender.evs.C}
                    statKey="C"
                    testId="text-defender-special-attack"
                    natureModifier={defender.natureModifiers?.C || 1.0}
                    onEVChange={updateDefenderEV}
                    onNatureChange={updateDefenderNature}
                  />
                  <EVStatDisplay
                    label="特防"
                    value={defenderStats.specialDefense}
                    evValue={defender.evs.D}
                    statKey="D"
                    testId="text-defender-special-defense"
                    color="text-[hsl(var(--pokemon-water))]"
                    natureModifier={defender.natureModifiers?.D || 1.0}
                    onEVChange={updateDefenderEV}
                    onNatureChange={updateDefenderNature}
                  />
                  <EVStatDisplay
                    label="素早"
                    value={defenderStats.speed}
                    evValue={defender.evs.S}
                    statKey="S"
                    testId="text-defender-speed"
                    natureModifier={defender.natureModifiers?.S || 1.0}
                    onEVChange={updateDefenderEV}
                    onNatureChange={updateDefenderNature}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Damage Calculation Results */}
      <div className="bg-[hsl(var(--gaming-card))] rounded-xl p-6 border border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-[hsl(var(--pokemon-electric))] to-yellow-400 rounded-lg flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold">ダメージ計算結果</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Damage Result */}
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-[hsl(var(--gaming-panel))] to-gray-800 rounded-lg p-6 text-center">
              <div className="text-sm text-gray-400 mb-2">与えるダメージ</div>
              {realtimeDamageResult && defenderStats ? (
                <>
                  <div className="text-3xl font-bold text-[hsl(var(--pokemon-electric))] mb-1" data-testid="text-damage-result">
                    {realtimeDamageResult.minDamage} - {realtimeDamageResult.maxDamage}
                  </div>
                  <div className="text-lg font-bold text-white mb-1">
                    {realtimeDamageResult.percentage}% - {realtimeDamageResult.maxPercentage}%
                  </div>
                  <div className="text-sm text-gray-400">
                    平均ダメージ: {Math.floor((realtimeDamageResult.minDamage + realtimeDamageResult.maxDamage) / 2)}
                  </div>
                </>
              ) : (
                <div className="text-2xl text-gray-500">
                  ポケモンと技を選択してください
                </div>
              )}
            </div>
            
            {/* Type Effectiveness */}
            <div className="bg-[hsl(var(--gaming-panel))] rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium">タイプ相性</span>
                <span className="text-lg font-bold text-white" data-testid="text-type-effectiveness">
                  {realtimeDamageResult?.effectiveness || 1}x
                </span>
              </div>
              <div className="text-sm text-gray-400" data-testid="text-effectiveness-message">
                {realtimeDamageResult ? getEffectivenessText(realtimeDamageResult.effectiveness) : "ポケモンと技を選択してください"}
              </div>
            </div>
          </div>
          
          {/* Battle Log */}
          <div className="space-y-4">
            <div className="bg-[hsl(var(--gaming-panel))] rounded-lg p-4">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                バトルログ
              </h3>
              <div className="space-y-2 text-sm max-h-32 overflow-y-auto">
                {realtimeDamageResult ? (
                  <>
                    <div className="text-gray-300">{attacker.name}の {selectedMove}！</div>
                    <div className="text-[hsl(var(--pokemon-fire))]">
                      {defender.name}に {realtimeDamageResult.damage} ダメージ！
                    </div>
                    <div className="text-gray-400">{getEffectivenessText(realtimeDamageResult.effectiveness)}</div>
                    {defenderStats && Math.round((realtimeDamageResult.damage / defenderStats.hp) * 100) >= 100 && (
                      <div className="text-red-400 font-bold">一撃で倒せます！</div>
                    )}
                  </>
                ) : (
                  <div className="text-gray-400">ポケモンと技を選択してください</div>
                )}
              </div>
            </div>
            
            {/* Share to Chat */}
            {damageResult && onShareResult && (
              <Button
                onClick={handleShareResult}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 transition-all flex items-center justify-center gap-2"
                data-testid="button-share-result"
              >
                <Send className="w-5 h-5" />
                チャットに共有
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
