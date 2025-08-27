"use client"

import type { PlayerInGame, TeamInGame } from "@/types";

interface PlayerSelectionProps {
  team: TeamInGame;
  selectedPlayer: PlayerInGame | null;
  onPlayerSelect: (player: PlayerInGame) => void;
}

export function PlayerSelection({ team, selectedPlayer, onPlayerSelect }: PlayerSelectionProps) {
  
  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3 justify-items-center p-4">
      {[...team.players].sort((a, b) => a.player.number - b.player.number).map((player) => {
        const isSelected = selectedPlayer?.player.id === player.player.id;

        return (
          <button
            key={player.player.id}
            onClick={() => onPlayerSelect(player)}
            className={`
              relative w-16 h-20 sm:w-18 sm:h-22 font-bold text-lg transition-all duration-200 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-white/50
              ${isSelected ? "scale-105" : "hover:scale-105"}
            `}
            aria-pressed={isSelected}
          >
            {isSelected && <div className="absolute inset-0 rounded-xl bg-white/30 blur-sm"></div>}
            <svg
              className="absolute w-full h-full drop-shadow-lg"
              viewBox="0 0 90 100"
              preserveAspectRatio="xMidYMid meet"
            >
              <path
                d="M15 10 C 15 0, 25 0, 25 10 L 35 25 L 5 30 V 95 H 85 V 30 L 55 25 L 65 10 C 65 0, 75 0, 75 10"
                className={`
                  transition-colors stroke-2
                  ${
                    isSelected
                      ? `fill-primary stroke-primary-foreground`
                      : `fill-secondary stroke-border hover:fill-secondary/80`
                  }
                `}
              />
            </svg>
            <span
              className={`
                relative z-10 transition-colors font-bold
                ${isSelected ? "text-primary-foreground" : "text-secondary-foreground"}
                ${isSelected ? "drop-shadow-[0_0_4px_rgba(0,0,0,0.8)]" : ""}
              `}
            >
              {player.player.number}
            </span>
          </button>
        )
      })}
    </div>
  )
}
