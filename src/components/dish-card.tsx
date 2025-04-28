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
import { UtensilsCrossed, ListChecks } from 'lucide-react';

interface DishCardProps {
  dishData: SuggestDailyDishOutput;
}

export function DishCard({ dishData }: DishCardProps) {
  const { dishName, recipe, ingredients } = dishData;

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-3xl font-bold text-primary">{dishName}</CardTitle>
        <CardDescription>A healthy and delicious North Indian dish for you!</CardDescription>
      </CardHeader>
      <Separator className="mb-4" />
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-2 flex items-center gap-2 text-secondary-foreground">
            <ListChecks className="w-5 h-5" />
            Ingredients
          </h3>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground pl-2">
            {ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>
        <Separator />
        <div>
          <h3 className="text-xl font-semibold mb-2 flex items-center gap-2 text-secondary-foreground">
            <UtensilsCrossed className="w-5 h-5" />
            Recipe
          </h3>
          <p className="text-foreground whitespace-pre-line leading-relaxed">{recipe}</p>
        </div>
      </CardContent>
    </Card>
  );
}
