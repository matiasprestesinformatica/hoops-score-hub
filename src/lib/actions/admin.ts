'use server';

import prisma from '@/lib/prisma';
import type { Player, Team } from '@prisma/client';

// Define un tipo explícito para el jugador con su equipo.
export type PlayerWithTeam = Player & { team: Team | null };

export async function getTeams(): Promise<Team[]> {
  const teams = await prisma.team.findMany();
  return teams;
}

// La función ahora devuelve un tipo explícito, lo que ayuda a la inferencia de TypeScript.
export async function getPlayersAndTeams(): Promise<{ players: PlayerWithTeam[], teams: Team[] }> {
  const players = await prisma.player.findMany({
    include: {
      team: true,
    },
    orderBy: [
      { team: { name: 'asc' } },
      { name: 'asc' },
    ]
  });
  const teams = await prisma.team.findMany();
  return { players, teams };
}
