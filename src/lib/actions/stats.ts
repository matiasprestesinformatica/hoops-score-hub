'use server';

import prisma from '@/lib/prisma';
import { calculatePlayerAverages, calculateTeamWinLoss, calculatePlayerTotals, calculateScore } from '@/lib/stats-utils';
import type { Player, PlayerGameStats, Team } from '@prisma/client';
import { transformStatsForFrontend } from '../utils';

export type TeamWithStats = Team & {
  wins: number;
  losses: number;
};

export type PlayerWithStats = {
  player: Player;
  stats: {
    gamesPlayed: number;
    ppg: number; // Points per game
    rpg: number; // Rebounds per game
    apg: number; // Assists per game
  };
};

export type MatchHistory = {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number;
  awayScore: number;
};

export type PlayerAverages = {
    gamesPlayed: number;
    ppg: number;
    rpg: number;
    apg: number;
}

export type PlayerGameLogData = {
    gameId: string;
    opponentName: string;
    result: 'V' | 'D';
    score: string;
    stats: {
        points: number;
        rebounds: number;
        assists: number;
        fouls: number;
        valuation: number;
    }
}

export type TeamSummaryStats = {
    pointsFor: number;
    pointsAgainst: number;
    homeWins: number;
    homeLosses: number;
    awayWins: number;
    awayLosses: number;
}

/**
 * Fetches all teams and calculates their win/loss records.
 */
export async function getAllTeamsWithStats(): Promise<TeamWithStats[]> {
  const teams = await prisma.team.findMany();
  const games = await prisma.game.findMany({
    where: { status: 'FINALIZADO' },
    include: {
      homeTeam: { include: { players: true } },
      awayTeam: { include: { players: true } },
      playerStats: true,
    },
  });

  const gamesWithScores = games.map(game => {
    const homeScore = calculateScore(game.homeTeam.players.map(p => ({ 
        player: p, 
        statsByPeriod: transformStatsForFrontend(game.playerStats.find(ps => ps.playerId === p.id))
    })));
    const awayScore = calculateScore(game.awayTeam.players.map(p => ({
        player: p,
        statsByPeriod: transformStatsForFrontend(game.playerStats.find(ps => ps.playerId === p.id))
    })));
    return { ...game, homeScore, awayScore };
  });

  return teams.map(team => {
    const { wins, losses } = calculateTeamWinLoss(team.id, gamesWithScores);
    return { ...team, wins, losses };
  });
}

/**
 * Fetches detailed information for a single team.
 */
export async function getTeamDetails(teamId: string) {
  const team = await prisma.team.findUnique({ where: { id: teamId } });
  if (!team) return null;

  const players = await prisma.player.findMany({
    where: { teamId },
    include: { gameStats: true },
  });

  const games = await prisma.game.findMany({
    where: {
      status: 'FINALIZADO',
      OR: [{ homeTeamId: teamId }, { awayTeamId: teamId }],
    },
    include: {
      homeTeam: { include: { players: true } },
      awayTeam: { include: { players: true } },
      playerStats: true,
    },
    orderBy: { createdAt: 'desc' },
  });
  
  const gamesWithScores = games.map(g => {
    const homeScore = calculateScore(g.homeTeam.players.map(p => ({ player: p, statsByPeriod: transformStatsForFrontend(g.playerStats.find(ps => ps.playerId === p.id))})));
    const awayScore = calculateScore(g.awayTeam.players.map(p => ({ player: p, statsByPeriod: transformStatsForFrontend(g.playerStats.find(ps => ps.playerId === p.id))})));
    return { ...g, homeScore, awayScore };
  });

  const { wins, losses } = calculateTeamWinLoss(teamId, gamesWithScores);

  const teamWithStats: TeamWithStats = { ...team, wins, losses };

  const playersWithStats: PlayerWithStats[] = players.map(player => {
    const averages = calculatePlayerAverages(player.gameStats);
    return { player, stats: averages };
  });

  const matchHistory: MatchHistory[] = gamesWithScores.map(game => ({
    id: game.id,
    homeTeamId: game.homeTeamId,
    awayTeamId: game.awayTeamId,
    homeTeam: game.homeTeam,
    awayTeam: game.awayTeam,
    homeScore: game.homeScore,
    awayScore: game.awayScore,
  }));

  const summaryStats: TeamSummaryStats = gamesWithScores.reduce((acc, game) => {
    if (game.homeTeamId === teamId) {
        acc.pointsFor += game.homeScore;
        acc.pointsAgainst += game.awayScore;
        if (game.homeScore > game.awayScore) acc.homeWins++; else acc.homeLosses++;
    } else {
        acc.pointsFor += game.awayScore;
        acc.pointsAgainst += game.homeScore;
        if (game.awayScore > game.homeScore) acc.awayWins++; else acc.awayLosses++;
    }
    return acc;
  }, { pointsFor: 0, pointsAgainst: 0, homeWins: 0, homeLosses: 0, awayWins: 0, awayLosses: 0 });

  const gamesPlayed = games.length;
  if (gamesPlayed > 0) {
      summaryStats.pointsFor /= gamesPlayed;
      summaryStats.pointsAgainst /= gamesPlayed;
  }

  return {
    team: teamWithStats,
    playersWithStats,
    matchHistory,
    summaryStats
  };
}


/**
 * Fetches detailed statistics for a single player.
 */
export async function getPlayerDetails(playerId: string) {
    const player = await prisma.player.findUnique({
        where: { id: playerId },
        include: { team: true }
    });

    if (!player) return null;

    const gameStats = await prisma.playerGameStats.findMany({
        where: { playerId },
        include: {
            game: {
                include: {
                    homeTeam: { include: { players: true } },
                    awayTeam: { include: { players: true } },
                    playerStats: true,
                }
            }
        },
        orderBy: { game: { createdAt: 'desc' } }
    });

    const averages = calculatePlayerAverages(gameStats);

    const gameLogs: PlayerGameLogData[] = gameStats
        .filter(gs => gs.game.status === 'FINALIZADO')
        .map(gs => {
            const { game } = gs;
            const isHomeTeam = game.homeTeamId === player.teamId;
            const opponent = isHomeTeam ? game.awayTeam : game.homeTeam;
            
            const homeScore = calculateScore(game.homeTeam.players.map(p => ({ player: p, statsByPeriod: transformStatsForFrontend(game.playerStats.find(ps => ps.playerId === p.id))})));
            const awayScore = calculateScore(game.awayTeam.players.map(p => ({ player: p, statsByPeriod: transformStatsForFrontend(game.playerStats.find(ps => ps.playerId === p.id))})));

            const result = (isHomeTeam && homeScore > awayScore) || (!isHomeTeam && awayScore > homeScore) ? 'V' : 'D';
            
            const playerTotalsInGame = calculatePlayerTotals(transformStatsForFrontend(gs));

            return {
                gameId: game.id,
                opponentName: opponent.name,
                result,
                score: `${homeScore}-${awayScore}`,
                stats: {
                    points: playerTotalsInGame.points,
                    rebounds: playerTotalsInGame.rebounds,
                    assists: playerTotalsInGame.assists,
                    fouls: playerTotalsInGame.fouls,
                    valuation: playerTotalsInGame.valuation,
                }
            }
    });
    
    const performanceData = [...gameLogs]
      .reverse() // Reverse to get chronological order for the chart
      .map(log => ({
        partido: `vs ${log.opponentName}`,
        puntos: log.stats.points,
        rebotes: log.stats.rebounds,
        asistencias: log.stats.assists,
      }));


    return {
        player,
        stats: {
            averages,
            gameLogs,
            performanceData
        }
    }
}
