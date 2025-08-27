'use client';

import { useTransition } from 'react';
import type { Game, GameStatus } from '@/types';
import { updateGameStatus, updateCurrentPeriod } from '@/lib/actions/game';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';


interface MobileGameStatusManagerProps {
  game: Game;
}

export function MobileGameStatusManager({ game }: MobileGameStatusManagerProps) {
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
    <div className="flex flex-col gap-2 w-full">
        <div className="flex items-center justify-between gap-2">
             <Badge
                variant={game.status === 'EN_VIVO' ? 'destructive' : 'secondary'}
                className={cn('text-xs px-2 py-1', isGameFinished && 'bg-green-700 text-white')}
                >
                {statusText[game.status]}
            </Badge>

            <Select 
                value={String(game.currentPeriod)}
                onValueChange={handlePeriodChange}
                disabled={isGameFinished || isPending}
            >
                <SelectTrigger className="w-[120px] h-8 text-xs">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="1">Período 1</SelectItem>
                    <SelectItem value="2">Período 2</SelectItem>
                    <SelectItem value="3">Período 3</SelectItem>
                    <SelectItem value="4">Período 4</SelectItem>
                </SelectContent>
            </Select>
        </div>

        <div className="flex items-center gap-2 w-full">
          {game.status === 'Programado' && (
            <Button size="sm" className="h-8 text-xs flex-1" onClick={() => handleStatusChange('EN_VIVO')} disabled={isPending}>
              {isPending ? '...' : 'Iniciar'}
            </Button>
          )}

          {game.status === 'EN_VIVO' && (
            <Button size="sm" className="h-8 text-xs flex-1" variant="secondary" onClick={() => handleStatusChange('Programado')} disabled={isPending}>
              {isPending ? '...' : 'Pausar'}
            </Button>
          )}

          {!isGameFinished && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" className="h-8 text-xs flex-1" variant="destructive" disabled={isPending}>
                  Finalizar
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

           {isGameFinished && (
             <Button size="sm" className="h-8 text-xs flex-1" disabled>
                Partido Finalizado
            </Button>
          )}
        </div>
    </div>
  );
}
