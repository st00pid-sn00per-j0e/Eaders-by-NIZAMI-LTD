
'use server';

import type { Series, Book, Page, SeriesMetadata, Author, KomgaBookPage } from '@/types';
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
      summary: komgaBook.metadata?.summary || '', // Ensure summary is a string
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
      const response = await fetch(`${komgaBaseUrl}/api/v1/series?unpaged=true`, {
        headers: { 'X-Api-Key': komgaApiKey },
        next: { revalidate: 3600 }
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
      
      if (filters?.featured) {
         // If 'featured' filter is active with live Komga data, return the first 5 series.
         // This is a simple placeholder for a more sophisticated "featured" mechanism.
         console.info("Komga live: Using first 5 series as 'featured'.");
         return seriesList.slice(0, 5); 
      }
      return seriesList;

    } catch (error) {
      console.error("Error fetching series from Komga, falling back to mock data:", error);
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
         if (response.status === 404) return undefined; 
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
      const response = await fetch(`${komgaBaseUrl}/api/v1/series/${seriesId}/books?unpaged=true`, { 
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
        if (response.status === 404) return undefined;
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
  const komgaBaseUrl = process.env.KOMGA_BASE_URL;
  const komgaApiKey = process.env.KOMGA_API_KEY;

  if (komgaBaseUrl && komgaApiKey) {
    try {
      // Fetch detailed page information from Komga
      const response = await fetch(`${komgaBaseUrl}/api/v1/books/${bookId}/pages`, {
        headers: { 'X-Api-Key': komgaApiKey },
        next: { revalidate: 3600 } // Cache for 1 hour
      });

      if (!response.ok) {
        console.error(`Failed to fetch page details for book ${bookId} from Komga: ${response.status} ${response.statusText}. Response: ${await response.text()}`);
        // Fallback to simple URL generation if detailed fetch fails but book exists
        const book = await getBookById(bookId); // Could be from mock or live if above failed but this works
        if (!book || book.pagesCount === 0) return [];
        return Array.from({ length: book.pagesCount }, (_, i) => ({
          number: i + 1,
          mediaType: 'image/jpeg', // Default, less accurate
          url: `${komgaBaseUrl}/api/v1/books/${bookId}/pages/${i + 1}`,
          width: 800,  // Placeholder
          height: 1200, // Placeholder
        }));
      }

      const komgaPages: KomgaBookPage[] = await response.json();
      if (!Array.isArray(komgaPages)) {
          console.error('Komga pages response is not an array:', komgaPages);
          throw new Error('Invalid pages data format from Komga');
      }

      return komgaPages.map((p: KomgaBookPage) => ({
        number: p.number,
        mediaType: p.mediaType,
        url: `${komgaBaseUrl}/api/v1/books/${bookId}/pages/${p.number}`,
        width: p.width || 800,  // Use actual width or fallback
        height: p.height || 1200, // Use actual height or fallback
        fileName: p.fileName,
      }));

    } catch (error) {
      console.error(`Error fetching pages for book ${bookId} from Komga, attempting fallback to URL generation:`, error);
      // Fallback: Generate URLs if detailed fetch fails, relies on pagesCount from getBookById
      const book = await getBookById(bookId);
      if (!book || book.pagesCount === 0) {
        console.warn(`Book ${bookId} not found or has 0 pages for URL generation fallback.`);
        return [];
      }
      return Array.from({ length: book.pagesCount }, (_, i) => ({
        number: i + 1,
        mediaType: 'image/jpeg', // Less accurate default
        url: `${komgaBaseUrl}/api/v1/books/${bookId}/pages/${i + 1}`,
        width: 800,  // Placeholder
        height: 1200, // Placeholder
      }));
    }
  } else {
    // Komga not configured, use mock data logic (which generates placeholder URLs)
    console.warn(`Komga URL or API key not configured. Using mock data for pages in book ${bookId}.`);
    const book = await getBookById(bookId); // Will get mock book
    if (!book || book.pagesCount === 0) return [];
    
    return Array.from({ length: book.pagesCount }, (_, i) => {
      const pageNumber = i + 1;
      return {
        number: pageNumber,
        mediaType: 'image/png',
        url: `https://placehold.co/800x1200.png?text=S[${book.seriesId || 'mock'}]-B[${bookId}]-P[${pageNumber}]`,
        width: 800,
        height: 1200,
      };
    });
  }
}
