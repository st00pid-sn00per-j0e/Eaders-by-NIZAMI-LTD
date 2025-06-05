
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSeriesById, getBooksBySeriesId } from '@/lib/manga-service';
import { Button } from '@/components/ui/button';
import AdBanner from '@/components/ad-banner';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BookMarked, CheckCircle, Users, CalendarDays, ChevronRight, ShieldAlert } from 'lucide-react';
import ChapterListItem from './components/chapter-list-item';
import RewardedUnlockButton from './components/rewarded-unlock-button';
import BookmarkButton from './components/bookmark-button';
import MangaRatingInteractive from './components/manga-rating-interactive';
import SynopsisEnhancer from './components/synopsis-enhancer'; // Import the new component
import type { Series, Book } from '@/types';

interface MangaDetailsPageProps {
  params: {
    id: string; // This is seriesId
  };
}

export async function generateMetadata({ params }: MangaDetailsPageProps) {
  const series = await getSeriesById(params.id);
  if (!series) {
    return { title: 'Series Not Found - Eaders' };
  }
  return {
    title: `${series.metadata.title} - Eaders`,
    description: series.metadata.summary.substring(0, 160),
  };
}

export default async function MangaDetailsPage({ params }: MangaDetailsPageProps) {
  const series = await getSeriesById(params.id);
  
  if (!series) {
    notFound();
  }
  const books = await getBooksBySeriesId(params.id);

  return (
    <div className="space-y-8">
      <section className="bg-card p-6 md:p-8 rounded-lg shadow-lg">
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          <div className="md:col-span-1">
            <div className="aspect-[2/3] relative rounded-md overflow-hidden shadow-md">
              <Image
                src={series.coverImageUrl}
                alt={`Cover of ${series.metadata.title}`}
                layout="fill"
                objectFit="cover"
                priority
                data-ai-hint="manga cover"
              />
            </div>
          </div>
          <div className="md:col-span-2 space-y-4">
            <h1 className="text-3xl md:text-4xl font-headline font-bold text-primary">{series.metadata.title}</h1>
            {series.metadata.authors && series.metadata.authors.length > 0 && (
              <p className="text-lg text-muted-foreground font-medium">By <span className="text-foreground">{series.metadata.authors.map(a => a.name).join(', ')}</span></p>
            )}
            <div className="flex flex-wrap gap-2">
              {series.metadata.genres?.map(genre => (
                <Badge key={genre} variant="secondary" className="text-sm">{genre}</Badge>
              ))}
            </div>
            
            <MangaRatingInteractive series={series} />
            
            {/* Replace direct summary display with SynopsisEnhancer */}
            <SynopsisEnhancer 
              mangaTitle={series.metadata.title} 
              originalSynopsis={series.metadata.summary} 
            />

            <div className="flex flex-wrap gap-2 items-center text-sm text-muted-foreground pt-2">
              {series.metadata.status && (
                <span className="flex items-center capitalize"><CheckCircle className="w-4 h-4 mr-1 text-green-500" /> Status: {series.metadata.status.toLowerCase()}</span>
              )}
              <span className="flex items-center"><Users className="w-4 h-4 mr-1" /> {series.booksCount} Chapters</span>
              {series.lastModifiedDate && <span className="flex items-center"><CalendarDays className="w-4 h-4 mr-1" /> Updated: {new Date(series.lastModifiedDate).toLocaleDateString()}</span>}
            </div>
            <div className="flex flex-wrap gap-3 pt-4">
              {books.length > 0 && !series.premium && (
                <Button asChild size="lg">
                  <Link href={`/manga/${series.id}/chapter/${books[0].id}`}>
                    Read First Chapter <ChevronRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              )}
              <BookmarkButton seriesId={series.id} />
              {series.premium && <RewardedUnlockButton series={series} />}
            </div>
             {series.premium && (
                <div className="mt-4 p-3 bg-accent/20 border border-accent/50 rounded-md flex items-start">
                  <ShieldAlert className="h-5 w-5 text-accent mr-2 mt-0.5 shrink-0" />
                  <p className="text-sm text-accent-foreground">
                    This is a premium series. Unlock access to read its chapters.
                  </p>
                </div>
              )}
          </div>
        </div>
      </section>

      <Separator />
      
      <AdBanner size="medium" />

      <Separator />

      <section aria-labelledby="chapters-heading">
        <div className="flex items-center mb-6">
            <BookMarked className="h-6 w-6 text-primary mr-2" />
            <h2 id="chapters-heading" className="text-2xl font-headline font-semibold">
              Chapters
            </h2>
        </div>
        {books.length > 0 ? (
          <div className="bg-card rounded-lg shadow">
            <ul className="divide-y divide-border">
              {books.map((book: Book) => (
                <ChapterListItem 
                  key={book.id} 
                  seriesId={series.id} 
                  book={book}
                  isLocked={series.premium}
                />
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-muted-foreground">No chapters available for this series yet.</p>
        )}
      </section>
    </div>
  );
}
