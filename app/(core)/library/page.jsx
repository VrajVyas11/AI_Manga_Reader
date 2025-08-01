"use client";
import {
  Bookmark,
  Heart,
  Search,
  Sliders,
  Play,
  X,
  BookOpen,
  NotebookTabs,
} from "lucide-react";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useManga } from "../../providers/MangaContext";
import Image from "next/image";
import FilterPanel from "../../Components/LibraryComponents/FilterPanel";
import LibraryLoading from "../../Components/LibraryComponents/LibraryLoading";
import ReadingHistoryCard from "../../Components/LibraryComponents/ReadingHistoryCard";
import FavoriteCard from "../../Components/LibraryComponents/FavoriteCard";
import BookmarkCard from "../../Components/LibraryComponents/BookmarkCard";
import { useTheme } from "../../providers/ThemeContext";

// Main MangaLibrary Component
const MangaLibrary = () => {
  const [activeTab, setActiveTab] = useState("history");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const {
    getSelectedManga,
    getAllFavorites,
    getAllBookMarks,
    getAllFromReadHistory,
    addToBookMarks,
    addToFavorite,
  } = useManga();
  const { theme } = useTheme();
  const isDark = theme == "dark";
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [filters, setFilters] = useState({
    genre: [],
    status: "all",
    sort: "recent",
  });

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const selectedManga = getSelectedManga();
  const allFavorites = Object.values(getAllFavorites());
  const allBookmarks = getAllBookMarks();
  const readingHistory = getAllFromReadHistory();

  const handleMangaClick = useCallback(
    (manga) => router.push(`/manga/${manga.id}/chapters`),
    [router]
  );

  // Filter function for all tabs
  const filterItems = useCallback(
    (items, type) => {
      let filtered = [...items];

      // Apply search filter
      if (searchQuery.trim()) {
        filtered = filtered.filter((item) => {
          const title =
            type === "history"
              ? item.manga.title
              : type === "favorites"
                ? item.mangaInfo.title
                : item.manga.title;
          return title.toLowerCase().includes(searchQuery.toLowerCase());
        });
      }

      // Apply genre filter (only for history)
      if (type === "history" && filters.genre.length > 0) {
        filtered = filtered.filter((item) =>
          item.manga.flatTags?.some((tag) => filters.genre.includes(tag))
        );
      }

      // Apply status filter (only for history)
      if (type === "history" && filters.status !== "all") {
        filtered = filtered.filter((item) => item.manga.status === filters.status);
      }

      // Apply sorting
      if (type === "history") {
        filtered.sort((a, b) => {
          switch (filters.sort) {
            case "recent":
              return new Date(b.lastReadAT) - new Date(a.lastReadAT);
            case "rating":
              return (
                (b.manga.rating?.rating?.bayesian || 0) -
                (a.manga.rating?.rating?.bayesian || 0)
              );
            case "popular":
              return (b.manga.rating?.follows || 0) - (a.manga.rating?.follows || 0);
            case "title":
              return a.manga.title.localeCompare(b.manga.title);
            case "progress":
              const progressA =
                (a.chapters.length / (a.allChaptersList.length || 1)) * 100;
              const progressB =
                (b.chapters.length / (b.allChaptersList.length || 1)) * 100;
              return progressB - progressA;
            default:
              return 0;
          }
        });
      } else {
        // Simple sorting for favorites and bookmarks
        filtered.sort((a, b) => {
          const title =
            type === "favorites" ? a.mangaInfo.title : a.manga.title;
          const titleB =
            type === "favorites" ? b.mangaInfo.title : b.manga.title;
          return title.localeCompare(titleB);
        });
      }

      return filtered;
    },
    [searchQuery, filters]
  );

  const filteredHistory = useMemo(
    () => filterItems(readingHistory, "history"),
    [filterItems, readingHistory]
  );
  const filteredFavorites = useMemo(
    () => filterItems(allFavorites, "favorites"),
    [filterItems, allFavorites]
  );
  const filteredBookmarks = useMemo(
    () => filterItems(allBookmarks, "bookmarks"),
    [filterItems, allBookmarks]
  );

  return (
    <div className={`min-h-screen overflow-hidden`}>
      {isLoading ? (
        <LibraryLoading isDark={isDark} />
      ) : (
        <div className="relative z-10 max-w-[95%] mx-auto px-1 sm:px-4 lg:px-8 py-4 sm:py-8">
          {/* Header */}
          <header className="flex flex-row justify-between items-center sm:items-end gap-4 sm:gap-6 mb-6 sm:mb-10">
            {/* Left: Logo + Title + Subtitle */}
            <div className="flex mx-1 sm:mx-2 mb-1 sm:mb-2 items-center gap-2 sm:gap-3">
              <div
                className={`${isDark ? "bg-white/10" : "bg-gray-800/10 backdrop-blur-lg"
                  } p-2 sm:p-3 rounded-lg`}
              >
                <NotebookTabs
                  className={`w-6 h-6 sm:w-6 sm:h-6 md:w-7 md:h-7  ${isDark ? "text-yellow-300 " : "text-purple-500 "
                    }  `}
                />
              </div>
              <div>
                <h2
                  className={`text-[14px] sm:text-xl md:text-2xl font-bold ${isDark ? "text-white" : "text-black"
                    } uppercase tracking-wide`}
                >
                  Manga Library
                </h2>
                <p
                  className={`text-[8px] sm:text-xs ${isDark ? "text-gray-400" : "text-gray-600"
                    }  uppercase tracking-wide`}
                >
                  Your personalized manga collection
                </p>
              </div>
            </div>

            {/* Right: Selected Manga Inline */}
            {selectedManga && (
              <div
                className={`group flex-row flex ${isDark
                    ? "shadow-[0_0_7px_rgba(0,0,0,1)] shadow-purple-500/20  bg-gray-900/30  border-gray-800/40"
                    : "shadow-[0_0_7px_rgba(0,0,0,0.1)] shadow-gray-400/20  bg-white/90  border-gray-300/40"
                  }  rounded-full p-1.5 sm:p-2 pr-2 sm:pr-3 backdrop-blur-sm border  max-w-[10rem] sm:max-w-sm w-full sm:w-auto items-center gap-2 sm:gap-4 transition focus:outline-none `}
                aria-label={`Continue reading ${selectedManga.title}`}
              >
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden flex-shrink-0 shadow-md">
                  <Image
                    width={300}
                    height={300}
                    src={selectedManga.coverImageUrl}
                    alt={selectedManga.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <div
                    className={`absolute inset-0 ${isDark
                        ? "bg-gradient-to-t from-black/90 via-black/40 to-transparent"
                        : "bg-gradient-to-t from-black/10 via-black/10 to-transparent"
                      }`}
                  />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <div
                    className={`text-left text-[9px] sm:text-[11px] ${isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                  >
                    Currently Reading
                  </div>
                  <h3
                    className={`font-semibold text-sm sm:text-base truncate ${isDark ? "text-white" : "text-black"
                      }`}
                  >
                    {selectedManga.title}
                  </h3>
                </div>
                <button
                  onClick={() => router.push(`/manga/${selectedManga.id}/chapters`)}
                  className={`flex cursor-pointer items-center gap-1 ${isDark
                      ? "bg-white/90 hover:bg-white text-black"
                      : "bg-black/80 hover:bg-black text-white"
                    } backdrop-blur-md text-xs p-2 sm:p-3 rounded-full ml-auto select-none `}
                >
                  <Play size={14} className={` ${isDark
                      ? " text-black fill-black"
                      : " fill-white text-white"
                    } `} />
                </button>
              </div>
            )}
          </header>

          {/* Navigation & Controls */}
          <div className="mb-6 sm:mb-8">
            {/* Tabs */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-8">
              {/* Tabs Navigation */}
              <div
                className={`border ${isDark ? " shadow-purple-500/10" : " shadow-gray-500/30"}  shadow-[0_0_7px_rgba(0,0,0,1)] w-full max-w-[52rem] border-white/10 backdrop-blur-lg rounded-2xl sm:rounded-3xl overflow-hidden `}
              >
                <div className="flex w-full flex-row gap-0 sm:gap-6 justify-between items-center">
                  {[
                    {
                      id: "history",
                      label: "Reading History",
                      shortLabel: "History",
                      icon: BookOpen,
                      count: readingHistory.length,
                    },
                    {
                      id: "favorites",
                      label: "Favorites Chapters",
                      shortLabel: "Favorites",
                      icon: Heart,
                      count: allFavorites.length,
                    },
                    {
                      id: "bookmarks",
                      label: "Bookmarked Mangas",
                      shortLabel: "Bookmarks",
                      icon: Bookmark,
                      count: allBookmarks.length,
                    },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-3 sm:px-5 font-semibold py-3 sm:py-5 text-xs sm:text-sm w-full sm:min-w-60 justify-center relative z-50 tracking-wider border-b-2 sm:border-b-2 border-t-0 rounded-2xl sm:rounded-3xl flex items-center gap-1 sm:gap-2 duration-0 transition-all ${activeTab === tab.id
                          ? isDark
                            ? "border-gray-500/40 hover:border-0 text-white bg-gray-800/30 backdrop-blur-lg" : "border-purple-400 hover:border-0 text-white bg-gray-800 backdrop-blur-lg"
                          : isDark
                            ? "border-transparent text-gray-400 hover:text-gray-200" : "border-transparent text-gray-700 hover:text-gray-900"
                        }`}
                    >
                      <tab.icon strokeWidth={3} size={18} className="sm:w-5 sm:h-5" />
                      <span className="hidden sm:inline">{tab.label}</span>
                      <span className="sm:hidden">{tab.shortLabel}</span>
                      <span
                        className={`${isDark
                            ? "bg-gray-800 text-gray-200"
                            : "bg-gray-200  text-gray-700"
                          } text-[9px] hidden sm:flex justify-center items-center sm:text-[10px] min-w-5 sm:min-w-6 min-h-5 sm:min-h-6 rounded-full ml-1 sm:ml-2`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Controls */}
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full lg:w-auto">
                {/* Search Input */}
                <div
                  className={`relative shadow-[0_0_7px_rgba(0,0,0,1)] shadow-purple-500/5 overflow-hidden rounded-2xl sm:rounded-3xl w-full sm:w-auto ${isDark ? " shadow-purple-500/10" : " shadow-gray-500/20"}`}
                >
                  <input
                    type="text"
                    placeholder={`Search ${activeTab}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`pl-10 sm:pl-14 pr-4 sm:pr-4 py-3 sm:py-5 rounded-2xl sm:rounded-3xl w-full sm:w-80 text-sm sm:text-base focus:outline-none duration-0 focus:border-purple-500 transition-all ${isDark
                        ? "bg-gray-950 border border-white/10 text-white placeholder-gray-400"
                        : "bg-white border border-gray-300 text-black placeholder-gray-500"
                      }`}
                  />
                  <Search
                    size={18}
                    className={`absolute left-3 sm:left-5 top-3 sm:top-[22px] sm:w-5 sm:h-5 ${isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className={`absolute right-3 sm:right-5 top-3 sm:top-[22px] transition-colors ${isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"
                        }`}
                      aria-label="Clear search"
                    >
                      <X size={14} className="sm:w-4 sm:h-4" />
                    </button>
                  )}
                </div>

                {/* Filter Button (only for history) */}
                <button
                  disabled={activeTab !== "history"}
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`flex disabled:opacity-70 disabled:cursor-not-allowed font-bold items-center gap-2 px-4 sm:px-7 backdrop-blur-lg py-3 sm:py-5 rounded-2xl sm:rounded-3xl transition-all border focus:outline-none text-sm sm:text-base w-full sm:w-auto justify-center ${isFilterOpen
                      ? isDark
                        ? "bg-purple-800/20 text-white border-purple-600/10"
                        : "bg-purple-800 backdrop-blur-lg text-white border-purple-600"
                      : isDark
                        ? "bg-white/90 border-white/10 hover:bg-white text-black"
                        : "bg-gray-900 border-gray-300 hover:bg-gray-950 text-white"
                    }`}
                >
                  <Sliders strokeWidth={3} size={14} className="sm:w-4 sm:h-4" />
                  <span>Filters</span>
                  {(filters.genre.length > 0 || filters.status !== "all") && (
                    <span
                      className={`${isDark ? "bg-white text-black" : "bg-gray-700 text-white"
                        } text-[10px] sm:text-xs px-1 sm:px-1.5 py-0.5 rounded-full`}
                    >
                      {filters.genre.length + (filters.status !== "all" ? 1 : 0)}
                    </span>
                  )}
                </button>

                {/* Filter Panel */}
                {isFilterOpen && activeTab === "history" && (
                  <div className="fixed sm:absolute min-w-fit z-50 top-0 left-0 right-0 bottom-0 sm:top-[12%] sm:right-40 sm:left-auto sm:bottom-auto p-4 bg-black/50 sm:bg-transparent">
                    <div className="w-full sm:w-fit max-w-md mx-auto sm:mx-0 mt-20 sm:mt-0">
                      <FilterPanel
                        filters={filters}
                        onFiltersChange={setFilters}
                        onClose={() => setIsFilterOpen(false)}
                        setIsFilterOpen={setIsFilterOpen}
                        isDark={isDark}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="space-y-6 sm:space-y-8">
            {/* History Tab */}
            {activeTab === "history" && (
              <div className="space-y-4 sm:space-y-6 flex flex-col justify-start">
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-6 gap-2 sm:gap-3">
                  {filteredHistory.length > 0 ? (
                    filteredHistory.map((manga) => (
                      <ReadingHistoryCard
                        key={manga.manga.id}
                        manga={manga.manga}
                        chapters={manga.chapters}
                        lastChapterRead={manga.lastChapterRead}
                        lastReadAt={manga.lastReadAT}
                        allChaptersList={manga.allChaptersList}
                        onMangaClick={handleMangaClick}
                        isActive={selectedManga?.id === manga.manga.id}
                        isDark={isDark}
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12 sm:py-20">
                      <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">📚</div>
                      <p className="text-gray-500 text-base sm:text-lg">No reading history available.</p>
                      <p className="text-gray-600 text-xs sm:text-sm mt-1 sm:mt-2">
                        Start reading some manga to see them here!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Favorites Tab */}
            {activeTab === "favorites" && (
              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
                  {filteredFavorites.length > 0 ? (
                    filteredFavorites.map(({ mangaInfo, chapterInfo }) => (
                      <FavoriteCard
                        key={`${mangaInfo.id}-${chapterInfo[0]?.id}`}
                        mangaInfo={mangaInfo}
                        chapterInfo={chapterInfo}
                        onMangaClick={handleMangaClick}
                        addToFavorite={addToFavorite}
                        isDark={isDark}
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12 sm:py-20">
                      <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">💖</div>
                      <p className="text-gray-500 text-base sm:text-lg">No favorite chapters yet.</p>
                      <p className="text-gray-600 text-xs sm:text-sm mt-1 sm:mt-2">
                        Heart chapters you love to see them here!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Bookmarks Tab */}
            {activeTab === "bookmarks" && (
              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-2 sm:gap-3">
                  {filteredBookmarks.length > 0 ? (
                    filteredBookmarks.map(({ manga, bookmarkedAt }) => (
                      <BookmarkCard
                        key={manga.id}
                        manga={manga}
                        bookmarkedAt={bookmarkedAt}
                        onMangaClick={handleMangaClick}
                        addToBookMarks={addToBookMarks}
                        isDark={isDark}
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12 sm:py-20">
                      <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🔖</div>
                      <p className="text-gray-500 text-base sm:text-lg">No bookmarked manga yet.</p>
                      <p className="text-gray-600 text-xs sm:text-sm mt-1 sm:mt-2">
                        Bookmark manga you want to read later!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MangaLibrary;