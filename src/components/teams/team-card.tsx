import Link from 'next/link';
import type { TeamWithStats } from '@/lib/actions/stats';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { getInitials } from '@/lib/utils';

interface TeamCardProps {
  team: TeamWithStats;
}

export function TeamCard({ team }: TeamCardProps) {
  return (
    <Card className="group flex flex-col bg-card border-border text-card-foreground transition-all duration-300 ease-in-out hover:bg-accent hover:border-primary/50">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16 border">
            <AvatarImage src={team.logoUrl ?? undefined} alt={team.name} />
            <AvatarFallback className="text-2xl">{getInitials(team.name)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl text-foreground">{team.name}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex justify-around text-center">
            <div>
                <p className="text-3xl font-bold text-green-500">{team.wins}</p>
                <p className="text-sm text-muted-foreground">Victorias</p>
            </div>
             <div>
                <p className="text-3xl font-bold text-red-500">{team.losses}</p>
                <p className="text-sm text-muted-foreground">Derrotas</p>
            </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant="secondary" className="w-full">
          <Link href={`/equipos/${team.id}`}>
            Ver Perfil del Equipo
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
