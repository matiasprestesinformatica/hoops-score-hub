import { z } from 'zod';

const PlayerStatsOutputSchema = z.object({
  playerId: z.string(),
  p1_points1_attempted: z.number().int(), p1_points1_made: z.number().int(),
  p1_points2_attempted: z.number().int(), p1_points2_made: z.number().int(),
  p1_points3_attempted: z.number().int(), p1_points3_made: z.number().int(),
  p1_rebounds: z.number().int(),
  p1_assists: z.number().int(),
  p1_fouls: z.number().int(),
  p2_points1_attempted: z.number().int(), p2_points1_made: z.number().int(),
  p2_points2_attempted: z.number().int(), p2_points2_made: z.number().int(),
  p2_points3_attempted: z.number().int(), p2_points3_made: z.number().int(),
  p2_rebounds: z.number().int(),
  p2_assists: z.number().int(),
  p2_fouls: z.number().int(),
  p3_points1_attempted: z.number().int(), p3_points1_made: z.number().int(),
  p3_points2_attempted: z.number().int(), p3_points2_made: z.number().int(),
  p3_points3_attempted: z.number().int(), p3_points3_made: z.number().int(),
  p3_rebounds: z.number().int(),
  p3_assists: z.number().int(),
  p3_fouls: z.number().int(),
  p4_points1_attempted: z.number().int(), p4_points1_made: z.number().int(),
  p4_points2_attempted: z.number().int(), p4_points2_made: z.number().int(),
  p4_points3_attempted: z.number().int(), p4_points3_made: z.number().int(),
  p4_rebounds: z.number().int(),
  p4_assists: z.number().int(),
  p4_fouls: z.number().int(),
});

// Zod Schemas for Genkit Flow
export const SimulateGameInputSchema = z.object({
  players: z.array(z.object({ 
    id: z.string(), 
    name: z.string(),
    currentStats: PlayerStatsOutputSchema.omit({ playerId: true }).optional(),
  })),
  teamName: z.string(),
  gameContext: z.string().describe("Describe el escenario general del partido, ej: 'Partido igualado', 'Un equipo domina al otro'."),
  teamContext: z.string().describe("Describe el rol de este equipo específico en el escenario, ej: 'Equipo ganador', 'Equipo perdedor', 'Partido igualado'."),
  currentPeriod: z.number().int().min(1).max(4).optional().describe("Si se provee, indica que el partido ya está en curso y la simulación debe continuar desde este período."),
});
export type SimulateGameInput = z.infer<typeof SimulateGameInputSchema>;

export const SimulateGameOutputSchema = z.object({
  simulatedStats: z.array(PlayerStatsOutputSchema),
});
export type SimulateGameOutput = z.infer<typeof SimulateGameOutputSchema>;
