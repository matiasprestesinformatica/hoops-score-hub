"use client";

import { useMemo } from "react";
import type { Game } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { calculateScore } from "@/lib/utils";

interface ScoreboardProps {
  game: Game | null;
}

export function Scoreboard({ game }: ScoreboardProps) {
  const teamAScore = useMemo(() => {
    if (!game) return 0;
    return calculateScore(game.teamA.players);
  }, [game]);

  const teamBScore = useMemo(() => {
    if (!game) return 0;
    return calculateScore(game.teamB.players);
  }, [game]);

  if (!game) {
    return (
        <Card className="p-4 w-full bg-card/80">
            <div className="flex justify-around items-center">
                <Skeleton className="h-12 w-1/4" />
                <div className="flex flex-col items-center gap-2">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-8 w-20" />
                </div>
                <Skeleton className="h-12 w-1/4" />
            </div>
        </Card>
    );
  }
  
  const statusText: Record<Game['status'], string> = {
    Programado: 'Programado',
    EN_VIVO: 'En Vivo',
    FINALIZADO: 'Finalizado',
  };

  return (
    <Card className="p-4 w-full shadow-lg bg-card/80 border-primary/20">
      <div className="flex justify-around items-center text-center">
        {/* Team A */}
        <div className="w-1/3">
          <h2 className="text-xl md:text-2xl font-semibold truncate">{game.teamA.name}</h2>
          <p className="text-4xl md:text-5xl font-bold text-primary">{teamAScore}</p>
        </div>

        {/* Game Info */}
        <div className="w-1/3 flex flex-col items-center gap-2">
          <h3 className="text-lg md:text-xl font-medium">Periodo {game.currentPeriod}</h3>
          <Badge variant={game.status === 'EN_VIVO' ? 'destructive' : 'secondary'}>
            {statusText[game.status]}
          </Badge>
        </div>

        {/* Team B */}
        <div className="w-1/3">
          <h2 className="text-xl md:text-2xl font-semibold truncate">{game.teamB.name}</h2>
          <p className="text-4xl md:text-5xl font-bold">{teamBScore}</p>
        </div>
      </div>
    </Card>
  );
}
