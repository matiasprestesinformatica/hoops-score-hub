"use client";

import { useTransition } from 'react';
import type { Game } from '@/types';
import { updateGameStatus, updateCurrentPeriod } from '@/lib/actions/game';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
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
import { Gamepad2 } from "lucide-react";

interface AdminPanelProps {
    game: Game;
}

export function AdminPanel({ game }: AdminPanelProps) {
  const [isPending, startTransition] = useTransition();

  const isGameFinished = game.status === "FINALIZADO";

  const handlePeriodChange = (value: string) => {
    const period = parseInt(value, 10) as 1 | 2 | 3 | 4;
    if (!isNaN(period)) {
      startTransition(() => updateCurrentPeriod(game.id, period));
    }
  };

  const handleStatusChange = (status: 'EN_VIVO' | 'Programado' | 'FINALIZADO') => {
    startTransition(() => updateGameStatus(game.id, status));
  }

  return (
    <Card className="bg-card/80 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gamepad2 className="w-6 h-6" />
          Controles del Partido
        </CardTitle>
        <CardDescription>
          Gestiona el período actual y el estado general del partido.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <p className="mb-2 text-sm font-medium">Seleccionar Período</p>
          <Tabs
            value={String(game.currentPeriod)}
            onValueChange={handlePeriodChange}
            className="w-[400px]"
          >
            <TabsList>
              <TabsTrigger value="1" disabled={isGameFinished || isPending}>Período 1</TabsTrigger>
              <TabsTrigger value="2" disabled={isGameFinished || isPending}>Período 2</TabsTrigger>
              <TabsTrigger value="3" disabled={isGameFinished || isPending}>Período 3</TabsTrigger>
              <TabsTrigger value="4" disabled={isGameFinished || isPending}>Período 4</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex items-center gap-4">
           <Button
            variant={game.status === 'EN_VIVO' ? 'secondary' : 'default'}
            onClick={() => handleStatusChange(game.status === 'EN_VIVO' ? 'Programado' : 'EN_VIVO')}
            disabled={isGameFinished || isPending}
            className="w-40"
          >
            {isPending ? '...' : game.status === 'EN_VIVO' ? 'Pausar Partido' : 'Iniciar Partido'}
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isGameFinished || isPending} className="w-40">
                Finalizar Partido
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro de que quieres finalizar el partido?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. El estado del partido se cambiará a Finalizado y no se podrán registrar más estadísticas.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleStatusChange('FINALIZADO')} disabled={isPending}>
                  Sí, finalizar partido
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
