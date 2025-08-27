'use client';

import { useState } from 'react';
import type { Game, PlayerInGame, Play, Shot } from '@/types';
import { Court } from './court';
import { registerShot, registerEvent } from '@/lib/actions/shots';
import { Button } from '../ui/button';
import { toast } from '@/hooks/use-toast';
import { PlayByPlayFeed } from '../play-by-play-feed';
import { DigitalScoreboard } from '../digital-scoreboard';
import { ShotControls } from './shot-controls';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ShotChartClientProps {
  game: Game & { shots: Shot[] };
}

export function ShotChartClient({ game: initialGame }: ShotChartClientProps) {
  const [game, setGame] = useState(initialGame);
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerInGame | null>(null);
  const [shotResult, setShotResult] = useState<'made' | 'missed'>('made');
  const [shotValue, setShotValue] = useState<'1' | '2' | '3'>('2');
  const [plays, setPlays] = useState<Play[]>([]);
  const [shots, setShots] = useState<Shot[]>(initialGame.shots || []);
  const isMobile = useIsMobile();

  const handleShotAttempt = async (coords: { x: number; y: number }) => {
    if (!selectedPlayer) {
      toast({
        title: 'Jugador no seleccionado',
        description: 'Por favor, selecciona un jugador antes de registrar un tiro.',
        variant: 'destructive',
      });
      return;
    }

    const shotData = {
      gameId: game.id,
      playerId: selectedPlayer.player.id,
      period: game.currentPeriod,
      x: coords.x,
      y: coords.y,
      made: shotResult === 'made',
      points: parseInt(shotValue, 10) as 1 | 2 | 3,
    };

    const result = await registerShot(shotData);

    if (result && result.newPlay && result.newShot) {
      setPlays(prevPlays => [result.newPlay, ...prevPlays]);
      setShots(prevShots => [...prevShots, result.newShot]);
      
      setGame(prevGame => {
        const newGame = JSON.parse(JSON.stringify(prevGame));
        const teamKey = newGame.teamA.players.some((p: PlayerInGame) => p.player.id === selectedPlayer.player.id) ? 'teamA' : 'teamB';
        const playerIndex = newGame[teamKey].players.findIndex((p: PlayerInGame) => p.player.id === selectedPlayer.player.id);
        
        if (playerIndex > -1) {
          const periodIndex = shotData.period - 1;
          const stats = newGame[teamKey].players[playerIndex].statsByPeriod[periodIndex];
          if (shotData.points === 1) {
            stats.points1.attempted++;
            if (shotData.made) stats.points1.made++;
          } else if (shotData.points === 2) {
            stats.points2.attempted++;
            if (shotData.made) stats.points2.made++;
          } else if (shotData.points === 3) {
            stats.points3.attempted++;
            if (shotData.made) stats.points3.made++;
          }
        }
        return newGame;
      });
      
    } else {
      toast({
        title: 'Error al registrar tiro',
        description: 'No se pudo guardar la jugada. Inténtalo de nuevo.',
        variant: 'destructive',
      });
    }
  };
  
  const handleRegisterEvent = async (eventType: 'rebound' | 'assist' | 'foul') => {
    if (!selectedPlayer) return;

    const team = game.teamA.players.some(p => p.player.id === selectedPlayer.player.id) ? game.teamA : game.teamB;
    
    const eventData = {
      gameId: game.id,
      playerId: selectedPlayer.player.id,
      period: game.currentPeriod,
      teamName: team.name,
      playerName: selectedPlayer.player.name,
      eventType,
    };

    const result = await registerEvent(eventData);

    if (result && result.newPlay) {
      setPlays(prevPlays => [result.newPlay, ...prevPlays]);
       setGame(prevGame => {
        const newGame = JSON.parse(JSON.stringify(prevGame));
        const teamKey = newGame.teamA.players.some((p: PlayerInGame) => p.player.id === selectedPlayer.player.id) ? 'teamA' : 'teamB';
        const playerIndex = newGame[teamKey].players.findIndex((p: PlayerInGame) => p.player.id === selectedPlayer.player.id);
        
        if (playerIndex > -1) {
          const periodIndex = eventData.period - 1;
          const stats = newGame[teamKey].players[playerIndex].statsByPeriod[periodIndex];
          if (eventType === 'rebound') stats.rebounds++;
          if (eventType === 'assist') stats.assists++;
          if (eventType === 'foul') stats.fouls++;
        }
        return newGame;
      });
    } else {
       toast({
        title: `Error al registrar ${eventType}`,
        variant: 'destructive',
      });
    }
  };

  const DesktopLayout = () => (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] gap-4 items-start overflow-hidden">
        <ShotControls 
            team={game.teamA}
            selectedPlayer={selectedPlayer}
            onPlayerSelect={setSelectedPlayer}
            shotResult={shotResult}
            onShotResultChange={setShotResult}
            shotValue={shotValue}
            onShotValueChange={setShotValue}
            onRegisterEvent={handleRegisterEvent}
        />

        <div className="flex flex-col items-center justify-start h-full gap-4">
          <DigitalScoreboard game={{...game, teamA: {...game.teamA}, teamB: {...game.teamB}}} />
          <Court onShot={handleShotAttempt} shots={shots} />
        </div>
        
        <div className="flex flex-col gap-4 h-full overflow-hidden">
          <ShotControls 
              team={game.teamB}
              selectedPlayer={selectedPlayer}
              onPlayerSelect={setSelectedPlayer}
              shotResult={shotResult}
              onShotResultChange={setShotResult}
              shotValue={shotValue}
              onShotValueChange={setShotValue}
              onRegisterEvent={handleRegisterEvent}
          />
           <div className="flex-1 min-h-0">
             <PlayByPlayFeed plays={plays} />
           </div>
        </div>
      </div>
  );

  const MobileLayout = () => (
     <div className="flex flex-col h-full w-full">
        <DigitalScoreboard game={{...game, teamA: {...game.teamA}, teamB: {...game.teamB}}} />
        <Tabs defaultValue="court" className="w-full flex-1 flex flex-col mt-4">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="teamA">{game.teamA.name}</TabsTrigger>
                <TabsTrigger value="court">Cancha</TabsTrigger>
                <TabsTrigger value="teamB">{game.teamB.name}</TabsTrigger>
            </TabsList>
            <TabsContent value="teamA" className="flex-1 overflow-y-auto">
                 <ShotControls 
                    team={game.teamA}
                    selectedPlayer={selectedPlayer}
                    onPlayerSelect={setSelectedPlayer}
                    shotResult={shotResult}
                    onShotResultChange={setShotResult}
                    shotValue={shotValue}
                    onShotValueChange={setShotValue}
                    onRegisterEvent={handleRegisterEvent}
                />
            </TabsContent>
            <TabsContent value="court" className="flex-1 overflow-y-auto space-y-4 p-2">
                 <Court onShot={handleShotAttempt} shots={shots} />
                 <PlayByPlayFeed plays={plays} />
            </TabsContent>
            <TabsContent value="teamB" className="flex-1 overflow-y-auto">
                 <ShotControls 
                    team={game.teamB}
                    selectedPlayer={selectedPlayer}
                    onPlayerSelect={setSelectedPlayer}
                    shotResult={shotResult}
                    onShotResultChange={setShotResult}
                    shotValue={shotValue}
                    onShotValueChange={setShotValue}
                    onRegisterEvent={handleRegisterEvent}
                />
            </TabsContent>
        </Tabs>
     </div>
  );

  return (
    <div className="w-full h-screen p-4 flex flex-col gap-4 text-white">
       <header className='flex items-center justify-between'>
        <Button asChild variant="outline" className="self-start bg-transparent hover:bg-white/10 text-white">
            <Link href="/game">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Link>
        </Button>
          <h1 className="text-xl md:text-2xl font-bold">Registro Avanzado</h1>
          <div className="w-24">{/* Spacer */}</div>
      </header>
      
      {isMobile ? <MobileLayout /> : <DesktopLayout />}
    </div>
  );
}
