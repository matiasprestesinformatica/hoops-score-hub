'use client';

import { useMemo } from "react";
import type { Game } from "@/types";
import { calculateScore } from "@/lib/utils";
import { useGameStore } from "@/store/use-game-store";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getInitials } from "@/lib/utils";
import { Card } from "./ui/card";

interface LiveScoreboardProps {
    game: Game;
}

export function LiveScoreboard({ game: initialGame }: LiveScoreboardProps) {
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

  return (
    <Card className="bg-card/80 border-primary/20 w-full max-w-lg">
        <div className="p-4 flex items-center justify-between">
            {/* Team A */}
            <div className="flex items-center gap-4 w-1/3">
                <Avatar className="h-12 w-12 border-2 border-border">
                    <AvatarImage src={game.teamA.logoUrl ?? undefined} alt={game.teamA.name} />
                    <AvatarFallback>{getInitials(game.teamA.name)}</AvatarFallback>
                </Avatar>
                <div className="font-semibold text-lg truncate">{game.teamA.name}</div>
            </div>
            
            {/* Scores & Period */}
            <div className="flex items-center gap-4 text-center">
                <div className="text-5xl font-bold text-primary w-20">{teamAScore}</div>
                <div className="flex flex-col">
                    <div className="text-xs font-semibold text-muted-foreground">PERÍODO</div>
                    <div className="text-2xl font-bold">{game.currentPeriod}</div>
                </div>
                <div className="text-5xl font-bold text-foreground w-20">{teamBScore}</div>
            </div>

             {/* Team B */}
             <div className="flex items-center justify-end gap-4 w-1/3">
                <div className="font-semibold text-lg truncate text-right">{game.teamB.name}</div>
                <Avatar className="h-12 w-12 border-2 border-border">
                    <AvatarImage src={game.teamB.logoUrl ?? undefined} alt={game.teamB.name} />
                    <AvatarFallback>{getInitials(game.teamB.name)}</AvatarFallback>
                </Avatar>
            </div>
        </div>
    </Card>
  );
}
