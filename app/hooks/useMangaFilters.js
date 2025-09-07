import { useMemo } from 'react';
import { usePreferences } from '@/app/providers/PreferencesContext';

/**
 * Custom hook for filtering manga based on user preferences
 * @param {Array} mangaList - Array of manga objects to filter
 * @returns {Array} Filtered manga array
 */
export const useMangaFilters = (mangaList = []) => {
  const { preferences } = usePreferences();

  const filteredManga = useMemo(() => {
    if (!mangaList || mangaList.length === 0) return [];
    if (!preferences) return mangaList;

    return mangaList.filter((manga) => {
      // Filter by content types (manga, manhwa, manhua)
      if (preferences.types && preferences.types.length > 0) {
        const mangaType = getMangaType(manga);
        if (!preferences.types.includes(mangaType)) {
          return false;
        }
      }

      // Filter by languages
      if (preferences.languages && preferences.languages.length > 0 && !preferences.languages.includes("all")) {
        const hasPreferredLanguage = preferences.languages.some(lang => {
          // Check original language
          if (manga.originalLanguage === lang) return true;

          // Check available translated languages
          if (manga.availableTranslatedLanguages &&
            manga.availableTranslatedLanguages.includes(lang)) return true;

          return false;
        });

        if (!hasPreferredLanguage) {
          return false;
        }
      }

      // Filter by age ratings
      if (preferences.contentFilters?.ageRatings) {
        const contentRating = mapContentRatingToAgeRating(manga.contentRating);
        if (!preferences.contentFilters.ageRatings[contentRating]) {
          return false;
        }
      }

      // Hide adult content if enabled
      if (preferences.contentFilters?.hideAdult) {
        if (isAdultContent(manga)) {
          return false;
        }
      }

      return true;
    });
  }, [mangaList, preferences]);

  // Return filtered manga with blur field applied
  const processedManga = useMemo(() => {
    return filteredManga.map(manga => ({
      ...manga,
      isCoverImageBlurred: preferences.contentFilters?.blurAdult && isAdultContent(manga)
    }));
  }, [filteredManga, preferences.contentFilters?.blurAdult]);

  return processedManga;
};

/**
 * Determines manga type based on original language and other factors
 * @param {Object} manga - Manga object
 * @returns {string} - manga type (manga, manhwa, manhua)
 */
const getMangaType = (manga) => {
  const originalLang = manga.originalLanguage;

  // Determine type based on original language
  if (originalLang === 'ja') return 'manga';
  if (originalLang === 'ko') return 'manhwa';
  if (originalLang === 'zh' || originalLang === 'zh-hk') return 'manhua';

  // Fallback: check tags for format indicators
  if (manga.flatTags) {
    const tags = manga.flatTags.map(tag => tag.toLowerCase());
    if (tags.includes('web comic') || tags.includes('webtoon')) {
      // Could be manhwa or manhua, default to manhwa for web comics
      return 'manhwa';
    }
  }

  // Default to manga if uncertain
  return 'manga';
};

/**
 * Maps content rating to age rating categories
 * @param {string} contentRating - The content rating from manga data
 * @returns {string} - Mapped age rating key
 */
const mapContentRatingToAgeRating = (contentRating) => {
  if (!contentRating) return 'all-ages';

  const rating = contentRating.toLowerCase();

  switch (rating) {
    case 'safe':
      return 'all-ages';
    case 'suggestive':
      return 'teen';
    case 'erotica':
      return '18+';
    case 'pornographic':
      return '18++';
    default:
      return 'all-ages';
  }
};

/**
 * Checks if content is considered adult content
 * @param {string} contentRating - The content rating
 * @returns {boolean} - True if adult content
 */
const isAdultContent = (manga) => {
  if (!manga) return false;

  const rating = manga?.contentRating?.toLowerCase();
  return rating === 'erotica' || rating === 'pornographic' || (manga.flatTags.includes("Harem", "Sexual Violence") && manga.flatTags.includes("Romance"));
};

/**
 * Hook to get filter statistics
 * @param {Array} originalList - Original unfiltered manga list
 * @param {Array} filteredList - Filtered manga list
 * @returns {Object} - Statistics about filtering
 */
export const useFilterStats = (originalList, filteredList) => {
  return useMemo(() => {
    const originalCount = originalList?.length || 0;
    const filteredCount = filteredList?.length || 0;
    const hiddenCount = originalCount - filteredCount;
    const hiddenPercentage = originalCount > 0 ? (hiddenCount / originalCount) * 100 : 0;

    return {
      originalCount,
      filteredCount,
      hiddenCount,
      hiddenPercentage: Math.round(hiddenPercentage * 10) / 10, // Round to 1 decimal
      hasFilters: hiddenCount > 0
    };
  }, [originalList, filteredList]);
};