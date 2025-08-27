'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import type { ProjectConfig } from '@/types';
import { cache } from 'react';

export const getProjectConfig = cache(async (): Promise<ProjectConfig> => {
  // Primero, intenta encontrar la configuración. Esta es la operación más común.
  let config = await prisma.projectConfig.findUnique({
    where: { id: 1 },
  });

  // Si no existe (solo ocurrirá la primera vez que se ejecute la app), créala.
  if (!config) {
    config = await prisma.projectConfig.create({
      data: {
        id: 1,
        title: 'Registro Liga Canaria',
        slogan: 'Tu centro de control para los partidos de la liga.',
        metaDescription: 'Marcador y estadísticas de la Liga Canaria de Baloncesto.',
        logoUrl: '/logocanaria.png',
      },
    });
  }

  return config;
});


export async function updateConfig(formData: FormData) {
  const title = formData.get('title') as string;
  const slogan = formData.get('slogan') as string || null;
  const logoUrl = formData.get('logoUrl') as string || null;
  const metaDescription = formData.get('metaDescription') as string || null;

  if (!title) {
    return { error: 'El título es obligatorio.' };
  }

  try {
    await prisma.projectConfig.update({
      where: { id: 1 },
      data: {
        title,
        slogan,
        logoUrl,
        metaDescription,
      },
    });

    // Revalida el layout para asegurar que los metadatos y el navbar se actualicen en toda la app.
    revalidatePath('/', 'layout');
    
    return { error: null };
  } catch (error) {
    console.error('Failed to update config:', error);
    return { error: 'No se pudo guardar la configuración.' };
  }
}
