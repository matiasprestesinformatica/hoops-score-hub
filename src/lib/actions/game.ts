'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import type { Game, PlayerInGame, PlayerStats, TeamInGame, GameStatus, ActionPayload } from '@/types';
import type { Player, PlayerGameStats, Team } from '@prisma/client';
import { simulateGameStats } from '@/ai/flows/simulate-game-stats';
import { calculateScore, transformStatsForFrontend } from '../utils';

// Helper function to create initial stats for a player for all 4 periods
const createInitialStatsArray = (): [PlayerStats, PlayerStats, PlayerStats, PlayerStats] => {
  const initialPeriodStats: PlayerStats = {
    points1: { made: 0, attempted: 0 },
    points2: { made: 0, attempted: 0 },
    points3: { made: 0, attempted: 0 },
    rebounds: 0,
    assists: 0,
    fouls: 0,
  };
  return [
    JSON.parse(JSON.stringify(initialPeriodStats)),
    JSON.parse(JSON.stringify(initialPeriodStats)),
    JSON.parse(JSON.stringify(initialPeriodStats)),
    JSON.parse(JSON.stringify(initialPeriodStats)),
  ];
};

// Define a more specific type for the game object coming from Prisma
type PrismaGame = Awaited<ReturnType<typeof prisma.game.findUnique>> & {
  homeTeam: Team & { players: Player[] };
  awayTeam: Team & { players: Player[] };
  playerStats: PlayerGameStats[];
};

// Helper to transform a full Prisma Game object to the frontend Game type
const transformGameForFrontend = (game: PrismaGame): Game => {
    const teamAPlayers: PlayerInGame[] = game.homeTeam.players.map((p) => {
        const stats = game.playerStats.find((ps) => ps.playerId === p.id);
        return {
            player: { id: p.id, name: p.name, number: p.jerseyNumber, imageUrl: p.imageUrl },
            statsByPeriod: stats ? transformStatsForFrontend(stats) : createInitialStatsArray(),
        }
    });

    const teamBPlayers: PlayerInGame[] = game.awayTeam.players.map((p) => {
        const stats = game.playerStats.find((ps) => ps.playerId === p.id);
        return {
            player: { id: p.id, name: p.name, number: p.jerseyNumber, imageUrl: p.imageUrl },
            statsByPeriod: stats ? transformStatsForFrontend(stats) : createInitialStatsArray(),
        }
    });

    const teamA: TeamInGame = {
        id: game.homeTeam.id,
        name: game.homeTeam.name,
        logoUrl: game.homeTeam.logoUrl,
        players: teamAPlayers,
    };

    const teamB: TeamInGame = {
        id: game.awayTeam.id,
        name: game.awayTeam.name,
        logoUrl: game.awayTeam.logoUrl,
        players: teamBPlayers,
    };

    return {
        id: game.id,
        createdAt: game.createdAt.toISOString(),
        teamA,
        teamB,
        currentPeriod: game.currentPeriod as 1 | 2 | 3 | 4,
        status: game.status as GameStatus,
        plays: [], // Plays are transient and not stored in the DB
    };
};


export async function getGames() {
    const games = await prisma.game.findMany({
        include: {
            homeTeam: { include: { players: true } },
            awayTeam: { include: { players: true } },
            playerStats: true,
        },
        orderBy: {
            createdAt: 'desc',
        }
    });
    return games.map(game => transformGameForFrontend(game as PrismaGame));
}

export async function getLiveGames() {
    const games = await prisma.game.findMany({
        where: {
          status: 'EN_VIVO'
        },
        include: {
            homeTeam: { include: { players: true } },
            awayTeam: { include: { players: true } },
            playerStats: true,
        },
        orderBy: {
            createdAt: 'desc',
        }
    });
    return games.map(game => transformGameForFrontend(game as PrismaGame));
}

export async function getGameById(gameId: string) {
  const game = await prisma.game.findUnique({
    where: { id: gameId },
    include: {
      homeTeam: { include: { players: true } },
      awayTeam: { include: { players: true } },
      playerStats: true,
    },
  });

  if (!game) {
    return null;
  }

  return transformGameForFrontend(game as PrismaGame);
}

