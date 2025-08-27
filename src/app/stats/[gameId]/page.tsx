import { getGameById } from '@/lib/actions/game';
import { notFound } from 'next/navigation';
import { TeamComparisonStats } from '@/components/stats/team-comparison-stats';
import { PlayerStatsTable } from '@/components/stats/player-stats-table';
import { aggregateTeamStats, calculateScoresByPeriod, calculateScoreProgression } from '@/lib/stats-utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, BarChart2, LineChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScoreByPeriod } from '@/components/stats/score-by-period';
import { GameHeader } from '@/components/stats/game-header';
import { cn } from '@/lib/utils';
import { ScoreProgressionChart } from '@/components/stats/score-progression-chart';

interface GameStatsPageProps {
  params: {
    gameId: string;
  };
}

export default async function GameStatsPage({ params }: GameStatsPageProps) {
  const game = await getGameById(params.gameId);

  if (!game) {
    notFound();
  }
  
  const teamAStats = aggregateTeamStats(game.teamA.players);
  const teamBStats = aggregateTeamStats(game.teamB.players);
  
  const teamAScores = calculateScoresByPeriod(game.teamA.players);
  const teamBScores = calculateScoresByPeriod(game.teamB.players);

  const scoreProgression = calculateScoreProgression(game);

  return (
    <div className={cn("body-with-background")}>
        <div className="backdrop-blur-sm bg-black/60 min-h-screen">
            <div className="container mx-auto p-4 md:p-8">
            <header className="mb-8">
                <Button asChild variant="outline" className="mb-6 bg-transparent hover:bg-white/10 text-white">
                    <Link href="/stats">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver a la lista de partidos
                    </Link>
                </Button>
                
                <GameHeader game={game} />
                
                <ScoreByPeriod 
                    teamA={game.teamA}
                    teamB={game.teamB}
                    teamAScores={teamAScores}
                    teamBScores={teamBScores}
                />
            </header>

            <main className="space-y-8 mt-12">
                <Card className="bg-black/30 backdrop-blur-lg border border-white/20 text-gray-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-gray-100">
                            <LineChart />
                            Progresión del Marcador
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScoreProgressionChart data={scoreProgression} teamAName={game.teamA.name} teamBName={game.teamB.name} />
                    </CardContent>
                </Card>

                <Card className="bg-black/30 backdrop-blur-lg border border-white/20 text-gray-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-gray-100">
                            <BarChart2 />
                            Resumen del Partido
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <TeamComparisonStats teamAStats={teamAStats} teamBStats={teamBStats} />
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <PlayerStatsTable team={game.teamA} />
                    <PlayerStatsTable team={game.teamB} />
                </div>
            </main>
            </div>
        </div>
    </div>
  );
}
