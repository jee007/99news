'use server';
/**
 * @fileOverview Generates a full article from a title and description.
 *
 * - generateFullArticle - A function that handles generating the full article.
 * - GenerateFullArticleInput - The input type for the generateFullArticle function.
 * - GenerateFullArticleOutput - The return type for the generateFullArticle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFullArticleInputSchema = z.object({
  title: z.string().describe('The title of the news article.'),
  description: z.string().describe('The short description or summary of the news article.'),
});
export type GenerateFullArticleInput = z.infer<typeof GenerateFullArticleInputSchema>;

const GenerateFullArticleOutputSchema = z.object({
  fullArticleText: z.string().describe('The full, generated text of the news article.'),
});
export type GenerateFullArticleOutput = z.infer<typeof GenerateFullArticleOutputSchema>;

export async function generateFullArticle(input: GenerateFullArticleInput): Promise<GenerateFullArticleOutput> {
  return generateFullArticleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFullArticlePrompt',
  input: {schema: GenerateFullArticleInputSchema},
  output: {schema: GenerateFullArticleOutputSchema},
  prompt: `You are a professional news journalist. Your task is to write a full, comprehensive news article based on the provided title and summary. The article should be well-structured, informative, and written in a neutral, journalistic tone.

Article Title: {{{title}}}

Article Summary: {{{description}}}

Please generate the full article text.`,
});

const generateFullArticleFlow = ai.defineFlow(
  {
    name: 'generateFullArticleFlow',
    inputSchema: GenerateFullArticleInputSchema,
    outputSchema: GenerateFullArticleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
