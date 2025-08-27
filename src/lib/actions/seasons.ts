'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { cache } from 'react';
import { calculateScore, transformStatsForFrontend } from '../utils';
import type { Game, Team, Player, PlayerGameStats } from '@prisma/client';
import type { GameStatus } from '@/types';
import { simulateGameStats } from '@/ai/flows/simulate-game-stats';

export type SimulationContext = 'home_wins' | 'away_wins' | 'random';

export const getSeasonById = cache(async (id: string) => {
    try {
        const season = await prisma.season.findUnique({
        where: { id },
        });
        return season;
    } catch (error) {
        console.error('Failed to fetch season:', error);
        return null;
    }
});

export async function getSeasonDetails(seasonId: string) {
    try {
        const season = await prisma.season.findUnique({
            where: { id: seasonId },
            include: { teams: true } // Incluye los equipos que ya participan
        });

        if (!season) {
            return null;
        }

        const allTeams = await prisma.team.findMany({
            orderBy: { name: 'asc' }
        });

        return {
            season,
            participatingTeams: season.teams,
            allTeams
        };
    } catch (error) {
        console.error('Failed to get season details:', error);
        return null;
    }
}


export async function getSeasonsByLeague(leagueId: string) {
  try {
    const seasons = await prisma.season.findMany({
      where: { leagueId },
      orderBy: {
        name: 'desc',
      },
    });
    return seasons;
  } catch (error) {
    console.error('Failed to fetch seasons:', error);
    return [];
  }
}

export async function createSeason(formData: FormData) {
  const name = formData.get('name') as string;
  const leagueId = formData.get('leagueId') as string;
  const playoffTeams = parseInt(formData.get('playoffTeams') as string, 10);
  const relegationTeams = parseInt(formData.get('relegationTeams') as string, 10);
  const startDateString = formData.get('startDate') as string | null;
  const startDate = startDateString ? new Date(startDateString) : null;

  if (!name || !leagueId) {
    return { error: 'El nombre y el ID de la liga son obligatorios' };
  }

  try {
    await prisma.season.create({
      data: {
        name,
        leagueId,
        startDate,
        playoffTeams: isNaN(playoffTeams) ? 4 : playoffTeams,
        relegationTeams: isNaN(relegationTeams) ? 2 : relegationTeams,
      },
    });
    revalidatePath(`/admin/ligas/${leagueId}/temporadas`);
  } catch (error) {
    console.error('Failed to create season:', error);
    return { error: 'No se pudo crear la temporada.' };
  }
}

export async function updateSeason(formData: FormData) {
  const id = formData.get('id') as string;
  const leagueId = formData.get('leagueId') as string;
  const name = formData.get('name') as string;
  const playoffTeams = parseInt(formData.get('playoffTeams') as string, 10);
  const relegationTeams = parseInt(formData.get('relegationTeams') as string, 10);
  const startDateString = formData.get('startDate') as string | null;
  const startDate = startDateString ? new Date(startDateString) : null;

  if (!id || !name || !leagueId) {
    return { error: 'Faltan datos para actualizar' };
  }

  try {
    await prisma.season.update({
      where: { id },
      data: {
        name,
        startDate,
        playoffTeams: isNaN(playoffTeams) ? 4 : playoffTeams,
        relegationTeams: isNaN(relegationTeams) ? 2 : relegationTeams,
      },
    });
    revalidatePath(`/admin/ligas/${leagueId}/temporadas`);
  } catch (error) {
    console.error('Failed to update season:', error);
    return { error: 'No se pudo actualizar la temporada.' };
  }
}

export async function deleteSeason(formData: FormData) {
  const id = formData.get('id') as string;
  const leagueId = formData.get('leagueId') as string;
  
  if (!id || !leagueId) {
    return { error: 'Falta el ID de la temporada o de la liga' };
  }

  try {
    await prisma.season.delete({
      where: { id },
    });
    revalidatePath(`/admin/ligas/${leagueId}/temporadas`);
  } catch (error) {
    console.error('Failed to delete season:', error);
    return { error: 'No se pudo eliminar la temporada.' };
  }
}


export async function updateSeasonTeams(seasonId: string, teamIds: string[]) {
    try {
        await prisma.season.update({
            where: { id: seasonId },
            data: {
                teams: {
                    set: teamIds.map(id => ({ id }))
                }
            }
        });
        revalidatePath(`/admin/temporadas/${seasonId}/equipos`);
        return { success: true };
    } catch (error) {
        console.error('Failed to update season teams:', error);
        return { success: false, error: 'No se pudo actualizar la lista de equipos.' };
    }
}

