import { getGameById } from '@/lib/actions/game';
import { notFound } from 'next/navigation';
import { cn } from '@/lib/utils';
import { PartidosClient } from '@/components/partidos/partidos-client';

interface PartidosPageProps {
  params: {
    partidosId: string;
  };
}

export default async function PartidosPage({ params }: PartidosPageProps) {
  const game = await getGameById(params.partidosId);

  if (!game) {
    notFound();
  }

  return (
    <div className={cn("body-with-background")}>
      <div className="backdrop-blur-sm bg-black/60 min-h-screen text-white">
        <PartidosClient game={game} />
      </div>
    </div>
  )
}
