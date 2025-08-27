"use client";

import type { TeamInGame, Game } from "@/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlayerStatsRow } from "./player-stats-row";

// Se actualiza la interfaz de props para recibir también el objeto `game`.
interface TeamPanelProps {
  team: TeamInGame;
  game: Game;
}

export function TeamPanel({ team, game }: TeamPanelProps) {
  return (
    <Card className="bg-card/80 border-primary/20">
      <CardHeader>
        <CardTitle>{team.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {team.players.map((gamePlayer) => (
          <PlayerStatsRow
            key={gamePlayer.player.id}
            player={gamePlayer}
            // Se pasa el objeto `game` al componente hijo.
            game={game}
          />
        ))}
      </CardContent>
    </Card>
  );
}
