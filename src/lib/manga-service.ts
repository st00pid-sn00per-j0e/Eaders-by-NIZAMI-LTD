
'use server';

import type { Series, Book, Page, SeriesMetadata, Author } from '@/types';
import {
  mockSeriesList,
  mockBooksData,
} from './mock-data';

// Helper to transform Komga series data to our Series type
function transformKomgaSeries(komgaSeries: any, komgaBaseUrl: string): Series {
  const authors = komgaSeries.metadata.authors?.map((a: any): Author => ({ name: a.name, role: a.role })) || [];
  const genres = komgaSeries.metadata.tags || []; // Komga uses 'tags' for genres

  return {
    id: komgaSeries.id,
    libraryId: komgaSeries.libraryId,
    name: komgaSeries.name,
    booksCount: komgaSeries.booksCount || 0,
    booksReadCount: komgaSeries.booksReadCount || 0,
    booksUnreadCount: komgaSeries.booksUnreadCount || 0,
    booksInProgressCount: komgaSeries.booksInProgressCount || 0,
    metadata: {
      title: komgaSeries.metadata.title || komgaSeries.name,
      summary: komgaSeries.metadata.summary || '',
      status: (komgaSeries.metadata.status?.toUpperCase() || 'UNKNOWN') as SeriesMetadata['status'],
      authors: authors,
      genres: genres,
      publisher: komgaSeries.metadata.publisher || '',
      releaseDate: komgaSeries.metadata.releaseDate,
    },
    coverImageUrl: `${komgaBaseUrl}/api/v1/series/${komgaSeries.id}/thumbnail`,
    createdDate: komgaSeries.created,
    lastModifiedDate: komgaSeries.lastModified,
    featured: false, // Komga doesn't have a 'featured' flag by default
    premium: false, // Komga doesn't have a 'premium' flag by default; needs custom logic if required
    averageRating: 0, // Komga doesn't have ratings; app uses its own
    ratingCount: 0,
  };
}

// Helper to transform Komga book data to our Book type
function transformKomgaBook(komgaBook: any): Book {
  const authors = komgaBook.metadata.authors?.map((a: any): Author => ({ name: a.name, role: a.role })) || [];
  return {
    id: komgaBook.id,
    seriesId: komgaBook.seriesId,
    name: komgaBook.name || `Chapter ${komgaBook.number}`,
    number: komgaBook.number,
    url: komgaBook.url, // Komga might provide a direct URL, otherwise constructed
    createdDate: komgaBook.created,
    lastModifiedDate: komgaBook.lastModified,
    fileLastModified: komgaBook.fileLastModified,
    sizeBytes: komgaBook.sizeBytes,
    media: {
      status: komgaBook.media?.status || 'UNKNOWN',
      mediaType: komgaBook.media?.mediaType,
      pagesCount: komgaBook.media?.pagesCount || 0,
      comment: komgaBook.media?.comment,
    },
    metadata: {
      title: komgaBook.metadata?.title || komgaBook.name,
      summary: komgaBook.metadata?.summary,
      number: komgaBook.metadata?.number || String(komgaBook.number),
      numberSort: komgaBook.metadata?.numberSort || komgaBook.number,
      releaseDate: komgaBook.metadata?.releaseDate,
      authors: authors,
    },
    readProgress: komgaBook.readProgress ? {
        page: komgaBook.readProgress.page,
        completed: komgaBook.readProgress.completed,
        readDate: komgaBook.readProgress.readDate,
    } : undefined,
    pagesCount: komgaBook.media?.pagesCount || 0,
  };
}


