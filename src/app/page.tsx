
"use client"; // Needs to be client for preventDefault

import React from 'react'; // Import React for event handling type
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Star } from "lucide-react";
import MangaCard from "@/components/manga-card";
import AdBanner from "@/components/ad-banner";
import { getSeriesList } from "@/lib/manga-service";
import type { Series } from "@/types";
import MangaCardSkeleton from '@/components/manga-card-skeleton'; // For loading state

export default function HomePage() {
  const [featuredSeries, setFeaturedSeries] = React.useState<Series[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadFeatured() {
      setIsLoading(true);
      const series = await getSeriesList({ featured: true });
      setFeaturedSeries(series);
      setIsLoading(false);
    }
    loadFeatured();
  }, []);

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // In a real app, you would handle search logic here
    // For now, we just prevent the page reload
    console.log("Search submitted (no action configured).");
  };

  return (
    <div className="space-y-12">
      <section aria-labelledby="search-manga-heading" className="py-8 bg-card rounded-lg shadow-sm">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 id="search-manga-heading" className="text-3xl md:text-4xl font-headline font-bold mb-4 text-primary">
            Find Your Next Favorite Manga
          </h1>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Explore a vast collection of manga across all genres. Start your reading adventure now!
          </p>
          <form className="max-w-xl mx-auto flex gap-2" onSubmit={handleSearchSubmit}>
            <Input
              type="search"
              placeholder="Search for manga titles, authors, or genres..."
              className="flex-grow text-base"
              aria-label="Search manga"
            />
            <Button type="submit" size="lg">
              <Search className="mr-2 h-5 w-5" />
              Search
            </Button>
          </form>
        </div>
      </section>

      <AdBanner size="medium" />

      <section aria-labelledby="featured-manga-heading">
        <div className="flex items-center mb-6">
          <Star className="h-6 w-6 text-accent mr-2" />
          <h2 id="featured-manga-heading" className="text-2xl font-headline font-semibold">
            Featured Series
          </h2>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <MangaCardSkeleton key={`featured-skeleton-${index}`} />
            ))}
          </div>
        ) : featuredSeries.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {featuredSeries.map((series: Series) => (
              <MangaCard key={series.id} series={series} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No featured series available at the moment. Check back soon!</p>
        )}
      </section>
    </div>
  );
}
