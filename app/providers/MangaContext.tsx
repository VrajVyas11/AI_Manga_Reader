'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the full Manga type based on the provided response
interface Manga {
  id: string;
  title: string;
  description: string;
  altTitle: string;
  contentRating: string;
  status: string;
  altTitles: { [key: string]: string }[];
  year: number;
  updatedAt: string;
  tags: { group: string; tags: string[] }[];
  flatTags: string[];
  coverImageUrl: string;
  authorName: {
    id: string;
    type: string;
    attributes: {
      name: string;
      imageUrl: string | null;
      biography: { [key: string]: string };
      twitter: string | null;
      pixiv: string | null;
      melonBook: string | null;
      fanBox: string | null;
      booth: string | null;
      namicomi: string | null;
      nicoVideo: string | null;
      skeb: string | null;
      fantia: string | null;
      tumblr: string | null;
      youtube: string | null;
      weibo: string | null;
      naver: string | null;
      website: string | null;
      createdAt: string;
      updatedAt: string;
      version: number;
    };
  }[];
  artistName: {
    id: string;
    type: string;
    attributes: {
      name: string;
      imageUrl: string | null;
      biography: { [key: string]: string };
      twitter: string | null;
      pixiv: string | null;
      melonBook: string | null;
      fanBox: string | null;
      booth: string | null;
      namicomi: string | null;
      nicoVideo: string | null;
      skeb: string | null;
      fantia: string | null;
      tumblr: string | null;
      youtube: string | null;
      weibo: string | null;
      naver: string | null;
      website: string | null;
      createdAt: string;
      updatedAt: string;
      version: number;
    };
  }[];
  rating: {
    comments: {
      threadId: number;
      repliesCount: number;
    };
    follows: number;
    rating: {
      average: number;
      bayesian: number;
    };
  };
  links: { [key: string]: string };
  creatorName: string;
  MangaStoryType: string | null;
  availableTranslatedLanguages: string[];
  latestUploadedChapter: string;
  originalLanguage: string;
  type: string;
}

// Define Chapter type
interface Chapter {
  id: string;
  chapter: string;
  title: string;
  mangaId: string;
  pageCount: string;
  [key: string]: any;
}

// Define ReadHistoryEntry type
interface ReadHistoryEntry {
  manga: Manga;
  chapters: Chapter[];
  lastChapterRead: Chapter | null;
  allChaptersList: Chapter[];
  lastReadAT: Date;
}

// Define Favorite type
interface Favorite {
  mangaInfo: Manga;
  chapterInfo: Chapter[];
}

// Define BookMark type
interface BookMark {
  manga: Manga;
  bookmarkedAt: Date;
}

// Update MangaContextType to include BookMarkedMangas
interface MangaContextType {
  selectedManga: Manga | null;
  setSelectedManga: (manga: Manga | null) => void;
  getSelectedManga: () => Manga | null;
  addToReadHistory: (manga: Manga, chapter?: Chapter, allChaptersList?: Chapter[]) => void;
  getAllFromReadHistory: () => ReadHistoryEntry[];
  addToFavoriteChapter: (chapter: Chapter) => void;
  getAllFromFavoriteChapter: () => Chapter[];
  setChapterListForManga: (mangaId: string, chapters: Chapter[]) => void;
  getChapterListForManga: (mangaId: string) => Chapter[];
  addToFavorite: (manga: Manga, chapter?: Chapter) => void;
  getAllFavorites: () => { [mangaId: string]: Favorite };
  addToBookMarks: (manga: Manga) => void;
  removeFromBookMarks: (mangaId: string) => void;
  getAllBookMarks: () => BookMark[];
}

const MangaContext = createContext<MangaContextType | undefined>(undefined);

// Storage keys for persistence
const STORAGE_KEYS = {
  READ_HISTORY: 'readHistory',
  FAVORITE_CHAPTERS: 'favoriteChapters',
  CHAPTER_LIST: 'chapterList',
  SELECTED_MANGA: 'selectedManga',
  FAVORITES: 'favorites',
  BOOKMARKS: 'bookMarks',
};

