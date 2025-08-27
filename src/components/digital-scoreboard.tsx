"use client";

import { useMemo } from "react";
import type { Game } from "@/types";
import { calculateScore } from "@/lib/utils";
import { useGameStore } from "@/store/use-game-store";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getInitials } from "@/lib/utils";

const SevenSegmentDisplay = ({ value }: { value: string }) => {
    return (
        <div className="font-mono text-7xl md:text-9xl text-primary-foreground relative bg-foreground p-2 rounded-md shadow-inner shadow-black/50">
            <span className="opacity-20">888</span>
            <span className="absolute inset-0 flex items-center justify-center tracking-widest">{value}</span>
        </div>
    );
};

const PeriodDisplay = ({ value }: { value: number }) => {
    return (
        <div className="font-mono text-7xl md:text-9xl text-primary-foreground relative bg-foreground p-2 rounded-md shadow-inner shadow-black/50 w-28 text-center">
             <span className="opacity-20">8</span>
            <span className="absolute inset-0 flex items-center justify-center">{value}</span>
        </div>
    );
};

interface DigitalScoreboardProps {
    game: Game;
}

export function DigitalScoreboard({ game: initialGame }: DigitalScoreboardProps) {
  const game = useGameStore((state) => state.game) || initialGame;

  const teamAScore = useMemo(() => {
    if (!game) return 0;
    return calculateScore(game.teamA.players);
  }, [game]);

  const teamBScore = useMemo(() => {
    if (!game) return 0;
    return calculateScore(game.teamB.players);
  }, [game]);
  
  if (!game) {
    return null;
  }

  const formatScore = (score: number) => score.toString().padStart(3, '0');

  return (
    <div className="bg-card/80 border border-border rounded-lg p-4 md:p-6 shadow-2xl flex items-center justify-around gap-4 md:gap-8 w-full max-w-4xl">
       <Avatar className="h-14 w-14 md:h-20 md:w-20 border-2 border-primary/50">
        <AvatarImage src={game.teamA.logoUrl ?? undefined} alt={game.teamA.name} />
        <AvatarFallback>{getInitials(game.teamA.name)}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col items-center w-1/3">
        <span className="text-lg md:text-2xl font-semibold text-muted-foreground mb-2 uppercase truncate" title={game.teamA.name}>
          {game.teamA.name}
        </span>
        <SevenSegmentDisplay value={formatScore(teamAScore)} />
      </div>
       <div className="flex flex-col items-center">
        <span className="text-lg md:text-2xl font-semibold text-muted-foreground mb-2 uppercase">PERÍODO</span>
        <PeriodDisplay value={game.currentPeriod} />
      </div>
      <div className="flex flex-col items-center w-1/3">
        <span className="text-lg md:text-2xl font-semibold text-muted-foreground mb-2 uppercase truncate" title={game.teamB.name}>
          {game.teamB.name}
        </span>
        <SevenSegmentDisplay value={formatScore(teamBScore)} />
      </div>
       <Avatar className="h-14 w-14 md:h-20 md:w-20 border-2 border-primary/50">
        <AvatarImage src={game.teamB.logoUrl ?? undefined} alt={game.teamB.name} />
        <AvatarFallback>{getInitials(game.teamB.name)}</AvatarFallback>
      </Avatar>
    </div>
  );
}
