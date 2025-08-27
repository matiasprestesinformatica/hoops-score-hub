import { getSeasonById, getSeasonStandings, getFixturesBySeason } from "@/lib/actions/seasons";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Trophy, Shield, ArrowDownCircle } from "lucide-react";
import { Suspense } from "react";
import { StandingsTable } from "./_components/standings-table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlayoffBracket } from "./_components/playoff-bracket";
import { PlayoffControls } from "./_components/playoff-controls";

export const dynamic = 'force-dynamic';

interface PostSeasonPageProps {
  params: {
    seasonId: string;
  };
}

export default async function PostSeasonPage({ params }: PostSeasonPageProps) {
  const [season, standingsData, playoffGames] = await Promise.all([
    getSeasonById(params.seasonId),
    getSeasonStandings(params.seasonId),
    getFixturesBySeason(params.seasonId, 'PLAYOFF')
  ]);
  
  if (!season || !standingsData) {
    notFound();
  }

  const { playoffTeams, safeTeams, relegationTeams } = standingsData;

  const canGenerate = standingsData.standings.length >= season.playoffTeams;

  return (
    <div>
       <Button asChild variant="outline" className="mb-4">
        <Link href={`/admin/ligas/${season.leagueId}/temporadas`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a Temporadas
        </Link>
      </Button>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Trophy className="w-8 h-8 text-primary" />
            Post-Temporada: {season.name}
          </h1>
          <p className="text-muted-foreground mt-2">
            Consulta la clasificación final y genera los enfrentamientos de playoffs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
           <Suspense fallback={<p>Calculando clasificación...</p>}>
             <StandingsTable standings={playoffTeams} title="Clasificados a Playoffs" icon={<Trophy className="w-5 h-5 text-amber-500" />} />
             <StandingsTable standings={safeTeams} title="Finalizan la Temporada (Permanencia)" icon={<Shield className="w-5 h-5 text-blue-500" />} />
             <StandingsTable standings={relegationTeams} title="Juegan por el Descenso" icon={<ArrowDownCircle className="w-5 h-5 text-red-500" />} />
           </Suspense>
        </div>
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Acciones de Post-Temporada</CardTitle>
                    <CardDescription>Genera los partidos para la fase final de la competición.</CardDescription>
                </CardHeader>
                <CardContent>
                    <PlayoffControls seasonId={season.id} canGenerate={canGenerate} />
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>Playoffs</CardTitle>
                </CardHeader>
                <CardContent>
                    <Suspense fallback={<p>Cargando enfrentamientos...</p>}>
                        <PlayoffBracket games={playoffGames} />
                    </Suspense>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