export async function getSeriesList(filters?: { featured?: boolean }): Promise<Series[]> {
  const komgaBaseUrl = process.env.KOMGA_BASE_URL;
  const komgaApiKey = process.env.KOMGA_API_KEY;

  if (komgaBaseUrl && komgaApiKey) {
    try {
      // Komga API parameters for paging, sorting etc. can be added here if needed
      // e.g. /api/v1/series?page=0&size=20&sort=metadata.titleSort,asc
      const response = await fetch(`${komgaBaseUrl}/api/v1/series?unpaged=true`, { // unpaged=true for all series
        headers: { 'X-Api-Key': komgaApiKey },
        next: { revalidate: 3600 } // Revalidate cache every hour
      });

      if (!response.ok) {
        console.error(`Failed to fetch series from Komga: ${response.status} ${response.statusText}. Response: ${await response.text()}`);
        throw new Error('Failed to fetch series from Komga');
      }

      const komgaData = await response.json();
      
      if (!komgaData || !komgaData.content) {
        console.error('Komga series response is not in expected format:', komgaData);
        throw new Error('Invalid series data format from Komga');
      }

      const seriesList: Series[] = komgaData.content.map((s: any) => transformKomgaSeries(s, komgaBaseUrl));
      
      // 'featured' filter is app-specific, Komga doesn't have it directly.
      // If you need featured items, you might tag them in Komga and filter by tag here.
      // For now, if 'featured' filter is active, it might return an empty list or all series.
      // Or, we could fall back to mock for featured if live API doesn't support it.
      if (filters?.featured) {
         // For now, let's return a slice of the live data as "featured" or specific IDs if known.
         // This is a placeholder for a real "featured" mechanism with Komga.
         // Example: return seriesList.slice(0, 5); 
         console.warn("Live Komga 'featured' filter not fully implemented, returning all series or relying on mock for featured if this part is modified.");
         // Returning mock for featured if live is not configured for it.
         // This can be changed to return a slice or filter of `seriesList` if desired.
         return mockSeriesList.filter(series => series.featured);
      }
      return seriesList;

    } catch (error) {
      console.error("Error fetching series from Komga, falling back to mock data:", error);
      // Fallback to mock data for featured filter as well
      if (filters?.featured) {
        return mockSeriesList.filter(series => series.featured);
      }
      return mockSeriesList;
    }
  } else {
    console.warn("Komga URL or API key not configured. Using mock data for series list.");
    if (filters?.featured) {
      return mockSeriesList.filter(series => series.featured);
    }
    return mockSeriesList;
  }
}

export async function getSeriesById(id: string): Promise<Series | undefined> {
  const komgaBaseUrl = process.env.KOMGA_BASE_URL;
  const komgaApiKey = process.env.KOMGA_API_KEY;

  if (komgaBaseUrl && komgaApiKey) {
    try {
      const response = await fetch(`${komgaBaseUrl}/api/v1/series/${id}`, {
        headers: { 'X-Api-Key': komgaApiKey },
        next: { revalidate: 3600 }
      });

      if (!response.ok) {
         if (response.status === 404) return undefined; // Not found
        console.error(`Failed to fetch series ${id} from Komga: ${response.status} ${response.statusText}. Response: ${await response.text()}`);
        throw new Error('Failed to fetch series details from Komga');
      }
      const komgaSeries = await response.json();
      return transformKomgaSeries(komgaSeries, komgaBaseUrl);
    } catch (error) {
      console.error(`Error fetching series ${id} from Komga, falling back to mock data:`, error);
      return mockSeriesList.find(s => s.id === id);
    }
  } else {
    console.warn(`Komga URL or API key not configured. Using mock data for series ${id}.`);
    return mockSeriesList.find(s => s.id === id);
  }
}

