import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Pokemon } from '@shared/schema';

interface EVStatDisplayProps {
  label: string;
  value: number;
  evValue: number;
  statKey: keyof Pokemon['evs'];
  testId: string;
  color?: string;
  natureModifier?: number;
  showNatureButtons?: boolean;
  showDragBar?: boolean;
  onEVChange: (stat: keyof Pokemon['evs'], value: number) => void;
  onNatureChange?: (stat: keyof Pokemon['natureModifiers'], modifier: number) => void;
}

export const EVStatDisplay: React.FC<EVStatDisplayProps> = ({
  label,
  value,
  evValue,
  statKey,
  testId,
  color,
  natureModifier = 1.0,
  showNatureButtons = true,
  showDragBar = false,
  onEVChange,
  onNatureChange
}) => {
  const [tempEV, setTempEV] = useState(evValue.toString());
  const [isDragging, setIsDragging] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTempEV(evValue.toString());
  }, [evValue]);

  const handleEVChange = (newValue: string) => {
    setTempEV(newValue);
    
    // Validate and parse the input
    const numValue = parseInt(newValue) || 0;
    const clampedValue = Math.min(Math.max(numValue, 0), 252);
    
    onEVChange(statKey, clampedValue);
  };

  const handleBlur = () => {
    // Ensure the displayed value is correct on blur
    const numValue = parseInt(tempEV) || 0;
    const clampedValue = Math.min(Math.max(numValue, 0), 252);
    setTempEV(clampedValue.toString());
  };

  const handleNatureClick = (modifier: number) => {
    if (!onNatureChange) return;
    onNatureChange(statKey as keyof Pokemon['natureModifiers'], modifier);
  };

  const handleBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!barRef.current) return;
    
    const rect = barRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.min(Math.max(clickX / rect.width, 0), 1);
    const newEV = Math.round(percentage * 252);
    
    onEVChange(statKey, newEV);
    setTempEV(newEV.toString());
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    
    if (!barRef.current) return;
    
    const rect = barRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.min(Math.max(clickX / rect.width, 0), 1);
    const newEV = Math.round(percentage * 252);
    
    onEVChange(statKey, newEV);
    setTempEV(newEV.toString());
    
    const handlePointerMove = (e: PointerEvent) => {
      if (!barRef.current) return;
      
      const rect = barRef.current.getBoundingClientRect();
      const moveX = e.clientX - rect.left;
      const percentage = Math.min(Math.max(moveX / rect.width, 0), 1);
      const newEV = Math.round(percentage * 252);
      
      onEVChange(statKey, newEV);
      setTempEV(newEV.toString());
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
  };

  return (
    <div className="bg-[hsl(var(--gaming-panel))] rounded-lg p-3">
      <div className="text-xs text-gray-400 mb-1">{label}</div>
      <div className={`font-bold text-lg mb-2 ${color || 'text-white'}`} data-testid={testId}>
        {value}
      </div>
      
      {/* Nature modification buttons (only for non-HP stats) */}
      {showNatureButtons && statKey !== 'H' && (
        <div className="flex gap-1 mb-2">
          <Button
            variant={natureModifier === 0.9 ? "default" : "outline"}
            size="sm"
            className={`h-6 px-2 text-xs ${
              natureModifier === 0.9 
                ? 'bg-red-600 hover:bg-red-700 text-white border-red-600' 
                : 'bg-gray-700 hover:bg-gray-600 border-gray-600 text-gray-300'
            }`}
            onClick={() => handleNatureClick(0.9)}
            data-testid={`button-nature-down-${statKey.toLowerCase()}`}
          >
            0.9
          </Button>
          <Button
            variant={natureModifier === 1.0 ? "default" : "outline"}
            size="sm"
            className={`h-6 px-2 text-xs ${
              natureModifier === 1.0 
                ? 'bg-gray-500 hover:bg-gray-600 text-white border-gray-500' 
                : 'bg-gray-700 hover:bg-gray-600 border-gray-600 text-gray-300'
            }`}
            onClick={() => handleNatureClick(1.0)}
            data-testid={`button-nature-neutral-${statKey.toLowerCase()}`}
          >
            1.0
          </Button>
          <Button
            variant={natureModifier === 1.1 ? "default" : "outline"}
            size="sm"
            className={`h-6 px-2 text-xs ${
              natureModifier === 1.1 
                ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600' 
                : 'bg-gray-700 hover:bg-gray-600 border-gray-600 text-gray-300'
            }`}
            onClick={() => handleNatureClick(1.1)}
            data-testid={`button-nature-up-${statKey.toLowerCase()}`}
          >
            1.1
          </Button>
        </div>
      )}
      
      {showDragBar ? (
        <div className="space-y-2">
          {/* EV Bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">努力値:</span>
              <span className="text-xs text-gray-400">{evValue}/252</span>
            </div>
            <div
              ref={barRef}
              className={`relative h-4 bg-gray-700 rounded-full cursor-pointer select-none touch-none ${
                isDragging ? 'ring-2 ring-blue-400' : ''
              }`}
              onClick={handleBarClick}
              onPointerDown={handlePointerDown}
              data-testid={`bar-ev-${statKey.toLowerCase()}`}
            >
              {/* Progress fill */}
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-150"
                style={{ width: `${(evValue / 252) * 100}%` }}
              />
              {/* Drag handle */}
              <div
                className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full border-2 border-blue-500 shadow-lg transition-all duration-150 ${
                  isDragging ? 'scale-110' : 'hover:scale-105'
                }`}
                style={{ left: `${(evValue / 252) * 100}%`, transform: 'translateX(-50%) translateY(-50%)' }}
              />
            </div>
          </div>
          
          {/* Direct input */}
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="0"
              max="252"
              value={tempEV}
              onChange={(e) => handleEVChange(e.target.value)}
              onBlur={handleBlur}
              className="w-16 h-6 text-xs bg-gray-700 border-gray-600 text-white"
              data-testid={`input-ev-${statKey.toLowerCase()}`}
            />
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                className="h-6 px-2 text-xs bg-gray-700 hover:bg-gray-600 border-gray-600"
                onClick={() => {
                  onEVChange(statKey, 0);
                  setTempEV('0');
                }}
                data-testid={`button-ev-min-${statKey.toLowerCase()}`}
              >
                0
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-6 px-2 text-xs bg-gray-700 hover:bg-gray-600 border-gray-600"
                onClick={() => {
                  onEVChange(statKey, 252);
                  setTempEV('252');
                }}
                data-testid={`button-ev-max-${statKey.toLowerCase()}`}
              >
                MAX
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">努力値:</span>
          <Input
            type="number"
            min="0"
            max="252"
            value={tempEV}
            onChange={(e) => handleEVChange(e.target.value)}
            onBlur={handleBlur}
            className="w-16 h-6 text-xs bg-gray-700 border-gray-600 text-white"
            data-testid={`input-ev-${statKey.toLowerCase()}`}
          />
        </div>
      )}
    </div>
  );
};