
import type { Manga, Chapter } from '@/types';

const generateChapters = (mangaId: string, count: number): Chapter[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `${mangaId}-chapter-${i + 1}`,
    title: `Chapter ${i + 1}: The Adventure Begins`,
    chapterNumber: i + 1,
    pageCount: Math.floor(Math.random() * 10) + 15, // Random page count between 15-24
  }));
};

export const mockMangaList: Manga[] = [
  {
    id: 'manga-1',
    title: 'Epic Quest Saga',
    coverImageUrl: 'https://placehold.co/300x450.png',
    description: 'Join our hero on an epic quest to save the world from ancient darkness. This thrilling adventure is full of twists, turns, and unforgettable characters.',
    author: 'Mangaka Sensei',
    genres: ['Adventure', 'Fantasy', 'Action'],
    status: 'Ongoing',
    chapters: generateChapters('manga-1', 15),
    featured: true,
    averageRating: 4.5,
    ratingCount: 120,
  },
  {
    id: 'manga-2',
    title: 'Cybernetic Dreams',
    coverImageUrl: 'https://placehold.co/300x450.png',
    description: 'In a futuristic city, a young hacker uncovers a conspiracy that could change humanity forever. A tale of technology, rebellion, and hope.',
    author: 'Tech Noir',
    genres: ['Sci-Fi', 'Cyberpunk', 'Mystery'],
    status: 'Completed',
    chapters: generateChapters('manga-2', 50),
    featured: true,
    averageRating: 4.2,
    ratingCount: 95,
  },
  {
    id: 'manga-3',
    title: 'School Life Funnies',
    coverImageUrl: 'https://placehold.co/300x450.png',
    description: 'A hilarious slice-of-life comedy following the daily antics of a group of high school friends. Get ready for laughter and heartwarming moments!',
    author: 'Comi K. Relif',
    genres: ['Comedy', 'Slice of Life', 'School'],
    status: 'Ongoing',
    chapters: generateChapters('manga-3', 5),
    averageRating: 3.8,
    ratingCount: 30,
  },
  {
    id: 'manga-4',
    title: 'The Last Spellbinder',
    coverImageUrl: 'https://placehold.co/300x450.png',
    description: 'In a world where magic is fading, the last spellbinder must embark on a perilous journey to restore it. A story of courage, sacrifice, and the power of belief.',
    author: 'Mysteria Weaver',
    genres: ['Fantasy', 'Magic', 'Drama'],
    status: 'Completed',
    chapters: generateChapters('manga-4', 120),
    premium: true, // This manga requires rewarded ad unlock
    averageRating: 4.9,
    ratingCount: 250,
  },
  {
    id: 'manga-5',
    title: 'Ninja Way',
    coverImageUrl: 'https://placehold.co/300x450.png',
    description: 'A young ninja strives to become the strongest in his village, facing challenges and making friends along the way.',
    author: 'Shinobi Storyteller',
    genres: ['Action', 'Adventure', 'Martial Arts'],
    status: 'Ongoing',
    chapters: generateChapters('manga-5', 200),
    featured: true,
    averageRating: 4.0,
    ratingCount: 150,
  },
];

export const getMangaById = (id: string): Manga | undefined => {
  return mockMangaList.find(manga => manga.id === id);
};

export const getChapterById = (mangaId: string, chapterId: string): Chapter | undefined => {
  const manga = getMangaById(mangaId);
  return manga?.chapters.find(chapter => chapter.id === chapterId);
};
