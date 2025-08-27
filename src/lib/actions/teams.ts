'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import type { Team } from '@prisma/client';

export async function getTeams(): Promise<Team[]> {
  const teams = await prisma.team.findMany({
    orderBy: {
      name: 'asc'
    }
  });
  return teams;
}

export async function createTeam(formData: FormData) {
  const name = formData.get('name') as string;
  const logoUrl = formData.get('logoUrl') as string;

  if (!name) {
    return { error: 'El nombre es obligatorio' };
  }

  await prisma.team.create({
    data: {
      name,
      logoUrl,
    },
  });

  revalidatePath('/admin?tab=teams');
  revalidatePath('/stats');
}

export async function updateTeam(formData: FormData) {
  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const logoUrl = formData.get('logoUrl') as string;

  if (!id || !name) {
    return { error: 'Faltan datos para actualizar' };
  }

  await prisma.team.update({
    where: { id },
    data: { name, logoUrl },
  });

  revalidatePath('/admin?tab=teams');
  revalidatePath('/stats');
}

export async function deleteTeam(formData: FormData) {
  const id = formData.get('id') as string;

  if (!id) {
    return { error: 'Falta el ID del equipo' };
  }
  
  await prisma.team.delete({
    where: { id },
  });
  
  revalidatePath('/admin?tab=teams');
  revalidatePath('/admin?tab=players');
  revalidatePath('/stats');
}
