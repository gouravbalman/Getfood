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
import { UtensilsCrossed, ListChecks, Image as ImageIcon, AlertTriangle, Soup } from 'lucide-react'; // Added Soup icon

interface DishCardProps {
  dishData: SuggestDailyDishOutput;
}

export function DishCard({ dishData }: DishCardProps) {
  const { dishName, recipe, ingredients, imageSearchKeywords } = dishData;
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Construct image URL using Unsplash Source based on refined keywords
  // Replace spaces with commas for potentially better Unsplash results
  const unsplashUrl = `https://source.unsplash.com/800x600/?${encodeURIComponent(imageSearchKeywords.replace(/\s+/g, ','))},food`;
  const fallbackImageUrl = 'https://picsum.photos/800/600'; // General fallback

  const handleImageError = () => {
    console.warn(`Failed to load image from Unsplash for keywords: "${imageSearchKeywords}". Using fallback.`);
    setImageError(true);
    setImageLoading(false); // Ensure loading state is turned off on error
  };

   const handleImageLoad = () => {
     setImageLoading(false);
   };


  // Split recipe steps - assumes steps are separated by newlines and potentially numbered
  const recipeSteps = recipe
    .split('\n')
    .map(step => step.trim())
    .filter(step => step.length > 0)
    // Remove any leading numbers/periods/spaces if AI provided them
    .map(step => step.replace(/^\d+\.\s*/, ''));

  return (
    // Enhanced Card styling: more shadow, subtle border, backdrop blur
    <Card className="w-full max-w-3xl mx-auto shadow-xl bg-card/80 backdrop-blur-md border border-border/30 overflow-hidden rounded-xl transition-all duration-300 ease-in-out hover:shadow-2xl">
      <CardHeader className="text-center p-4 md:p-6 pb-4">
        <CardTitle className="text-3xl md:text-4xl font-bold text-primary drop-shadow-sm flex items-center justify-center gap-2">
          <Soup size={32} className="inline-block" /> {dishName}
        </CardTitle>
        <CardDescription className="text-base mt-1">A healthy and delicious vegetarian North Indian dish for you!</CardDescription>
      </CardHeader>

      {/* Image Section - Improved styling, added loading/error states */}
       <div className="relative w-full h-60 md:h-96 mb-4 md:mb-6 overflow-hidden bg-muted/50">
          {imageLoading && !imageError && (
             <div className="absolute inset-0 flex items-center justify-center bg-muted/70">
               <ImageIcon className="w-12 h-12 text-muted-foreground animate-pulse" />
             </div>
           )}
           <Image
             src={imageError ? fallbackImageUrl : unsplashUrl}
             alt={imageError ? 'Fallback placeholder image' : `Image related to ${dishName}`}
             fill
             style={{ objectFit: 'cover' }}
             className={`transition-opacity duration-500 ease-in-out ${imageLoading ? 'opacity-0' : 'opacity-100'} group-hover:scale-105 transform-gpu transition-transform duration-300`}
             onError={handleImageError}
             onLoad={handleImageLoad}
             unoptimized // Keep for external URLs like Unsplash/Picsum unless configured
             priority // Load image sooner
           />
           {/* Subtle overlay for text legibility if needed, or remove if image quality is good */}
           {/* <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div> */}
           <div className={`absolute bottom-2 left-2 p-1.5 px-2.5 bg-black/60 rounded text-xs text-white/90 flex items-center gap-1.5 backdrop-blur-sm ${imageLoading ? 'hidden' : ''}`}>
             {imageError ? <AlertTriangle size={14} className="text-yellow-400"/> : <ImageIcon size={14}/>}
             {imageError ? 'Using Fallback Image' : 'Image from Unsplash'}
           </div>
        </div>

      <Separator className="mb-4 md:mb-6 bg-border/40" />

      <CardContent className="space-y-6 md:space-y-8 px-4 md:px-8 pb-6 md:pb-8">
        {/* Ingredients Section */}
        <div>
          <h3 className="text-xl md:text-2xl font-semibold mb-3 flex items-center gap-2 text-foreground">
            <ListChecks className="w-6 h-6 text-accent" />
            Ingredients
          </h3>
          {/* Using grid for better alignment */}
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
          {/* Ordered list with better spacing and clarity */}
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
