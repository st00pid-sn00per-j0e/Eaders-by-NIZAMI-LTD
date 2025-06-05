
import type { Series, Book, SeriesMetadata, Author } from '@/types';

const generateBooksForSeries = (seriesId: string, seriesName: string, count: number, isPremium: boolean = false): Book[] => {
  return Array.from({ length: count }, (_, i) => {
    const bookId = `${seriesId}-book-${i + 1}`;
    return {
      id: bookId,
      seriesId: seriesId,
      name: `${seriesName} Chapter ${i + 1}: The Adventure Continues`,
      number: i + 1,
      pagesCount: Math.floor(Math.random() * 10) + 20, // 20-29 pages
      createdDate: new Date().toISOString(),
      lastModifiedDate: new Date().toISOString(),
      media: {
        status: 'READY',
        mediaType: 'application/zip', // example
        pagesCount: Math.floor(Math.random() * 10) + 20, // ensure consistency or derive
      },
      metadata: {
        title: `Chapter ${i + 1}: The Adventure Continues`,
        number: `${i + 1}`,
        numberSort: i + 1,
      },
      // premium status for books might be inherited from series or managed separately
      // For Eaders, premium is on Series level.
    };
  });
};


const authorsPool: Author[][] = [
  [{ name: 'Mangaka Sensei', role: 'writer & artist' }],
  [{ name: 'Tech Noir', role: 'writer' }, { name: 'Cybe Rel', role: 'artist' }],
  [{ name: 'Comi K. Relif', role: 'creator' }],
  [{ name: 'Mysteria Weaver', role: 'storyteller' }],
  [{ name: 'Shinobi Storyteller', role: 'mangaka' }],
];

const allBooks: Book[] = [];

export const mockSeriesList: Series[] = [
  {
    id: 'series-1',
    libraryId: 'lib-main',
    name: 'Epic Quest Saga',
    booksCount: 15,
    metadata: {
      title: 'Epic Quest Saga',
      summary: 'Join our hero on an epic quest to save the world from ancient darkness. This thrilling adventure is full of twists, turns, and unforgettable characters.',
      status: 'ONGOING',
      authors: authorsPool[0],
      genres: ['Adventure', 'Fantasy', 'Action'],
      publisher: 'Shonen Jumpstart',
      releaseDate: '2022-01-15T00:00:00Z',
    },
    coverImageUrl: 'https://placehold.co/300x450.png',
    featured: true,
    averageRating: 4.5,
    ratingCount: 120,
    createdDate: new Date().toISOString(),
    lastModifiedDate: new Date().toISOString(),
  },
  {
    id: 'series-2',
    libraryId: 'lib-main',
    name: 'Cybernetic Dreams',
    booksCount: 50,
    metadata: {
      title: 'Cybernetic Dreams',
      summary: 'In a futuristic city, a young hacker uncovers a conspiracy that could change humanity forever. A tale of technology, rebellion, and hope.',
      status: 'ENDED', // Komga 'ENDED' or 'COMPLETED'
      authors: authorsPool[1],
      genres: ['Sci-Fi', 'Cyberpunk', 'Mystery'],
      publisher: 'Future Tech Comics',
    },
    coverImageUrl: 'https://placehold.co/300x450.png',
    featured: true,
    averageRating: 4.2,
    ratingCount: 95,
  },
  {
    id: 'series-3',
    name: 'School Life Funnies',
    libraryId: 'lib-comedy',
    booksCount: 5, // Lower count for slice of life
    metadata: {
      title: 'School Life Funnies',
      summary: 'A hilarious slice-of-life comedy following the daily antics of a group of high school friends. Get ready for laughter and heartwarming moments!',
      status: 'ONGOING',
      authors: authorsPool[2],
      genres: ['Comedy', 'Slice of Life', 'School'],
    },
    coverImageUrl: 'https://placehold.co/300x450.png',
    averageRating: 3.8,
    ratingCount: 30,
  },
  {
    id: 'series-4',
    name: 'The Last Spellbinder',
    libraryId: 'lib-fantasy',
    booksCount: 120,
    metadata: {
      title: 'The Last Spellbinder',
      summary: 'In a world where magic is fading, the last spellbinder must embark on a perilous journey to restore it. A story of courage, sacrifice, and the power of belief.',
      status: 'COMPLETED',
      authors: authorsPool[3],
      genres: ['Fantasy', 'Magic', 'Drama'],
    },
    coverImageUrl: 'https://placehold.co/300x450.png',
    premium: true,
    averageRating: 4.9,
    ratingCount: 250,
  },
  {
    id: 'series-5',
    name: 'Ninja Way',
    libraryId: 'lib-action',
    booksCount: 200,
    metadata: {
      title: 'Ninja Way',
      summary: 'A young ninja strives to become the strongest in his village, facing challenges and making friends along the way.',
      status: 'HIATUS',
      authors: authorsPool[4],
      genres: ['Action', 'Adventure', 'Martial Arts'],
    },
    coverImageUrl: 'https://placehold.co/300x450.png',
    featured: true,
    averageRating: 4.0,
    ratingCount: 150,
  },
];

// Populate allBooks based on mockSeriesList
mockSeriesList.forEach(series => {
  const books = generateBooksForSeries(series.id, series.name, series.booksCount, series.premium);
  allBooks.push(...books);
});

export const mockBooksData: Book[] = allBooks;

// The service layer will handle the "getById" logic.
// If needed, internal helpers for mock data:
// export const getSeriesById = (id: string): Series | undefined => mockSeriesList.find(s => s.id === id);
// export const getBookById = (id: string): Book | undefined => mockBooksData.find(b => b.id === id);
// export const getBooksBySeriesId = (seriesId: string): Book[] => mockBooksData.filter(b => b.seriesId === seriesId).sort((a,b) => a.number - b.number);
