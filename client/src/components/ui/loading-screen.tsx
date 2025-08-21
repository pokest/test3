import { Zap } from 'lucide-react';

export const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-[hsl(var(--gaming-dark))] z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-[hsl(var(--pokemon-electric))] to-[hsl(var(--pokemon-fire))] rounded-full mx-auto mb-4 animate-pulse-glow flex items-center justify-center">
          <Zap className="w-8 h-8 text-white" />
        </div>
        <div className="text-xl font-bold mb-2">PokeCalc</div>
        <div className="text-gray-400">読み込み中...</div>
        <div className="mt-4">
          <div className="w-32 h-2 bg-[hsl(var(--gaming-panel))] rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[hsl(var(--pokemon-electric))] to-[hsl(var(--pokemon-fire))] rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
