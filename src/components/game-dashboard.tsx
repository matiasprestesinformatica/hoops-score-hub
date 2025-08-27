"use client";

import { Scoreboard } from "./scoreboard";
import { TeamPanel } from "./team-panel";
import { AdminPanel } from "./admin-panel";
import { PlayByPlayFeed } from "./play-by-play-feed";
import { Button } from "./ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Game } from "@/types";

interface GameDashboardProps {
  game: Game | null;
}

export function GameDashboard({ game }: GameDashboardProps) {

  if (!game) {
    return (
       <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
            <p className="text-2xl font-semibold mb-4">Partido no encontrado</p>
            <Button asChild>
                <Link href="/game">Volver al panel de partidos</Link>
            </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
       <Button asChild variant="outline" className="mb-4">
        <Link href="/game">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a todos los partidos
        </Link>
      </Button>
      
      <section>
        <Scoreboard game={game} />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <TeamPanel team={game.teamA} game={game} />
            </div>
            <div>
              <TeamPanel team={game.teamB} game={game} />
            </div>
          </section>

          <section>
            <AdminPanel game={game} />
          </section>
        </div>
        
        <aside className="lg:col-span-1">
           <PlayByPlayFeed plays={game.plays} />
        </aside>
      </div>
    </div>
  );
}
