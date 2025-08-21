import { useState } from 'react';
import { Smartphone, Download, Sparkles, ExternalLink } from 'lucide-react';
import { Team } from '@shared/schema';
import { POKEMON_DATA } from '@/lib/pokemon-data';
import { openYakkunLink } from '@/lib/yakkun-links';
import { Button } from '@/components/ui/button';

interface TeamPreviewProps {
  team: Team;
}

export const TeamPreview: React.FC<TeamPreviewProps> = ({ team }) => {
  const [isGeneratingScreenshot, setIsGeneratingScreenshot] = useState(false);

  const handleScreenshot = async () => {
    setIsGeneratingScreenshot(true);
    try {
      // Import html2canvas dynamically
      const html2canvas = (await import('html2canvas')).default;
      
      const element = document.getElementById('team-preview-container');
      if (element) {
        const canvas = await html2canvas(element, {
          backgroundColor: '#0f0f0f',
          scale: 2
        });
        
        // Create download link
        const link = document.createElement('a');
        link.download = `${team.name}_team.png`;
        link.href = canvas.toDataURL();
        link.click();
      }
    } catch (error) {
      console.error('Screenshot generation failed:', error);
    } finally {
      setIsGeneratingScreenshot(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Mobile Preview */}
      <div className="bg-[hsl(var(--gaming-card))] rounded-xl p-6 border border-gray-700">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Smartphone className="w-5 h-5" />
          スマホプレビュー
        </h3>
        
        <div id="team-preview-container" className="bg-black rounded-lg p-3 max-w-sm mx-auto">
          <div className="bg-[hsl(var(--gaming-panel))] rounded-lg p-3">
            <div className="text-center text-sm font-bold mb-2" data-testid="text-team-name">
              {team.name}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 6 }, (_, index) => {
                const pokemon = team.pokemons[index];
                const pokemonData = pokemon ? POKEMON_DATA[pokemon.name] : null;
                
                return (
                  <div
                    key={index}
                    className="aspect-square bg-[hsl(var(--gaming-dark))] rounded flex items-center justify-center"
                    data-testid={`slot-pokemon-${index}`}
                  >
                    {pokemon && pokemonData ? (
                      <div className="relative">
                        <img
                          src={pokemon.isShiny && pokemonData.shinySprite 
                            ? pokemonData.shinySprite 
                            : pokemonData.sprite}
                          alt={pokemon.name}
                          className="w-8 h-8 pixelated cursor-pointer hover:scale-110 transition-transform"
                          onClick={() => openYakkunLink(pokemon.name)}
                        />
                        {pokemon.isShiny && (
                          <div className="absolute -top-1 -left-1">
                            <Sparkles className="w-2 h-2 text-yellow-400" />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-4 h-4 text-gray-600">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                        </svg>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        <Button
          onClick={handleScreenshot}
          disabled={isGeneratingScreenshot}
          className="w-full mt-3 bg-[hsl(var(--gaming-accent))] hover:bg-blue-600 text-white font-medium py-2 transition-all"
          data-testid="button-screenshot"
        >
          {isGeneratingScreenshot ? (
            '生成中...'
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              スクリーンショット
            </>
          )}
        </Button>
      </div>
      
      {/* Type Coverage Chart */}
      <div className="bg-[hsl(var(--gaming-card))] rounded-xl p-6 border border-gray-700">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <div className="w-5 h-5 bg-gradient-to-r from-[hsl(var(--pokemon-electric))] to-yellow-400 rounded"></div>
          タイプ相性
        </h3>
        
        <div className="grid grid-cols-3 gap-2 text-xs">
          {[
            { name: 'ノーマル', color: 'bg-gray-500', symbol: 'N' },
            { name: 'ほのお', color: 'bg-red-500', symbol: 'F' },
            { name: 'みず', color: 'bg-blue-500', symbol: 'W' },
            { name: 'でんき', color: 'bg-yellow-500', symbol: 'E' },
            { name: 'くさ', color: 'bg-green-500', symbol: 'G' },
            { name: 'こおり', color: 'bg-cyan-500', symbol: 'I' }
          ].map((type) => (
            <div key={type.name} className="text-center">
              <div className={`w-8 h-8 ${type.color} rounded-full mx-auto mb-1 flex items-center justify-center text-white font-bold text-xs`}>
                {type.symbol}
              </div>
              <div className="text-gray-400">{type.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
