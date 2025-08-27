"use client"

import { useState, useMemo } from "react"
import { ScoreBoard } from "@/components/partidos/score-board"
import { PlayerSelection } from "@/components/partidos/player-selection"
import { ActionButtons } from "@/components/partidos/action-buttons"
import { PlayerStats } from "@/components/partidos/player-stats"
import { Button } from "@/components/ui/button"
import { Download, ChevronLeft } from "lucide-react"
import type { Game, PlayerInGame, PlayerStats as PlayerStatsType } from "@/types";
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsLandscape } from "@/hooks/use-is-landscape"
import { Skeleton } from "../ui/skeleton"

interface PartidosClientProps {
  game: Game;
}

export function PartidosClient({ game: initialGame }: PartidosClientProps) {
  const router = useRouter();
  const [game, setGame] = useState<Game>(initialGame);
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerInGame | null>(null);
  const isLandscape = useIsLandscape();

  const teamAScore = useMemo(() => game.teamA.players.reduce((totalScore, p) => totalScore + p.statsByPeriod.reduce((playerScore, period) => playerScore + period.points1.made + (period.points2.made * 2) + (period.points3.made * 3), 0), 0), [game.teamA.players]);
  const teamBScore = useMemo(() => game.teamB.players.reduce((totalScore, p) => totalScore + p.statsByPeriod.reduce((playerScore, period) => playerScore + period.points1.made + (period.points2.made * 2) + (period.points3.made * 3), 0), 0), [game.teamB.players]);

  const handleSelectPlayer = (player: PlayerInGame) => {
    setSelectedPlayer(prev => prev?.player.id === player.player.id ? null : player);
  }

  // NOTE: This is a client-side only update for demonstration on this test page.
  // It does not persist to the database.
  const handleStatUpdate = (statType: string, made: boolean) => {
    if (!selectedPlayer) return;

    setGame(prevGame => {
      const newGame = JSON.parse(JSON.stringify(prevGame));
      const teamKey = newGame.teamA.players.some((p: PlayerInGame) => p.player.id === selectedPlayer.player.id) ? 'teamA' : 'teamB';
      const playerIndex = newGame[teamKey].players.findIndex((p: PlayerInGame) => p.player.id === selectedPlayer.player.id);
      
      if (playerIndex > -1) {
        const periodIndex = newGame.currentPeriod - 1;
        const stats: PlayerStatsType = newGame[teamKey].players[playerIndex].statsByPeriod[periodIndex];

        switch (statType) {
          case "2PT":
            stats.points2.attempted += 1;
            if (made) stats.points2.made += 1;
            break;
          case "3PT":
            stats.points3.attempted += 1;
            if (made) stats.points3.made += 1;
            break;
          case "FT":
            stats.points1.attempted += 1;
            if (made) stats.points1.made += 1;
            break;
        }
      }
      return newGame;
    });
  }
  
  if (isLandscape === undefined) {
    return <Skeleton className="h-screen w-full" />;
  }

  return (
    <main className="flex flex-col h-screen">
      {/* Header - Sticky Controls */}
      <header className="sticky top-0 z-20 flex flex-col items-center p-2 bg-black/20 backdrop-blur-sm border-b border-white/10 gap-2">
        <div className="flex items-center justify-between w-full">
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/10" onClick={() => router.push('/partidos')}>
            <ChevronLeft className="w-4 h-4 mr-1" />
            Salir
          </Button>
          <div className="flex items-center gap-2">
            <Button size="sm" className="text-xs">Iniciar</Button>
            <Button variant="destructive" size="sm" className="text-xs">Finalizar</Button>
          </div>
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
            <Download className="w-4 h-4 mr-1" />
            Guardar
          </Button>
        </div>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((p) => (
            <Button
              key={p}
              variant={game.currentPeriod === p ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setGame(g => ({...g, currentPeriod: p as 1 | 2 | 3 | 4}))}
              className="text-white hover:bg-white/10 text-xs px-3"
            >
              P{p}
            </Button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-20"> {/* Padding bottom to avoid overlap with footer */}
        <div className="p-2">
            <ScoreBoard
                homeScore={teamAScore}
                guestScore={teamBScore}
                period={game.currentPeriod}
                homeTeam={game.teamA}
                guestTeam={game.teamB}
            />
        </div>

        {/* Game Area */}
         <Tabs defaultValue="teamA" className="w-full flex flex-col flex-1 mt-4">
            <TabsList className="grid w-full grid-cols-3 sticky top-0 z-10 rounded-none bg-black/20 backdrop-blur-sm border-y border-white/10">
                <TabsTrigger value="teamA" className="rounded-none transition-colors duration-200 ease-in-out data-[state=active]:bg-white/10 data-[state=active]:text-white">{game.teamA.name}</TabsTrigger>
                <TabsTrigger value="actions" className="rounded-none transition-colors duration-200 ease-in-out data-[state=active]:bg-white/10 data-[state=active]:text-white">Acciones</TabsTrigger>
                <TabsTrigger value="teamB" className="rounded-none transition-colors duration-200 ease-in-out data-[state=active]:bg-white/10 data-[state=active]:text-white">{game.teamB.name}</TabsTrigger>
            </TabsList>
            <div className="flex-1 overflow-y-auto">
                <TabsContent value="teamA">
                    <PlayerSelection
                        team={game.teamA}
                        selectedPlayer={selectedPlayer}
                        onPlayerSelect={handleSelectPlayer}
                    />
                </TabsContent>
                <TabsContent value="actions" className="p-4">
                    <ActionButtons onStatUpdate={handleStatUpdate} disabled={!selectedPlayer} />
                </TabsContent>
                <TabsContent value="teamB">
                    <PlayerSelection
                        team={game.teamB}
                        selectedPlayer={selectedPlayer}
                        onPlayerSelect={handleSelectPlayer}
                    />
                </TabsContent>
            </div>
        </Tabs>

      </div>

      {/* Footer - Player Stats */}
      <footer className="fixed bottom-0 left-0 right-0 z-20 p-2 bg-black/20 backdrop-blur-sm border-t border-white/10">
        <PlayerStats playerInGame={selectedPlayer} />
      </footer>
    </main>
  )
}
