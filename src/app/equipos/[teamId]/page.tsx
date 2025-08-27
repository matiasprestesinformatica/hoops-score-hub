import { getTeamDetails } from '@/lib/actions/stats';
import { notFound } from 'next/navigation';
import { TeamProfileHeader } from '@/components/teams/team-profile-header';
import { TeamPlayersTable } from '@/components/teams/team-players-table';
import { TeamMatchHistory } from '@/components/teams/team-match-history';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TeamSummaryStats } from '@/components/teams/team-summary-stats';

interface TeamProfilePageProps {
  params: {
    teamId: string;
  };
}

export default async function TeamProfilePage({ params }: TeamProfilePageProps) {
  const teamDetails = await getTeamDetails(params.teamId);

  if (!teamDetails) {
    notFound();
  }

  const { team, playersWithStats, matchHistory, summaryStats } = teamDetails;

  return (
    <div className={cn("body-with-background")}>
        <div className="bg-background/80 min-h-screen">
            <div className="container mx-auto p-4 md:p-8">
            <header className="mb-8">
                <Button asChild variant="outline" className="mb-6">
                    <Link href="/equipos">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver a la lista de equipos
                    </Link>
                </Button>
                <TeamProfileHeader team={team} />
            </header>

            <main className="space-y-12">
                <section>
                    <h2 className="text-2xl font-bold tracking-tight mb-4 text-foreground">Estadísticas Resumidas</h2>
                    <TeamSummaryStats stats={summaryStats} />
                </section>

                <section>
                <h2 className="text-2xl font-bold tracking-tight mb-4 text-foreground">Plantilla y Estadísticas</h2>
                <TeamPlayersTable players={playersWithStats} />
                </section>
                
                <section>
                <h2 className="text-2xl font-bold tracking-tight mb-4 text-foreground">Historial de Partidos</h2>
                <TeamMatchHistory matches={matchHistory} currentTeamId={team.id} />
                </section>
            </main>
            </div>
        </div>
    </div>
  );
}
