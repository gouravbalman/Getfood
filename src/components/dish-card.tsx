'use client';

import type { SuggestDailyDishOutput } from '@/ai/flows/suggest-daily-dish';
import Image from 'next/image';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { UtensilsCrossed, ListChecks, Image as ImageIcon, AlertTriangle } from 'lucide-react';

interface DishCardProps {
  dishData: SuggestDailyDishOutput;
}

export function DishCard({ dishData }: DishCardProps) {
  const { dishName, recipe, ingredients, imageSearchKeywords } = dishData;
  const [imageError, setImageError] = useState(false);

  // Construct image URL using Unsplash Source based on keywords
  // Replace spaces with commas for better search results
  const unsplashUrl = `https://source.unsplash.com/600x400/?${encodeURIComponent(imageSearchKeywords.replace(/\s+/g, ','))}`;
  const fallbackImageUrl = 'https://picsum.photos/600/400'; // General fallback

  const handleImageError = () => {
    console.warn(`Failed to load image from Unsplash for keywords: ${imageSearchKeywords}. Using fallback.`);
    setImageError(true);
  };

  // Split recipe steps - assumes steps are separated by newlines and potentially numbered
  const recipeSteps = recipe
    .split('\n')
    .map(step => step.trim())
    .filter(step => step.length > 0)
    // Remove any leading numbers/periods/spaces if AI provided them
    .map(step => step.replace(/^\d+\.\s*/, ''));

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg bg-card/80 backdrop-blur-sm border-border/50 overflow-hidden">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-3xl font-bold text-primary">{dishName}</CardTitle>
        <CardDescription>A healthy and delicious North Indian dish for you!</CardDescription>
      </CardHeader>

      {/* Image Section */}
      <div className="relative w-full h-64 md:h-80 mb-4 overflow-hidden rounded-t-lg group bg-muted/50">
           <Image
             src={imageError ? fallbackImageUrl : unsplashUrl}
             alt={`Image related to ${dishName}`}
             fill // Use fill instead of layout
             style={{ objectFit: 'cover' }} // Use style for objectFit with fill
             className="transition-transform duration-300 ease-in-out group-hover:scale-105"
             onError={handleImageError}
             // Add placeholder if desired, e.g., blurDataURL with 'placeholder="blur"'
             unoptimized // Keep for external URLs like Unsplash/Picsum unless configured
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
           <div className="absolute bottom-2 left-2 p-2 bg-black/50 rounded text-xs text-white/80 flex items-center gap-1">
             {imageError ? <AlertTriangle size={14} className="text-yellow-400"/> : <ImageIcon size={14}/>}
             {imageError ? 'Fallback Image' : 'Image from Unsplash'}
           </div>
        </div>

      <Separator className="mb-4 bg-border/50" />

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

        <Separator className="bg-border/50"/>

        <div>
          <h3 className="text-xl font-semibold mb-3 flex items-center gap-2 text-secondary-foreground">
            <UtensilsCrossed className="w-5 h-5 text-accent" />
            Recipe Steps
          </h3>
          {/* Render recipe steps as an ordered list */}
          <ol className="list-decimal list-outside space-y-3 text-foreground pl-6 leading-relaxed">
             {recipeSteps.map((step, index) => (
                <li key={index}>{step}</li>
             ))}
          </ol>
           {recipeSteps.length === 0 && (
                <p className="text-muted-foreground italic">Recipe steps could not be processed.</p>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
