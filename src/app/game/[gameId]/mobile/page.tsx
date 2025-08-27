import { getGameById } from '@/lib/actions/game';
import { MobileGameClient } from '@/components/mobile/mobile-game-client';
import { notFound } from 'next/navigation';
import { cn } from '@/lib/utils';

interface LiveGameMobilePageProps {
  params: {
    gameId: string;
  };
}

export default async function LiveGameMobilePage({ params }: LiveGameMobilePageProps) {
  const game = await getGameById(params.gameId);

  if (!game) {
    notFound();
  }

  return (
    <div className={cn("body-with-background")}>
        <div className="backdrop-blur-sm bg-black/60 min-h-screen">
            <MobileGameClient game={game} />
        </div>
    </div>
  );
}
