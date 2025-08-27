"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Game } from "@/types";
import { deleteGame } from "@/lib/actions/game";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Trash2 } from "lucide-react";
import { FormattedDate } from "../formatted-date";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getInitials } from "@/lib/utils";

interface GameCardProps {
  game: Game;
  teamAScore: number;
  teamBScore: number;
  basePath?: '/game' | '/partidos';
}

export function GameCard({ game, teamAScore, teamBScore, basePath = '/game' }: GameCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleContinue = () => {
    router.push(`${basePath}/${game.id}`);
  };
  
  const handleContinueMobile = () => {
    router.push(`/game/${game.id}/mobile`);
  };

  const handleViewStats = () => {
    router.push(`/stats/${game.id}`);
  };

  const handleDelete = () => {
    startTransition(() => {
        deleteGame(game.id);
    });
  }

  const statusText: Record<Game['status'], string> = {
    Programado: 'Programado',
    EN_VIVO: 'En Vivo',
    FINALIZADO: 'Finalizado',
  };

  return (
    <Card className="w-full max-w-2xl bg-black/30 backdrop-blur-lg border border-white/20 text-gray-200 transition-all duration-300 ease-in-out hover:border-white/40 hover:bg-black/50">
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="space-y-1.5">
          <CardTitle className="text-2xl text-gray-100">{game.teamA.name} vs {game.teamB.name}</CardTitle>
          <CardDescription className="text-gray-400">
            Creado el: <FormattedDate dateString={game.createdAt} />
          </CardDescription>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="icon">
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Eliminar Partido</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. Esto eliminará permanentemente este partido y todos sus datos asociados.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} disabled={isPending}>
                {isPending ? "Eliminando..." : "Confirmar"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
      <CardContent className="flex items-center justify-around">
        <div className="flex flex-col items-center gap-2 text-center">
            <Avatar>
                <AvatarImage src={game.teamA.logoUrl ?? undefined} alt={game.teamA.name} />
                <AvatarFallback>{getInitials(game.teamA.name)}</AvatarFallback>
            </Avatar>
            <p className="text-gray-400">{game.teamA.name}</p>
            <p className="text-5xl font-bold text-primary">{teamAScore}</p>
        </div>
         <Badge variant={game.status === 'EN_VIVO' ? 'destructive' : 'secondary'}>
            {statusText[game.status]}
          </Badge>
         <div className="flex flex-col items-center gap-2 text-center">
            <Avatar>
                <AvatarImage src={game.teamB.logoUrl ?? undefined} alt={game.teamB.name} />
                <AvatarFallback>{getInitials(game.teamB.name)}</AvatarFallback>
            </Avatar>
            <p className="text-gray-400">{game.teamB.name}</p>
            <p className="text-5xl font-bold text-gray-100">{teamBScore}</p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-end gap-2">
        <Button onClick={handleViewStats} variant="outline" disabled={game.status !== 'FINALIZADO'} className="w-full sm:w-auto bg-white/10 hover:bg-white/20 border-white/30 text-white">Ver Estadísticas</Button>
        <Button onClick={handleContinueMobile} variant="secondary" disabled={game.status === 'FINALIZADO'} className="w-full sm:w-auto">
          <Smartphone className="mr-2 h-4 w-4" />
          Abrir en Móvil
        </Button>
        <Button onClick={handleContinue} disabled={game.status === 'FINALIZADO'} className="w-full sm:w-auto">
          {game.status === 'Programado' ? 'Empezar Partido' : 'Continuar Partido'}
        </Button>
      </CardFooter>
    </Card>
  );
}
