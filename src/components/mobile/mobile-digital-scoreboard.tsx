"use client";

import { useMemo } from "react";
import type { Game } from "@/types";
import { calculateScore } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getInitials } from "@/lib/utils";
import { useGameStore } from "@/store/use-game-store";

const SevenSegmentDisplay = ({ value }: { value: string }) => {
    return (
        <div className="font-mono text-5xl text-amber-400 relative bg-black p-1 rounded-md shadow-inner shadow-black/50">
            <span className="opacity-20">88</span>
            <span className="absolute inset-0 flex items-center justify-center tracking-normal">{value}</span>
        </div>
    );
};

const PeriodDisplay = ({ value }: { value: number }) => {
    return (
        <div className="font-mono text-3xl text-amber-400 relative bg-black p-1 rounded-md shadow-inner shadow-black/50 w-10 text-center">
             <span className="opacity-20">8</span>
            <span className="absolute inset-0 flex items-center justify-center">{value}</span>
        </div>
    );
};

interface MobileDigitalScoreboardProps {
    game: Game;
}

export function MobileDigitalScoreboard({ game: initialGame }: MobileDigitalScoreboardProps) {
  const game = useGameStore((state) => state.game) || initialGame;
  
  const teamAScore = useMemo(() => calculateScore(game.teamA.players), [game.teamA.players]);
  const teamBScore = useMemo(() => calculateScore(game.teamB.players), [game.teamB.players]);
  
  const formatScore = (score: number) => score.toString().padStart(2, '0');

  return (
    <div className="bg-neutral-800/60 backdrop-blur-md border border-neutral-700/50 rounded-lg p-2 shadow-lg flex items-center justify-around gap-2 w-full">
      <Avatar className="h-10 w-10 border border-amber-600/50">
        <AvatarImage src={game.teamA.logoUrl ?? undefined} alt={game.teamA.name} />
        <AvatarFallback>{getInitials(game.teamA.name)}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col items-center flex-1">
        <span className="text-sm font-semibold text-amber-200 mb-1 uppercase truncate w-full text-center" title={game.teamA.name}>
          {game.teamA.name}
        </span>
        <SevenSegmentDisplay value={formatScore(teamAScore)} />
      </div>
       <div className="flex flex-col items-center gap-1">
        <span className="text-xs font-semibold text-amber-200 uppercase">Período</span>
        <PeriodDisplay value={game.currentPeriod} />
      </div>
      <div className="flex flex-col items-center flex-1">
        <span className="text-sm font-semibold text-amber-200 mb-1 uppercase truncate w-full text-center" title={game.teamB.name}>
          {game.teamB.name}
        </span>
        <SevenSegmentDisplay value={formatScore(teamBScore)} />
      </div>
      <Avatar className="h-10 w-10 border border-amber-600/50">
        <AvatarImage src={game.teamB.logoUrl ?? undefined} alt={game.teamB.name} />
        <AvatarFallback>{getInitials(game.teamB.name)}</AvatarFallback>
      </Avatar>
    </div>
  );
}
