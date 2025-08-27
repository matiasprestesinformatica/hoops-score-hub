import { getTeams, getPlayersAndTeams } from "@/lib/actions/admin";
import { TeamForm } from "./_components/team-form";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PlayerForm } from "./_components/player-form";
import { AdminTabs } from "./_components/admin-tabs";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Settings } from "lucide-react";
import { TeamsTable } from "./_components/teams-table";
import { PlayersTable } from "./_components/players-table";

export const dynamic = 'force-dynamic';

// Este componente carga los datos para las pestañas
async function AdminDataContainer() {
  // Ambas llamadas a la base de datos se ejecutan en paralelo
  const [teams, { players }] = await Promise.all([
    getTeams(),
    getPlayersAndTeams()
  ]);
  const noTeams = teams.length === 0;

  return (
    <AdminTabs
      teamsContent={
        <div className="mt-6 space-y-4">
          <div className='flex justify-end'>
             <TeamForm />
          </div>
          <Suspense fallback={<p>Cargando equipos...</p>}>
            <TeamsTable teams={teams} />
          </Suspense>
        </div>
      }
      playersContent={
        <div className="mt-6 space-y-4">
          <div className='flex justify-end'>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="inline-block">
                    <PlayerForm teams={teams} disabled={noTeams} />
                  </div>
                </TooltipTrigger>
                {noTeams && (
                  <TooltipContent>
                    <p>Debes crear un equipo antes de añadir un jugador.</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>
          <Suspense fallback={<p>Cargando jugadores...</p>}>
            <PlayersTable players={players} teams={teams} />
          </Suspense>
        </div>
      }
    />
  );
}

export default function AdminPage() {
  return (
    <div className="container mx-auto p-0">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Administración</h1>
          <p className="text-muted-foreground mt-2">
            Gestiona los equipos y jugadores de la liga.
          </p>
        </div>
        <Button asChild variant="outline">
            <Link href="/admin/config">
                <Settings className="mr-2 h-4 w-4" />
                Configuración del Proyecto
            </Link>
        </Button>
      </div>
      <Suspense fallback={<div>Cargando...</div>}>
        <AdminDataContainer />
      </Suspense>
    </div>
  );
}
