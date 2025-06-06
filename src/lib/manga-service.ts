
'use server';

import type { Series, Book, Page } from '@/types';
import {
  mockSeriesList,
  mockBooksData,
  // getSeriesById as findSeriesInMock,
  // getBookById as findBookInMock,
  // getBooksBySeriesId as findBooksForSeriesInMock,
} from './mock-data'; // We'll adjust mock-data exports or its internal structure

// Helper function to simulate finding a series (can be moved to mock-data or kept here)
const findSeriesInMock = (id: string): Series | undefined => {
  return mockSeriesList.find(s => s.id === id);
};

// Helper function to simulate finding books for a series
const findBooksForSeriesInMock = (seriesId: string): Book[] => {
  return mockBooksData.filter(b => b.seriesId === seriesId).sort((a, b) => a.number - b.number);
};

// Helper function to simulate finding a book
const findBookInMock = (id: string): Book | undefined => {
  return mockBooksData.find(b => b.id === id);
};


// If switching to live Komga API:
// const KOMGA_API_KEY = process.env.KOMGA_API_KEY;
// const KOMGA_BASE_URL = process.env.KOMGA_BASE_URL;
//
// Example fetch call for series list:
// async function fetchSeriesFromKomga() {
//   if (!KOMGA_BASE_URL || !KOMGA_API_KEY) {
//     console.warn("Komga base URL or API key not configured. Falling back to mock data.");
//     return mockSeriesList;
//   }
//   try {
//     const response = await fetch(`${KOMGA_BASE_URL}/api/v1/series`, {
//       headers: {
//         // Adjust header based on Komga's requirements, e.g.:
//         // 'X-Api-Key': KOMGA_API_KEY,
//         // 'Authorization': `Bearer ${KOMGA_API_KEY}`
//       }
//     });
//     if (!response.ok) throw new Error('Failed to fetch series from Komga');
//     const data = await response.json();
//     // Transform Komga API response to Series[] type
//     return data.content; // Example, structure may vary
//   } catch (error) {
//     console.error("Error fetching series from Komga:", error);
//     return mockSeriesList; // Fallback
//   }
// }

export async function getSeriesList(filters?: { featured?: boolean }): Promise<Series[]> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 100)); // Simulate network delay
  // To use live data: return await fetchSeriesFromKomga(filters);
  if (filters?.featured) {
    return mockSeriesList.filter(series => series.featured);
  }
  return mockSeriesList;
}

export async function getSeriesById(id: string): Promise<Series | undefined> {
  await new Promise(resolve => setTimeout(resolve, 50));
  // To use live data, implement fetch to `${KOMGA_BASE_URL}/api/v1/series/${id}`
  return findSeriesInMock(id);
}

export async function getBooksBySeriesId(seriesId: string): Promise<Book[]> {
  await new Promise(resolve => setTimeout(resolve, 50));
  const series = findSeriesInMock(seriesId);
  if (!series) return [];
  // To use live data, implement fetch to `${KOMGA_BASE_URL}/api/v1/series/${seriesId}/books`
  return findBooksForSeriesInMock(seriesId);
}

export async function getBookById(bookId: string): Promise<Book | undefined> {
  await new Promise(resolve => setTimeout(resolve, 50));
  // To use live data, implement fetch to `${KOMGA_BASE_URL}/api/v1/books/${bookId}`
  return findBookInMock(bookId);
}

export async function getBookPages(bookId: string): Promise<Page[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  const book = findBookInMock(bookId);
  if (!book) return [];

  const komgaBaseUrl = process.env.KOMGA_BASE_URL;
  // Note: Accessing page images might require authentication header if not handled by session.
  // The image proxy (`/api/image-proxy`) would need to pass this header if Komga requires it for image URLs.
  // The KOMGA_API_KEY would be used here if Komga page URLs require API key auth directly or for the proxy.

  return Array.from({ length: book.pagesCount }, (_, i) => {
    const pageNumber = i + 1;
    let pageUrl: string;

    if (komgaBaseUrl) {
      // Construct real Komga URL if base URL is provided
      // For Komga, the API key is typically sent as a header with the request,
      // not usually as part of the page image URL itself.
      // The image proxy would need to handle auth if direct image URLs are protected.
      pageUrl = `${komgaBaseUrl}/api/v1/books/${bookId}/pages/${pageNumber}`;
    } else {
      // Fallback to mock URL
      pageUrl = `https://placehold.co/800x1200.png?text=S[${book.seriesId}]-B[${book.id}]-P[${pageNumber}]`;
    }

    return {
      number: pageNumber,
      mediaType: 'image/png', // Placeholder
      url: pageUrl,
      width: 800, // Placeholder
      height: 1200, // Placeholder
    };
  });
}

