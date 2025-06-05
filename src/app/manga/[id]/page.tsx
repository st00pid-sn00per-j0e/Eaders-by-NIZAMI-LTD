
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getMangaById } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import AdBanner from '@/components/ad-banner';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BookMarked, CheckCircle, Users, CalendarDays, ChevronRight, ShieldAlert } from 'lucide-react';
import ChapterListItem from './components/chapter-list-item';
import RewardedUnlockButton from './components/rewarded-unlock-button';
import BookmarkButton from './components/bookmark-button';
import MangaRatingInteractive from './components/manga-rating-interactive'; // New component

interface MangaDetailsPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: MangaDetailsPageProps) {
  const manga = getMangaById(params.id);
  if (!manga) {
    return { title: 'Manga Not Found - Eaders' };
  }
  return {
    title: `${manga.title} - Eaders`,
    description: manga.description.substring(0, 160),
  };
}

export default function MangaDetailsPage({ params }: MangaDetailsPageProps) {
  const manga = getMangaById(params.id);

  if (!manga) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <section className="bg-card p-6 md:p-8 rounded-lg shadow-lg">
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          <div className="md:col-span-1">
            <div className="aspect-[2/3] relative rounded-md overflow-hidden shadow-md">
              <Image
                src={manga.coverImageUrl}
                alt={`Cover of ${manga.title}`}
                layout="fill"
                objectFit="cover"
                priority
                data-ai-hint="manga cover"
              />
            </div>
          </div>
          <div className="md:col-span-2 space-y-4">
            <h1 className="text-3xl md:text-4xl font-headline font-bold text-primary">{manga.title}</h1>
            {manga.author && (
              <p className="text-lg text-muted-foreground font-medium">By <span className="text-foreground">{manga.author}</span></p>
            )}
            <div className="flex flex-wrap gap-2">
              {manga.genres?.map(genre => (
                <Badge key={genre} variant="secondary" className="text-sm">{genre}</Badge>
              ))}
            </div>
            
            <MangaRatingInteractive manga={manga} />
            
            <p className="text-base leading-relaxed">{manga.description}</p>
            <div className="flex flex-wrap gap-2 items-center text-sm text-muted-foreground">
              {manga.status && (
                <span className="flex items-center"><CheckCircle className="w-4 h-4 mr-1 text-green-500" /> Status: {manga.status}</span>
              )}
              <span className="flex items-center"><Users className="w-4 h-4 mr-1" /> {manga.chapters.length} Chapters</span>
              <span className="flex items-center"><CalendarDays className="w-4 h-4 mr-1" /> Updated: Recently</span>
            </div>
            <div className="flex flex-wrap gap-3 pt-4">
              {manga.chapters.length > 0 && !manga.premium && (
                <Button asChild size="lg">
                  <Link href={`/manga/${manga.id}/chapter/${manga.chapters[0].id}`}>
                    Read First Chapter <ChevronRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              )}
              <BookmarkButton mangaId={manga.id} />
              {manga.premium && <RewardedUnlockButton manga={manga} />}
            </div>
             {manga.premium && (
                <div className="mt-4 p-3 bg-accent/20 border border-accent/50 rounded-md flex items-start">
                  <ShieldAlert className="h-5 w-5 text-accent mr-2 mt-0.5 shrink-0" />
                  <p className="text-sm text-accent-foreground">
                    This is a premium manga. Unlock access to read its chapters.
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
        {manga.chapters.length > 0 ? (
          <div className="bg-card rounded-lg shadow">
            <ul className="divide-y divide-border">
              {manga.chapters.map((chapter, index) => (
                <ChapterListItem 
                  key={chapter.id} 
                  mangaId={manga.id} 
                  chapter={chapter} 
                  isLocked={manga.premium}
                />
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-muted-foreground">No chapters available for this manga yet.</p>
        )}
      </section>
    </div>
  );
}
