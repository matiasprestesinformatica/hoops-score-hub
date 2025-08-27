import type { Game } from '@/types';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dribbble, Star } from 'lucide-react';
import { getInitials } from '@/lib/utils';
import { calculateScore } from '@/lib/stats-utils';
import { format } from 'date-fns';
import { Button } from '../ui/button';

interface GameHeaderProps {
  game: Game;
}

const TeamDisplay = ({ team, className }: { team: Game['teamA'], className?: string }) => (
    <div className={`hidden md:flex flex-col items-center gap-2 text-center w-full md:w-1/3 ${className}`}>
        <Avatar className="w-20 h-20 md:w-24 md:h-24 border-4 border-white shadow-lg">
            <AvatarImage src={team.logoUrl ?? undefined} alt={team.name} />
            <AvatarFallback className="text-3xl">{getInitials(team.name)}</AvatarFallback>
        </Avatar>
        <h2 className="text-lg md:text-xl font-bold uppercase tracking-wider text-gray-100">{team.name}</h2>
    </div>
);


export function GameHeader({ game }: GameHeaderProps) {
    const teamAScore = calculateScore(game.teamA.players);
    const teamBScore = calculateScore(game.teamB.players);

    const date = new Date(game.createdAt);
    const dayOfWeek = format(date, 'eeee');
    const fullDate = format(date, 'dd/MM/yyyy');
    const time = format(date, 'HH:mm');
    
    return (
        <Card className="w-full max-w-2xl mx-auto overflow-hidden shadow-lg bg-black/30 backdrop-blur-lg border border-white/20 text-gray-200">
            <div className="p-4 md:p-6 flex flex-col md:flex-row items-center justify-between relative gap-4 md:gap-0">
                <TeamDisplay team={game.teamA} />
                
                <div className="flex-1 flex flex-col items-center justify-center text-center px-0 md:px-4 w-full">
                    <Badge className="bg-primary hover:bg-primary/90 text-primary-foreground mb-2 text-sm md:text-base px-3 py-1 md:px-4 md:py-2 rounded-full">
                        <Dribbble className="w-4 h-4 mr-2" />
                        Terminado
                    </Badge>

                    {/* Score section with responsive logos */}
                    <div className="flex items-center justify-center w-full gap-2">
                        {/* Mobile Logo A */}
                        <Avatar className="w-12 h-12 md:hidden border-2 border-white/50 shadow-md">
                            <AvatarImage src={game.teamA.logoUrl ?? undefined} alt={game.teamA.name} />
                            <AvatarFallback>{getInitials(game.teamA.name)}</AvatarFallback>
                        </Avatar>

                        {/* Scores */}
                        <div className="flex items-center gap-2 md:gap-4">
                            <span className="text-5xl md:text-6xl font-bold text-primary">{teamAScore}</span>
                            <span className="text-3xl md:text-4xl text-muted-foreground">-</span>
                            <span className="text-5xl md:text-6xl font-bold text-gray-100">{teamBScore}</span>
                        </div>
                        
                        {/* Mobile Logo B */}
                        <Avatar className="w-12 h-12 md:hidden border-2 border-white/50 shadow-md">
                            <AvatarImage src={game.teamB.logoUrl ?? undefined} alt={game.teamB.name} />
                            <AvatarFallback>{getInitials(game.teamB.name)}</AvatarFallback>
                        </Avatar>
                    </div>

                    {/* Mobile Team Names */}
                    <div className="flex md:hidden justify-between w-full max-w-xs mt-2">
                        <span className="w-1/2 text-center font-semibold uppercase truncate text-gray-100">{game.teamA.name}</span>
                        <span className="w-1/2 text-center font-semibold uppercase truncate text-gray-100">{game.teamB.name}</span>
                    </div>

                    <div className="text-muted-foreground mt-2 text-xs md:text-sm text-gray-300">
                        <p className="capitalize">{dayOfWeek}</p>
                        <p>{fullDate} - {time}</p>
                    </div>
                </div>

                <TeamDisplay team={game.teamB} />
                <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground hover:text-amber-400">
                    <Star className="w-5 h-5" />
                </Button>
            </div>
        </Card>
    )
}
