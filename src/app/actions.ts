'use server';

import { suggestDailyDish, type SuggestDailyDishOutput } from '@/ai/flows/suggest-daily-dish';
import { getCurrentTimeOfDay } from '@/lib/time-helper';

/**
 * Server action to get a dish suggestion.
 * It determines the time of day and calls the AI flow.
 */
export async function getDishSuggestionAction(): Promise<SuggestDailyDishOutput | { error: string }> {
  try {
    const timeOfDay = getCurrentTimeOfDay();
    const suggestion = await suggestDailyDish({ timeOfDay });
    return suggestion;
  } catch (error) {
    console.error("Error fetching dish suggestion:", error);
    // Check if error is an instance of Error before accessing message property
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return { error: `Failed to get suggestion: ${errorMessage}` };
  }
}
