"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { JerseyButton } from "@/components/jersey-button";
import { PlayerStatsPanel } from "@/components/player-stats-panel";
import { ActionPanel } from "@/components/action-panel";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import type { Game, PlayerInGame } from "@/types";
import { GameStatusManager } from "./game-status-manager";
import { useGameStore } from "@/store/use-game-store";
import { batchUpdateStats } from "@/lib/actions/game";
import { toast } from "@/hooks/use-toast";
import { SyncStatusIndicator } from "./sync-status-indicator";
import { LiveScoreboard } from "./live-scoreboard";

interface GameClientProps {
    game: Game;
}

export function GameClient(props: GameClientProps) {
  const router = useRouter();
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerInGame | null>(null);
  const { game, initializeGame, updateGameMetadata, clearPendingActions, setSyncStatus } = useGameStore();

  const isSyncing = useRef(false);

  const handleSync = useCallback(async () => {
    const latestPendingActions = useGameStore.getState().pendingActions;
    if (isSyncing.current || latestPendingActions.length === 0 || !game) return;

    isSyncing.current = true;
    setSyncStatus('syncing');
    
    try {
      const result = await batchUpdateStats(game.id, latestPendingActions);
      if (result.success) {
        clearPendingActions();
        toast({
            title: "Sincronizado",
            description: `${latestPendingActions.length} acciones guardadas en el servidor.`,
        });
      } else {
        throw new Error(result.error || "Error desconocido en la sincronización");
      }
    } catch (error) {
      console.error("Error de sincronización:", error);
      setSyncStatus('error');
      toast({
        title: "Error de Sincronización",
        description: "No se pudieron guardar los últimos cambios. Se reintentará automáticamente.",
        variant: "destructive",
      });
    } finally {
      isSyncing.current = false;
    }
  }, [game, clearPendingActions, setSyncStatus]);


  useEffect(() => {
    const localGame = useGameStore.getState().game;
    if (localGame?.id !== props.game.id) {
        initializeGame(props.game);
    } else {
        updateGameMetadata(props.game);
    }
  }, [props.game, initializeGame, updateGameMetadata]);
  
  useEffect(() => {
    const intervalId = setInterval(() => {
        handleSync();
    }, 15000); 

    return () => clearInterval(intervalId);
  }, [handleSync]);

  useEffect(() => {
    window.addEventListener('online', handleSync);
    return () => {
      window.removeEventListener('online', handleSync);
    };
  }, [handleSync]);

  const handleSaveAndClose = () => {
    handleSync(); 
    router.push('/game');
  }

  const handleSelectPlayer = (player: PlayerInGame) => {
    if (!game || game.status !== 'EN_VIVO') return;
    setSelectedPlayer(prev => prev?.player.id === player.player.id ? null : player);
  }

  if (!game) {
    return <div>Cargando partido...</div>;
  }

  return (
    <main className="font-sans h-screen grid grid-rows-[auto_1fr] overflow-hidden">
        <header className="flex flex-col sm:flex-row justify-between items-center p-2 border-b border-border gap-4 z-10">
            <GameStatusManager game={game} />
            <div className="flex items-center gap-4 self-end sm:self-center">
              <SyncStatusIndicator />
              <Button variant="ghost" className="flex items-center gap-2 text-muted-foreground hover:text-foreground" onClick={handleSaveAndClose}>
                  Guardar y Salir
                  <Download className="h-5 w-5" />
              </Button>
            </div>
        </header>

        <section className="grid grid-cols-[1fr_auto_1fr] gap-4 items-start overflow-hidden p-4">
            <div className="flex flex-col items-center gap-4 h-full overflow-y-auto animate-in fade-in slide-in-from-left-12 duration-500 p-2">
                <h2 className="text-xl font-bold uppercase tracking-widest text-muted-foreground">{game.teamA.name}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {[...game.teamA.players].sort((a, b) => a.player.number - b.player.number).map(p => (
                    <JerseyButton
                        key={p.player.id}
                        playerInGame={p}
                        onClick={handleSelectPlayer}
                        isSelected={selectedPlayer?.player.id === p.player.id}
                        isDisabled={game.status !== 'EN_VIVO'}
                    />
                    ))}
                </div>
            </div>

            <div className="flex flex-col items-center justify-between h-full gap-4 py-4 animate-in fade-in zoom-in-95 duration-500">
                <LiveScoreboard game={game}/>
                <ActionPanel game={game} selectedPlayerId={selectedPlayer?.player.id || null} />
                <PlayerStatsPanel player={selectedPlayer} />
            </div>

            <div className="flex flex-col items-center gap-4 h-full overflow-y-auto animate-in fade-in slide-in-from-right-12 duration-500 p-2">
                <h2 className="text-xl font-bold uppercase tracking-widest text-muted-foreground">{game.teamB.name}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {[...game.teamB.players].sort((a, b) => a.player.number - b.player.number).map(p => (
                    <JerseyButton
                        key={p.player.id}
                        playerInGame={p}
                        onClick={handleSelectPlayer}
                        isSelected={selectedPlayer?.player.id === p.player.id}
                        isDisabled={game.status !== 'EN_VIVO'}
                    />
                    ))}
                </div>
            </div>
      </section>
    </main>
  );
}
