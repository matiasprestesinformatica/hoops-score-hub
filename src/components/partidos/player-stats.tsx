import { PlayerInGame } from "@/types";

interface PlayerStatsProps {
  playerInGame: PlayerInGame | null;
}

export function PlayerStats({ playerInGame }: PlayerStatsProps) {
  const calculateTotals = () => {
    if (!playerInGame) {
      return {
        totalPoints: 0,
        twoPointsMade: 0,
        twoPointsAttempted: 0,
        threePointsMade: 0,
        threePointsAttempted: 0,
        freeThrowsMade: 0,
        freeThrowsAttempted: 0,
      };
    }

    return playerInGame.statsByPeriod.reduce(
      (acc, period) => {
        acc.totalPoints += period.points1.made + period.points2.made * 2 + period.points3.made * 3;
        acc.twoPointsMade += period.points2.made;
        acc.twoPointsAttempted += period.points2.attempted;
        acc.threePointsMade += period.points3.made;
        acc.threePointsAttempted += period.points3.attempted;
        acc.freeThrowsMade += period.points1.made;
        acc.freeThrowsAttempted += period.points1.attempted;
        return acc;
      },
      {
        totalPoints: 0,
        twoPointsMade: 0,
        twoPointsAttempted: 0,
        threePointsMade: 0,
        threePointsAttempted: 0,
        freeThrowsMade: 0,
        freeThrowsAttempted: 0,
      }
    );
  };
  
  const stats = calculateTotals();

  if (!playerInGame) {
    return (
      <div className="bg-black/40 backdrop-blur-md rounded-lg p-2 w-full text-center">
        <p className="text-sm text-muted-foreground">Selecciona un jugador</p>
      </div>
    );
  }

  return (
    <div className="bg-black/40 backdrop-blur-md rounded-lg p-2 w-full">
       <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="bg-primary text-primary-foreground font-bold text-lg rounded-md w-8 h-8 flex items-center justify-center flex-shrink-0">
            {playerInGame.player.number}
          </div>
          <div className="text-base font-semibold truncate">{playerInGame.player.name}</div>
        </div>
        <div className="grid grid-cols-4 gap-x-2 text-center text-xs">
          <div>
            <div className="font-bold text-lg">{stats.totalPoints}</div>
            <div className="text-muted-foreground">PTS</div>
          </div>
          <div>
            <div className="font-bold text-lg">{`${stats.twoPointsMade}/${stats.twoPointsAttempted}`}</div>
            <div className="text-muted-foreground">T2</div>
          </div>
          <div>
            <div className="font-bold text-lg">{`${stats.threePointsMade}/${stats.threePointsAttempted}`}</div>
            <div className="text-muted-foreground">T3</div>
          </div>
           <div>
            <div className="font-bold text-lg">{`${stats.freeThrowsMade}/${stats.freeThrowsAttempted}`}</div>
            <div className="text-muted-foreground">TL</div>
          </div>
        </div>
       </div>
    </div>
  )
}
