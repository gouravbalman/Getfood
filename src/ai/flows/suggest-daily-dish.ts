'use server';
/**
 * @fileOverview Suggests a North Indian dish based on the current time of day, prioritizing healthy options.
 *
 * - suggestDailyDish - A function that handles the dish suggestion process.
 * - SuggestDailyDishInput - The input type for the suggestDailyDish function.
 * - SuggestDailyDishOutput - The return type for the suggestDailyDish function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SuggestDailyDishInputSchema = z.object({
  timeOfDay: z
    .string()
    .describe("The current time of day (e.g., 'Breakfast', 'Lunch', 'Dinner')."),
  previousDishNames: z.array(z.string()).optional().describe('A list of dish names that have already been suggested in this session and should be avoided.'),
});
export type SuggestDailyDishInput = z.infer<typeof SuggestDailyDishInputSchema>;

const SuggestDailyDishOutputSchema = z.object({
  dishName: z.string().describe('The name of the suggested North Indian dish.'),
  recipe: z.string().describe('The recipe for the suggested dish, formatted with numbered steps (e.g., "1. Step one.\\n2. Step two."). Each step should be on a new line.'),
  ingredients: z.array(z.string()).describe('A list of ingredients required for the dish.'),
  // Refined description for better image search keywords
  imageSearchKeywords: z.string().describe('4-5 highly relevant keywords suitable for searching a high-quality image of the dish (e.g., "dish name cuisine type food photography close up", like "Palak Paneer North Indian food photography close up").'),
});
export type SuggestDailyDishOutput = z.infer<typeof SuggestDailyDishOutputSchema>;

export async function suggestDailyDish(input: SuggestDailyDishInput): Promise<SuggestDailyDishOutput> {
  return suggestDailyDishFlow(input);
}

const suggestDishPrompt = ai.definePrompt({
  name: 'suggestDishPrompt',
  input: {
    schema: SuggestDailyDishInputSchema, // Use the flow's input schema
  },
  output: {
    schema: SuggestDailyDishOutputSchema, // Expect the full output directly from the prompt
  },
  // Ensure prompt clearly asks for vegetarian dish, numbered steps, avoids previous suggestions, and asks for specific keywords
  prompt: `Suggest a healthy **vegetarian** North Indian dish suitable for {{timeOfDay}}.
Provide the following details:
1. dishName: The name of the suggested dish.
2. recipe: A clear and concise recipe for the dish. **Format the steps numerically (e.g., "1. Chop onions.\\n2. Sauté onions.") with each step on a new line.**
3. ingredients: A list of required ingredients.
4. imageSearchKeywords: 4-5 highly relevant keywords (e.g., "dish name cuisine type food photography close up", like "Aloo Gobi North Indian food photography close up") suitable for searching a high-quality image of the dish. Ensure keywords are specific to the dish.

Focus on healthy options. Ensure the suggested dish is strictly vegetarian (no meat, poultry, or fish).

{{#if previousDishNames}}
**Important:** Do not suggest any of the following dishes that have already been suggested:
{{#each previousDishNames}}
- {{this}}
{{/each}}
Suggest something different.
{{/if}}
`,
});

const suggestDailyDishFlow = ai.defineFlow<
  typeof SuggestDailyDishInputSchema,
  typeof SuggestDailyDishOutputSchema
>(
  {
    name: 'suggestDailyDishFlow',
    inputSchema: SuggestDailyDishInputSchema,
    outputSchema: SuggestDailyDishOutputSchema,
  },
  async input => {
    // Directly call the prompt that generates the full output
    const { output } = await suggestDishPrompt(input);

    if (!output) {
        throw new Error("Failed to generate dish suggestion.");
    }

    // Basic validation for keywords - ensure it's not empty and provide a fallback
    if (!output.imageSearchKeywords || output.imageSearchKeywords.trim() === '') {
        console.warn("Received empty image search keywords from AI. Using fallback.");
        // Use a more descriptive fallback
        output.imageSearchKeywords = `${output.dishName} North Indian food vegetarian`;
    }

    // The output from the prompt should match the required SuggestDailyDishOutputSchema
    return output;
  }
);
