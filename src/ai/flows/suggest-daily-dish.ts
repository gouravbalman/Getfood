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
});
export type SuggestDailyDishInput = z.infer<typeof SuggestDailyDishInputSchema>;

const SuggestDailyDishOutputSchema = z.object({
  dishName: z.string().describe('The name of the suggested North Indian dish.'),
  recipe: z.string().describe('The recipe for the suggested dish.'),
  ingredients: z.array(z.string()).describe('A list of ingredients required for the dish.'),
});
export type SuggestDailyDishOutput = z.infer<typeof SuggestDailyDishOutputSchema>;

export async function suggestDailyDish(input: SuggestDailyDishInput): Promise<SuggestDailyDishOutput> {
  return suggestDailyDishFlow(input);
}

// Removed the generateRecipe tool as it's not needed; the LLM can generate everything in one go.

const suggestDishPrompt = ai.definePrompt({
  name: 'suggestDishPrompt',
  input: {
    schema: SuggestDailyDishInputSchema, // Use the flow's input schema
  },
  output: {
    schema: SuggestDailyDishOutputSchema, // Expect the full output directly from the prompt
  },
  prompt: `Suggest a healthy North Indian dish suitable for {{timeOfDay}}.
Provide the following details:
1. dishName: The name of the dish.
2. recipe: A clear and concise recipe for the dish.
3. ingredients: A list of required ingredients.

Focus on healthy options.`,
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

    // The output from the prompt already matches the required SuggestDailyDishOutputSchema
    return output;
  }
);
