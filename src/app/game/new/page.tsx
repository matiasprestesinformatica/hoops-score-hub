import prisma from '@/lib/prisma';
import { NewGameForm } from "@/components/new-game-form";
import { cn } from '@/lib/utils';

export default async function NewGamePage() {
  const teams = await prisma.team.findMany({
    include: {
      players: true,
    },
  });

  return (
    <div className={cn("body-with-background")}>
      <div className="bg-background/80 backdrop-blur-sm min-h-screen">
        <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-3xl font-bold text-center my-6 text-foreground">
            Crear Nuevo Partido
          </h1>
          <NewGameForm teams={teams} basePath="/game" />
        </div>
      </div>
    </div>
  );
}
