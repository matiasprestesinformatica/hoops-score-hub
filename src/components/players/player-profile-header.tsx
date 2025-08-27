import type { Player, Team } from '@prisma/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';
import { Card, CardContent } from '../ui/card';

interface PlayerProfileHeaderProps {
  player: Player & { team: Team | null };
}

export function PlayerProfileHeader({ player }: PlayerProfileHeaderProps) {
  return (
    <Card className="bg-card border-border">
      <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
        <Avatar className="w-32 h-32 border-4 border-primary">
            <AvatarImage src={player.imageUrl ?? undefined} alt={player.name} />
            <AvatarFallback className="text-4xl">{getInitials(player.name)}</AvatarFallback>
        </Avatar>
        <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">{player.name}</h1>
            <p className="text-2xl text-primary font-semibold">#{player.jerseyNumber}</p>
            <p className="text-xl text-muted-foreground mt-1">{player.team?.name || 'Sin Equipo'}</p>
        </div>
      </CardContent>
    </Card>
  );
}
