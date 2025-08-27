import type { Game, PlayerInGame, PlayerStats } from '@/types';
import type { Player, PlayerGameStats, Team } from '@prisma/client';

export type ShotStats = {
    made: number;
    attempted: number;
};

export type TeamStatsSummary = {
    points1: ShotStats;
    points2: ShotStats;
    points3: ShotStats;
    rebounds: number;
    assists: number;
    fouls: number;
};

export type PlayerTotalsSummary = TeamStatsSummary & {
    points: number;
    valuation: number;
};

export type LeagueLeader = {
    player: Player & { team: Team };
    value: number;
}


/**
 * Aggregates statistics for an entire team from a list of players.
 */
export function aggregateTeamStats(players: PlayerInGame[]): TeamStatsSummary {
  return players.reduce(
    (teamTotals, player) => {
      player.statsByPeriod.forEach((periodStats) => {
        teamTotals.points1.made += periodStats.points1.made;
        teamTotals.points1.attempted += periodStats.points1.attempted;
        teamTotals.points2.made += periodStats.points2.made;
        teamTotals.points2.attempted += periodStats.points2.attempted;
        teamTotals.points3.made += periodStats.points3.made;
        teamTotals.points3.attempted += periodStats.points3.attempted;
        teamTotals.rebounds += periodStats.rebounds;
        teamTotals.assists += periodStats.assists;
        teamTotals.fouls += periodStats.fouls;
      });
      return teamTotals;
    },
    {
      points1: { made: 0, attempted: 0 },
      points2: { made: 0, attempted: 0 },
      points3: { made: 0, attempted: 0 },
      rebounds: 0,
      assists: 0,
      fouls: 0,
    }
  );
}

/**
 * Calculates the valuation score for a player based on their total stats.
 * Formula: (Points + Rebounds + Assists) - (Missed Shots + Fouls)
 */
export function calculateValuation(totals: Omit<PlayerTotalsSummary, 'valuation'>): number {
    const missedShots1 = totals.points1.attempted - totals.points1.made;
    const missedShots2 = totals.points2.attempted - totals.points2.made;
    const missedShots3 = totals.points3.attempted - totals.points3.made;
    const totalMissedShots = missedShots1 + missedShots2 + missedShots3;

    const valuation = 
        totals.points + 
        totals.rebounds + 
        totals.assists - 
        (totalMissedShots + totals.fouls);

    return valuation;
}


/**
 * Calculates total stats for a single player across all periods.
 */
export function calculatePlayerTotals(statsByPeriod: readonly PlayerStats[]): PlayerTotalsSummary {
    const totals = statsByPeriod.reduce(
        (acc: Omit<PlayerTotalsSummary, 'valuation'>, period) => {
            acc.points += period.points1.made + period.points2.made * 2 + period.points3.made * 3;
            acc.rebounds += period.rebounds;
            acc.assists += period.assists;
            acc.fouls += period.fouls;
            acc.points1.made += period.points1.made;
            acc.points1.attempted += period.points1.attempted;
            acc.points2.made += period.points2.made;
            acc.points2.attempted += period.points2.attempted;
            acc.points3.made += period.points3.made;
            acc.points3.attempted += period.points3.attempted;
            return acc;
        },
        { 
            points: 0, 
            rebounds: 0, 
            assists: 0, 
            fouls: 0,
            points1: { made: 0, attempted: 0 },
            points2: { made: 0, attempted: 0 },
            points3: { made: 0, attempted: 0 },
        }
    );

    const valuation = calculateValuation(totals);
    
    return { ...totals, valuation };
}


/**
 * Calculates the score for each of the 4 periods for a given team.
 * @returns An array of 5 numbers: [p1_score, p2_score, p3_score, p4_score, total_score]
 */
export function calculateScoresByPeriod(players: PlayerInGame[]): [number, number, number, number, number] {
  const periodScores = [0, 0, 0, 0];

  players.forEach(player => {
    player.statsByPeriod.forEach((periodStats, i) => {
      if (i < 4) {
        const points = 
          periodStats.points1.made + 
          periodStats.points2.made * 2 + 
          periodStats.points3.made * 3;
        periodScores[i] += points;
      }
    });
  });

  const totalScore = periodScores.reduce((acc, score) => acc + score, 0);

  return [...periodScores, totalScore] as [number, number, number, number, number];
}


/**
 * Calculates the league leaders for points, rebounds, and assists per game.
 * Returns the top 5 for each category.
 */
