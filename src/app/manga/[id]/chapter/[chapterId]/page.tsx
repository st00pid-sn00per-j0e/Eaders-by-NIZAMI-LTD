import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getMangaById, getChapterById } from '@/lib/mock-data';
import InterstitialAdDialog from './components/interstitial-ad-dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Home, List } from 'lucide-react';
import AdBanner from '@/components/ad-banner';

interface ChapterPageProps {
  params: {
    id: string; // mangaId
    chapterId: string;
  };
}

export async function generateMetadata({ params }: ChapterPageProps) {
  const manga = getMangaById(params.id);
  const chapter = getChapterById(params.id, params.chapterId);
  if (!manga || !chapter) {
    return { title: 'Chapter Not Found - Eaders' };
  }
  return {
    title: `${manga.title} - ${chapter.title} - Eaders`,
  };
}

export default function ChapterPage({ params }: ChapterPageProps) {
  const manga = getMangaById(params.id);
  const chapter = getChapterById(params.id, params.chapterId);

  if (!manga || !chapter) {
    notFound();
  }

  const chapterIndex = manga.chapters.findIndex(c => c.id === chapter.id);
  const prevChapter = chapterIndex > 0 ? manga.chapters[chapterIndex - 1] : null;
  const nextChapter = chapterIndex < manga.chapters.length - 1 ? manga.chapters[chapterIndex + 1] : null;

  // Placeholder for manga pages
  const pages = Array.from({ length: chapter.pageCount }, (_, i) => `https://placehold.co/800x1200.png?text=Page+${i + 1}`);

  return (
    <div className="mx-auto max-w-3xl">
      <InterstitialAdDialog />
      
      <div className="sticky top-16 md:top-0 bg-background py-2 z-40 mb-4 border-b">
        <div className="container mx-auto px-2 flex flex-col sm:flex-row justify-between items-center">
          <div className="text-center sm:text-left mb-2 sm:mb-0">
            <h1 className="text-xl font-headline font-semibold truncate" title={manga.title}>{manga.title}</h1>
            <p className="text-sm text-muted-foreground truncate" title={chapter.title}>{chapter.title}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild title="Previous Chapter" disabled={!prevChapter}>
              <Link href={prevChapter ? `/manga/${manga.id}/chapter/${prevChapter.id}` : '#'}>
                <ChevronLeft className="h-4 w-4" /> <span className="hidden sm:inline ml-1">Prev</span>
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild title="Chapter List">
              <Link href={`/manga/${manga.id}`}>
                <List className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild title="Next Chapter" disabled={!nextChapter}>
              <Link href={nextChapter ? `/manga/${manga.id}/chapter/${nextChapter.id}` : '#'}>
                <span className="hidden sm:inline mr-1">Next</span> <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {pages.map((pageUrl, index) => (
          <div key={index} className="bg-card p-1 rounded-md shadow-sm">
            <Image
              src={pageUrl}
              alt={`Page ${index + 1} of ${chapter.title}`}
              width={800}
              height={1200}
              className="w-full h-auto rounded"
              priority={index < 3} // Prioritize loading first few pages
              data-ai-hint="manga page"
            />
          </div>
        ))}
      </div>

      <div className="mt-8 py-4 border-t flex justify-between items-center">
        {prevChapter ? (
          <Button variant="outline" asChild>
            <Link href={`/manga/${manga.id}/chapter/${prevChapter.id}`}>
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous Chapter
            </Link>
          </Button>
        ) : <div />}
        {nextChapter ? (
          <Button variant="default" asChild>
            <Link href={`/manga/${manga.id}/chapter/${nextChapter.id}`}>
              Next Chapter <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        ) : (
          <Button variant="outline" asChild>
            <Link href={`/manga/${manga.id}`}>
              Back to Chapters <List className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>
       <AdBanner size="small" className="mt-8" />
    </div>
  );
}
