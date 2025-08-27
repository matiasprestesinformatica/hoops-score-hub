'use server';
/**
 * @fileOverview A Genkit flow to simulate realistic basketball game statistics for a list of players.
 *
 * - simulateGameStats - A function that handles the game statistics simulation process.
 * - SimulateGameInput - The input type for the simulateGameStats function.
 * - SimulateGameOutput - The return type for the simulateGameStats function.
 */

import { ai } from '@/ai/genkit';
import type { SimulateGameInput, SimulateGameOutput } from '@/lib/definitions';
import { SimulateGameInputSchema, SimulateGameOutputSchema } from '@/lib/definitions';

export async function simulateGameStats(
  input: SimulateGameInput
): Promise<SimulateGameOutput> {
  return simulateGameStatsFlow(input);
}

const simulateGamePrompt = ai.definePrompt({
  name: 'simulateGameStatsPrompt',
  input: { schema: SimulateGameInputSchema },
  output: { schema: SimulateGameOutputSchema },
  prompt: `You are an expert basketball statistics analyst. Your task is to simulate realistic game statistics.

Game Context: {{{gameContext}}}
Team Name: {{{teamName}}}
Team Role in this Context: {{{teamContext}}}

{{#if currentPeriod}}
The game is already in progress and is currently in period {{currentPeriod}}.
You must COMPLETE the game by generating plausible statistics ONLY for the remaining periods (from period {{currentPeriod}} to 4).
The existing stats for each player up to this point are provided. Use them as a baseline for their performance in the rest of the game.
{{else}}
Your task is to simulate realistic game statistics for a team of players over four periods from the beginning.
{{/if}}

Players to simulate stats for:
{{#each players}}
- Player ID: {{id}}, Name: {{name}}
  {{#if currentStats}}
  (Has existing stats)
  {{/if}}
{{/each}}

Please generate plausible statistics. Adhere to these rules:
1. The number of made shots (e.g., p1_points2_made) cannot exceed the number of attempted shots (e.g., p1_points2_attempted).
2. The total statistics for a player should be realistic for a single game. Avoid generating outlier performances unless suggested by the context.
3. The 'Team Role' should heavily influence the stats. For example, players on the 'Equipo ganador' should have better stats (higher shooting percentages, more points/rebounds/assists) than players on the 'Equipo perdedor'. For 'Partido igualado', stats should be competitive and balanced.
4. The overall shooting percentage for 2-point shots (total pX_points2_made / total pX_points2_attempted) for any single player should not exceed 55%.
5. The overall shooting percentage for 3-point shots (total pX_points3_made / total pX_points3_attempted) for any single player should not exceed 40%.
{{#if currentPeriod}}
6. IMPORTANT: You MUST return the complete stats object for all 4 periods. For periods that have already passed (1 to {{currentPeriod}}-1), return the "currentStats" provided in the input for each player. For the current and future periods ({{currentPeriod}} to 4), generate new stats. If no stats exist for a past period, return all zeros for it.
{{else}}
6. Distribute stats across all four periods. Don't put all stats in one period.
{{/if}}
7. Return the data strictly in the JSON format defined by the output schema. Ensure every player from the input list has a corresponding stats object in the output. The 'simulatedStats' key must be present and contain an array of player stats objects.
`,
});

const simulateGameStatsFlow = ai.defineFlow(
  {
    name: 'simulateGameStatsFlow',
    inputSchema: SimulateGameInputSchema,
    outputSchema: SimulateGameOutputSchema,
  },
  async (input) => {
    const { output } = await simulateGamePrompt(input);
    return output!;
  }
);
