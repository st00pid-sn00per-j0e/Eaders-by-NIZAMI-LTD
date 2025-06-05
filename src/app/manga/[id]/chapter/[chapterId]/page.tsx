
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getSeriesById, getBookById, getBooksBySeriesId } from '@/lib/manga-service';
import type { Series, Book } from '@/types'; // Import new types
import ChapterView from './components/chapter-view';

interface ChapterPageProps {
  params: {
    id: string; // This is seriesId
    chapterId: string; // This is bookId
  };
}

export async function generateMetadata({ params }: ChapterPageProps) {
  const series = await getSeriesById(params.id);
  const book = await getBookById(params.chapterId); // chapterId is bookId
  if (!series || !book) {
    return { title: 'Chapter Not Found - Eaders' };
  }
  return {
    // Use series.metadata.title and book.name or book.metadata.title
    title: `${series.metadata.title} - ${book.name || `Chapter ${book.number}`} - Eaders`,
  };
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const series = await getSeriesById(params.id);
  const currentBook = await getBookById(params.chapterId);

  if (!series || !currentBook) {
    notFound();
  }

  // Fetch all books for the series to find previous/next
  const allBooksInSeries = await getBooksBySeriesId(series.id);
  const currentBookIndex = allBooksInSeries.findIndex(b => b.id === currentBook.id);

  const prevBook = currentBookIndex > 0 ? allBooksInSeries[currentBookIndex - 1] : null;
  const nextBook = currentBookIndex < allBooksInSeries.length - 1 ? allBooksInSeries[currentBookIndex + 1] : null;

  return (
    <ChapterView
      series={series}
      book={currentBook}
      prevBook={prevBook}
      nextBook={nextBook}
      // params are still id and chapterId from route
    />
  );
}
