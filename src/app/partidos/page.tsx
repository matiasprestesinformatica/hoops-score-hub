import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GameCard } from "@/components/partidos/game-card";
import { getGames } from "@/lib/actions/game";
import { calculateScore } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default async function PartidosDashboardPage() {
  const games = await getGames();

  return (
    <div className={cn("body-with-background")}>
      <div className="backdrop-blur-sm bg-black/60 min-h-screen">
        <div className="container mx-auto p-4 flex flex-col items-center">
          <h1 className="text-3xl font-bold text-center my-6 text-gray-100" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}>
            Panel de Partidos (Prueba)
          </h1>

          <Button asChild size="lg" className="mb-12">
            <Link href="/partidos/new">CREAR NUEVO PARTIDO (PRUEBA)</Link>
          </Button>

          <div className="w-full max-w-2xl">
            <h2 className="text-2xl font-semibold mb-4 text-center text-gray-200" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}>Partidos Guardados</h2>
            <div className="space-y-4">
              {games.length > 0 ? (
                games.map((game) => {
                  const teamAScore = calculateScore(game.teamA.players);
                  const teamBScore = calculateScore(game.teamB.players);
                  return <GameCard key={game.id} game={game} teamAScore={teamAScore} teamBScore={teamBScore} basePath="/partidos" />
                })
              ) : (
                <p className="text-center text-gray-400">
                  No hay partidos guardados. ¡Crea uno nuevo para empezar!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