export function MangaProvider({ children }: { children: ReactNode }) {
  const [selectedManga, setSelectedMangaState] = useState<Manga | null>(null);
  const [readHistory, setReadHistory] = useState<ReadHistoryEntry[]>([]);
  const [favoriteChapters, setFavoriteChapters] = useState<Chapter[]>([]);
  const [chapterLists, setChapterLists] = useState<{ [mangaId: string]: Chapter[] }>({});
  const [favorites, setFavorites] = useState<{ [mangaId: string]: Favorite }>({});
  const [bookMarks, setBookMarks] = useState<BookMark[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      // Load Selected Manga
      const storedSelectedManga = localStorage.getItem(STORAGE_KEYS.SELECTED_MANGA);
      if (storedSelectedManga) {
        setSelectedMangaState(JSON.parse(storedSelectedManga));
      }

      // Load Read History
      const storedReadHistory = localStorage.getItem(STORAGE_KEYS.READ_HISTORY);
      if (storedReadHistory) {
        const parsedHistory = JSON.parse(storedReadHistory);
        // Parse lastReadAT as Date
        setReadHistory(
          parsedHistory.map((entry: any) => ({
            ...entry,
            lastReadAT: new Date(entry.lastReadAT),
          }))
        );
      }

      // Load Favorite Chapters
      const storedFavoriteChapters = localStorage.getItem(STORAGE_KEYS.FAVORITE_CHAPTERS);
      if (storedFavoriteChapters) {
        setFavoriteChapters(JSON.parse(storedFavoriteChapters));
      }

      // Load Chapter Lists
      const storedChapterLists = localStorage.getItem(STORAGE_KEYS.CHAPTER_LIST);
      if (storedChapterLists) {
        setChapterLists(JSON.parse(storedChapterLists));
      }

      // Load Favorites
      const storedFavorites = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }

      // Load Bookmarks
      const storedBookMarks = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      if (storedBookMarks) {
        const parsedBookMarks = JSON.parse(storedBookMarks);
        // Parse bookmarkedAt as Date
        setBookMarks(
          parsedBookMarks.map((bookmark: any) => ({
            ...bookmark,
            bookmarkedAt: new Date(bookmark.bookmarkedAt),
          }))
        );
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
  }, []);

  // Save Selected Manga to localStorage
  const setSelectedManga = (manga: Manga | null) => {
    setSelectedMangaState(manga);
    try {
      if (manga) {
        localStorage.setItem(STORAGE_KEYS.SELECTED_MANGA, JSON.stringify(manga));
      } else {
        localStorage.removeItem(STORAGE_KEYS.SELECTED_MANGA);
      }
    } catch (error) {
      console.error('Error saving selectedManga to localStorage:', error);
    }
  };

  const getSelectedManga = () => {
    return selectedManga;
  };

  // Read History Methods
  const addToReadHistory = (manga: Manga, chapter?: Chapter, allChaptersList?: Chapter[]) => {
    setReadHistory((prev) => {
      const existingEntry = prev.find((entry) => entry.manga.id === manga.id);
      let updatedHistory: ReadHistoryEntry[];

      if (existingEntry) {
        const updatedChapters = chapter
          ? [chapter, ...existingEntry.chapters.filter((ch) => ch.id !== chapter.id)]
          : existingEntry.chapters;
        updatedHistory = prev.map((entry) =>
          entry.manga.id === manga.id
            ? {
              manga,
              chapters: updatedChapters,
              lastChapterRead: chapter || existingEntry.lastChapterRead,
              allChaptersList: allChaptersList || existingEntry.allChaptersList,
              lastReadAT: new Date(),
            }
            : entry
        );
      } else {
        updatedHistory = [
          {
            manga,
            chapters: chapter ? [chapter] : [],
            lastChapterRead: chapter || null,
            allChaptersList: allChaptersList || [],
            lastReadAT: new Date(),
          },
          ...prev,
        ].slice(0, 50);
      }

      try {
        localStorage.setItem(STORAGE_KEYS.READ_HISTORY, JSON.stringify(updatedHistory));
      } catch (error) {
        console.error('Error saving readHistory to localStorage:', error);
      }
      return updatedHistory;
    });
  };

  const getAllFromReadHistory = () => {
    return readHistory;
  };

  // Favorite Chapters Methods
  const addToFavoriteChapter = (chapter: Chapter) => {
    setFavoriteChapters((prev) => {
      const updatedFavorites = [chapter, ...prev.filter((item) => item.id !== chapter.id)];
      try {
        localStorage.setItem(STORAGE_KEYS.FAVORITE_CHAPTERS, JSON.stringify(updatedFavorites));
      } catch (error) {
        console.error('Error saving favoriteChapters to localStorage:', error);
      }
      return updatedFavorites;
    });
  };

  const getAllFromFavoriteChapter = () => {
    return favoriteChapters;
  };

  // Chapter List for Manga Methods
  const setChapterListForManga = (mangaId: string, chapters: Chapter[]) => {
    setChapterLists((prev) => {
      const updatedLists = {
        ...prev,
        [mangaId]: chapters,
      };
      try {
        localStorage.setItem(STORAGE_KEYS.CHAPTER_LIST, JSON.stringify(updatedLists));
      } catch (error) {
        console.error('Error saving chapterLists to localStorage:', error);
      }
      return updatedLists;
    });
  };

  const getChapterListForManga = (mangaId: string) => {
    return chapterLists[mangaId] || [];
  };

  // Favorites Methods
  const addToFavorite = (manga: Manga, chapter?: Chapter) => {
    setFavorites((prev) => {
      const updatedFavorites = { ...prev };
      const mangaId = manga.id;

      if (!updatedFavorites[mangaId]) {
        updatedFavorites[mangaId] = {
          mangaInfo: manga,
          chapterInfo: [],
        };
      } else {
        // Create a completely new object to avoid mutation
        updatedFavorites[mangaId] = {
          ...updatedFavorites[mangaId],
          mangaInfo: manga,
        };
      }

      if (chapter) {
        const existingChapters = updatedFavorites[mangaId].chapterInfo;
        const chapterExists = existingChapters.some((ch) => ch.id === chapter.id);

        if (!chapterExists) {
          // Add chapter - create new array
          updatedFavorites[mangaId].chapterInfo = [chapter, ...existingChapters];
        } else {
          // Remove chapter - create new array without the chapter
          updatedFavorites[mangaId].chapterInfo = existingChapters.filter((ch) => ch.id !== chapter.id);

          // Optional: Remove the entire manga entry if no chapters left
          if (updatedFavorites[mangaId].chapterInfo.length === 0) {
            delete updatedFavorites[mangaId];
          }
        }
      }

      try {
        localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updatedFavorites));
      } catch (error) {
        console.error('Error saving favorites to localStorage:', error);
      }

      return updatedFavorites;
    });
  };

  const getAllFavorites = () => {
    return favorites;
  };

  // Bookmarks Methods
  const addToBookMarks = (manga: Manga) => {
    setBookMarks((prev) => {
      const existingBookmark = prev.find((bookmark) => bookmark.manga.id === manga.id);
      let updatedBookMarks: BookMark[];

      if (existingBookmark) {
        // Update existing bookmark
        updatedBookMarks = prev.map((bookmark) =>
          bookmark.manga.id === manga.id
            ? { manga, bookmarkedAt: new Date() }
            : bookmark
        );
      } else {
        // Add new bookmark
        updatedBookMarks = [
          { manga, bookmarkedAt: new Date() },
          ...prev,
        ].slice(0, 50); // Limit to 50 bookmarks
      }

      try {
        localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updatedBookMarks));
      } catch (error) {
        console.error('Error saving bookMarks to localStorage:', error);
      }
      return updatedBookMarks;
    });
  };

  const removeFromBookMarks = (mangaId: string) => {
    setBookMarks((prev) => {
      const updatedBookMarks = prev.filter((bookmark) => bookmark.manga.id !== mangaId);
      try {
        localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updatedBookMarks));
      } catch (error) {
        console.error('Error saving bookMarks to localStorage:', error);
      }
      return updatedBookMarks;
    });
  };

  const getAllBookMarks = () => {
    return bookMarks;
  };

  return (
    <MangaContext.Provider
      value={{
        selectedManga,
        setSelectedManga,
        getSelectedManga,
        addToReadHistory,
        getAllFromReadHistory,
        addToFavoriteChapter,
        getAllFromFavoriteChapter,
        setChapterListForManga,
        getChapterListForManga,
        addToFavorite,
        getAllFavorites,
        addToBookMarks,
        removeFromBookMarks,
        getAllBookMarks,
      }}
    >
      {children}
    </MangaContext.Provider>
  );
}

export function useManga() {
  const context = useContext(MangaContext);
  if (!context) {
    throw new Error('useManga must be used within a MangaProvider');
  }
  return context;
}