export async function generateSeasonFixture(seasonId: string) {
  try {
    const season = await prisma.season.findUnique({
      where: { id: seasonId },
      include: { teams: { select: { id: true } } },
    });

    if (!season) {
      return { success: false, error: 'Temporada no encontrada.' };
    }
    if (season.teams.length < 2) {
      return { success: false, error: 'Se necesitan al menos 2 equipos para generar un fixture.' };
    }
    if (!season.startDate) {
      return { success: false, error: 'Se debe configurar una fecha de inicio para la temporada.' };
    }
    
    const teamIds = season.teams.map((t: {id: string}) => t.id);
    const roundRobinMatchups: { homeTeamId: string; awayTeamId: string }[][] = [];
    
    if (teamIds.length % 2 !== 0) {
        teamIds.push("dummy"); // Add a dummy team for odd numbers
    }

    const numRounds = teamIds.length - 1;
    const halfSize = teamIds.length / 2;

    for (let round = 0; round < numRounds; round++) {
        const roundMatchups: { homeTeamId: string; awayTeamId: string }[] = [];
        for (let i = 0; i < halfSize; i++) {
            const home = teamIds[i];
            const away = teamIds[teamIds.length - 1 - i];
            if (home !== "dummy" && away !== "dummy") {
                roundMatchups.push({ homeTeamId: home, awayTeamId: away });
            }
        }
        roundRobinMatchups.push(roundMatchups);

        // Rotate teams
        const lastTeam = teamIds.pop()!;
        teamIds.splice(1, 0, lastTeam);
    }

    const gameCount = await prisma.$transaction(async (tx) => {
      await tx.game.deleteMany({ where: { seasonId, type: 'REGULAR_SEASON' } });
      
      const gamesToCreate = roundRobinMatchups.flatMap((round, roundIndex) => {
        const roundDate = new Date(season.startDate!);
        roundDate.setDate(roundDate.getDate() + (roundIndex * 7)); // Add 7 days for each round
        
        return round.map(match => ({
          ...match,
          date: roundDate,
          seasonId,
          status: 'Programado' as const,
          currentPeriod: 1,
          type: 'REGULAR_SEASON' as const,
        }));
      });

      await tx.game.createMany({ data: gamesToCreate });
      return gamesToCreate.length;
    });
    
    revalidatePath(`/admin/temporadas/${seasonId}/fixture`);
    revalidatePath(`/admin/temporadas/${seasonId}/postemporada`);
    return { success: true, gameCount };
  } catch (error) {
    console.error('Failed to generate fixture:', error);
    return { success: false, error: 'Ocurrió un error al generar el fixture.' };
  }
}

export async function getFixturesBySeason(seasonId: string, type: 'REGULAR_SEASON' | 'PLAYOFF' = 'REGULAR_SEASON') {
    try {
        const games = await prisma.game.findMany({
            where: { seasonId, type },
            include: {
                homeTeam: true,
                awayTeam: true
            },
            orderBy: {
                date: 'asc'
            }
        });
        return games;
    } catch (error) {
        console.error("Failed to fetch fixtures:", error);
        return [];
    }
}

export type TeamStanding = Team & {
    position: number;
    played: number;
    wins: number;
    losses: number;
    pointsFor: number;
    pointsAgainst: number;
    pointsDifference: number;
}

