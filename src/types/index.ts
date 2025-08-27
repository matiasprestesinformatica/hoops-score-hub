import type { Player, Team } from '@prisma/client';

export type PlayerStats = {
  points1: { made: number, attempted: number };
  points2: { made: number, attempted: number };
  points3: { made: number, attempted: number };
  rebounds: number;
  assists: number;
  fouls: number;
};

export type GamePlayerData = {
  id: string;
  name: string;
  number: number;
  imageUrl?: string | null;
};

export type PlayerInGame = {
  player: GamePlayerData;
  statsByPeriod: [PlayerStats, PlayerStats, PlayerStats, PlayerStats];
};

export type TeamInGame = {
  id: string;
  name: string;
  logoUrl: string | null;
  players: PlayerInGame[];
};

export type Shot = {
  id: string;
  x: number;
  y: number;
  made: boolean;
  points: number;
  period: number;
  playerId: string;
};

export type Game = {
  id: string;
  createdAt: string; // ISO date string
  teamA: TeamInGame;
  teamB: TeamInGame;
  currentPeriod: 1 | 2 | 3 | 4;
  status: 'Programado' | 'EN_VIVO' | 'FINALIZADO';
  plays: Play[];
  shots?: Shot[]; // Shots are optional as they are loaded on a specific page
};

export type GameStatus = 'Programado' | 'EN_VIVO' | 'FINALIZADO';

export type ShotAction = {
  type: 'shot';
  payload: {
    playerId: string;
    points: 1 | 2 | 3;
    made: boolean;
    period: 1 | 2 | 3 | 4;
  };
};

export type StatAction = {
  type: 'stat';
  payload: {
    playerId: string;
    stat: 'rebounds' | 'assists' | 'fouls';
    period: 1 | 2 | 3 | 4;
  };
};

export type ActionPayload = ShotAction | StatAction;


export type Play = {
  id: string;
  summary: string;
  teamName: string;
  time: string;
  action?: ActionPayload;
  undone: boolean;
};

export type TeamWithPlayers = Team & { players: Player[] };

export interface ProjectConfig {
  id: number;
  title: string;
  slogan: string | null;
  logoUrl: string | null;
  metaDescription: string | null;
}
