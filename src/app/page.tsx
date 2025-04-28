'use client';

import { useState, useEffect, useTransition, useCallback } from 'react';
import type { SuggestDailyDishOutput } from '@/ai/flows/suggest-daily-dish';
import { getDishSuggestionAction } from './actions';
import { Button } from "@/components/ui/button";
import { DishCard } from "@/components/dish-card";
import { Loader2, ChefHat, RefreshCw, TriangleAlert } from 'lucide-react'; // Added TriangleAlert
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardContent } from '@/components/ui/card'; // Added Card imports
import { Separator } from "@/components/ui/separator";
import { getCurrentTimeOfDay } from '@/lib/time-helper';

export default function Home() {
  const [suggestion, setSuggestion] = useState<SuggestDailyDishOutput | null>(null);
  const [previousSuggestions, setPreviousSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isFetching, startTransition] = useTransition();
  const [initialLoad, setInitialLoad] = useState(true);

  const fetchSuggestion = useCallback(() => {
    setError(null);
    startTransition(async () => {
      const result = await getDishSuggestionAction({ previousDishNames: previousSuggestions });
      if ('error' in result) {
        setError(result.error);
        setSuggestion(null);
      } else {
        // Keyword handling/fallback is now primarily in the flow/component
        setSuggestion(result);
        // Add the new suggestion only if it's different from the last one
        // This check might be redundant if the AI flow is robustly avoiding repeats
        setPreviousSuggestions(prev => prev.includes(result.dishName) ? prev : [...prev, result.dishName]);
      }
      if (initialLoad) {
        setInitialLoad(false);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previousSuggestions, initialLoad]); // Keep dependencies minimal

  useEffect(() => {
    fetchSuggestion();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Fetch only on initial mount

  const timeOfDay = getCurrentTimeOfDay();

  return (
    // Enhanced gradient using theme variables, adjust stops and direction
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-12 bg-gradient-to-b from-background via-secondary/10 to-background dark:from-background dark:via-secondary/20 dark:to-background">
       {/* Increased spacing and refined text styles */}
       <div className="text-center mb-10 space-y-3">
          <ChefHat className="mx-auto h-20 w-20 text-primary animate-bounce drop-shadow-lg" />
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-foreground drop-shadow-sm">
            Spice Route Planner
          </h1>
          <p className="text-xl text-muted-foreground max-w-md mx-auto">
            Your daily guide to healthy <span className="text-primary font-medium">vegetarian</span> North Indian cooking for {timeOfDay}!
          </p>
      </div>

      <div className="w-full max-w-3xl flex flex-col items-center space-y-8">
        {/* Loading State - Improved Skeleton Structure */}
        {(isFetching || initialLoad) && !error && (
          <Card className="w-full mx-auto shadow-xl bg-card/70 backdrop-blur-md border-border/50 overflow-hidden animate-pulse">
            {/* Keep CardHeader simple for skeleton */}
             <CardHeader className="p-4 md:p-6 text-center pb-4">
               <Skeleton className="h-7 w-3/5 mx-auto bg-muted rounded-md" />
               <Skeleton className="h-4 w-4/5 mx-auto mt-2 bg-muted/70 rounded-md" />
             </CardHeader>
             {/* Image Skeleton */}
             <Skeleton className="w-full h-60 md:h-80 bg-muted/60" />
             <Separator className="my-4 md:my-6 bg-border/40" />
             <CardContent className="space-y-6 px-4 md:px-6 pb-6">
               {/* Ingredients Skeleton */}
               <div>
                 <Skeleton className="h-6 w-1/4 mb-4 bg-muted rounded-md" />
                 <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                   <Skeleton className="h-4 w-full bg-muted/70 rounded-md" />
                   <Skeleton className="h-4 w-full bg-muted/70 rounded-md" />
                   <Skeleton className="h-4 w-5/6 bg-muted/70 rounded-md" />
                   <Skeleton className="h-4 w-5/6 bg-muted/70 rounded-md" />
                   <Skeleton className="h-4 w-4/6 bg-muted/70 rounded-md" />
                   <Skeleton className="h-4 w-4/6 bg-muted/70 rounded-md" />
                 </div>
               </div>
               <Separator className="bg-border/40"/>
                {/* Recipe Skeleton */}
               <div>
                 <Skeleton className="h-6 w-1/5 mb-4 bg-muted rounded-md" />
                 <div className="space-y-3">
                   <Skeleton className="h-4 w-full bg-muted/70 rounded-md" />
                   <Skeleton className="h-4 w-full bg-muted/70 rounded-md" />
                   <Skeleton className="h-4 w-3/4 bg-muted/70 rounded-md" />
                   <Skeleton className="h-4 w-5/6 bg-muted/70 rounded-md" />
                 </div>
               </div>
             </CardContent>
           </Card>
        )}

        {/* Error State - Added Icon */}
        {error && !isFetching && (
          <Alert variant="destructive" className="w-full bg-destructive/10 border-destructive/50 text-destructive-foreground shadow-md">
             <TriangleAlert className="h-5 w-5 text-destructive" /> {/* Added Icon */}
             <AlertTitle className="font-semibold ml-2">Oops! Something went wrong.</AlertTitle>
             <AlertDescription className="ml-2">{error}</AlertDescription>
          </Alert>
        )}

        {/* Suggestion Display */}
        {!isFetching && !initialLoad && suggestion && !error && (
          <DishCard dishData={suggestion} />
        )}

        {/* Re-roll Button - Enhanced Styling */}
        <Button
          onClick={fetchSuggestion}
          disabled={isFetching || initialLoad}
          size="lg"
          className="mt-8 w-full max-w-sm shadow-lg transition-all duration-150 ease-in-out hover:scale-[1.03] hover:shadow-xl active:scale-95 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full text-base font-semibold"
          aria-label="Get a new dish suggestion"
        >
          {isFetching ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-5 w-5" />
          )}
          {isFetching ? 'Thinking...' : "Don't like it? Suggest Again!"}
        </Button>
      </div>
    </main>
  );
}
