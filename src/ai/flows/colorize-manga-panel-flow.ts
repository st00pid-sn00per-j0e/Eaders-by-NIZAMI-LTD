
'use server';
/**
 * @fileOverview An AI flow for colorizing black and white manga panels.
 *
 * - colorizeMangaPanel - A function that takes a manga panel image (as a data URI) and returns a colorized version.
 * - ColorizeMangaPanelInput - The input type for the colorizeMangaPanel function.
 * - ColorizeMangaPanelOutput - The return type for the colorizeMangaPanel function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ColorizeMangaPanelInputSchema = z.object({
  panelDataUri: z
    .string()
    .describe(
      "A black and white manga panel image, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ColorizeMangaPanelInput = z.infer<typeof ColorizeMangaPanelInputSchema>;

const ColorizeMangaPanelOutputSchema = z.object({
  colorizedPanelDataUri: z
    .string()
    .describe('The AI-colorized manga panel image, as a data URI.'),
});
export type ColorizeMangaPanelOutput = z.infer<typeof ColorizeMangaPanelOutputSchema>;

export async function colorizeMangaPanel(
  input: ColorizeMangaPanelInput
): Promise<ColorizeMangaPanelOutput> {
  return colorizeMangaPanelFlow(input);
}

const colorizeMangaPanelFlow = ai.defineFlow(
  {
    name: 'colorizeMangaPanelFlow',
    inputSchema: ColorizeMangaPanelInputSchema,
    outputSchema: ColorizeMangaPanelOutputSchema,
  },
  async (input) => {
    try {
      const {media} = await ai.generate({
        model: 'googleai/gemini-2.0-flash-exp', // Model capable of image generation/manipulation
        prompt: [
          {media: {url: input.panelDataUri}},
          {text: 'You are an expert manga colorist. Your task is to colorize this black and white manga panel. It is CRITICAL that you DO NOT alter, redraw, or change any of the existing line art or the original artistic style. Your ONLY job is to add color to the existing drawing. Provide only the colorized image as output. Do not add any text or descriptions.'},
        ],
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
          // Add safety settings if needed, e.g.
          // safetySettings: [{ category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' }]
        },
      });

      if (!media || !media.url) {
        throw new Error('AI did not return a colorized image.');
      }
      // Ensure the output is a data URI, though Gemini usually provides it in this format for images.
      // If it were a different format, conversion might be needed here.
      return {colorizedPanelDataUri: media.url};

    } catch (error) {
      console.error('Error in colorizeMangaPanelFlow:', error);
      // It's crucial to check the error structure from Gemini for specific error types (e.g., safety blocks)
      if (error instanceof Error && error.message.includes('SAFETY')) {
         throw new Error('The image could not be colorized due to safety filters. The original panel might contain sensitive content.');
      }
      throw new Error('Failed to colorize manga panel with AI.');
    }
  }
);

