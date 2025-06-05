
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getMangaById, getChapterById } from '@/lib/mock-data';
import type { Manga, Chapter } from '@/types';
import ChapterView from './components/chapter-view'; // New client component

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

  return (
    <ChapterView
      manga={manga}
      chapter={chapter}
      prevChapter={prevChapter}
      nextChapter={nextChapter}
      params={params}
    />
  );
}
