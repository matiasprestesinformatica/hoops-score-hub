'use client';

import type { PlayerInGame } from '@/types';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface MobileJerseyButtonProps {
  playerInGame: PlayerInGame;
  teamLogoUrl: string | null;
  onClick: (player: PlayerInGame) => void;
  isSelected: boolean;
  isDisabled: boolean;
}

export function MobileJerseyButton({ playerInGame, teamLogoUrl, onClick, isSelected, isDisabled }: MobileJerseyButtonProps) {
  const player = playerInGame.player;
  
  return (
    <button
      onClick={() => onClick(playerInGame)}
      disabled={isDisabled}
      className={cn(
        'relative aspect-[4/5] w-full font-bold text-3xl transition-all duration-200 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 group',
        'flex flex-col items-center justify-center pt-2',
        isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
      )}
      aria-pressed={isSelected}
    >
       {isSelected && (
         <div className="absolute inset-0 rounded-lg bg-primary/50 blur-lg"></div>
      )}
      <svg
        className="absolute w-full h-full drop-shadow-md"
        viewBox="0 0 90 100"
        preserveAspectRatio="xMidYMid meet"
      >
        <path
          d="M15 10 C 15 0, 25 0, 25 10 L 35 25 L 5 30 V 95 H 85 V 30 L 55 25 L 65 10 C 65 0, 75 0, 75 10"
          className={cn(
            'transition-colors stroke-border stroke-[5px]',
            isSelected
              ? 'fill-primary'
              : 'fill-secondary group-hover:fill-secondary/80'
          )}
        />
      </svg>
      {teamLogoUrl && (
          <div className="relative z-10 h-1/3 w-1/3 mb-1">
              <Image 
                src={teamLogoUrl} 
                alt="Team Logo" 
                fill
                style={{ objectFit: "contain" }}
              />
          </div>
      )}
      <span
        className={cn(
          'relative z-10 transition-colors',
          isSelected
            ? 'text-primary-foreground drop-shadow-[0_0_5px_rgba(0,0,0,0.7)]'
            : 'text-secondary-foreground group-hover:text-foreground'
        )}
      >
        {player.number}
      </span>
    </button>
  );
}
