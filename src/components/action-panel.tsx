"use client";

import type { Game } from '@/types';
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useGameStore } from '@/store/use-game-store';
import { Card, CardContent } from './ui/card';

const ActionButton = ({ onClick, disabled, children, className, variant = "outline" }: { onClick: () => void; disabled: boolean; children: React.ReactNode, className?: string, variant?: "default" | "secondary" | "destructive" | "outline" | "ghost" | "link" | null | undefined }) => (
    <Button
        variant={variant}
        className={cn(
            "h-16 w-full transition-all duration-200 flex flex-col gap-1 text-xs uppercase font-semibold",
            className
        )}
        onClick={onClick}
        disabled={disabled}
    >
        {children}
    </Button>
);

interface ActionPanelProps {
    game: Game;
    selectedPlayerId: string | null;
}

export function ActionPanel({ game, selectedPlayerId }: ActionPanelProps) {
  const addAction = useGameStore((state) => state.addAction);
  const isDisabled = !selectedPlayerId || game.status !== 'EN_VIVO';

  const handleAction = (action: () => void) => {
    if (game.status !== 'EN_VIVO') {
      toast({
        title: "Acción no permitida",
        description: "El partido debe estar 'EN VIVO' para registrar estadísticas.",
        variant: "destructive",
      });
      return;
    }
    action();
  }

  const handleShot = (points: 1 | 2 | 3, made: boolean) => {
    if (!selectedPlayerId) return;
    handleAction(() => {
      addAction({
        type: 'shot',
        payload: {
          playerId: selectedPlayerId,
          points,
          made,
          period: game.currentPeriod,
        }
      });
    });
  };
  
  const handleStat = (stat: 'rebounds' | 'assists' | 'fouls') => {
    if(!selectedPlayerId) return;
    handleAction(() => {
      addAction({
        type: 'stat',
        payload: {
          playerId: selectedPlayerId,
          stat,
          period: game.currentPeriod,
        }
      });
    });
  }

  return (
    <Card className="bg-card/80 border-primary/20 w-full max-w-sm">
        <CardContent className="p-3 space-y-3">
            {/* Grupo de Tiros Anotados */}
            <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground text-center">ANOTADO</p>
                <div className="grid grid-cols-3 gap-2">
                    <ActionButton onClick={() => handleShot(1, true)} disabled={isDisabled} variant="secondary">
                        <span>+1 P</span>
                        <span className="text-green-300">T. Libre</span>
                    </ActionButton>
                    <ActionButton onClick={() => handleShot(2, true)} disabled={isDisabled} variant="secondary">
                        <span>+2 Pts</span>
                        <span className="text-green-300">Canasta</span>
                    </ActionButton>
                    <ActionButton onClick={() => handleShot(3, true)} disabled={isDisabled} variant="secondary">
                        <span>+3 Pts</span>
                        <span className="text-green-300">Triple</span>
                    </ActionButton>
                </div>
            </div>

            {/* Grupo de Tiros Fallados */}
             <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground text-center">FALLADO</p>
                <div className="grid grid-cols-3 gap-2">
                    <ActionButton onClick={() => handleShot(1, false)} disabled={isDisabled} variant="outline">
                        <span>-1 P</span>
                         <span className="text-red-400">T. Libre</span>
                    </ActionButton>
                    <ActionButton onClick={() => handleShot(2, false)} disabled={isDisabled} variant="outline">
                        <span>-2 Pts</span>
                         <span className="text-red-400">Canasta</span>
                    </ActionButton>
                    <ActionButton onClick={() => handleShot(3, false)} disabled={isDisabled} variant="outline">
                        <span>-3 Pts</span>
                         <span className="text-red-400">Triple</span>
                    </ActionButton>
                </div>
            </div>

             {/* Grupo de Otras Acciones */}
             <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground text-center">OTRAS ACCIONES</p>
                <div className="grid grid-cols-3 gap-2">
                    <ActionButton onClick={() => handleStat('rebounds')} disabled={isDisabled} variant="outline">
                        <span>Rebote</span>
                    </ActionButton>
                    <ActionButton onClick={() => handleStat('assists')} disabled={isDisabled} variant="outline">
                        <span>Asistencia</span>
                    </ActionButton>
                    <ActionButton onClick={() => handleStat('fouls')} disabled={isDisabled} variant="outline">
                        <span>Falta</span>
                    </ActionButton>
                </div>
            </div>
        </CardContent>
    </Card>
  );
}
