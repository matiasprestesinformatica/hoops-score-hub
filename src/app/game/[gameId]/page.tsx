import { getGameById } from '@/lib/actions/game';
import { GameClient } from '@/components/game-client';
import { notFound } from 'next/navigation';
import { cn } from '@/lib/utils';

interface LiveGamePageProps {
  params: {
    gameId: string;
  };
}

export default async function LiveGamePage({ params }: LiveGamePageProps) {
  const game = await getGameById(params.gameId);

  // Si no se encuentra el partido, se muestra la página 404.
  // Esto asegura que `GameClient` siempre reciba un objeto `game` válido.
  if (!game) {
    notFound();
  }

  return (
    <div className={cn("body-with-background")}>
        <div className="bg-background/80 backdrop-blur-sm min-h-screen">
             <GameClient game={game} />
        </div>
    </div>
  )
}
