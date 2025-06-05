
export interface Chapter {
  id: string;
  title: string;
  chapterNumber: number;
  pageCount: number; // Example property
}

export interface Manga {
  id: string;
  title: string;
  coverImageUrl: string;
  description: string;
  chapters: Chapter[];
  author?: string;
  genres?: string[];
  status?: 'Ongoing' | 'Completed';
  featured?: boolean;
  premium?: boolean; // For rewarded unlocks
  averageRating?: number; // New: Average rating from 0 to 5
  ratingCount?: number;   // New: Number of ratings received
}
