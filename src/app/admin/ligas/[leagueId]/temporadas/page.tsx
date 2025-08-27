import { getSeasonsByLeague } from "@/lib/actions/seasons";
import { getLeagueById } from "@/lib/actions/leagues";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { SeasonsTable } from "./_components/seasons-table";
import { SeasonForm } from "./_components/season-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = 'force-dynamic';

interface SeasonsPageProps {
  params: {
    leagueId: string;
  };
}

async function SeasonsDataContainer({ leagueId }: { leagueId: string }) {
  const seasons = await getSeasonsByLeague(leagueId);
  
  return (
    <div className="mt-6 space-y-4">
        <div className='flex justify-end'>
            <SeasonForm leagueId={leagueId} />
        </div>
        <Suspense fallback={<p>Cargando temporadas...</p>}>
            <SeasonsTable seasons={seasons} leagueId={leagueId} />
        </Suspense>
    </div>
  );
}

export default async function SeasonsPage({ params }: SeasonsPageProps) {
  const league = await getLeagueById(params.leagueId);

  if (!league) {
    notFound();
  }

  return (
    <div>
       <Button asChild variant="outline" className="mb-4">
        <Link href="/admin/ligas">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a Ligas
        </Link>
      </Button>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Temporadas de {league.name}
          </h1>
          <p className="text-muted-foreground mt-2">
            Gestiona las temporadas, equipos participantes y fixtures para esta liga.
          </p>
        </div>
      </div>
      <Suspense fallback={<div>Cargando...</div>}>
        <SeasonsDataContainer leagueId={params.leagueId} />
      </Suspense>
    </div>
  );
}
