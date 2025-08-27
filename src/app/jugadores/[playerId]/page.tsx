import { getPlayerDetails } from '@/lib/actions/stats';
import { notFound } from 'next/navigation';
import { PlayerProfileHeader } from '@/components/players/player-profile-header';
import { PlayerStatsCards } from '@/components/players/player-stats-cards';
import { PlayerGameLog } from '@/components/players/player-game-log';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PlayerPerformanceChart } from '@/components/players/player-performance-chart';

interface PlayerProfilePageProps {
  params: {
    playerId: string;
  };
}

export default async function PlayerProfilePage({ params }: PlayerProfilePageProps) {
  const playerDetails = await getPlayerDetails(params.playerId);

  if (!playerDetails) {
    notFound();
  }

  const { player, stats } = playerDetails;

  return (
    <div className={cn("body-with-background")}>
      <div className="bg-background/80 min-h-screen">
        <div className="container mx-auto p-4 md:p-8">
          <header className="mb-8">
            <Button asChild variant="outline" className="mb-6">
              <Link href={`/equipos/${player.teamId}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al Equipo
              </Link>
            </Button>
            <PlayerProfileHeader player={player} />
          </header>

          <main className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold tracking-tight mb-4 text-foreground">Promedios por Partido</h2>
              <PlayerStatsCards averages={stats.averages} />
            </section>

            <section>
              <h2 className="text-2xl font-bold tracking-tight mb-4 text-foreground">Evolución de Rendimiento</h2>
              <PlayerPerformanceChart data={stats.performanceData} />
            </section>

            <section>
              <h2 className="text-2xl font-bold tracking-tight mb-4 text-foreground">Registro de Partidos</h2>
              <PlayerGameLog gameLogs={stats.gameLogs} />
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
