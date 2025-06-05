
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { enhanceSynopsis, type EnhanceSynopsisInput } from '@/ai/flows/enhance-synopsis-flow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface SynopsisEnhancerProps {
  mangaTitle: string;
  originalSynopsis: string;
}

export default function SynopsisEnhancer({ mangaTitle, originalSynopsis }: SynopsisEnhancerProps) {
  const [currentSynopsis, setCurrentSynopsis] = useState(originalSynopsis);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleEnhanceSynopsis = async () => {
    setIsLoading(true);
    try {
      const input: EnhanceSynopsisInput = { mangaTitle, originalSynopsis };
      const result = await enhanceSynopsis(input);
      setCurrentSynopsis(result.enhancedSynopsis);
      toast({
        title: "Synopsis Enhanced!",
        description: "The AI has generated a new synopsis.",
      });
    } catch (error) {
      console.error("Error enhancing synopsis:", error);
      toast({
        title: "Error",
        description: "Could not enhance synopsis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mt-6 bg-card/50">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <div>
            <CardTitle className="text-xl font-headline">Synopsis</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Original synopsis below. Click enhance for an AI-powered version!
            </p>
          </div>
          <Button onClick={handleEnhanceSynopsis} disabled={isLoading} size="sm" className="w-full sm:w-auto">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Enhance with AI
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && currentSynopsis === originalSynopsis ? (
            <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
                <div className="h-4 bg-muted rounded w-5/6 animate-pulse"></div>
                <p className="text-base leading-relaxed whitespace-pre-line text-transparent select-none">{originalSynopsis}</p> {/* Keep layout */}
            </div>
        ) : (
            <p className="text-base leading-relaxed whitespace-pre-line">{currentSynopsis}</p>
        )}

        {currentSynopsis !== originalSynopsis && !isLoading && (
             <Button 
                onClick={() => setCurrentSynopsis(originalSynopsis)} 
                variant="link" 
                size="sm" 
                className="mt-3 p-0 h-auto text-sm text-muted-foreground hover:text-primary"
             >
                Revert to Original Synopsis
             </Button>
        )}
      </CardContent>
    </Card>
  );
}
