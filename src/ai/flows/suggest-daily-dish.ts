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

const generateRecipe = ai.defineTool({
  name: 'generateRecipe',
  description: 'Generates a recipe for a given North Indian dish and lists its ingredients.',
  inputSchema: z.object({
    dishName: z.string().describe('The name of the North Indian dish to generate a recipe for.'),
    timeOfDay: z
    .string()
    .describe("The current time of day (e.g., 'Breakfast', 'Lunch', 'Dinner')."),
  }),
  outputSchema: z.object({
    recipe: z.string().describe('The recipe for the suggested dish.'),
    ingredients: z.array(z.string()).describe('A list of ingredients required for the dish.'),
  }),
  async fn(input) {
    // In a real application, this could call an external recipe API or database.
    // For now, it returns a placeholder object.
    return {
      recipe: `A delicious recipe for ${input.dishName} goes here.`, // Placeholder recipe
      ingredients: ['Ingredient 1', 'Ingredient 2', 'Ingredient 3'], // Placeholder ingredients
    };
  },
});

const suggestDishPrompt = ai.definePrompt({
  name: 'suggestDishPrompt',
  input: {
    schema: z.object({
      timeOfDay: z
        .string()
        .describe("The current time of day (e.g., 'Breakfast', 'Lunch', 'Dinner')."),
    }),
  },
  output: {
    schema: z.object({
      dishName: z.string().describe('The name of the suggested North Indian dish.'),
    }),
  },
  prompt: `Suggest a healthy North Indian dish suitable for {{timeOfDay}}. Give only name.`, // Just output the name of the dish
  tools: [generateRecipe],
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
    const { output: dishNameOutput } = await suggestDishPrompt(input);
    const { dishName } = dishNameOutput!;
    const { recipe, ingredients } = await generateRecipe({
      dishName: dishName!,
      timeOfDay: input.timeOfDay
    });

    return {
      dishName: dishName!,
      recipe,
      ingredients,
    };
  }
);
