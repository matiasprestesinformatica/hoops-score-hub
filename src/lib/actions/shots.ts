'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import type { Play, Shot } from '@/types';

interface ShotData {
  gameId: string;
  playerId: string;
  period: 1 | 2 | 3 | 4;
  x: number;
  y: number;
  made: boolean;
  points: 1 | 2 | 3;
}

export async function registerShot(shotData: ShotData): Promise<{ newPlay: Play; newShot: Shot } | null> {
  const { gameId, playerId, period, x, y, made, points } = shotData;

  try {
    const playerGameStats = await prisma.playerGameStats.findUnique({
      where: { gameId_playerId: { gameId, playerId } },
      select: { id: true },
    });

    if (!playerGameStats) {
      throw new Error('PlayerGameStats not found');
    }

    const statAttemptedField = `p${period}_points${points}_attempted`;
    const statMadeField = `p${period}_points${points}_made`;

    let newShotRecord: import('@prisma/client').Shot;

    await prisma.$transaction(async (tx) => {
      newShotRecord = await tx.shot.create({
        data: {
          x,
          y,
          made,
          points,
          period,
          playerGameStatsId: playerGameStats.id,
        },
      });

      await tx.playerGameStats.update({
        where: { id: playerGameStats.id },
        data: {
          [statAttemptedField]: { increment: 1 },
          ...(made && { [statMadeField]: { increment: 1 } }),
        },
      });
    });

    revalidatePath(`/shot-chart/${gameId}`);
    revalidatePath(`/game/${gameId}`);

    const player = await prisma.player.findUnique({ where: { id: playerId }, include: { team: true }});
    if (!player || !player.team) {
        throw new Error('Could not retrieve necessary data for summary');
    }
    
    const summary = `${player.name}, de ${player.team.name}, ${made ? 'anotación' : 'fallo'} de ${points} punto${points > 1 ? 's' : ''}.`;
    
    const newPlay: Play = {
        id: newShotRecord!.id,
        summary,
        teamName: player.team.name,
        time: new Date().toLocaleTimeString('es-ES', { minute: '2-digit', second: '2-digit' }),
        undone: false,
    };

    const newShotForClient: Shot = {
        id: newShotRecord!.id,
        x,
        y,
        made,
        points,
        period,
        playerId,
    }

    return { newPlay, newShot: newShotForClient };

  } catch (error) {
    console.error('Error registering shot:', error);
    return null;
  }
}


interface EventData {
    gameId: string;
    playerId: string;
    period: 1 | 2 | 3 | 4;
    teamName: string;
    playerName: string;
    eventType: 'rebound' | 'assist' | 'foul';
}

export async function registerEvent(eventData: EventData): Promise<{ newPlay: Play } | null> {
    const { gameId, playerId, period, eventType, teamName, playerName } = eventData;
    
    const statFieldMap = {
        rebound: 'rebounds',
        assist: 'assists',
        foul: 'fouls'
    };
    const dbField = `p${period}_${statFieldMap[eventType]}`;

    try {
        await prisma.playerGameStats.update({
            where: {
                gameId_playerId: { gameId, playerId }
            },
            data: {
                [dbField]: { increment: 1 }
            }
        });
        
        revalidatePath(`/shot-chart/${gameId}`);
        revalidatePath(`/game/${gameId}`);

        let summary = '';
        switch(eventType) {
            case 'rebound':
                summary = `${playerName}, de ${teamName}, rebote realizado.`;
                break;
            case 'assist':
                summary = `${playerName}, de ${teamName}, asistencia realizada.`;
                break;
            case 'foul':
                summary = `${playerName}, de ${teamName}, falta realizada.`;
                break;
        }

        const newPlay: Play = {
            id: crypto.randomUUID(),
            summary,
            teamName,
            time: new Date().toLocaleTimeString('es-ES', { minute: '2-digit', second: '2-digit' }),
            undone: false,
        };

        return { newPlay };

    } catch (error) {
        console.error(`Error registering event (${eventType}):`, error);
        return null;
    }
}
