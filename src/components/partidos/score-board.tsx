import type { Game } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { getInitials } from '@/lib/utils';

interface ScoreBoardProps {
  homeScore: number
  guestScore: number
  period: number
  homeTeam: Game['teamA']
  guestTeam: Game['teamB']
}

const SevenSegmentDisplay = ({ value }: { value: string }) => {
    return (
        <div className="font-mono text-5xl text-amber-400 relative bg-black p-1 rounded-md shadow-inner shadow-black/50">
            <span className="opacity-20">88</span>
            <span className="absolute inset-0 flex items-center justify-center tracking-normal">{value}</span>
        </div>
    );
};

const PeriodDisplay = ({ value }: { value: number }) => {
    return (
        <div className="font-mono text-3xl text-amber-400 relative bg-black p-1 rounded-md shadow-inner shadow-black/50 w-10 text-center">
             <span className="opacity-20">8</span>
            <span className="absolute inset-0 flex items-center justify-center">{value}</span>
        </div>
    );
};


export function ScoreBoard({ homeScore, guestScore, period, homeTeam, guestTeam }: ScoreBoardProps) {
  const formatScore = (score: number) => {
    return score.toString().padStart(2, "0")
  }

  return (
    <div className="bg-neutral-800/60 backdrop-blur-md border border-neutral-700/50 rounded-lg p-2 shadow-lg flex items-center justify-around gap-2 w-full">
      <Avatar className="h-10 w-10 border border-amber-600/50">
        <AvatarImage src={homeTeam.logoUrl ?? undefined} alt={homeTeam.name} />
        <AvatarFallback>{getInitials(homeTeam.name)}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col items-center flex-1">
        <span className="text-sm font-semibold text-amber-200 mb-1 uppercase truncate w-full text-center" title={homeTeam.name}>
          {homeTeam.name}
        </span>
        <SevenSegmentDisplay value={formatScore(homeScore)} />
      </div>
       <div className="flex flex-col items-center gap-1">
        <span className="text-xs font-semibold text-amber-200 uppercase">Período</span>
        <PeriodDisplay value={period} />
      </div>
      <div className="flex flex-col items-center flex-1">
        <span className="text-sm font-semibold text-amber-200 mb-1 uppercase truncate w-full text-center" title={guestTeam.name}>
          {guestTeam.name}
        </span>
        <SevenSegmentDisplay value={formatScore(guestScore)} />
      </div>
      <Avatar className="h-10 w-10 border border-amber-600/50">
        <AvatarImage src={guestTeam.logoUrl ?? undefined} alt={guestTeam.name} />
        <AvatarFallback>{getInitials(guestTeam.name)}</AvatarFallback>
      </Avatar>
    </div>
  )
}
