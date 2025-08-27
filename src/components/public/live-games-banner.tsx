import { Badge } from '@/components/ui/badge';
import { Clock, Eye } from 'lucide-react';

// Mock data para desarrollo
const liveGames = [
  {
    id: '1',
    homeTeam: 'Lakers',
    awayTeam: 'Warriors',
    homeScore: 85,
    awayScore: 92,
    period: '4Q',
    timeRemaining: '2:45',
    viewers: 1542
  }
];

export function LiveGamesBanner() {
  if (liveGames.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-primary/80 via-primary to-primary/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="destructive" className="animate-pulse">
              🔴 EN VIVO
            </Badge>
            <span className="text-white font-medium">
              {liveGames[0].homeTeam} vs {liveGames[0].awayTeam}
            </span>
          </div>
          
          <div className="flex items-center gap-6 text-white">
            <div className="text-lg font-bold">
              {liveGames[0].homeScore} - {liveGames[0].awayScore}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              {liveGames[0].period} {liveGames[0].timeRemaining}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Eye className="h-4 w-4" />
              {liveGames[0].viewers}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}