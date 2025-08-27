import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getGames } from "@/lib/actions/game";
import { BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getTeams } from "@/lib/actions/teams";
import { FilteredGameList } from "@/components/stats/filtered-game-list";

export default async function StatsPage() {
  // Se obtienen tanto los partidos como los equipos en paralelo
  const [games, teams] = await Promise.all([
    getGames(),
    getTeams()
  ]);
  
  const finishedGames = games.filter(g => g.status === 'FINALIZADO');

  return (
    <div className={cn("body-with-background")}>
      <div className="backdrop-blur-sm bg-black/60 min-h-screen">
        <div className="container mx-auto p-4 flex flex-col items-center">
          <div className="w-full max-w-4xl">
            <header className="my-8 text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-100" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}>Estadísticas de Partidos</h1>
              <p className="text-muted-foreground mt-2 text-gray-300">
                Selecciona un partido finalizado para ver el resumen o explora los líderes de la liga.
              </p>
            </header>

            <div className="flex justify-center mb-8">
              <Button asChild>
                <Link href="/stats/leaders">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Ver Líderes de la Liga
                </Link>
              </Button>
            </div>

            <main className="space-y-6">
              {/* Se renderiza el nuevo componente cliente que maneja el filtrado */}
              <FilteredGameList games={finishedGames} teams={teams} />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
