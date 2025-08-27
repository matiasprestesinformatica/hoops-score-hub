import type { TeamWithStats } from '@/lib/actions/stats';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { getInitials } from '@/lib/utils';

interface TeamProfileHeaderProps {
  team: TeamWithStats;
}

export function TeamProfileHeader({ team }: TeamProfileHeaderProps) {
  return (
    <Card className="bg-card border-border">
      <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
        <Avatar className="w-32 h-32 border-4 border-primary">
          <AvatarImage src={team.logoUrl ?? undefined} alt={team.name} />
          <AvatarFallback className="text-4xl">{getInitials(team.name)}</AvatarFallback>
        </Avatar>
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">{team.name}</h1>
          <p className="text-2xl text-muted-foreground mt-2">
            Récord: <span className="font-bold text-green-500">{team.wins}V</span> - <span className="font-bold text-red-500">{team.losses}D</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
