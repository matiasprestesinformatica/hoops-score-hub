import type { LeagueLeader } from '@/lib/stats-utils';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface LeaderCardProps {
  category: string;
  leader: LeagueLeader | null;
  icon: React.ReactNode;
}

const getInitials = (name: string) => {
    if (!name) return "";
    const names = name.split(' ');
    if (names.length > 1 && names[1]) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    if (name.length > 1) {
      return name.substring(0, 2).toUpperCase();
    }
    return name.toUpperCase();
}

export function LeaderCard({ category, leader, icon }: LeaderCardProps) {
  return (
    <Card className="text-center shadow-lg hover:shadow-primary/20 transition-shadow">
      <CardHeader>
        <div className="flex justify-center items-center gap-2">
          {icon}
          <CardTitle className="text-2xl">{category}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        {leader ? (
            <>
                <Avatar className="w-24 h-24 border-4 border-primary/50">
                    <AvatarImage src={leader.player.imageUrl ?? undefined} alt={leader.player.name} />
                    <AvatarFallback className="text-3xl">
                        {getInitials(leader.player.name)}
                    </AvatarFallback>
                </Avatar>
                <div className="text-center">
                    <p className="text-2xl font-bold">{leader.player.name}</p>
                    <p className="text-muted-foreground">{leader.player.team.name}</p>
                </div>
                <p className="text-5xl font-bold text-primary font-mono">
                    {leader.value.toFixed(1)}
                </p>
            </>
        ) : (
            <div className="flex flex-col items-center justify-center h-48">
                <p className="text-muted-foreground">No hay datos suficientes.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
