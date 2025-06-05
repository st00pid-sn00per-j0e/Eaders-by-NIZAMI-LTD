
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


export async function getSeriesList(filters?: { featured?: boolean }): Promise<Series[]> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 100)); // Simulate network delay
  if (filters?.featured) {
    return mockSeriesList.filter(series => series.featured);
  }
  return mockSeriesList;
}

export async function getSeriesById(id: string): Promise<Series | undefined> {
  await new Promise(resolve => setTimeout(resolve, 50));
  return findSeriesInMock(id);
}

export async function getBooksBySeriesId(seriesId: string): Promise<Book[]> {
  await new Promise(resolve => setTimeout(resolve, 50));
  const series = findSeriesInMock(seriesId);
  if (!series) return [];
  // In a real API, you might fetch books separately. Here, we filter from a combined list or use series.booksCount
  return findBooksForSeriesInMock(seriesId);
}

export async function getBookById(bookId: string): Promise<Book | undefined> {
  await new Promise(resolve => setTimeout(resolve, 50));
  return findBookInMock(bookId);
}

export async function getBookPages(bookId: string): Promise<Page[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  const book = findBookInMock(bookId);
  if (!book) return [];

  // Simulate generating page URLs like Komga would
  // Base URL for Komga instance would be needed here in a real scenario
  // const komgaBaseUrl = 'http://192.168.0.103:8080';
  // For mock, we use placehold.co
  return Array.from({ length: book.pagesCount }, (_, i) => ({
    number: i + 1,
    mediaType: 'image/png', // Placeholder
    // url: `${komgaBaseUrl}/api/v1/books/${bookId}/pages/${i + 1}`, // Real Komga URL
    url: `https://placehold.co/800x1200.png?text=S[${book.seriesId}]-B[${book.id}]-P[${i + 1}]`, // Mock URL
    width: 800, // Placeholder
    height: 1200, // Placeholder
  }));
}
