'use client';

import type { SuggestDailyDishOutput } from '@/ai/flows/suggest-daily-dish';
import Image from 'next/image'; // Import next/image
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { UtensilsCrossed, ListChecks, Image as ImageIcon } from 'lucide-react'; // Added ImageIcon

interface DishCardProps {
  dishData: SuggestDailyDishOutput;
}

export function DishCard({ dishData }: DishCardProps) {
  const { dishName, recipe, ingredients, imageUrl } = dishData;

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg bg-card/80 backdrop-blur-sm border-border/50">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-3xl font-bold text-primary">{dishName}</CardTitle>
        <CardDescription>A healthy and delicious North Indian dish for you!</CardDescription>
      </CardHeader>

      {/* Image Section */}
      {imageUrl && (
        <div className="relative w-full h-64 md:h-80 mb-4 overflow-hidden rounded-t-lg group">
           <Image
             src={imageUrl}
             alt={`Image of ${dishName}`}
             layout="fill"
             objectFit="cover"
             className="transition-transform duration-300 ease-in-out group-hover:scale-105"
             // Add placeholder if desired, e.g., blurDataURL with 'placeholder="blur"'
             unoptimized // Necessary for external URLs like picsum unless configured in next.config.js
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
           <div className="absolute bottom-2 left-2 p-2 bg-black/50 rounded text-xs text-white/80 flex items-center gap-1">
             <ImageIcon size={14}/> Placeholder Image
           </div>
        </div>
      )}

      <Separator className="mb-4" />

      <CardContent className="space-y-6 px-4 md:px-6 pb-6">
        <div>
          <h3 className="text-xl font-semibold mb-3 flex items-center gap-2 text-secondary-foreground">
            <ListChecks className="w-5 h-5 text-accent" />
            Ingredients
          </h3>
          <ul className="list-disc list-inside space-y-1.5 text-muted-foreground pl-3 columns-2">
            {ingredients.map((ingredient, index) => (
              <li key={index} className="break-inside-avoid">{ingredient}</li>
            ))}
          </ul>
        </div>

        <Separator />

        <div>
          <h3 className="text-xl font-semibold mb-3 flex items-center gap-2 text-secondary-foreground">
            <UtensilsCrossed className="w-5 h-5 text-accent" />
            Recipe
          </h3>
          {/* Split recipe into paragraphs for better readability */}
          {recipe.split('\n').map((paragraph, index) => (
             paragraph.trim() && <p key={index} className="text-foreground whitespace-pre-line leading-relaxed mb-3">{paragraph.trim()}</p>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
