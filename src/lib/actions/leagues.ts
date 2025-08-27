'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { cache } from 'react';
import type { League, Season } from '@prisma/client';

export const getLeagueById = cache(async (id: string) => {
  try {
    const league = await prisma.league.findUnique({
      where: { id },
    });
    return league;
  } catch (error) {
    console.error('Failed to fetch league:', error);
    return null;
  }
});

export async function getLeagues(): Promise<League[]> {
  try {
    const leagues = await prisma.league.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    return leagues;
  } catch (error) {
    console.error('Failed to fetch leagues:', error);
    return [];
  }
}

export async function createLeague(formData: FormData) {
  const name = formData.get('name') as string;

  if (!name) {
    return { error: 'El nombre es obligatorio' };
  }

  try {
    await prisma.league.create({
      data: { name },
    });
    revalidatePath('/admin/ligas');
  } catch (error) {
    console.error('Failed to create league:', error);
    return { error: 'No se pudo crear la liga.' };
  }
}

export async function updateLeague(formData: FormData) {
  const id = formData.get('id') as string;
  const name = formData.get('name') as string;

  if (!id || !name) {
    return { error: 'Faltan datos para actualizar' };
  }

  try {
    await prisma.league.update({
      where: { id },
      data: { name },
    });
    revalidatePath('/admin/ligas');
  } catch (error) {
    console.error('Failed to update league:', error);
    return { error: 'No se pudo actualizar la liga.' };
  }
}

export async function deleteLeague(formData: FormData) {
  const id = formData.get('id') as string;

  if (!id) {
    return { error: 'Falta el ID de la liga' };
  }

  try {
    // Primero, encuentra todas las temporadas asociadas a la liga
    const seasons = await prisma.season.findMany({
      where: { leagueId: id },
      select: { id: true },
    });
    const seasonIds = seasons.map((s: { id: string }) => s.id);

    // Inicia una transacción para eliminar en cascada
    await prisma.$transaction(async (tx) => {
      // Elimina los partidos asociados a las temporadas encontradas
      if (seasonIds.length > 0) {
        await tx.game.deleteMany({
          where: { seasonId: { in: seasonIds } },
        });
      }
      
      // Elimina las temporadas
      await tx.season.deleteMany({
        where: { leagueId: id },
      });
      
      // Finalmente, elimina la liga
      await tx.league.delete({
        where: { id },
      });
    });

    revalidatePath('/admin/ligas');
  } catch (error) {
    console.error('Failed to delete league:', error);
    return { error: 'No se pudo eliminar la liga.' };
  }
}
