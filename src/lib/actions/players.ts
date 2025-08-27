'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createPlayer(formData: FormData) {
  const name = formData.get('name') as string;
  const jerseyNumber = parseInt(formData.get('jerseyNumber') as string, 10);
  const teamId = formData.get('teamId') as string;
  const imageUrl = formData.get('imageUrl') as string;
  
  if (!name || !teamId || isNaN(jerseyNumber)) {
    return { error: 'Todos los campos son obligatorios.' };
  }

  await prisma.player.create({
    data: {
      name,
      jerseyNumber,
      teamId,
      imageUrl: imageUrl || '/logos/jugadores/placehoader_jugador.png',
    },
  });

  revalidatePath('/players');
  revalidatePath('/game/new');
}

export async function updatePlayer(formData: FormData) {
  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const jerseyNumber = parseInt(formData.get('jerseyNumber') as string, 10);
  const teamId = formData.get('teamId') as string;
  const imageUrl = formData.get('imageUrl') as string;
  
  if (!id || !name || !teamId || isNaN(jerseyNumber)) {
    return { error: 'Todos los campos son obligatorios.' };
  }

  await prisma.player.update({
    where: { id },
    data: {
      name,
      jerseyNumber,
      teamId,
      imageUrl: imageUrl || '/logos/jugadores/placehoader_jugador.png',
    },
  });

  revalidatePath('/players');
  revalidatePath('/game/new');
}

export async function deletePlayer(formData: FormData) {
  const id = formData.get('id') as string;

  if (!id) {
    return { error: 'Falta el ID del jugador' };
  }
  
  await prisma.player.delete({
    where: { id },
  });
  
  revalidatePath('/players');
  revalidatePath('/game/new');
}