export async function createGame(teamAId: string, teamBId: string) {
  const game = await prisma.game.create({
    data: {
      homeTeamId: teamAId,
      awayTeamId: teamBId,
      status: 'Programado',
      currentPeriod: 1, 
    },
    include: {
      homeTeam: { include: { players: true } },
      awayTeam: { include: { players: true } },
    }
  });

  const allPlayers = [...game.homeTeam.players, ...game.awayTeam.players];
  
  if (allPlayers.length > 0) {
    await prisma.playerGameStats.createMany({
      data: allPlayers.map(player => ({
        gameId: game.id,
        playerId: player.id,
      })),
    });
  }
  
  revalidatePath('/game');
  return game.id;
}


export async function deleteGame(gameId: string) {
    await prisma.game.delete({
        where: { id: gameId },
    });
    revalidatePath('/game');
}


export async function updateGameStatus(gameId: string, status: GameStatus) {
    await prisma.game.update({
        where: { id: gameId },
        data: { status },
    });
    revalidatePath(`/game/${gameId}`);
    revalidatePath('/game');
}

export async function updateCurrentPeriod(gameId: string, period: 1 | 2 | 3 | 4) {
    await prisma.game.update({
        where: { id: gameId },
        data: { 
            currentPeriod: period 
        },
    });
    // Don't revalidate the game page itself to avoid overwriting local state
    revalidatePath('/game');
}

export async function createAndSimulateGame(teamAId: string, teamBId: string, gameContext: string) {
  const newGameId = await createGame(teamAId, teamBId);
  if (!newGameId) throw new Error('Failed to create a new game.');

  const gameData = await prisma.game.findUnique({
    where: { id: newGameId },
    include: {
      homeTeam: { include: { players: true } },
      awayTeam: { include: { players: true } },
    },
  });
  if (!gameData) throw new Error('Failed to fetch newly created game data.');

  const teamAPlayers = gameData.homeTeam.players.map(p => ({ id: p.id, name: p.name }));
  const teamBPlayers = gameData.awayTeam.players.map(p => ({ id: p.id, name: p.name }));
  
  let teamAContext: string;
  let teamBContext: string;

  // Determine winner/loser roles based on game context
  if (gameContext === "Un equipo domina al otro") {
      // Randomly decide which team dominates
      if (Math.random() > 0.5) {
        teamAContext = "Equipo ganador";
        teamBContext = "Equipo perdedor";
      } else {
        teamAContext = "Equipo perdedor";
        teamBContext = "Equipo ganador";
      }
  } else {
      // For "Partido igualado" or other neutral contexts
      teamAContext = "Partido igualado";
      teamBContext = "Partido igualado";
  }

  const [teamAStats, teamBStats] = await Promise.all([
    simulateGameStats({ players: teamAPlayers, teamName: gameData.homeTeam.name, gameContext, teamContext: teamAContext }),
    simulateGameStats({ players: teamBPlayers, teamName: gameData.awayTeam.name, gameContext, teamContext: teamBContext }),
  ]);

  const allSimulatedStats = [...teamAStats.simulatedStats, ...teamBStats.simulatedStats];

  const updateOperations = allSimulatedStats.map(playerStats => 
    prisma.playerGameStats.update({
      where: {
        gameId_playerId: {
          gameId: newGameId,
          playerId: playerStats.playerId,
        },
      },
      data: playerStats,
    })
  );
  
  const updateGameOperation = prisma.game.update({
    where: { id: newGameId },
    data: { status: 'FINALIZADO' }
  });

  await prisma.$transaction([...updateOperations, updateGameOperation]);

  revalidatePath('/game');
  revalidatePath(`/stats/${newGameId}`);
  
  return newGameId;
}