export async function getBooksBySeriesId(seriesId: string): Promise<Book[]> {
  const komgaBaseUrl = process.env.KOMGA_BASE_URL;
  const komgaApiKey = process.env.KOMGA_API_KEY;

  if (komgaBaseUrl && komgaApiKey) {
    try {
      // Komga sorts books by number by default.
      const response = await fetch(`${komgaBaseUrl}/api/v1/series/${seriesId}/books?unpaged=true`, { // unpaged=true for all books
        headers: { 'X-Api-Key': komgaApiKey },
        next: { revalidate: 3600 }
      });

      if (!response.ok) {
        console.error(`Failed to fetch books for series ${seriesId} from Komga: ${response.status} ${response.statusText}. Response: ${await response.text()}`);
        throw new Error('Failed to fetch books from Komga');
      }
      const komgaData = await response.json();

      if (!komgaData || !komgaData.content) {
        console.error('Komga books response is not in expected format:', komgaData);
        throw new Error('Invalid books data format from Komga');
      }
      return komgaData.content.map((b: any) => transformKomgaBook(b));
    } catch (error) {
      console.error(`Error fetching books for series ${seriesId} from Komga, falling back to mock data:`, error);
      return mockBooksData.filter(b => b.seriesId === seriesId).sort((a, b) => a.number - b.number);
    }
  } else {
    console.warn(`Komga URL or API key not configured. Using mock data for books in series ${seriesId}.`);
    return mockBooksData.filter(b => b.seriesId === seriesId).sort((a, b) => a.number - b.number);
  }
}

export async function getBookById(bookId: string): Promise<Book | undefined> {
  const komgaBaseUrl = process.env.KOMGA_BASE_URL;
  const komgaApiKey = process.env.KOMGA_API_KEY;

  if (komgaBaseUrl && komgaApiKey) {
    try {
      const response = await fetch(`${komgaBaseUrl}/api/v1/books/${bookId}`, {
        headers: { 'X-Api-Key': komgaApiKey },
        next: { revalidate: 3600 }
      });

      if (!response.ok) {
        if (response.status === 404) return undefined; // Not found
        console.error(`Failed to fetch book ${bookId} from Komga: ${response.status} ${response.statusText}. Response: ${await response.text()}`);
        throw new Error('Failed to fetch book details from Komga');
      }
      const komgaBook = await response.json();
      return transformKomgaBook(komgaBook);
    } catch (error) {
      console.error(`Error fetching book ${bookId} from Komga, falling back to mock data:`, error);
      return mockBooksData.find(b => b.id === bookId);
    }
  } else {
    console.warn(`Komga URL or API key not configured. Using mock data for book ${bookId}.`);
    return mockBooksData.find(b => b.id === bookId);
  }
}

export async function getBookPages(bookId: string): Promise<Page[]> {
  // First, get the book to know its pagesCount
  const book = await getBookById(bookId); // This will use Komga or mock based on config
  if (!book || book.pagesCount === 0) {
      // Try to fetch page count directly if book object didn't have it or it was zero.
      // This part could still rely on a book object having pagesCount from getBookById.
      // For a more robust solution, one might fetch /api/v1/books/{bookId}/pages from Komga here
      // to get the actual page list and their metadata (width, height, type).
      // However, for simplicity and performance, we'll rely on book.pagesCount for now.
      console.warn(`Book ${bookId} not found or has 0 pages. Cannot fetch pages.`);
      return [];
  }

  const komgaBaseUrl = process.env.KOMGA_BASE_URL;

  // TODO: For more accurate page data (width, height, mediaType),
  // fetch from `${komgaBaseUrl}/api/v1/books/${bookId}/pages`
  // and map the results instead of generating them.
  // This current implementation just generates URLs.

  return Array.from({ length: book.pagesCount }, (_, i) => {
    const pageNumber = i + 1;
    let pageUrl: string;

    if (komgaBaseUrl) {
      // Komga page URLs typically don't require API key directly in URL.
      // Auth for image access is handled by session or if proxying, proxy adds headers.
      pageUrl = `${komgaBaseUrl}/api/v1/books/${bookId}/pages/${pageNumber}`;
    } else {
      // Fallback to mock placeholder URL
      pageUrl = `https://placehold.co/800x1200.png?text=S[${book.seriesId || 'unknown'}]-B[${bookId}]-P[${pageNumber}]`;
    }

    return {
      number: pageNumber,
      mediaType: 'image/png', // Placeholder, ideally from actual Komga page metadata
      url: pageUrl,
      width: 800,  // Placeholder
      height: 1200, // Placeholder
    };
  });
}
