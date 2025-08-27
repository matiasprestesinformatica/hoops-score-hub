import { getAllTeamsWithStats } from '@/lib/actions/stats';
import { Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TeamListControls } from '@/components/teams/team-list-controls';

export default async function TeamsListPage() {
  const teams = await getAllTeamsWithStats();

  return (
    <div className={cn("body-with-background")}>
      <div className="bg-background/80 min-h-screen">
        <div className="container mx-auto p-4 md:p-8">
          <header className="text-center my-8">
            <h1 
                className="text-4xl font-bold tracking-tight flex items-center justify-center gap-3 text-foreground"
                style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}
            >
              <Users className="w-8 h-8 text-primary" />
              Equipos de la Liga
            </h1>
            <p className="text-muted-foreground mt-2">
              Explora las plantillas, estadísticas y resultados de todos los equipos.
            </p>
          </header>

          <main>
            <TeamListControls teams={teams} />
          </main>
        </div>
      </div>
    </div>
  );
}
