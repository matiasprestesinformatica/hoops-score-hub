'use server';
/**
 * @fileOverview Generates dynamic summaries of each play in a basketball game.
 *
 * - generatePlayByPlaySummary - A function that generates a play-by-play summary.
 * - GeneratePlayByPlaySummaryInput - The input type for the generatePlayByPlaySummary function.
 * - GeneratePlayByPlaySummaryOutput - The return type for the generatePlayByPlaySummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePlayByPlaySummaryInputSchema = z.object({
  playDescription: z.string().describe('Description of the play.'),
  teamName: z.string().describe('Name of the team involved in the play.'),
  homeTeamScore: z.number().describe('Current score of the home team.'),
  awayTeamScore: z.number().describe('Current score of the away team.'),
  quarter: z.number().describe('Current quarter of the game.'),
  timeRemaining: z.string().describe('Time remaining in the current quarter (e.g., 05:30).'),
});
export type GeneratePlayByPlaySummaryInput = z.infer<typeof GeneratePlayByPlaySummaryInputSchema>;

const GeneratePlayByPlaySummaryOutputSchema = z.object({
  summary: z.string().describe('A dynamic summary of the play.'),
});
export type GeneratePlayByPlaySummaryOutput = z.infer<typeof GeneratePlayByPlaySummaryOutputSchema>;

export async function generatePlayByPlaySummary(
  input: GeneratePlayByPlaySummaryInput
): Promise<GeneratePlayByPlaySummaryOutput> {
  return generatePlayByPlaySummaryFlow(input);
}

const playByPlayPrompt = ai.definePrompt({
  name: 'generatePlayByPlaySummaryPrompt',
  input: {schema: GeneratePlayByPlaySummaryInputSchema},
  output: {schema: GeneratePlayByPlaySummaryOutputSchema},
  prompt: `Generate a dynamic and engaging summary of the following play in a basketball game, suitable for live play-by-play updates.

Play Description: {{{playDescription}}}
Team: {{{teamName}}}
Home Team Score: {{{homeTeamScore}}}
Away Team Score: {{{awayTeamScore}}}
Quarter: {{{quarter}}}
Time Remaining: {{{timeRemaining}}}

Summary:`, // The prompt should end with "Summary:" so that the LLM knows how to format its response
});

const generatePlayByPlaySummaryFlow = ai.defineFlow(
  {
    name: 'generatePlayByPlaySummaryFlow',
    inputSchema: GeneratePlayByPlaySummaryInputSchema,
    outputSchema: GeneratePlayByPlaySummaryOutputSchema,
  },
  async input => {
    const {output} = await playByPlayPrompt(input);
    return output!;
  }
);
