import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { PlayerInGame, PlayerStats } from "@/types";
import type { PlayerGameStats } from "@prisma/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const calculateScore = (players: PlayerInGame[]) => {
  if (!players) return 0;
  return players.reduce((totalScore, gamePlayer) => {
    if (!gamePlayer || !gamePlayer.statsByPeriod) return totalScore;
    const playerPoints = gamePlayer.statsByPeriod.reduce((periodScore, periodStats) => {
      const points =
        (periodStats.points1.made * 1) +
        (periodStats.points2.made * 2) +
        (periodStats.points3.made * 3);
      return periodScore + points;
    }, 0);
    return totalScore + playerPoints;
  }, 0);
};

export const getInitials = (name: string) => {
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

type StatsSource = Omit<PlayerGameStats, 'id' | 'gameId' | 'playerId'>;

// Helper to transform Prisma PlayerGameStats to frontend PlayerStats array
export const transformStatsForFrontend = (stats: StatsSource | undefined | null): [PlayerStats, PlayerStats, PlayerStats, PlayerStats] => {
  const defaultPeriod: PlayerStats = { points1: {made:0, attempted:0}, points2: {made:0, attempted:0}, points3: {made:0, attempted:0}, rebounds:0, assists:0, fouls:0};
  if (!stats) return [
    JSON.parse(JSON.stringify(defaultPeriod)), 
    JSON.parse(JSON.stringify(defaultPeriod)), 
    JSON.parse(JSON.stringify(defaultPeriod)), 
    JSON.parse(JSON.stringify(defaultPeriod))
  ];
  
  const periods: PlayerStats[] = [];
  for (let i = 1; i <= 4; i++) {
    const p = i as 1 | 2 | 3 | 4;
    periods.push({
      points1: { made: stats[`p${p}_points1_made`], attempted: stats[`p${p}_points1_attempted`] },
      points2: { made: stats[`p${p}_points2_made`], attempted: stats[`p${p}_points2_attempted`] },
      points3: { made: stats[`p${p}_points3_made`], attempted: stats[`p${p}_points3_attempted`] },
      rebounds: stats[`p${p}_rebounds`],
      assists: stats[`p${p}_assists`],
      fouls: stats[`p${p}_fouls`],
    });
  }
  return periods as [PlayerStats, PlayerStats, PlayerStats, PlayerStats];
};
