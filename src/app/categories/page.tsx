import React from 'react';
import type { Metadata } from 'next';
import { mockMangaList } from '@/lib/mock-data';
import type { Manga } from '@/types';
import MangaCard from '@/components/manga-card';
import { Separator } from '@/components/ui/separator';
import { Tag as TagIcon } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Manga Categories - Eaders',
  description: 'Browse manga by categories and genres. Find your next favorite read organized by tags.',
};

interface CategorizedManga {
  [genre: string]: Manga[];
}

const groupMangaByGenre = (mangaList: Manga[]): CategorizedManga => {
  const categorized: CategorizedManga = {};
  mangaList.forEach(manga => {
    if (manga.genres && manga.genres.length > 0) {
      manga.genres.forEach(genre => {
        if (!categorized[genre]) {
          categorized[genre] = [];
        }
        categorized[genre].push(manga);
      });
    }
  });
  return categorized;
};

export default function CategoriesPage() {
  const categorizedManga = groupMangaByGenre(mockMangaList);
  const sortedGenres = Object.keys(categorizedManga).sort((a, b) => a.localeCompare(b));

  if (sortedGenres.length === 0) {
    return (
      <div className="text-center py-10">
        <TagIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-3xl font-headline font-bold mb-4 text-primary">Manga Categories</h1>
        <p className="text-lg text-muted-foreground">No categories found or no manga have been assigned genres yet.</p>
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
            {categorizedManga[genre] && categorizedManga[genre].length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {categorizedManga[genre].map((manga: Manga) => (
                  <MangaCard key={manga.id} manga={manga} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No manga found in this category.</p>
            )}
          </section>
        </React.Fragment>
      ))}
    </div>
  );
}
