
'use server';
/**
 * @fileOverview AI flow for enhancing manga synopses.
 *
 * - enhanceSynopsis - A function that takes an original synopsis and manga title, and returns an enhanced version.
 * - EnhanceSynopsisInput - The input type for the enhanceSynopsis function.
 * - EnhanceSynopsisOutput - The return type for the enhanceSynopsis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhanceSynopsisInputSchema = z.object({
  mangaTitle: z.string().describe('The title of the manga series.'),
  originalSynopsis: z.string().describe('The original synopsis of the manga series.'),
});
export type EnhanceSynopsisInput = z.infer<typeof EnhanceSynopsisInputSchema>;

const EnhanceSynopsisOutputSchema = z.object({
  enhancedSynopsis: z.string().describe('The AI-enhanced synopsis for the manga series.'),
});
export type EnhanceSynopsisOutput = z.infer<typeof EnhanceSynopsisOutputSchema>;

export async function enhanceSynopsis(input: EnhanceSynopsisInput): Promise<EnhanceSynopsisOutput> {
  return enhanceSynopsisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'enhanceSynopsisPrompt',
  input: {schema: EnhanceSynopsisInputSchema},
  output: {schema: EnhanceSynopsisOutputSchema},
  prompt: `You are a creative writer specializing in crafting compelling synopses for manga series.
Given the manga title and its original synopsis, rewrite and enhance the synopsis to be more engaging, intriguing, and descriptive.
Make it sound exciting and capture the essence of the story. Aim for a length of 2-3 paragraphs. Ensure the output is only the enhanced synopsis.

Manga Title: {{{mangaTitle}}}
Original Synopsis:
{{{originalSynopsis}}}

Enhanced Synopsis:
`,
});

const enhanceSynopsisFlow = ai.defineFlow(
  {
    name: 'enhanceSynopsisFlow',
    inputSchema: EnhanceSynopsisInputSchema,
    outputSchema: EnhanceSynopsisOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("Failed to get enhanced synopsis from AI.");
    }
    return output;
  }
);
