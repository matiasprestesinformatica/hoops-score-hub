import { getGameById } from '@/lib/actions/game';
import { notFound } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ShotChartClient } from '@/components/shot-chart/shot-chart-client';
import prisma from '@/lib/prisma';
import type { Shot } from '@/types';

interface ShotChartPageProps {
  params: {
    gameId: string;
  };
}

async function getShotsForGame(gameId: string): Promise<Shot[]> {
    try {
        const shots = await prisma.shot.findMany({
            where: {
                playerGameStats: {
                    gameId: gameId,
                },
            },
            include: {
                playerGameStats: {
                    select: {
                        playerId: true,
                    },
                },
            },
        });

        return shots.map(shot => ({
            id: shot.id,
            x: shot.x,
            y: shot.y,
            made: shot.made,
            points: shot.points,
            period: shot.period,
            playerId: shot.playerGameStats.playerId,
        }));
    } catch (error) {
        console.error("Failed to fetch shots:", error);
        return []; // Return empty array on error
    }
}


export default async function ShotChartPage({ params }: ShotChartPageProps) {
  const game = await getGameById(params.gameId);

  if (!game) {
    notFound();
  }
  
  const shots = await getShotsForGame(params.gameId);

  const gameWithShots = { ...game, shots };

  return (
    <div className={cn("body-with-background")}>
        <div className="backdrop-blur-sm bg-black/60 min-h-screen flex items-center justify-center">
             <ShotChartClient game={gameWithShots} />
        </div>
    </div>
  )
}
