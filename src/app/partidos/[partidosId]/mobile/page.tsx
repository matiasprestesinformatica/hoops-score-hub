import { getGameById } from '@/lib/actions/game';
import { MobileGameClient } from '@/components/mobile/mobile-game-client';
import { notFound } from 'next/navigation';
import { cn } from '@/lib/utils';

interface LiveGameMobilePageProps {
  params: {
    partidosId: string;
  };
}

// NOTE: This test page will reuse the main mobile client for demonstration
export default async function LiveGameMobilePage({ params }: LiveGameMobilePageProps) {
  const game = await getGameById(params.partidosId);

  if (!game) {
    notFound();
  }

  // We can render the main mobile client here as well, since it's fully functional
  return (
    <div className={cn("body-with-background")}>
        <div className="backdrop-blur-sm bg-black/60 min-h-screen">
            <MobileGameClient game={game} />
        </div>
    </div>
  );
}
