"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { MobileDigitalScoreboard } from "./mobile-digital-scoreboard";
import { MobileJerseyButton } from "./mobile-jersey-button";
import { MobilePlayerStatsPanel } from "./mobile-player-stats-panel";
import { MobileActionPanel } from "./mobile-action-panel";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { Game, PlayerInGame, TeamInGame } from "@/types";
import { MobileGameStatusManager } from "./mobile-game-status-manager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsLandscape } from "@/hooks/use-is-landscape";
import { Skeleton } from "../ui/skeleton";
import { useGameStore } from "@/store/use-game-store";
import { batchUpdateStats } from "@/lib/actions/game";
import { toast } from "@/hooks/use-toast";
import { SyncStatusIndicator } from "../sync-status-indicator";


interface MobileGameClientProps {
    game: Game;
}

const TeamJerseyGrid = ({ team, selectedPlayer, onSelectPlayer, isDisabled }: {
    team: TeamInGame;
    selectedPlayer: PlayerInGame | null;
    onSelectPlayer: (player: PlayerInGame) => void;
    isDisabled: boolean;
}) => (
    <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 p-4">
        {[...team.players].sort((a, b) => a.player.number - b.player.number).map(p => (
            <MobileJerseyButton
                key={p.player.id}
                playerInGame={p}
                teamLogoUrl={team.logoUrl}
                onClick={onSelectPlayer}
                isSelected={selectedPlayer?.player.id === p.player.id}
                isDisabled={isDisabled}
            />
        ))}
    </div>
);

const LandscapeLayout = ({ game, selectedPlayer, handleSelectPlayer }: {
    game: Game;
    selectedPlayer: PlayerInGame | null;
    handleSelectPlayer: (player: PlayerInGame) => void;
}) => (
    <section className="flex-1 grid grid-cols-3 gap-2 items-start p-2 pt-40"> {/* Add padding top */}
        {/* Team A */}
        <div className="flex flex-col items-center gap-2">
             <h2 className="font-bold text-center text-sm uppercase">{game.teamA.name}</h2>
             <div className="grid grid-cols-3 gap-2 w-full">
                {[...game.teamA.players].sort((a, b) => a.player.number - b.player.number).map(p => (
                    <MobileJerseyButton
                        key={p.player.id}
                        playerInGame={p}
                        teamLogoUrl={game.teamA.logoUrl}
                        onClick={handleSelectPlayer}
                        isSelected={selectedPlayer?.player.id === p.player.id}
                        isDisabled={game.status !== 'EN_VIVO'}
                    />
                ))}
            </div>
        </div>
        {/* Actions */}
        <div className="flex flex-col items-center gap-2">
             <h2 className="font-bold text-center text-sm uppercase">Acciones</h2>
            <MobileActionPanel game={game} selectedPlayerId={selectedPlayer?.player.id || null} />
        </div>

        {/* Team B */}
        <div className="flex flex-col items-center gap-2">
            <h2 className="font-bold text-center text-sm uppercase">{game.teamB.name}</h2>
            <div className="grid grid-cols-3 gap-2 w-full">
                {[...game.teamB.players].sort((a, b) => a.player.number - b.player.number).map(p => (
                    <MobileJerseyButton
                        key={p.player.id}
                        playerInGame={p}
                        teamLogoUrl={game.teamB.logoUrl}
                        onClick={handleSelectPlayer}
                        isSelected={selectedPlayer?.player.id === p.player.id}
                        isDisabled={game.status !== 'EN_VIVO'}
                    />
                ))
            }
            </div>
        </div>
    </section>
);

const MobileGameSkeleton = () => (
    <div className="flex flex-col h-screen animate-pulse p-2 gap-2">
        {/* Header Skeleton */}
        <div className="p-2 border-b border-border">
            <div className="flex items-center justify-between mb-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-24" />
            </div>
            {/* Scoreboard Skeleton */}
            <div className="flex justify-between items-center p-2 rounded-lg">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-6 w-24" />
                </div>
                <Skeleton className="h-10 w-20" />
                <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-10 w-10 rounded-full" />
                </div>
            </div>
        </div>

        {/* Body Skeleton */}
        <div className="flex-1 p-4">
             <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                {[...Array(10)].map((_, i) => <Skeleton key={i} className="aspect-[4/5] rounded-lg" />)}
            </div>
        </div>

        {/* Footer Skeleton */}
        <div className="p-2 border-t border-border">
            <Skeleton className="h-12 w-full" />
        </div>
    </div>
);


