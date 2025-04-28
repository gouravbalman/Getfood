'use server';

import { suggestDailyDish, type SuggestDailyDishInput, type SuggestDailyDishOutput } from '@/ai/flows/suggest-daily-dish';
import { getCurrentTimeOfDay } from '@/lib/time-helper';

interface GetDishSuggestionActionInput {
    previousDishNames?: string[];
}

/**
 * Server action to get a dish suggestion.
 * It determines the time of day and calls the AI flow, avoiding previously suggested dishes.
 * @param input Optional object containing previousDishNames array.
 */
export async function getDishSuggestionAction(
    input?: GetDishSuggestionActionInput
): Promise<SuggestDailyDishOutput | { error: string }> {
  try {
    const timeOfDay = getCurrentTimeOfDay();
    const flowInput: SuggestDailyDishInput = {
        timeOfDay,
        previousDishNames: input?.previousDishNames ?? [],
    };
    const suggestion = await suggestDailyDish(flowInput);
    return suggestion;
  } catch (error) {
    console.error("Error fetching dish suggestion:", error);
    // Check if error is an instance of Error before accessing message property
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return { error: `Failed to get suggestion: ${errorMessage}` };
  }
}
