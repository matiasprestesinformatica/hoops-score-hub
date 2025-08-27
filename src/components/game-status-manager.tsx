'use client';

import { useTransition } from 'react';
import type { Game, GameStatus } from '@/types';
import { updateGameStatus, updateCurrentPeriod } from '@/lib/actions/game';
import { Button } from '@/components/ui/button';
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
} from '@/components/ui/alert-dialog';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';

interface GameStatusManagerProps {
  game: Game;
}

export function GameStatusManager({ game }: GameStatusManagerProps) {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (status: GameStatus) => {
    startTransition(() => updateGameStatus(game.id, status));
  };

  const handlePeriodChange = (value: string) => {
    const period = parseInt(value, 10) as 1 | 2 | 3 | 4;
    if (!isNaN(period)) {
      startTransition(() => updateCurrentPeriod(game.id, period));
    }
  };

  const statusText: Record<GameStatus, string> = {
    Programado: 'Programado',
    EN_VIVO: 'En Vivo',
    FINALIZADO: 'Finalizado',
  };

  const isGameFinished = game.status === 'FINALIZADO';

  return (
    <div className="flex items-center gap-6 p-2 rounded-lg bg-card border border-border">
      <div className="flex items-center gap-4">
        <Badge
          variant={game.status === 'EN_VIVO' ? 'destructive' : 'secondary'}
          className={cn('text-sm', game.status === 'FINALIZADO' && 'bg-green-700 text-white')}
        >
          {statusText[game.status]}
        </Badge>

        <div className="flex items-center gap-2">
          {game.status === 'Programado' && (
            <Button size="sm" onClick={() => handleStatusChange('EN_VIVO')} disabled={isPending}>
              {isPending ? 'Iniciando...' : 'Iniciar Partido'}
            </Button>
          )}

          {game.status === 'EN_VIVO' && (
            <Button size="sm" variant="secondary" onClick={() => handleStatusChange('Programado')} disabled={isPending}>
              {isPending ? 'Pausando...' : 'Pausar Partido'}
            </Button>
          )}

          {!isGameFinished && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="destructive" disabled={isPending}>
                  Finalizar Partido
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Finalizar el partido?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. El estado cambiará a Finalizado y ya no se podrán registrar más estadísticas.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleStatusChange('FINALIZADO')} disabled={isPending}>
                    Sí, finalizar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
      
      <div>
        <Tabs
            value={String(game.currentPeriod)}
            onValueChange={handlePeriodChange}
          >
            <TabsList>
              <TabsTrigger value="1" disabled={isGameFinished || isPending}>P1</TabsTrigger>
              <TabsTrigger value="2" disabled={isGameFinished || isPending}>P2</TabsTrigger>
              <TabsTrigger value="3" disabled={isGameFinished || isPending}>P3</TabsTrigger>
              <TabsTrigger value="4" disabled={isGameFinished || isPending}>P4</TabsTrigger>
            </TabsList>
          </Tabs>
      </div>
    </div>
  );
}
