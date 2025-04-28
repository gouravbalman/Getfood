'use server';
/**
 * @fileOverview Suggests a North Indian dish based on the current time of day, prioritizing healthy options, and provides nutritional information.
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

// Define a schema for a single nutrient
const NutrientInfoSchema = z.object({
    name: z.string().describe("The name of the nutrient (e.g., 'Calories', 'Protein', 'Fiber', 'Fat', 'Carbohydrates')."),
    quantity: z.string().describe("The estimated quantity of the nutrient per serving, including units (e.g., '350 kcal', '15g', '8g', '12g', '45g').")
});

const SuggestDailyDishOutputSchema = z.object({
  dishName: z.string().describe('The name of the suggested North Indian dish.'),
  recipe: z.string().describe('The recipe for the suggested dish, formatted with numbered steps (e.g., "1. Step one.\\n2. Step two."). Each step should be on a new line.'),
  ingredients: z.array(z.string()).describe('A list of ingredients required for the dish.'),
  // Add nutritional information field
  nutritionalInfo: z.array(NutrientInfoSchema).describe('An array of estimated nutritional information per serving for the dish. Include key nutrients like Calories, Protein, Fiber, Fat, and Carbohydrates.')
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
  // Updated prompt to ask for nutritional info instead of image keywords
  prompt: `Suggest a healthy **vegetarian** North Indian dish suitable for {{timeOfDay}}.
Provide the following details:
1. dishName: The name of the suggested dish.
2. recipe: A clear and concise recipe for the dish. **Format the steps numerically (e.g., "1. Chop onions.\\n2. Sauté onions.") with each step on a new line.**
3. ingredients: A list of required ingredients.
4. nutritionalInfo: An array providing estimated nutritional information per serving. Include objects for key nutrients: Calories (kcal), Protein (g), Fiber (g), Fat (g), and Carbohydrates (g). Each object should have 'name' and 'quantity' (e.g., { name: "Protein", quantity: "15g" }). Ensure the quantities are reasonable estimates for a standard serving.

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

    // Validate nutritional info presence (basic check)
    if (!output.nutritionalInfo || output.nutritionalInfo.length === 0) {
      console.warn("Received empty nutritional information from AI. This might indicate an issue.");
      // Add fallback or handle as needed, here we just let it pass but log.
      output.nutritionalInfo = []; // Ensure it's at least an empty array
    }

    // The output from the prompt should match the required SuggestDailyDishOutputSchema
    return output;
  }
);
