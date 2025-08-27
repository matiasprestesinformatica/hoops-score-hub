"use client";

import { useState, useMemo } from "react";
import type { Game } from "@/types";
import type { Team } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatsGameCard } from "./stats-game-card";
import { calculateScore } from "@/lib/utils";
import { Label } from "../ui/label";

interface FilteredGameListProps {
  games: Game[];
  teams: Team[];
}

export function FilteredGameList({ games, teams }: FilteredGameListProps) {
  const [selectedTeamId, setSelectedTeamId] = useState<string>("all");

  const filteredGames = useMemo(() => {
    if (selectedTeamId === "all") {
      return games;
    }
    return games.filter(
      (game) =>
        game.teamA.id === selectedTeamId || game.teamB.id === selectedTeamId
    );
  }, [games, selectedTeamId]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold text-center text-gray-200" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}>
          Partidos Finalizados
        </h2>
        <div className="flex items-center gap-2">
            <Label htmlFor="team-filter" className="text-gray-300">Filtrar por equipo:</Label>
            <Select value={selectedTeamId} onValueChange={setSelectedTeamId}>
                <SelectTrigger id="team-filter" className="w-[200px] bg-card border-border">
                    <SelectValue placeholder="Seleccionar equipo" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todos los equipos</SelectItem>
                    {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                        {team.name}
                    </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
      </div>

      {filteredGames.length > 0 ? (
        filteredGames.map((game) => {
          const teamAScore = calculateScore(game.teamA.players);
          const teamBScore = calculateScore(game.teamB.players);
          return (
            <StatsGameCard
              key={game.id}
              game={game}
              teamAScore={teamAScore}
              teamBScore={teamBScore}
            />
          );
        })
      ) : (
        <div className="text-center py-16 border-2 border-dashed border-border rounded-lg bg-black/20 text-gray-400">
          <p>
            No se han encontrado partidos finalizados para el equipo seleccionado.
          </p>
        </div>
      )}
    </div>
  );
}
