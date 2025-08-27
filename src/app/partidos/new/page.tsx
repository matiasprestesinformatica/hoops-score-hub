import prisma from '@/lib/prisma';
import { NewGameForm } from "@/components/new-game-form";

export default async function NewGamePage() {
  const teams = await prisma.team.findMany({
    include: {
      players: true,
    },
  });

  return (
    <div className="container mx-auto p-4 flex flex-col items-center">
       <h1 className="text-3xl font-bold text-center my-6">
        Crear Nuevo Partido (Prueba)
      </h1>
      <NewGameForm teams={teams} basePath="/partidos" />
    </div>
  );
}
