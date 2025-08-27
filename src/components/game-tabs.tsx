"use client";

import { useMemo } from "react";
import type { Game } from "@/types";
import { GameCard } from "@/components/game-card";
import { calculateScore } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "./ui/badge";

interface GameTabsProps {
  games: Game[];
}

const GameList = ({ games }: { games: Game[] }) => {
    if (games.length === 0) {
        return (
            <div className="text-center py-16 border-2 border-dashed border-border rounded-lg bg-card/50">
                <p className="text-muted-foreground">
                    No hay partidos en esta categoría.
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {games.map((game) => {
                const teamAScore = calculateScore(game.teamA.players);
                const teamBScore = calculateScore(game.teamB.players);
                return <GameCard key={game.id} game={game} teamAScore={teamAScore} teamBScore={teamBScore} basePath="/game" />
            })}
        </div>
    )
}

export function GameTabs({ games }: GameTabsProps) {

  const liveGames = useMemo(() => games.filter(g => g.status === 'EN_VIVO'), [games]);
  const scheduledGames = useMemo(() => games.filter(g => g.status === 'Programado'), [games]);
  const finishedGames = useMemo(() => games.filter(g => g.status === 'FINALIZADO'), [games]);

  return (
    <Tabs defaultValue="live" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="live">
          En Vivo
          <Badge variant="destructive" className="ml-2">{liveGames.length}</Badge>
        </TabsTrigger>
        <TabsTrigger value="scheduled">
          Programados
          <Badge variant="secondary" className="ml-2">{scheduledGames.length}</Badge>
        </TabsTrigger>
        <TabsTrigger value="finished">
          Finalizados
           <Badge variant="secondary" className="ml-2">{finishedGames.length}</Badge>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="live">
        <GameList games={liveGames} />
      </TabsContent>
      <TabsContent value="scheduled">
        <GameList games={scheduledGames} />
      </TabsContent>
      <TabsContent value="finished">
        <GameList games={finishedGames} />
      </TabsContent>
    </Tabs>
  );
}
