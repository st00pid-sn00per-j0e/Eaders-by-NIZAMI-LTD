
import type { Metadata } from 'next';
import BookmarksDisplay from './components/bookmarks-display';

export const metadata: Metadata = {
  title: 'My Bookmarks - Eaders',
  description: 'View your bookmarked series and continue reading your favorites.', // Updated "manga series" to "series"
};

export default function BookmarksPage() {
  return <BookmarksDisplay />;
}
