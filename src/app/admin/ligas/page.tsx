import { getLeagues } from "@/lib/actions/leagues";
import { Suspense } from "react";
import { LeagueForm } from "./_components/league-form";
import { LeaguesTable } from "./_components/leagues-table";
import { Trophy } from "lucide-react";

export const dynamic = 'force-dynamic';

async function LeaguesDataContainer() {
  const leagues = await getLeagues();
  
  return (
    <div className="mt-6 space-y-4">
        <div className='flex justify-end'>
            <LeagueForm />
        </div>
        <Suspense fallback={<p>Cargando ligas...</p>}>
            <LeaguesTable leagues={leagues} />
        </Suspense>
    </div>
  )
}

export default function LigasPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Trophy className="w-8 h-8 text-primary" />
            Gestión de Ligas
          </h1>
          <p className="text-muted-foreground mt-2">
            Crea, edita y organiza las diferentes ligas o competiciones.
          </p>
        </div>
      </div>
      <Suspense fallback={<div>Cargando...</div>}>
        <LeaguesDataContainer />
      </Suspense>
    </div>
  );
}
