import { getGameById } from '@/lib/actions/game';
import { notFound } from 'next/navigation';
import { cn } from '@/lib/utils';
import { PublicGameView } from '@/components/public-game-view';

interface PublicGamePageProps {
  params: {
    gameId: string;
  };
}

export default async function PublicGamePage({ params }: PublicGamePageProps) {
  const game = await getGameById(params.gameId);

  if (!game) {
    notFound();
  }

  return (
    <div className={cn("body-with-background")}>
        <div className="backdrop-blur-sm bg-black/60 min-h-screen flex items-center justify-center">
             <PublicGameView initialGame={game} />
        </div>
    </div>
  );
}
