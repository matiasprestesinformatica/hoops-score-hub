import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getGames } from "@/lib/actions/game";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { GameTabs } from "@/components/game-tabs";
import { Suspense } from "react";


export default async function GameDashboardPage() {
  const games = await getGames();

  return (
    <div className={cn("body-with-background")}>
      <div className="bg-background/80 backdrop-blur-sm min-h-screen">
        <div className="container mx-auto p-4 flex flex-col items-center">
          <h1 className="text-3xl font-bold text-center my-6 text-foreground">
            Panel de Partidos
          </h1>

          <div className="flex flex-col md:flex-row items-center gap-4 mb-8 w-full max-w-md md:max-w-none justify-center">
            <Button asChild size="lg" className="w-full md:w-auto">
              <Link href="/game/new">CREAR NUEVO PARTIDO</Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="w-full md:w-auto">
              <Link href="/game/simulate">
                <Sparkles className="mr-2 h-5 w-5" />
                Simulación Rápida (IA)
              </Link>
            </Button>
          </div>

          <div className="w-full max-w-4xl">
             <Suspense fallback={<p>Cargando partidos...</p>}>
                <GameTabs games={games} />
             </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
