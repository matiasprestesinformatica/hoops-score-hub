import { getSeasonDetails } from "@/lib/actions/seasons";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TeamAssignmentClient } from "./_components/team-assignment-client";
import { Suspense } from "react";
import { FixtureControls } from "./_components/fixture-controls";

export const dynamic = 'force-dynamic';

interface TeamAssignmentPageProps {
  params: {
    seasonId: string;
  };
}

export default async function TeamAssignmentPage({ params }: TeamAssignmentPageProps) {
  const data = await getSeasonDetails(params.seasonId);

  if (!data) {
    notFound();
  }
  
  const { season, participatingTeams, allTeams } = data;

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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Gestionar Equipos en {season.name}
          </h1>
          <p className="text-muted-foreground mt-2">
            Añade o elimina equipos que participarán en esta temporada.
          </p>
        </div>
        <FixtureControls seasonId={season.id} teamCount={participatingTeams.length} />
      </div>
      <Suspense fallback={<div>Cargando interfaz de asignación...</div>}>
        <TeamAssignmentClient 
            season={season}
            initialParticipatingTeams={participatingTeams}
            allTeams={allTeams}
        />
      </Suspense>
    </div>
  );
}
