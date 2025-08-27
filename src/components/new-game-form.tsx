"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createGame } from "@/lib/actions/game";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { TeamWithPlayers } from '@/types';
import type { Player } from "@prisma/client";

interface NewGameFormProps {
  teams: TeamWithPlayers[];
  basePath?: '/game' | '/partidos';
}

export function NewGameForm({ teams, basePath = '/game' }: NewGameFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [teamAId, setTeamAId] = useState<string | undefined>();
  const [teamBId, setTeamBId] = useState<string | undefined>();

  const getInitials = (name: string) => {
    if (!name || typeof name !== 'string') return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const selectedTeamA = teamAId ? teams.find(t => t.id === teamAId) : null;
  const selectedTeamB = teamBId ? teams.find(t => t.id === teamBId) : null;

  const handleCreateGame = async () => {
    if (!teamAId || !teamBId) return;

    startTransition(async () => {
        const newGameId = await createGame(teamAId, teamBId);
        if (newGameId) {
            router.push(`${basePath}/${newGameId}`);
        } else {
            // TODO: Handle error, maybe show a toast
            console.error("Failed to create game");
        }
    });
  };

  const availableTeamsForB = teamAId ? teams.filter(t => t.id !== teamAId) : teams;
  const availableTeamsForA = teamBId ? teams.filter(t => t.id !== teamBId) : teams;
  
  const playersA = selectedTeamA ? selectedTeamA.players : [];
  const playersB = selectedTeamB ? selectedTeamB.players : [];

  const isFormValid = teamAId && teamBId && teamAId !== teamBId;

  const PlayerList = ({ players }: { players: Player[] }) => (
    <div>
      <h4 className="font-semibold mb-2 text-foreground">Plantilla:</h4>
      <ul className="space-y-2">
        {players.map(p => {
          const displayName = p.name;
          const imageUrl = p.imageUrl || null;

          return (
            <li key={p.id} className="flex items-center gap-2 text-sm text-muted-foreground">
              <Avatar className="h-6 w-6 text-xs">
                {imageUrl && <AvatarImage src={imageUrl} alt={displayName} />}
                <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
              </Avatar>
              <span>#{p.jerseyNumber} - {displayName}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <Card className="w-full max-w-4xl bg-card border-border">
      <CardHeader>
        <CardTitle className="text-3xl text-foreground">Configurar Nuevo Partido</CardTitle>
        <CardDescription className="text-muted-foreground">
          Selecciona los dos equipos que se enfrentarán.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Team A Selection */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold text-foreground">Equipo Local (A)</Label>
            <Select onValueChange={setTeamAId} value={teamAId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el primer equipo" />
              </SelectTrigger>
              <SelectContent>
                {availableTeamsForA.map(team => (
                  <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedTeamA && <PlayerList players={playersA} />}
          </div>

          {/* Team B Selection */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold text-foreground">Equipo Visitante (B)</Label>
            <Select onValueChange={setTeamBId} value={teamBId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el segundo equipo" />
              </SelectTrigger>
              <SelectContent>
                {availableTeamsForB.map(team => (
                  <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
             {selectedTeamB && <PlayerList players={playersB} />}
          </div>
        </div>

        <Button
          onClick={handleCreateGame}
          size="lg"
          className="w-full"
          disabled={!isFormValid || isPending}
        >
          {isPending ? 'Creando Partido...' : 'Iniciar Partido'}
        </Button>
      </CardContent>
    </Card>
  );
}
