'use client';

import type { SuggestDailyDishOutput } from '@/ai/flows/suggest-daily-dish';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { UtensilsCrossed, ListChecks, Soup, Flame, Wheat, Leaf, Orbit, Brain } from 'lucide-react'; // Added nutrition icons
import { cn } from '@/lib/utils'; // Import cn for conditional classes

interface DishCardProps {
  dishData: SuggestDailyDishOutput;
}

// Helper function to get an appropriate icon for a nutrient
function getNutrientIcon(nutrientName: string): React.ReactNode {
    const lowerCaseName = nutrientName.toLowerCase();
    if (lowerCaseName.includes('calorie')) return <Flame className="w-5 h-5" />;
    if (lowerCaseName.includes('protein')) return <Wheat className="w-5 h-5" />; // Using Wheat as a proxy for protein source
    if (lowerCaseName.includes('fiber')) return <Leaf className="w-5 h-5" />;
    if (lowerCaseName.includes('fat')) return <Orbit className="w-5 h-5" />; // Using Orbit as an abstract representation
    if (lowerCaseName.includes('carbohydrate')) return <Brain className="w-5 h-5" />; // Using Brain as carbs are fuel
    return <Soup className="w-5 h-5" />; // Default icon
}

// Helper function to generate gradient background based on nutrient name
function getNutrientGradient(nutrientName: string): string {
    const lowerCaseName = nutrientName.toLowerCase();
    if (lowerCaseName.includes('calorie')) return 'from-red-500/20 to-orange-500/20';
    if (lowerCaseName.includes('protein')) return 'from-yellow-500/20 to-amber-500/20';
    if (lowerCaseName.includes('fiber')) return 'from-green-500/20 to-lime-500/20';
    if (lowerCaseName.includes('fat')) return 'from-purple-500/20 to-violet-500/20';
    if (lowerCaseName.includes('carbohydrate')) return 'from-blue-500/20 to-sky-500/20';
    return 'from-muted/30 to-muted/10'; // Default gradient
}

export function DishCard({ dishData }: DishCardProps) {
  // Destructure nutritionalInfo from dishData
  const { dishName, recipe, ingredients, nutritionalInfo } = dishData;

  // Split recipe steps
  const recipeSteps = recipe
    .split('\n')
    .map(step => step.trim())
    .filter(step => step.length > 0)
    .map(step => step.replace(/^\d+\.\s*/, ''));

  return (
    // Enhanced Card styling maintained
    <Card className="w-full max-w-3xl mx-auto shadow-xl bg-card/80 backdrop-blur-md border border-border/30 overflow-hidden rounded-xl transition-all duration-300 ease-in-out hover:shadow-2xl">
      <CardHeader className="text-center p-4 md:p-6 pb-4">
        <CardTitle className="text-3xl md:text-4xl font-bold text-primary drop-shadow-sm flex items-center justify-center gap-2">
          <Soup size={32} className="inline-block" /> {dishName}
        </CardTitle>
        <CardDescription className="text-base mt-1">A healthy and delicious vegetarian North Indian dish for you!</CardDescription>
      </CardHeader>

      {/* REMOVED Image Section */}

      <Separator className="mb-4 md:mb-6 bg-border/40" />

      <CardContent className="space-y-6 md:space-y-8 px-4 md:px-8 pb-6 md:pb-8">

        {/* Nutritional Information Section */}
        {nutritionalInfo && nutritionalInfo.length > 0 && (
            <div>
                <h3 className="text-xl md:text-2xl font-semibold mb-4 flex items-center gap-2 text-foreground">
                    <Leaf className="w-6 h-6 text-green-500" /> {/* Using Leaf icon for overall nutrition */}
                    Estimated Nutrition (per serving)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
                    {nutritionalInfo.map((nutrient, index) => (
                    <div
                        key={index}
                        className={cn(
                        "p-3 rounded-lg shadow-md flex flex-col items-center justify-center text-center border border-border/20 bg-gradient-to-br",
                        getNutrientGradient(nutrient.name) // Apply gradient background
                        )}
                    >
                        <div className="mb-1 text-primary"> {/* Icon color uses primary theme color */}
                            {getNutrientIcon(nutrient.name)}
                        </div>
                        <p className="text-sm font-medium text-foreground/90">{nutrient.name}</p>
                        <p className="text-lg font-bold text-foreground">{nutrient.quantity}</p>
                    </div>
                    ))}
                </div>
            </div>
        )}

        {nutritionalInfo && nutritionalInfo.length > 0 && <Separator className="bg-border/40"/>}


        {/* Ingredients Section */}
        <div>
          <h3 className="text-xl md:text-2xl font-semibold mb-3 flex items-center gap-2 text-foreground">
            <ListChecks className="w-6 h-6 text-accent" />
            Ingredients
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-muted-foreground pl-4 list-disc">
            {ingredients.map((ingredient, index) => (
              <li key={index} className="break-words">{ingredient}</li>
            ))}
          </ul>
        </div>

        <Separator className="bg-border/40"/>

        {/* Recipe Section */}
        <div>
          <h3 className="text-xl md:text-2xl font-semibold mb-4 flex items-center gap-2 text-foreground">
            <UtensilsCrossed className="w-6 h-6 text-accent" />
            Recipe Steps
          </h3>
          <ol className="space-y-4 text-foreground pl-6 list-decimal list-outside">
             {recipeSteps.map((step, index) => (
                <li key={index} className="leading-relaxed">
                    <span className="font-medium">Step {index + 1}:</span> {step}
                </li>
             ))}
          </ol>
           {recipeSteps.length === 0 && (
                <p className="text-muted-foreground italic mt-2">Recipe steps could not be processed.</p>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