export async function getSeasonStandings(seasonId: string) {
    const season = await prisma.season.findUnique({
        where: { id: seasonId },
        include: { 
            teams: true,
            games: {
                where: { status: 'FINALIZADO', type: 'REGULAR_SEASON' },
                include: {
                    homeTeam: { include: { players: true }},
                    awayTeam: { include: { players: true }},
                    playerStats: true,
                }
            }
        }
    });

    if (!season) return null;

    const standingsMap: Map<string, Omit<TeamStanding, keyof Team | 'position'>> = new Map();
    season.teams.forEach((team: Team) => {
        standingsMap.set(team.id, {
            played: 0,
            wins: 0,
            losses: 0,
            pointsFor: 0,
            pointsAgainst: 0,
            pointsDifference: 0,
        });
    });

    type GameWithRelations = Game & { homeTeam: { players: Player[] }, awayTeam: { players: Player[] }, playerStats: PlayerGameStats[]};

    season.games.forEach((game: GameWithRelations) => {
        const homeStats = standingsMap.get(game.homeTeamId);
        const awayStats = standingsMap.get(game.awayTeamId);

        if (!homeStats || !awayStats) return;
        
        const homeScore = calculateScore(game.homeTeam.players.map((p: Player) => ({ player: p, statsByPeriod: transformStatsForFrontend(game.playerStats.find(ps => ps.playerId === p.id))})));
        const awayScore = calculateScore(game.awayTeam.players.map((p: Player) => ({ player: p, statsByPeriod: transformStatsForFrontend(game.playerStats.find(ps => ps.playerId === p.id))})));

        homeStats.played++;
        awayStats.played++;
        homeStats.pointsFor += homeScore;
        awayStats.pointsFor += awayScore;
        homeStats.pointsAgainst += awayScore;
        awayStats.pointsAgainst += homeScore;

        if (homeScore > awayScore) {
            homeStats.wins++;
            awayStats.losses++;
        } else {
            homeStats.losses++;
            awayStats.wins++;
        }
    });

    const standings: Omit<TeamStanding, 'position'>[] = season.teams.map((team: Team) => {
        const stats = standingsMap.get(team.id)!;
        stats.pointsDifference = stats.pointsFor - stats.pointsAgainst;
        return { ...team, ...stats };
    });

    standings.sort((a, b) => {
        if (b.wins !== a.wins) {
            return b.wins - a.wins;
        }
        return b.pointsDifference - a.pointsDifference;
    });
    
    const finalStandings = standings.map((s, i) => ({ ...s, position: i + 1 }));

    const playoffTeams = finalStandings.slice(0, season.playoffTeams);
    const relegationTeams = finalStandings.slice(standings.length - season.relegationTeams);
    const safeTeams = finalStandings.slice(season.playoffTeams, standings.length - season.relegationTeams);


    return {
        standings: finalStandings,
        playoffTeams,
        safeTeams,
        relegationTeams
    };
}


export async function generatePlayoffMatches(seasonId: string) {
    const season = await getSeasonById(seasonId);
    const standingsData = await getSeasonStandings(seasonId);

    if (!season || !standingsData || standingsData.standings.length < season.playoffTeams) {
        return { success: false, error: 'No hay suficientes equipos para los playoffs.' };
    }

    try {
        await prisma.$transaction(async (tx) => {
            await tx.game.deleteMany({
                where: { seasonId, type: 'PLAYOFF' }
            });

            const topTeams = standingsData.playoffTeams;
            const matchups = [];
            
            if (season.playoffTeams === 4 && topTeams.length === 4) {
                matchups.push({ homeTeamId: topTeams[0].id, awayTeamId: topTeams[3].id });
                matchups.push({ homeTeamId: topTeams[1].id, awayTeamId: topTeams[2].id });
            } else {
                 // The return inside a transaction will rollback. But we need to signal an error.
                 // This will be caught by the outer catch block.
                 throw new Error('La generación de playoffs solo está implementada para 4 equipos.');
            }

            const gamesToCreate = matchups.map(match => ({
                ...match,
                seasonId,
                status: 'Programado' as const,
                currentPeriod: 1,
                type: 'PLAYOFF' as const,
            }));

            await tx.game.createMany({ data: gamesToCreate });
        });

        revalidatePath(`/admin/temporadas/${seasonId}/postemporada`);
        return { success: true };

    } catch (error: any) {
        console.error("Failed to generate playoff matches:", error);
        return { success: false, error: error.message || "No se pudieron generar los partidos de playoffs." };
    }
}

export async function getLeagueHomepageData() {
    const firstLeague = await prisma.league.findFirst({
        orderBy: { name: 'asc' }
    });
    
    if (!firstLeague) {
        return null;
    }

    const latestSeason = await prisma.season.findFirst({
        where: { leagueId: firstLeague.id },
        orderBy: { name: 'desc' }
    });

    if (!latestSeason) {
        return { league: firstLeague, season: null, standings: null, fixture: [] };
    }

    const standingsData = await getSeasonStandings(latestSeason.id);
    const fixture = await getFixturesBySeason(latestSeason.id, 'REGULAR_SEASON');

    return {
        league: firstLeague,
        season: latestSeason,
        standings: standingsData?.standings || null,
        fixture
    };
}

export async function updateGameDate(gameId: string, newDate: Date) {
    try {
        await prisma.game.update({
            where: { id: gameId },
            data: { date: newDate },
        });
        const game = await prisma.game.findUnique({ where: { id: gameId }, select: { seasonId: true } });
        if (game?.seasonId) {
            revalidatePath(`/admin/temporadas/${game.seasonId}/fixture`);
        }
        return { success: true };
    } catch (error) {
        console.error("Failed to update game date:", error);
        return { success: false, error: "No se pudo actualizar la fecha del partido." };
    }
}

