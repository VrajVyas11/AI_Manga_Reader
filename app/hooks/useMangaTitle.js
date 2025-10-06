/* eslint-disable react-hooks/rules-of-hooks */
// hooks/useMangaTitle.js
import { useMemo } from 'react';

/**
 * Simple hook to get English title from alternate titles, fallback to original title
 */
export const useMangaTitle = (manga, options = {}) => {
  const { maxLength } = options;

  const normalizedTitle = useMemo(() => {
    if (!manga?.title) return 'Untitled Manga';

    // Always try to get English title first
    const englishTitle = findEnglishTitle(manga);
    if (englishTitle) {
      return truncateTitle(englishTitle, maxLength);
    }

    // Fallback to original title
    return truncateTitle(manga.title.trim(), maxLength);
  }, [manga, maxLength]);

  const titleLanguage = useMemo(() => {
    if (!manga?.title) return 'unknown';

    const englishTitle = findEnglishTitle(manga);
    return englishTitle ? 'english' : (manga.originalLanguage || 'original');
  }, [manga]);

  return {
    title: normalizedTitle,
    language: titleLanguage,
    isEnglish: titleLanguage === 'english'
  };
};

/**
 * Finds English title from alternate titles
 */
const findEnglishTitle = (manga) => {
  if (!manga) return null;

  // Check altTitles array for English titles
  if (manga.altTitles && Array.isArray(manga.altTitles)) {
    for (const altTitleObj of manga.altTitles) {
      // Direct English key
      if (altTitleObj.en) {
        return altTitleObj.en;
      }
      
      // Case-insensitive English keys
      const englishKey = Object.keys(altTitleObj).find(key => 
        key.toLowerCase() === 'en' || 
        key.toLowerCase().startsWith('en-') ||
        key.toLowerCase() === 'english'
      );
      
      if (englishKey && altTitleObj[englishKey]) {
        return altTitleObj[englishKey];
      }
    }
  }

  return null;
};

/**
 * Truncates title if it exceeds max length
 */
const truncateTitle = (title, maxLength) => {
  if (!maxLength || title.length <= maxLength) {
    return title;
  }
  
  return title.substring(0, maxLength).trim() + '...';
};

// Export for standalone use
export const getNormalizedMangaTitle = (manga, options = {}) => {
  const { title } = useMangaTitle(manga, options);
  return title;
};