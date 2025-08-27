"use client";

import type { PlayerInGame, Game } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { Badge } from "./ui/badge";
import { toast } from "@/hooks/use-toast";
import { useGameStore } from "@/store/use-game-store";


interface PlayerStatsRowProps {
  player: PlayerInGame;
  game: Game;
}

export function PlayerStatsRow({ player, game }: PlayerStatsRowProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const addAction = useGameStore((state) => state.addAction);

  const handleAction = (actionCallback: () => void) => {
    if (game.status !== 'EN_VIVO') {
      toast({
        title: "Acción no permitida",
        description: "El partido debe estar 'EN VIVO' para registrar estadísticas.",
        variant: "destructive",
      });
      return;
    }
    actionCallback();
    setIsPopoverOpen(false);
  }

  const handleShot = (points: 1 | 2 | 3, made: boolean) => {
    handleAction(() => {
        addAction({
            type: 'shot',
            payload: {
                playerId: player.player.id,
                points,
                made,
                period: game.currentPeriod,
            }
        });
    });
  };
  
  const handleStat = (stat: 'rebounds' | 'assists' | 'fouls') => {
    handleAction(() => {
        addAction({
            type: 'stat',
            payload: {
                playerId: player.player.id,
                stat,
                period: game.currentPeriod,
            }
        });
    });
  }


  const currentStats = player.statsByPeriod[game.currentPeriod - 1];

  const points = currentStats
    ? currentStats.points1.made +
      currentStats.points2.made * 2 +
      currentStats.points3.made * 3
    : 0;

  return (
    <div className="flex items-center justify-between border-b border-primary/10 p-2">
      <div className="font-medium">
        <span>#{player.player.number} {player.player.name}</span>
        {currentStats && (
           <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
            <Badge variant="secondary">PTS: {points}</Badge>
            <Badge variant="secondary">REB: {currentStats.rebounds}</Badge>
            <Badge variant="secondary">AST: {currentStats.assists}</Badge>
            <Badge variant="secondary">FLS: {currentStats.fouls}</Badge>
           </div>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button size="sm">Tiro</Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto bg-background border-primary/20">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Registrar Tiro</h4>
                <p className="text-sm text-muted-foreground">
                  Selecciona el resultado del tiro.
                </p>
              </div>
              <div className="flex flex-col space-y-2">
                 <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium">1 Punto (TL)</span>
                  <div className="flex space-x-1">
                    <Button size="sm" variant="outline" onClick={() => handleShot(1, true)}>Anotado</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleShot(1, false)}>Fallado</Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">2 Puntos</span>
                  <div className="flex space-x-1">
                    <Button size="sm" variant="outline" onClick={() => handleShot(2, true)}>Anotado</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleShot(2, false)}>Fallado</Button>
                  </div>
                </div>
                 <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">3 Puntos</span>
                  <div className="flex space-x-1">
                    <Button size="sm" variant="outline" onClick={() => handleShot(3, true)}>Anotado</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleShot(3, false)}>Fallado</Button>
                  </div>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Button size="sm" variant="outline" onClick={() => handleStat('rebounds')}>+ REB</Button>
        <Button size="sm" variant="outline" onClick={() => handleStat('assists')}>+ ASI</Button>
        <Button size="sm" variant="outline" onClick={() => handleStat('fouls')}>+ FAL</Button>
      </div>
    </div>
  );
}
