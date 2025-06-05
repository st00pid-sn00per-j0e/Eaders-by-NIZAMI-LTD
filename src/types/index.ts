
export interface Author {
  name: string;
  role?: string;
}

export interface SeriesMetadata {
  title: string; // Main title, can be same as series name
  summary: string;
  status: 'ONGOING' | 'ENDED' | 'HIATUS' | 'ABANDONED' | 'COMPLETED'; // Komga uses these, 'COMPLETED' is an alias for 'ENDED'
  authors: Author[];
  genres: string[];
  publisher?: string;
  releaseDate?: string; // ISO date string
  // Add any other metadata fields you expect from Komga
}

export interface Series {
  id: string; // Komga series ID
  libraryId?: string; // Komga library ID
  name: string; // Often used as a display title if metadata.title is complex
  url?: string; // Komga URL for the series
  booksCount: number; // Number of books (chapters) in the series
  booksReadCount?: number;
  booksUnreadCount?: number;
  booksInProgressCount?: number;
  metadata: SeriesMetadata;
  coverImageUrl: string; // For simplicity in mock, in real Komga this is /api/v1/series/{id}/thumbnail
  createdDate?: string; // ISO date string
  lastModifiedDate?: string; // ISO date string
  // Fields from previous Manga type to maintain functionality
  featured?: boolean;
  premium?: boolean;
  averageRating?: number;
  ratingCount?: number;
}

export interface Book {
  id: string; // Komga book ID
  seriesId: string;
  name: string; // Title of the book/chapter
  number: number; // Chapter number
  url?: string; // Komga URL for the book
  createdDate?: string; // ISO date string
  lastModifiedDate?: string; // ISO date string
  fileLastModified?: string; // ISO date string
  sizeBytes?: number;
  media?: { // Komga media status
    status: 'READY' | 'UNKNOWN' | 'ERROR' | 'UNSUPPORTED' | 'OUTDATED';
    mediaType?: string; // e.g., "application/zip" or "image/jpeg" for single file book
    pagesCount: number;
    comment?: string;
  };
  metadata?: { // Komga book metadata
    title: string; // Can be same as book.name
    summary?: string;
    number: string; // Often chapter number as string
    numberSort: number;
    releaseDate?: string;
    authors?: Author[];
    // ... and more
  };
  readProgress?: { // Komga read progress
    page: number;
    completed: boolean;
    readDate?: string;
    // ... and more
  };
  // For Eaders app functionality, ensuring pagesCount is easily accessible
  pagesCount: number; // Directly accessible page count
}

export interface Page {
  number: number; // Page number (1-indexed)
  fileName?: string;
  mediaType?: string;
  width?: number;
  height?: number;
  url: string; // URL to the page image, e.g., /api/v1/books/{bookId}/pages/{pageNumber}
}
