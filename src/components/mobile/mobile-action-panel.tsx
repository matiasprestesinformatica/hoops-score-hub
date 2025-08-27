"use client";

import type { Game } from '@/types';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useGameStore } from '@/store/use-game-store';

const ActionButton = ({ onClick, disabled, children, className }: { onClick: () => void; disabled: boolean; children: React.ReactNode, className?: string }) => (
    <Button
        variant="outline"
        className={cn(
            "aspect-square w-full h-auto bg-black/40 backdrop-blur-md border-2 border-white/20 hover:bg-white/20 text-white transition-all duration-200 flex flex-col gap-1 text-xs uppercase font-semibold p-2",
            className
        )}
        onClick={onClick}
        disabled={disabled}
    >
        {children}
    </Button>
);

interface MobileActionPanelProps {
    game: Game;
    selectedPlayerId: string | null;
}

export function MobileActionPanel({ game, selectedPlayerId }: MobileActionPanelProps) {
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
    <div className="p-4">
        <div className="grid grid-cols-3 gap-3">
            <ActionButton onClick={() => handleShot(2, true)} disabled={isDisabled}>
                <span>2 Pts</span>
                <span className="text-green-400 text-xs">Anotado</span>
            </ActionButton>
            <ActionButton onClick={() => handleShot(3, true)} disabled={isDisabled}>
                <span>3 Pts</span>
                <span className="text-green-400 text-xs">Anotado</span>
            </ActionButton>
             <ActionButton onClick={() => handleShot(1, true)} disabled={isDisabled}>
                <span>T. Libre</span>
                <span className="text-green-400 text-xs">Anotado</span>
            </ActionButton>
            
            <ActionButton onClick={() => handleShot(2, false)} disabled={isDisabled}>
                <span>2 Pts</span>
                <span className="text-red-400 text-xs">Fallado</span>
            </ActionButton>
            <ActionButton onClick={() => handleShot(3, false)} disabled={isDisabled}>
                <span>3 Pts</span>
                <span className="text-red-400 text-xs">Fallado</span>
            </ActionButton>
            <ActionButton onClick={() => handleShot(1, false)} disabled={isDisabled}>
                <span>T. Libre</span>
                <span className="text-red-400 text-xs">Fallado</span>
            </ActionButton>

            <ActionButton onClick={() => handleStat('rebounds')} disabled={isDisabled}>
                <span>Rebote</span>
            </ActionButton>
            <ActionButton onClick={() => handleStat('assists')} disabled={isDisabled}>
                <span>Asistencia</span>
            </ActionButton>
            <ActionButton onClick={() => handleStat('fouls')} disabled={isDisabled}>
                <span>Falta</span>
            </ActionButton>
        </div>
    </div>
  );
}
