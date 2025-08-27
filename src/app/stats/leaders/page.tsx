import prisma from '@/lib/prisma';
import { calculateLeagueLeaders } from '@/lib/stats-utils';
import { RankingTable } from '@/components/stats/ranking-table';
import { BarChart3, Star, Medal } from 'lucide-react';
import { cn } from '@/lib/utils';

export default async function LeadersPage() {
  const allPlayerStats = await prisma.playerGameStats.findMany({
    include: {
      player: {
        include: {
          team: true,
        },
      },
    },
  });

  const gameCounts = allPlayerStats.reduce((acc, stat) => {
    acc[stat.playerId] = (acc[stat.playerId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);


  const leaders = calculateLeagueLeaders(allPlayerStats, gameCounts);

  const hasData = leaders.points.length > 0 || leaders.rebounds.length > 0 || leaders.assists.length > 0;

  return (
    <div className={cn("body-with-background")}>
      <div className="backdrop-blur-sm bg-black/60 min-h-screen">
        <div className="container mx-auto p-4 md:p-8">
          <header className="text-center my-8">
            <h1 className="text-4xl font-bold tracking-tight text-gray-100" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}>Líderes de la Liga</h1>
            <p className="text-muted-foreground mt-2 text-gray-300">
              Los mejores jugadores de la competición en cada categoría estadística.
            </p>
          </header>
          
          <main>
            {hasData ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <RankingTable
                  title="Puntos por Partido"
                  leaders={leaders.points}
                  icon={<Star className="w-6 h-6 text-yellow-400" />}
                />
                 <RankingTable
                  title="Rebotes por Partido"
                  leaders={leaders.rebounds}
                  icon={<Medal className="w-6 h-6 text-gray-300" />}
                />
                 <RankingTable
                  title="Asistencias por Partido"
                  leaders={leaders.assists}
                  icon={<BarChart3 className="w-6 h-6 text-orange-400" />}
                />
              </div>
            ) : (
              <div className="text-center py-16 border-2 border-dashed border-border rounded-lg bg-black/20 text-gray-400">
                <p>No hay datos suficientes para generar un ranking de líderes.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
