'use client';

import { useState, useEffect, useTransition } from 'react';
import type { SuggestDailyDishOutput } from '@/ai/flows/suggest-daily-dish';
import { getDishSuggestionAction } from './actions';
import { Button } from "@/components/ui/button";
import { DishCard } from "@/components/dish-card";
import { Loader2, ChefHat, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardContent } from "@/components/ui/card"; // Import Card components
import { Separator } from "@/components/ui/separator"; // Import Separator
import { getCurrentTimeOfDay } from '@/lib/time-helper';

export default function Home() {
  const [suggestion, setSuggestion] = useState<SuggestDailyDishOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFetching, startTransition] = useTransition();
  const [initialLoad, setInitialLoad] = useState(true); // Track initial load

  const fetchSuggestion = () => {
    setError(null); // Clear previous errors
    startTransition(async () => {
      const result = await getDishSuggestionAction();
      if ('error' in result) {
        setError(result.error);
        setSuggestion(null);
      } else {
        setSuggestion(result);
      }
      if (initialLoad) {
        setInitialLoad(false); // Mark initial load complete
      }
    });
  };

  // Fetch initial suggestion on component mount
  useEffect(() => {
    fetchSuggestion();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures this runs only once on mount

  const timeOfDay = getCurrentTimeOfDay();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-gradient-to-br from-background to-secondary/20">
       <div className="text-center mb-8 space-y-2">
          <ChefHat className="mx-auto h-16 w-16 text-primary animate-bounce" />
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Spice Route Planner
          </h1>
          <p className="text-lg text-muted-foreground">
            Your daily guide to healthy North Indian cooking for {timeOfDay}!
          </p>
      </div>

      <div className="w-full max-w-2xl flex flex-col items-center space-y-6">
        {/* Loading State */}
        {(isFetching || initialLoad) && !error && (
          <Card className="w-full max-w-2xl mx-auto shadow-lg">
            <CardHeader className="text-center pb-4">
              <Skeleton className="h-8 w-3/5 mx-auto" />
              <Skeleton className="h-4 w-4/5 mx-auto mt-2" />
            </CardHeader>
            <Separator className="mb-4" />
            <CardContent className="space-y-6">
              <div>
                <Skeleton className="h-6 w-1/4 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-5/6 mb-1" />
                <Skeleton className="h-4 w-4/6" />
              </div>
              <Separator />
              <div>
                <Skeleton className="h-6 w-1/5 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </CardContent>
           </Card>
        )}

        {/* Error State */}
        {error && !isFetching && (
          <Alert variant="destructive" className="w-full">
            <AlertTitle>Oops! Something went wrong.</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Suggestion Display */}
        {!isFetching && !initialLoad && suggestion && !error && (
          <DishCard dishData={suggestion} />
        )}

        {/* Re-roll Button */}
        <Button
          onClick={fetchSuggestion}
          disabled={isFetching || initialLoad} // Disable during initial load too
          size="lg"
          className="mt-6 w-full max-w-xs shadow-md transition-transform duration-150 ease-in-out hover:scale-105 active:scale-95"
          aria-label="Get a new dish suggestion"
        >
          {isFetching ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-5 w-5" />
          )}
          {isFetching ? 'Thinking...' : "I don't like this, suggest again!"}
        </Button>
      </div>
    </main>
  );
}
