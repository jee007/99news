// src/ai/flows/auto-translate-article.ts
'use server';

/**
 * @fileOverview Automatically translates article content into the user's preferred language if the original source is unavailable in that language.
 *
 * - autoTranslateArticle - A function that handles the article translation process.
 * - AutoTranslateArticleInput - The input type for the autoTranslateArticle function.
 * - AutoTranslateArticleOutput - The return type for the autoTranslateArticle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutoTranslateArticleInputSchema = z.object({
  text: z.string().describe('The text content of the article to be translated.'),
  targetLanguage: z.string().describe('The target language code (e.g., en, hi, ta).'),
});
export type AutoTranslateArticleInput = z.infer<typeof AutoTranslateArticleInputSchema>;

const AutoTranslateArticleOutputSchema = z.object({
  translatedText: z.string().describe('The translated text content of the article.'),
});
export type AutoTranslateArticleOutput = z.infer<typeof AutoTranslateArticleOutputSchema>;

export async function autoTranslateArticle(input: AutoTranslateArticleInput): Promise<AutoTranslateArticleOutput> {
  return autoTranslateArticleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'autoTranslateArticlePrompt',
  input: {schema: AutoTranslateArticleInputSchema},
  output: {schema: AutoTranslateArticleOutputSchema},
  prompt: `Translate the following text into {{targetLanguage}}:\n\n{{text}}`,
});

const autoTranslateArticleFlow = ai.defineFlow(
  {
    name: 'autoTranslateArticleFlow',
    inputSchema: AutoTranslateArticleInputSchema,
    outputSchema: AutoTranslateArticleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
