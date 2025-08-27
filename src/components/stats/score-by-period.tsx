import type { TeamInGame } from '@/types';
import { Card } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { getInitials } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface ScoreByPeriodProps {
  teamA: TeamInGame;
  teamB: TeamInGame;
  teamAScores: [number, number, number, number, number];
  teamBScores: [number, number, number, number, number];
}

const TeamScoreRow = ({ team, scores, isWinner }: { team: TeamInGame, scores: number[], isWinner: boolean }) => (
    <div className="flex items-center w-full max-w-md">
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <Avatar className="w-8 h-8">
                <AvatarImage src={team.logoUrl ?? undefined} alt={team.name} />
                <AvatarFallback>{getInitials(team.name)}</AvatarFallback>
            </Avatar>
            <span className="font-semibold text-sm md:text-base truncate text-gray-100">{team.name}</span>
        </div>
        <div className="flex items-center justify-end gap-1 sm:gap-3 font-mono text-sm md:text-base">
            {scores.slice(0, 4).map((score, index) => (
                <span key={index} className={cn("w-8 text-center", isWinner ? 'text-gray-100' : 'text-gray-400')}>
                    {score}
                </span>
            ))}
            <span className={cn("w-10 text-center font-bold", isWinner ? 'text-primary' : 'text-gray-100')}>
                {scores[4]}
            </span>
        </div>
    </div>
)

export function ScoreByPeriod({ teamA, teamB, teamAScores, teamBScores }: ScoreByPeriodProps) {
  const isTeamAWinner = teamAScores[4] > teamBScores[4];
  const isTeamBWinner = teamBScores[4] > teamAScores[4];

  return (
    <Card className="w-full max-w-2xl mx-auto mt-4 bg-black/30 backdrop-blur-lg border border-white/20 text-gray-200">
        <div className="p-4 flex flex-col gap-3 items-center">
            <div className="flex w-full max-w-md">
                <div className="flex-1"></div>
                <div className="flex justify-end gap-1 sm:gap-3 font-mono text-xs font-semibold text-gray-400">
                    <span className="w-8 text-center">1</span>
                    <span className="w-8 text-center">2</span>
                    <span className="w-8 text-center">3</span>
                    <span className="w-8 text-center">4</span>
                    <span className="w-10 text-center">T</span>
                </div>
            </div>
            <TeamScoreRow team={teamA} scores={teamAScores} isWinner={isTeamAWinner} />
            <TeamScoreRow team={teamB} scores={teamBScores} isWinner={isTeamBWinner} />
        </div>
    </Card>
  );
}
