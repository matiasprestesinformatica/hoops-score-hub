"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Game } from "@/types";
import { deleteGame, simulateExistingGame } from "@/lib/actions/game";
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
import { Eye, Smartphone, Trash2, Map, Sparkles } from "lucide-react";
import { FormattedDate } from "./formatted-date";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getInitials } from "@/lib/utils";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";

interface GameCardProps {
  game: Game;
  teamAScore: number;
  teamBScore: number;
  basePath?: '/game' | '/partidos';
}

export function GameCard({ game, teamAScore, teamBScore, basePath = '/game' }: GameCardProps) {
  const router = useRouter();
  const [isDeleting, startDeleteTransition] = useTransition();
  const [isSimulating, startSimulateTransition] = useTransition();

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
    startDeleteTransition(() => {
        deleteGame(game.id);
    });
  }

  const handleSimulate = () => {
    startSimulateTransition(async () => {
      const result = await simulateExistingGame(game.id);
      if (result?.success) {
        toast({
          title: "¡Partido Simulado!",
          description: "Las estadísticas han sido generadas y el partido ha finalizado.",
        });
      } else {
        toast({
          title: "Error de Simulación",
          description: result?.error || "No se pudo simular el partido.",
          variant: "destructive",
        });
      }
    });
  };

  const statusText: Record<Game['status'], string> = {
    Programado: 'Programado',
    EN_VIVO: 'En Vivo',
    FINALIZADO: 'Finalizado',
  };

  return (
    <Card className="w-full max-w-2xl bg-card border-border transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="space-y-1.5">
          <CardTitle className="text-2xl text-foreground">{game.teamA.name} vs {game.teamB.name}</CardTitle>
          <CardDescription className="text-muted-foreground">
            Creado el: <FormattedDate dateString={game.createdAt} />
          </CardDescription>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Trash2 className="h-4 w-4 text-destructive" />
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
              <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? "Eliminando..." : "Confirmar"}
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
            <p className="text-muted-foreground">{game.teamA.name}</p>
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
            <p className="text-muted-foreground">{game.teamB.name}</p>
            <p className="text-5xl font-bold text-foreground">{teamBScore}</p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap justify-end gap-2">
        <Button asChild onClick={handleViewStats} variant="outline" disabled={game.status !== 'FINALIZADO'} className="w-full sm:w-auto">
            <Link href={`/stats/${game.id}`}>
                Ver Estadísticas
            </Link>
        </Button>
        <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href={`/game/${game.id}/public`}>
                <Eye className="mr-2 h-4 w-4" />
                Vista Pública
            </Link>
        </Button>
        {(game.status === 'EN_VIVO' || game.status === 'Programado') && (
           <Button onClick={handleSimulate} disabled={isSimulating} variant="secondary" className="w-full sm:w-auto">
             <Sparkles className="mr-2 h-4 w-4" />
             {isSimulating ? 'Simulando...' : 'Simular Partido (IA)'}
           </Button>
        )}
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