export async function updateGameStatusInFixture(gameId: string, status: GameStatus) {
    try {
        await prisma.game.update({
            where: { id: gameId },
            data: { status },
        });
        const game = await prisma.game.findUnique({ where: { id: gameId }, select: { seasonId: true } });
        if (game?.seasonId) {
            revalidatePath(`/admin/temporadas/${game.seasonId}/fixture`);
        }
        revalidatePath(`/game/${gameId}`);
        return { success: true };
    } catch (error) {
         console.error("Failed to update game status:", error);
        return { success: false, error: "No se pudo actualizar el estado del partido." };
    }
}

export async function simulateFixtureGames(gameIds: string[], context: SimulationContext) {
  if (gameIds.length === 0) {
    return { success: false, error: 'No se seleccionaron partidos.' };
  }

  try {
    const games = await prisma.game.findMany({
      where: {
        id: { in: gameIds },
        status: { in: ['Programado', 'EN_VIVO'] },
      },
      include: {
        homeTeam: { include: { players: true } },
        awayTeam: { include: { players: true } },
      },
    });

    if (games.length === 0) {
        return { success: false, error: 'Ninguno de los partidos seleccionados es válido para simulación.' };
    }
    
    for (const game of games) {
        // Create player stats entries if they don't exist
        const allPlayers = [...game.homeTeam.players, ...game.awayTeam.players];
        const existingStats = await prisma.playerGameStats.findMany({
            where: { gameId: game.id, playerId: { in: allPlayers.map(p => p.id) } },
            select: { playerId: true }
        });
        const existingPlayerIds = new Set(existingStats.map(s => s.playerId));
        const playersWithoutStats = allPlayers.filter(p => !existingPlayerIds.has(p.id));

        if (playersWithoutStats.length > 0) {
            await prisma.playerGameStats.createMany({
                data: playersWithoutStats.map(player => ({
                    gameId: game.id,
                    playerId: player.id,
                })),
            });
        }
    }
    
    const simulationPromises = games.map(async (game) => {
      let homeContext: string, awayContext: string;
      const gameContext = `Un partido de temporada regular. El resultado debe tener una diferencia de puntos realista, generalmente entre 5 y 20, y nunca superior a 40.`;

      switch (context) {
        case 'home_wins':
          homeContext = "Equipo ganador";
          awayContext = "Equipo perdedor";
          break;
        case 'away_wins':
          homeContext = "Equipo perdedor";
          awayContext = "Equipo ganador";
          break;
        case 'random':
        default:
          if (Math.random() > 0.5) {
            homeContext = "Equipo ganador";
            awayContext = "Equipo perdedor";
          } else {
            homeContext = "Equipo perdedor";
            awayContext = "Equipo ganador";
          }
          break;
      }
      
      const homeTeamPlayers = game.homeTeam.players.map(p => ({ id: p.id, name: p.name }));
      const awayTeamPlayers = game.awayTeam.players.map(p => ({ id: p.id, name: p.name }));
      
      const [homeStats, awayStats] = await Promise.all([
        simulateGameStats({ players: homeTeamPlayers, teamName: game.homeTeam.name, gameContext, teamContext: homeContext }),
        simulateGameStats({ players: awayTeamPlayers, teamName: game.awayTeam.name, gameContext, teamContext: awayContext }),
      ]);
      
      return [...homeStats.simulatedStats, ...awayStats.simulatedStats].map(stats => ({ ...stats, gameId: game.id }));
    });

    const allSimulatedStatsNested = await Promise.all(simulationPromises);
    const allSimulatedStats = allSimulatedStatsNested.flat();

    await prisma.$transaction(async (tx) => {
        for (const playerStats of allSimulatedStats) {
            await tx.playerGameStats.update({
                where: {
                    gameId_playerId: {
                        gameId: playerStats.gameId,
                        playerId: playerStats.playerId,
                    },
                },
                data: playerStats,
            });
        }
        await tx.game.updateMany({
            where: { id: { in: games.map(g => g.id) } },
            data: { status: 'FINALIZADO' },
        });
    });
    
    revalidatePath(`/admin/temporadas/${games[0].seasonId}/fixture`);
    revalidatePath(`/admin/temporadas/${games[0].seasonId}/postemporada`);
    
    return { success: true, simulatedCount: games.length };

  } catch (error) {
    console.error("Error during fixture simulation:", error);
    return { success: false, error: "Ocurrió un error inesperado durante la simulación masiva." };
  }
}
