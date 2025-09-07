'use client';
import React, { useState, useEffect, useMemo, useCallback,memo } from "react";
import { useTheme } from "../../providers/ThemeContext";
import { AlertCircleIcon, RouteOff } from "lucide-react";

import SearchMangaCardWith2ViewMode from "../../Components/SearchPageComponents/SearchMangaCardWith2ViewMode";
import SearchTotalAndFilterOptions from "../../Components/SearchPageComponents/SearchAndTotalFilterOptions";
import BottomPagination from "../../Components/SearchPageComponents/BottomPagination";
import SearchMangaCardSkeleton from "../../Components/Skeletons/SearchPage/SearchMangaCardSkeleton";
import SearchMangaListSkeleton from "../../Components/Skeletons/SearchPage/SearchMangaListSkeleton";
import { useMangaFilters } from '../../hooks/useMangaFilters'; // ADDED

const SearchPage = React.memo(() => {
  const { theme } = useTheme();
  const isDark = theme == "dark";

  // search state
  const [searchResults, setSearchResults] = useState([]); // will store original raw results
  const [filteredResults, setFilteredResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");

  // filter state (your existing)
  const [activeFilters, setActiveFilters] = useState({
    rating: [], status: [], language: [], publicationType: [], year: [], sortBy: "", demographic: [], genres: [],
  });

  const ITEMS_PER_PAGE = 24;

  // Fetch manga data (same as yours)
  const fetchMangaData = useCallback(async (query) => {
    setIsLoading(true);
    setError(null);
    try {
      const cacheKey = `manga_search_${query}`;
      const cachedData = getFromCache(cacheKey);
      if (cachedData) {
        setSearchResults(cachedData);
        setFilteredResults(cachedData);
        setIsLoading(false);
        return;
      }
      const response = await fetch(`/api/manga/titles?title=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();
      if (!data.data || data.data.length === 0) {
        setSearchResults([]);
        setFilteredResults([]);
        setError("No manga found");
        setIsLoading(false);
        return;
      }
      setSearchResults(data.data);        // store original raw results
      setFilteredResults(data.data);      // default filtered view
      saveToCache(cacheKey, data.data);
      setCurrentPage(1);
    } catch (err) {
      console.error("Error fetching manga:", err);
      setError(err.message ?? "Failed to fetch manga data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize search from URL params (same as yours)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("query") ?? "";
    setSearchQuery(query);
    if (query) fetchMangaData(query);
    else {
      setIsLoading(false);
      setError("Please enter a search term");
    }
  }, [fetchMangaData]);

  // ---------------------
  // NEW: use shared hooks to inject flags (e.g., isCoverImageBlurred)
  // originalMangas is the raw fetched array; hookFilteredMangas is the output of your shared hook
  // ---------------------
  const originalMangas = useMemo(() => searchResults ?? [], [searchResults]); // raw
  const hookFilteredMangas = useMangaFilters(originalMangas); // injects isCoverImageBlurred etc.
  // const hookFilterStats = useFilterStats(originalMangas, hookFilteredMangas);
  // ---------------------

  // Apply local activeFilters on top of hookFilteredMangas (so hook-injected fields persist)
  const applyFilters = useCallback(() => {
    let results = [...(hookFilteredMangas ?? [])]; // NOTE: use hookFilteredMangas as base

    // your existing filtering logic, unchanged, but working on "results"
    if (activeFilters.rating.length > 0) {
      results = results.filter((manga) => activeFilters.rating.includes(manga.contentRating));
    }
    if (activeFilters.status.length > 0) {
      results = results.filter((manga) => activeFilters.status.includes(manga.status));
    }
    if (activeFilters.year.length > 0) {
      results = results.filter((manga) => activeFilters.year.includes(manga.year?.toString()));
    }
    if (activeFilters.genres.length > 0) {
      results = results.filter((manga) => activeFilters.genres.every((genre) => manga.flatTags.includes(genre)));
    }
    if (activeFilters.language.length > 0) {
      results = results.filter((manga) =>
        activeFilters.language.every(
          (lang) =>
            manga.originalLanguage === lang ||
            (manga.availableTranslatedLanguages && manga.availableTranslatedLanguages.includes(lang))
        )
      );
    }
    if (activeFilters.demographic.length > 0) {
      results = results.filter(
        (manga) =>
          activeFilters.demographic.every((demo) =>
            demo === "none" ? manga.MangaStoryType == null : manga.MangaStoryType === demo
          ) || activeFilters.demographic.includes(manga.MangaStoryType == null ? "none" : manga.MangaStoryType)
      );
    }
    if (activeFilters.publicationType.length > 0) {
      results = results.filter((manga) =>
        activeFilters.publicationType.some((demo) => {
          const flatTags = manga.flatTags ?? [];
          const originalLanguage = manga.originalLanguage ?? "";
          const normalizedTags = flatTags.map((tag) => tag.toLowerCase());
          switch (demo.toLowerCase()) {
            case "manga":
              return originalLanguage === "ja" && !normalizedTags.includes("long strip") && !normalizedTags.includes("web comic");
            case "manhwa":
              return originalLanguage === "ko" && (normalizedTags.includes("long strip") || normalizedTags.includes("web comic"));
            case "manhua":
              return originalLanguage === "zh" || originalLanguage === "zh-hk";
            case "doujinshi":
              return normalizedTags.includes("doujinshi");
            default:
              return true;
          }
        })
      );
    }

    if (activeFilters.sortBy && activeFilters.sortBy !== "") {
      results.sort((a, b) => {
        switch (activeFilters.sortBy.trim()) {
          case "relevance": return (a.title ?? "").localeCompare(b.title ?? "");
          case "latestUploadedChapter": return new Date(b.updatedAt ?? 0) - new Date(a.updatedAt ?? 0);
          case "followedCount": return (b.rating?.follows ?? 0) - (a.rating?.follows ?? 0);
          case "createdAt": return new Date(b.updatedAt ?? 0) - new Date(a.updatedAt ?? 0);
          case "title": return (a.title ?? "").localeCompare(b.title ?? "");
          case "year": return (b.year ?? 0) - (a.year ?? 0);
          case "minScore": return (b.rating?.rating?.bayesian ?? 0) - (a.rating?.rating?.bayesian ?? 0);
          default: return 0;
        }
      });
    }

    setFilteredResults(results);
    setCurrentPage(1);
  }, [activeFilters, hookFilteredMangas]);

  // Re-run when hookFilteredMangas or filters change
  useEffect(() => {
    if ((hookFilteredMangas?.length ?? 0) > 0) applyFilters();
    else setFilteredResults([]); // no results
  }, [activeFilters, applyFilters, hookFilteredMangas]);

  // clear filters (unchanged)
  const clearAllFilters = () => {
    setActiveFilters({ rating: [], status: [], year: [], genres: [], sortBy: "", publicationType: [], language: [], demographic: [] });
  };

  // Cache helpers (same as you had)
  const getFromCache = (key) => { try { const data = localStorage.getItem(key); return data ? JSON.parse(data) : null; } catch (e) { console.error(e); return null; } };
  const saveToCache = (key, data) => { try { const serializedData = JSON.stringify(data); const dataSize = new Blob([serializedData]).size; if (dataSize > 4 * 1024 * 1024) return false; const cacheKeys = Object.keys(localStorage).filter((k) => k.startsWith("manga_")); if (cacheKeys.length > 10) { cacheKeys.sort((a, b) => { const timeA = localStorage.getItem(`${a}_timestamp`) ?? 0; const timeB = localStorage.getItem(`${b}_timestamp`) ?? 0; return timeA - timeB; }); for (let i = 0; i < cacheKeys.length - 9; i++) { localStorage.removeItem(cacheKeys[i]); localStorage.removeItem(`${cacheKeys[i]}_timestamp`); } } localStorage.setItem(key, serializedData); localStorage.setItem(`${key}_timestamp`, Date.now()); return true; } catch (error) { console.error("Cache save error:", error); return false; } };

  // Pagination (unchanged)
  const totalPages = Math.ceil(filteredResults.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredResults.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const goToPage = useCallback((page) => { if (page >= 1 && page <= totalPages) { setCurrentPage(page); window.scrollTo({ top: 0, behavior: "smooth" }); } }, [totalPages]);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.elements[0].value.trim();
    if (query) {
      setSearchQuery(query);
      fetchMangaData(query);
      const url = new URL(window.location);
      url.searchParams.set("query", query);
      window.history.pushState({}, "", url);
    }
  };
  return (
    <div className={`min-h-[89vh] relative z-20 ${isDark ? 'text-slate-100' : 'text-gray-900'}`}>
      <main className="max-w-full sm:max-w-[90vw] md:max-w-[95vw] lg:max-w-[91.5%] mx-auto px-2 py-6">
        {/* Results header with controls */}
        <SearchTotalAndFilterOptions
          handleSearch={handleSearch}
          setActiveFilters={setActiveFilters}
          activeFilters={activeFilters}
          clearAllFilters={clearAllFilters}
          filteredResults={filteredResults}
          searchQuery={searchQuery}
          setViewMode={setViewMode}
          viewMode={viewMode}
          isDark={isDark}
        />

        {/* Loading state */}
        {isLoading && (
          <div className={
            viewMode === "grid"
              ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2 mt-5 relative gap-y-4 z-10"
              : "grid grid-cols-1 md:grid-cols-2 gap-2  z-10 mt-5"
          }>
            {[...Array(12)].map((_, index) => (
              <div key={index}>
                {viewMode === "grid" ? (
                  <SearchMangaCardSkeleton isDark={isDark} />
                ) : (
                  <SearchMangaListSkeleton isDark={isDark} />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {!isLoading && error && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className={`${isDark ? 'bg-slate-950/20 border-slate-800' : 'bg-white/80 border-gray-300'} border rounded-xl p-6 max-w-md w-full text-center shadow-lg backdrop-blur-sm`}>
              <div className={`${isDark ? 'bg-slate-800/50' : 'bg-gray-100'} w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4`}>
                <AlertCircleIcon className={`h-6 w-6 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
              </div>
              <h2 className={`text-xl font-semibold ${isDark ? 'text-slate-200' : 'text-gray-800'} mb-2`}>{error}</h2>
              <p className={`${isDark ? 'text-slate-400' : 'text-gray-600'} mb-5`}>
                {error === "No manga found"
                  ? "Try adjusting your search terms or filters."
                  : "Please try again later."}
              </p>
              <button
                onClick={() => window.location.reload()}
                className={`${isDark ? 'bg-gradient-to-r from-purple-700/70 to-indigo-700/70 hover:bg-purple-700' : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'} text-white px-5 py-2 rounded-lg transition`}
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Empty results after filtering */}
        {!isLoading && !error && filteredResults.length === 0 && searchResults.length > 0 && (
          <div className="flex h-fit flex-col items-center justify-center py-16">
            <div className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-300'} border rounded-xl p-6 max-w-md w-full text-center shadow-lg`}>
              <div className={`${isDark ? 'bg-slate-800/50' : 'bg-gray-100'} w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4`}>
                <RouteOff className={`w-8 h-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
              </div>
              <h2 className={`text-xl font-semibold ${isDark ? 'text-slate-200' : 'text-gray-800'} mb-2`}>
                No matches found
              </h2>
              <p className={`${isDark ? 'text-slate-400' : 'text-gray-600'} mb-5`}>
                No manga matched your current filter settings.
              </p>
              <button
                onClick={clearAllFilters}
                className={`${isDark ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-600 hover:bg-purple-700'} text-white px-5 py-2 rounded-lg transition`}
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Results grid/list */}
        {!isLoading && !error && filteredResults.length > 0 && (
          <>
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2 mt-5 relative gap-y-4 z-10"
                  : "grid grid-cols-1 md:grid-cols-2 gap-2  z-10 mt-5"
              }
            >
              {paginatedItems.map((manga) => (
                <SearchMangaCardWith2ViewMode
                  key={manga.id}
                  manga={manga}
                  viewMode={viewMode}
                  isDark={isDark}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <BottomPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={goToPage}
                isDark={isDark}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
});
SearchPage.displayName = "SearchPage"
export default memo(SearchPage);