"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createAndSimulateGame } from "@/lib/actions/game";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import type { TeamWithPlayers } from '@/types';
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Sparkles } from "lucide-react";

interface SimulateGameFormProps {
  teams: TeamWithPlayers[];
}

const gameContextOptions = [
    { value: "Partido igualado", label: "Partido Igualado" },
    { value: "Un equipo domina al otro", label: "Un Equipo Domina" },
    { value: "Actuación estelar de un jugador", label: "Actuación Estelar Individual" },
]

export function SimulateGameForm({ teams }: SimulateGameFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [teamAId, setTeamAId] = useState<string | undefined>();
  const [teamBId, setTeamBId] = useState<string | undefined>();
  const [gameContext, setGameContext] = useState(gameContextOptions[0].value);

  const handleSimulateGame = () => {
    if (!teamAId || !teamBId || !gameContext) return;

    startTransition(async () => {
        const newGameId = await createAndSimulateGame(teamAId, teamBId, gameContext);
        if (newGameId) {
            router.push(`/stats/${newGameId}`);
        } else {
            console.error("Failed to create and simulate game");
        }
    });
  };

  const availableTeamsForB = teamAId ? teams.filter(t => t.id !== teamAId) : teams;
  const availableTeamsForA = teamBId ? teams.filter(t => t.id !== teamBId) : teams;

  const isFormValid = teamAId && teamBId && teamAId !== teamBId && gameContext;

  return (
    <Card className="w-full max-w-2xl bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Configurar Simulación</CardTitle>
        <CardDescription className="text-muted-foreground">
          Selecciona los equipos y el escenario del partido para que la IA genere las estadísticas.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="font-semibold text-foreground">Equipo Local</Label>
            <Select onValueChange={setTeamAId} value={teamAId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un equipo" />
              </SelectTrigger>
              <SelectContent>
                {availableTeamsForA.map(team => (
                  <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="font-semibold text-foreground">Equipo Visitante</Label>
            <Select onValueChange={setTeamBId} value={teamBId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un equipo" />
              </SelectTrigger>
              <SelectContent>
                {availableTeamsForB.map(team => (
                  <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-3">
            <Label className="font-semibold text-foreground">Escenario del Partido</Label>
            <RadioGroup value={gameContext} onValueChange={setGameContext}>
                {gameContextOptions.map(opt => (
                     <div key={opt.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={opt.value} id={opt.value} />
                        <Label htmlFor={opt.value} className="font-normal text-muted-foreground">{opt.label}</Label>
                    </div>
                ))}
            </RadioGroup>
        </div>

      </CardContent>
      <CardFooter>
         <Button
          onClick={handleSimulateGame}
          size="lg"
          className="w-full"
          disabled={!isFormValid || isPending}
        >
          {isPending ? 'Simulando partido... por favor, espera.' : 'Crear y Simular Partido'}
          {!isPending && <Sparkles className="ml-2 h-5 w-5" />}
        </Button>
      </CardFooter>
    </Card>
  );
}