export function calculateLeagueLeaders(
  allPlayerStats: (PlayerGameStats & { player: Player & { team: Team } })[],
  gameCounts: Record<string, number>
): {
  points: LeagueLeader[];
  rebounds: LeagueLeader[];
  assists: LeagueLeader[];
} {
    
  const aggregatedStats: Record<string, { totalPoints: number; totalRebounds: number; totalAssists: number; gamesPlayed: number, player: Player & { team: Team } }> = {};

  allPlayerStats.forEach(stat => {
    const { playerId, player } = stat;

    if (!aggregatedStats[playerId]) {
      aggregatedStats[playerId] = {
        totalPoints: 0,
        totalRebounds: 0,
        totalAssists: 0,
        gamesPlayed: gameCounts[playerId],
        player: player,
      };
    }

    const points = (stat.p1_points1_made + stat.p2_points1_made + stat.p3_points1_made + stat.p4_points1_made) * 1 +
                   (stat.p1_points2_made + stat.p2_points2_made + stat.p3_points2_made + stat.p4_points2_made) * 2 +
                   (stat.p1_points3_made + stat.p2_points3_made + stat.p3_points3_made + stat.p4_points3_made) * 3;

    const rebounds = stat.p1_rebounds + stat.p2_rebounds + stat.p3_rebounds + stat.p4_rebounds;
    const assists = stat.p1_assists + stat.p2_assists + stat.p3_assists + stat.p4_assists;

    aggregatedStats[playerId].totalPoints += points;
    aggregatedStats[playerId].totalRebounds += rebounds;
    aggregatedStats[playerId].totalAssists += assists;
  });

  const playerAverages = Object.values(aggregatedStats).map(data => ({
    player: data.player,
    ppg: data.gamesPlayed > 0 ? data.totalPoints / data.gamesPlayed : 0,
    rpg: data.gamesPlayed > 0 ? data.totalRebounds / data.gamesPlayed : 0,
    apg: data.gamesPlayed > 0 ? data.totalAssists / data.gamesPlayed : 0,
  }));
  
  if (playerAverages.length === 0) {
      return { points: [], rebounds: [], assists: [] };
  }

  const findTop5 = (key: 'ppg' | 'rpg' | 'apg'): LeagueLeader[] => {
      if (playerAverages.length === 0) return [];
      
      return [...playerAverages]
        .sort((a, b) => b[key] - a[key])
        .slice(0, 5)
        .map(p => ({ player: p.player, value: p[key] }))
        .filter(p => p.value > 0); // Only include players with a non-zero average
  };

  return {
    points: findTop5('ppg'),
    rebounds: findTop5('rpg'),
    assists: findTop5('apg'),
  };
}

/**
 * Calculates the win/loss record for a specific team.
 */
export function calculateTeamWinLoss(teamId: string, games: { homeTeamId: string, awayTeamId: string, homeScore: number, awayScore: number }[]) {
    return games.reduce(
        (acc, game) => {
            if (game.homeTeamId === teamId) {
                if (game.homeScore > game.awayScore) acc.wins++;
                else if (game.homeScore < game.awayScore) acc.losses++;
            } else if (game.awayTeamId === teamId) {
                if (game.awayScore > game.homeScore) acc.wins++;
                else if (game.awayScore < game.homeScore) acc.losses++;
            }
            return acc;
        },
        { wins: 0, losses: 0 }
    );
}

/**
 * Calculates per-game averages for a player from all their game stats.
 */
export function calculatePlayerAverages(gameStats: PlayerGameStats[]) {
    const gamesPlayed = gameStats.length;
    if (gamesPlayed === 0) {
        return { gamesPlayed: 0, ppg: 0, rpg: 0, apg: 0 };
    }

    const totals = gameStats.reduce(
        (acc, stats) => {
            const points = 
                (stats.p1_points1_made + stats.p2_points1_made + stats.p3_points1_made + stats.p4_points1_made) * 1 +
                (stats.p1_points2_made + stats.p2_points2_made + stats.p3_points2_made + stats.p4_points2_made) * 2 +
                (stats.p1_points3_made + stats.p2_points3_made + stats.p3_points3_made + stats.p4_points3_made) * 3;
            
            acc.totalPoints += points;
            acc.totalRebounds += stats.p1_rebounds + stats.p2_rebounds + stats.p3_rebounds + stats.p4_rebounds;
            acc.totalAssists += stats.p1_assists + stats.p2_assists + stats.p3_assists + stats.p4_assists;
            return acc;
        },
        { totalPoints: 0, totalRebounds: 0, totalAssists: 0 }
    );

    return {
        gamesPlayed,
        ppg: totals.totalPoints / gamesPlayed,
        rpg: totals.totalRebounds / gamesPlayed,
        apg: totals.totalAssists / gamesPlayed,
    };
}

export const calculateScore = (players: PlayerInGame[]) => {
  if (!players) return 0;
  return players.reduce((totalScore, gamePlayer) => {
    if (!gamePlayer || !gamePlayer.statsByPeriod) return totalScore;
    const playerPoints = gamePlayer.statsByPeriod.reduce((periodScore: number, periodStats: PlayerStats) => {
      const points =
        (periodStats.points1.made * 1) +
        (periodStats.points2.made * 2) +
        (periodStats.points3.made * 3);
      return periodScore + points;
    }, 0);
    return totalScore + playerPoints;
  }, 0);
};

export function calculateScoreProgression(game: Game) {
  const progression = [
    { period: 'P0', [game.teamA.name]: 0, [game.teamB.name]: 0 },
  ];
  let teamACumulative = 0;
  let teamBCumulative = 0;

  for (let i = 0; i < 4; i++) {
    const periodNum = i + 1;
    const teamAScoreThisPeriod = game.teamA.players.reduce((sum, p) => sum + (
        p.statsByPeriod[i].points1.made * 1 +
        p.statsByPeriod[i].points2.made * 2 +
        p.statsByPeriod[i].points3.made * 3
    ), 0);
    const teamBScoreThisPeriod = game.teamB.players.reduce((sum, p) => sum + (
        p.statsByPeriod[i].points1.made * 1 +
        p.statsByPeriod[i].points2.made * 2 +
        p.statsByPeriod[i].points3.made * 3
    ), 0);

    teamACumulative += teamAScoreThisPeriod;
    teamBCumulative += teamBScoreThisPeriod;

    progression.push({
      period: `P${periodNum}`,
      [game.teamA.name]: teamACumulative,
      [game.teamB.name]: teamBCumulative,
    });
  }

  return progression;
}
