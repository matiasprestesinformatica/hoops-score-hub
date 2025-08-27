import prisma from '@/lib/prisma';
import { SimulateGameForm } from "@/components/simulate-game-form";
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export default async function SimulateGamePage() {
  const teams = await prisma.team.findMany({
    include: {
      players: true,
    },
  });

  return (
    <div className={cn("body-with-background")}>
      <div className="bg-background/80 backdrop-blur-sm min-h-screen">
        <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen">
          <div className="text-center my-6">
                <h1 className="text-4xl font-bold tracking-tight flex items-center justify-center gap-3 text-foreground">
                    <Sparkles className="w-8 h-8 text-primary" />
                    Simulación Rápida de Partido
                </h1>
                <p className="text-muted-foreground mt-2">
                    Usa IA para generar un partido completo con estadísticas realistas en segundos.
                </p>
          </div>
          <SimulateGameForm teams={teams} />
        </div>
      </div>
    </div>
  );
}