export function MobileGameClient(props: MobileGameClientProps) {
  const router = useRouter();
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerInGame | null>(null);
  const { game, initializeGame, updateGameMetadata, clearPendingActions, setSyncStatus } = useGameStore();
  const isLandscape = useIsLandscape();
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
            description: `${latestPendingActions.length} acciones guardadas.`,
        });
      } else {
        throw new Error(result.error || "Error desconocido en la sincronización");
      }
    } catch (error) {
      console.error("Error de sincronización:", error);
      setSyncStatus('error');
      toast({
        title: "Error de Sincronización",
        description: "No se pudieron guardar los últimos cambios. Se reintentará.",
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

  // Effect for periodic sync
  useEffect(() => {
    const intervalId = setInterval(handleSync, 15000);
    return () => clearInterval(intervalId);
  }, [handleSync]);

  // Effect for network resilience
  useEffect(() => {
    window.addEventListener('online', handleSync);
    return () => {
      window.removeEventListener('online', handleSync);
    };
  }, [handleSync]);

  const handleGoBack = () => {
    handleSync();
    router.push('/game');
  }

  const handleSelectPlayer = (player: PlayerInGame) => {
    if (!game || game.status !== 'EN_VIVO') return;
    setSelectedPlayer(prev => prev?.player.id === player.player.id ? null : player);
  }

  // Render a loading state until orientation is determined
  if (isLandscape === undefined || !game) {
    return <MobileGameSkeleton />;
  }

  return (
    <main className="h-screen bg-transparent text-foreground flex flex-col font-sans">
        <Tabs defaultValue="teamA" className="flex flex-col h-full">
            <header className="fixed top-0 left-0 right-0 z-20 bg-black/20 backdrop-blur-sm border-b border-white/10 flex flex-col gap-2 p-2">
                <div className="flex items-center justify-between">
                    <Button variant="ghost" size="sm" onClick={handleGoBack}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Salir
                    </Button>
                    <SyncStatusIndicator />
                </div>
                <MobileDigitalScoreboard game={game}/>
                <MobileGameStatusManager game={game} />
                {!isLandscape && (
                  <TabsList className="grid w-full grid-cols-3 rounded-md bg-black/20 p-1">
                      <TabsTrigger value="teamA" className="rounded-sm">{game.teamA.name}</TabsTrigger>
                      <TabsTrigger value="actions" className="rounded-sm">Acciones</TabsTrigger>
                      <TabsTrigger value="teamB" className="rounded-sm">{game.teamB.name}</TabsTrigger>
                  </TabsList>
                )}
            </header>

            <div className="flex-1 mt-[232px] mb-[76px] overflow-y-auto">
                {isLandscape ? 
                    <LandscapeLayout game={game} selectedPlayer={selectedPlayer} handleSelectPlayer={handleSelectPlayer} /> : 
                    (
                        <>
                            <TabsContent value="teamA">
                                <TeamJerseyGrid team={game.teamA} selectedPlayer={selectedPlayer} onSelectPlayer={handleSelectPlayer} isDisabled={game.status !== 'EN_VIVO'}/>
                            </TabsContent>
                            <TabsContent value="actions">
                                <MobileActionPanel game={game} selectedPlayerId={selectedPlayer?.player.id || null} />
                            </TabsContent>
                            <TabsContent value="teamB">
                                <TeamJerseyGrid team={game.teamB} selectedPlayer={selectedPlayer} onSelectPlayer={handleSelectPlayer} isDisabled={game.status !== 'EN_VIVO'}/>
                            </TabsContent>
                        </>
                    )
                }
            </div>
            
            <footer className="fixed bottom-0 left-0 right-0 z-20 p-2 bg-black/20 backdrop-blur-sm border-t border-white/10">
                <MobilePlayerStatsPanel player={selectedPlayer} />
            </footer>
        </Tabs>
    </main>
  );
}
