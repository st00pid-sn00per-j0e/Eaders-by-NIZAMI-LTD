
import React from 'react';
import type { Metadata } from 'next';
import { getSeriesList } from '@/lib/manga-service';
import type { Series } from '@/types'; // Changed from Manga to Series
import MangaCard from '@/components/manga-card'; // Adapts to Series
import { Separator } from '@/components/ui/separator';
import { Tag as TagIcon } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Manga Categories - Eaders',
  description: 'Browse manga by categories and genres. Find your next favorite read organized by tags.',
};

interface CategorizedSeries { // Changed from Manga to Series
  [genre: string]: Series[];
}

const groupSeriesByGenre = (seriesList: Series[]): CategorizedSeries => {
  const categorized: CategorizedSeries = {};
  seriesList.forEach(series => {
    if (series.metadata.genres && series.metadata.genres.length > 0) {
      series.metadata.genres.forEach(genre => {
        if (!categorized[genre]) {
          categorized[genre] = [];
        }
        categorized[genre].push(series);
      });
    }
  });
  return categorized;
};

export default async function CategoriesPage() {
  const allSeries = await getSeriesList();
  const categorizedSeries = groupSeriesByGenre(allSeries);
  const sortedGenres = Object.keys(categorizedSeries).sort((a, b) => a.localeCompare(b));

  if (sortedGenres.length === 0) {
    return (
      <div className="text-center py-10">
        <TagIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-3xl font-headline font-bold mb-4 text-primary">Manga Categories</h1>
        <p className="text-lg text-muted-foreground">No categories found or no series have been assigned genres yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <section className="pt-8 pb-4 bg-card rounded-lg shadow-sm">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-3xl md:text-4xl font-headline font-bold mb-3 text-primary">
            Browse by Category
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover manga series organized by your favorite genres.
          </p>
        </div>
      </section>

      {sortedGenres.map((genre, index) => (
        <React.Fragment key={genre}>
          {index > 0 && <Separator className="my-8 md:my-12" />}
          <section aria-labelledby={`genre-heading-${genre.toLowerCase().replace(/\s+/g, '-')}`}>
            <div className="flex items-center mb-6 px-1">
              <TagIcon className="h-5 w-5 md:h-6 md:w-6 text-accent mr-2 md:mr-3 shrink-0" />
              <h2 
                id={`genre-heading-${genre.toLowerCase().replace(/\s+/g, '-')}`} 
                className="text-xl md:text-2xl font-headline font-semibold text-foreground"
              >
                {genre}
              </h2>
            </div>
            {categorizedSeries[genre] && categorizedSeries[genre].length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {categorizedSeries[genre].map((series: Series) => (
                  <MangaCard key={series.id} series={series} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No series found in this category.</p>
            )}
          </section>
        </React.Fragment>
      ))}
    </div>
  );
}
