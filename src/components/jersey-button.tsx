'use client';

import type { PlayerInGame } from '@/types';
import { cn } from '@/lib/utils';

interface JerseyButtonProps {
  playerInGame: PlayerInGame;
  onClick: (player: PlayerInGame) => void;
  isSelected: boolean;
  isDisabled: boolean;
}

export function JerseyButton({ playerInGame, onClick, isSelected, isDisabled }: JerseyButtonProps) {
  const player = playerInGame.player;
  
  return (
    <button
      onClick={() => onClick(playerInGame)}
      disabled={isDisabled}
      className={cn(
        'relative aspect-[4/5] w-24 font-bold text-4xl transition-all duration-200 ease-in-out transform focus:outline-none focus:ring-4 focus:ring-primary/50 group',
        'flex items-center justify-center',
        isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
      )}
      aria-pressed={isSelected}
    >
       {isSelected && (
         <div className="absolute inset-0 rounded-2xl bg-primary/50 blur-xl"></div>
      )}
      <svg
        className="absolute w-full h-full drop-shadow-lg"
        viewBox="0 0 90 100"
        preserveAspectRatio="xMidYMid meet"
      >
        <path
          d="M15 10 C 15 0, 25 0, 25 10 L 35 25 L 5 30 V 95 H 85 V 30 L 55 25 L 65 10 C 65 0, 75 0, 75 10"
          className={cn(
            'transition-colors stroke-border stroke-[4px]',
            isSelected
              ? 'fill-primary'
              : 'fill-secondary group-hover:fill-secondary/80'
          )}
        />
      </svg>
      <span
        className={cn(
          'relative z-10 transition-colors',
          isSelected
            ? 'text-primary-foreground drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]'
            : 'text-secondary-foreground group-hover:text-foreground'
        )}
      >
        {player.number}
      </span>
    </button>
  );
}