export async function simulateExistingGame(gameId: string) {
  try {
    const gameData = await prisma.game.findUnique({
      where: { id: gameId },
      include: {
        homeTeam: { include: { players: true } },
        awayTeam: { include: { players: true } },
        playerStats: true,
      },
    });

    if (!gameData) {
      return { success: false, error: 'Partido no encontrado.' };
    }

    const teamAPlayers = gameData.homeTeam.players.map(p => {
      const currentStats = gameData.playerStats.find(ps => ps.playerId === p.id);
      return { id: p.id, name: p.name, currentStats };
    });
    const teamBPlayers = gameData.awayTeam.players.map(p => {
      const currentStats = gameData.playerStats.find(ps => ps.playerId === p.id);
      return { id: p.id, name: p.name, currentStats };
    });
    
    // For existing game simulation, we assume a competitive context
    const gameContext = "Partido igualado";
    const teamAContext = "Partido igualado";
    const teamBContext = "Partido igualado";

    const [teamAStats, teamBStats] = await Promise.all([
      simulateGameStats({ players: teamAPlayers, teamName: gameData.homeTeam.name, gameContext, teamContext: teamAContext, currentPeriod: gameData.currentPeriod as any }),
      simulateGameStats({ players: teamBPlayers, teamName: gameData.awayTeam.name, gameContext, teamContext: teamBContext, currentPeriod: gameData.currentPeriod as any }),
    ]);

    const allSimulatedStats = [...teamAStats.simulatedStats, ...teamBStats.simulatedStats];

    const updateOperations = allSimulatedStats.map(playerStats => 
      prisma.playerGameStats.update({
        where: {
          gameId_playerId: {
            gameId: gameId,
            playerId: playerStats.playerId,
          },
        },
        data: playerStats,
      })
    );
    
    const updateGameOperation = prisma.game.update({
      where: { id: gameId },
      data: { status: 'FINALIZADO' }
    });

    await prisma.$transaction([...updateOperations, updateGameOperation]);

    revalidatePath('/game');
    revalidatePath(`/stats/${gameId}`);
    
    return { success: true };
  } catch (error) {
    console.error("Failed to simulate existing game:", error);
    return { success: false, error: 'Ocurrió un error inesperado durante la simulación.' };
  }
}


/**
 * Processes a batch of player actions and updates the database in a single transaction.
 */
export async function batchUpdateStats(gameId: string, actions: ActionPayload[]) {
  // 1. Aggregate operations
  const updates = new Map<string, { [key: string]: number }>();

  for (const action of actions) {
    const { payload } = action;
    const { playerId, period } = payload;
    
    if (!updates.has(playerId)) {
      updates.set(playerId, {});
    }
    const playerUpdates = updates.get(playerId)!;

    if (action.type === 'shot') {
      const { points, made } = action.payload;
      const attemptedField = `p${period}_points${points}_attempted`;
      const madeField = `p${period}_points${points}_made`;

      playerUpdates[attemptedField] = (playerUpdates[attemptedField] || 0) + 1;
      if (made) {
        playerUpdates[madeField] = (playerUpdates[madeField] || 0) + 1;
      }
    } else if (action.type === 'stat') {
      const { stat } = action.payload;
      const field = `p${period}_${stat}`;
      playerUpdates[field] = (playerUpdates[field] || 0) + 1;
    }
  }

  // 2. Build transaction operations
  const prismaOperations = [];
  for (const [playerId, data] of updates.entries()) {
    const incrementData: { [key: string]: { increment: number } } = {};
    for (const [field, increment] of Object.entries(data)) {
      incrementData[field] = { increment };
    }

    prismaOperations.push(
      prisma.playerGameStats.update({
        where: {
          gameId_playerId: { gameId, playerId },
        },
        data: incrementData,
      })
    );
  }

  // 3. Execute transaction
  try {
    await prisma.$transaction(prismaOperations);
    // 4. Revalidate path
    revalidatePath(`/game/${gameId}`);
    return { success: true };
  } catch (error) {
    console.error("Error in batchUpdateStats transaction:", error);
    return { success: false, error: "Failed to update stats." };
  }
}

export async function getPublicGameData(gameId: string) {
  const game = await prisma.game.findUnique({
    where: { id: gameId },
    include: {
      homeTeam: { include: { players: true } },
      awayTeam: { include: { players: true } },
      playerStats: true,
    },
  });

  if (!game) {
    return null;
  }

  const gameForFrontend = transformGameForFrontend(game as PrismaGame);
  
  const teamAScore = calculateScore(gameForFrontend.teamA.players);
  const teamBScore = calculateScore(gameForFrontend.teamB.players);

  return {
    status: gameForFrontend.status,
    currentPeriod: gameForFrontend.currentPeriod,
    teamA: {
      ...gameForFrontend.teamA,
      score: teamAScore,
    },
    teamB: {
       ...gameForFrontend.teamB,
      score: teamBScore,
    },
  };
}
