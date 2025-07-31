"use client";
import {
  Bookmark,
  Clock,
  Flame,
  Heart,
  Search,
  Star,
  Filter,
  Play,
  X,
  Sliders,
  Library,
  BookOpen,
  SortAsc,
  TrendingUp,
  ArrowUpDown,
  Tag,
  XCircle,
  ClockAlert,
  CircleCheck,
  ListFilter,
  ArrowBigLeftDashIcon,
} from "lucide-react";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useManga } from "../../providers/MangaContext";
import Image from "next/image";
import { langFullNames } from "../../constants/Flags";
import filterOptions from "../../constants/filterOptions";
import FilterPanel from "../../Components/LibraryComponents/FilterPanel";


const calculateProgress = (item) => {
  if (!item.allChaptersList || !item.chapters || item.allChaptersList.length === 0) {
    return { percentage: 0, current: 0, total: 0 };
  }

  const totalChapters = item.allChaptersList.length;
  const percentage = Math.min((item.chapters.length / totalChapters) * 100, 100);

  return {
    percentage: Math.round(percentage),
    current: item.chapters.length,
    total: totalChapters,
  };
};



const MangaCard = ({
  manga,
  isActive = false,
  chapters,
  lastChapterRead,
  lastReadAt,
  allChaptersList,
  onMangaClick
}) => {
  const { addToBookMarks, getAllBookMarks, addToFavorite, getAllFavorites } = useManga();
  const progress = calculateProgress({ manga, allChaptersList, chapters });

  const isBookmarked = useMemo(() => {
    const bookmarks = getAllBookMarks();
    return bookmarks.some(bookmark => bookmark.manga.id === manga.id);
  }, [getAllBookMarks, manga.id]);

  const isFavorited = useMemo(() => {
    const favorites = getAllFavorites();
    return favorites[manga.id];
  }, [getAllFavorites, manga.id]);

  const handleBookmark = useCallback((e) => {
    e.stopPropagation();
    addToBookMarks(manga);
  }, [addToBookMarks, manga]);

  const handleFavorite = useCallback((e) => {
    e.stopPropagation();
    addToFavorite(manga, lastChapterRead);
  }, [addToFavorite, manga, lastChapterRead]);

  return (
    <div
      className={`relative group overflow-hidden rounded-3xl shadow-lg transition-all duration-300 cursor-pointer ${isActive
        ? "ring-2 ring-purple-500/50 shadow-purple-500/20"
        : "hover:ring-1 hover:ring-gray-600 hover:shadow-xl"
        } bg-transparent`}
      onClick={() => onMangaClick(manga)}
      aria-label={`Manga card for ${manga.title}`}
    >
      <div className="relative h-56 overflow-hidden rounded-t-3xl">
        <Image
          width={300}
          height={300}
          src={manga.coverImageUrl || manga.cover}
          alt={manga.title}
          className="w-full h-full object-fill group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent rounded-t-3xl" />
        <div className="absolute bottom-1 left-4 right-4">
          <div className="flex items-center justify-between gap-3 mt-2 text-gray-300 text-sm select-none">
            <span className="flex items-center gap-1">
              <Star size={14} className="text-yellow-400" />
              {manga?.rating?.rating?.average?.toFixed(2) ??
                manga.rating?.follows?.toFixed(2) ??
                "N/A"}
            </span>
            {lastReadAt && (
              <time
                dateTime={lastReadAt.toISOString()}
                className="text-xs text-gray-200"
                title={`Last read on ${lastReadAt.toLocaleDateString()}`}
              >
                {lastReadAt.toLocaleDateString()}
              </time>
            )}
          </div>
          <h3 className="font-semibold mt-1 text-lg text-white line-clamp-1 drop-shadow-md">
            {manga.title}
          </h3>
          <p className="text-xs text-gray-400 line-clamp-1">
            Ch.{" "}
            {lastChapterRead
              ? `${lastChapterRead.chapter} : ${lastChapterRead.title}`
              : "N/A"}
          </p>
        </div>
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleFavorite}
            className={`p-1.5 rounded-full transition-all focus:outline-none  ${isFavorited
              ? "bg-red-600 text-white shadow-lg"
              : "bg-black hover:bg-red-600 text-gray-300 hover:text-white"
              }`}
            aria-label="Add to favorites"
          >
            <Heart size={16} className={isFavorited ? "fill-current" : ""} />
          </button>
          <button
            onClick={handleBookmark}
            className={`p-1.5 rounded-full transition-all focus:outline-none  ${isBookmarked
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-black hover:bg-blue-600 text-gray-300 hover:text-white"
              }`}
            aria-label="Add to bookmarks"
          >
            <Bookmark size={16} className={isBookmarked ? "fill-current" : ""} />
          </button>
        </div>
      </div>

      {isActive && (
        <div className="absolute top-3 left-3 bg-purple-900/70 backdrop-blur-xl shadow-lg shadow-black text-white text-xs px-3 py-2 rounded-full flex items-center gap-1  select-none">
          <Play size={12} className="fill-current" /> Reading
        </div>
      )}

      <div className="p-4 pt-2">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-1 select-none">
          <span>
            Progress:{" "}
            <span className="font-medium text-white">
              {progress.current}/{progress.total}
            </span>{" "}
            chapters
          </span>
          <span className="font-semibold text-white">{progress.percentage}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-700 ease-out relative"
            style={{ width: `${progress.percentage}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

// ========== MAIN COMPONENT ========== //
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
    addToFavorite
  } = useManga();
  const [searchHistory, setSearchHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [filters, setFilters] = useState({
    genre: [],
    status: "all",
    sort: "recent",
  });

  useEffect(() => {
    try {
      const searches = Object.keys(localStorage || {})
        .filter((key) => key.startsWith('manga_search_'))
        .map((key) => key.replace('manga_search_', ''))
        .reverse();
      setSearchHistory(searches);
    } catch {
      setSearchHistory([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const selectedManga = getSelectedManga();
  const allFavorites = Object.values(getAllFavorites());
  const allBookmarks = getAllBookMarks();
  const readingHistory = getAllFromReadHistory();

  const handleMangaClick = useCallback(
    (manga) => router.push(`/manga/${manga.id}/chapters`),
    [router]
  );

  const handleSearchClick = useCallback(
    (query) => router.push(`/search?query=${encodeURIComponent(query)}`),
    [router]
  );

  // Filter function for all tabs
  const filterItems = useCallback((items, type) => {
    let filtered = [...items];

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(item => {
        const title = type === 'history' ? item.manga.title :
          type === 'favorites' ? item.mangaInfo.title :
            item.manga.title;
        return title.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }

    // Apply genre filter (only for history)
    if (type === 'history' && filters.genre.length > 0) {
      filtered = filtered.filter((item) =>
        item.manga.flatTags?.some((tag) => filters.genre.includes(tag))
      );
    }

    // Apply status filter (only for history)
    if (type === 'history' && filters.status !== 'all') {
      filtered = filtered.filter((item) => item.manga.status === filters.status);
    }

    // Apply sorting
    if (type === 'history') {
      filtered.sort((a, b) => {
        switch (filters.sort) {
          case 'recent':
            return new Date(b.lastReadAT) - new Date(a.lastReadAT);
          case 'rating':
            return (b.manga.rating?.rating?.bayesian || 0) - (a.manga.rating?.rating?.bayesian || 0);
          case 'popular':
            return (b.manga.rating?.follows || 0) - (a.manga.rating?.follows || 0);
          case 'title':
            return a.manga.title.localeCompare(b.manga.title);
          case 'progress':
            const progressA = (a.chapters.length / (a.allChaptersList.length || 1)) * 100;
            const progressB = (b.chapters.length / (b.allChaptersList.length || 1)) * 100;
            return progressB - progressA;
          default:
            return 0;
        }
      });
    } else {
      // Simple sorting for favorites and bookmarks
      filtered.sort((a, b) => {
        const titleA = type === 'favorites' ? a.mangaInfo.title : a.manga.title;
        const titleB = type === 'favorites' ? b.mangaInfo.title : b.manga.title;
        return titleA.localeCompare(titleB);
      });
    }

    return filtered;
  }, [searchQuery, filters]);

  const filteredHistory = useMemo(() => filterItems(readingHistory, 'history'), [filterItems, readingHistory]);
  const filteredFavorites = useMemo(() => filterItems(allFavorites, 'favorites'), [filterItems, allFavorites]);
  const filteredBookmarks = useMemo(() => filterItems(allBookmarks, 'bookmarks'), [filterItems, allBookmarks]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100 overflow-hidden">

      {/* Main Content */}
      <div className="relative z-10 max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Clean Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center sm:items-end gap-6 mb-10">
          {/* Left: Clean Logo + Title + Subtitle */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 max-w-full sm:max-w-[60%] min-w-0">
            <div className="p-3 bg-white/20 backdrop-blur-lg rounded-xl border border-slate-500/30">
              <Library size={40} className="text-purple-400" />
            </div>
            <div className="min-w-0">
              <h1 className="text-3xl font-bold text-white truncate">
                Manga Library
              </h1>
              <p className="text-gray-400 mt-1 truncate">
                Your personalized manga collection
              </p>
            </div>
          </div>

          {/* Right: Selected Manga Inline (UNCHANGED) */}
          {selectedManga && (
            <div
              className="group flex items-center gap-4 bg-gray-900/30 backdrop-blur-sm border border-gray-800/40 rounded-full p-2 pr-4 shadow-xl max-w-sm w-full sm:w-auto transition focus:outline-none "
              aria-label={`Continue reading ${selectedManga.title}`}
            >
              <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 shadow-md">
                <Image
                  width={300}
                  height={300}
                  src={selectedManga.coverImageUrl}
                  alt={selectedManga.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="text-left text-xs text-gray-400">Currently Reading</div>
                <h3 className="text-lg font-semibold text-white truncate">
                  {selectedManga.title}
                </h3>
              </div>
              <button
                onClick={() => router.push(`/manga/${selectedManga.id}/chapters`)}
                className="hidden cursor-pointer sm:flex items-center gap-1 bg-white/90 hover:bg-white backdrop-blur-md text-xs p-3 rounded-full ml-auto select-none"
              >
                <Play size={20} className="text-black fill-black" />
              </button>
            </div>
          )}
        </header>

        {/* Clean Navigation & Controls */}
        <div className=" mb-8">
          {/* Clean Tabs */}
          <div className="flex flex-col border-b-2 border-white/20 lg:flex-row lg:items-center lg:justify-between gap-3">
            {/* Tabs Navigation */}
            <div className="flex   justify-between w-full scrollbar-hide ">
              <div className=" flex flex-row gap-6 justify-start items-center">
                <button
                  onClick={() => setActiveTab("history")}
                  className={`px-5 py-5 min-w-60 justify-center relative z-50 -mb-[1px] tracking-wider border-2 rounded-t-3xl flex items-center gap-2 transition-all ${activeTab === "history"
                    ? "border-gray-500/30 text-white bg-gray-700/20"
                    : "border-transparent text-gray-400 hover:text-gray-200"
                    }`}
                >
                  <BookOpen size={26} /> Reading History{" "}
                  {/* <span className="bg-gray-800 text-gray-200 text-xs px-2 py-0.5 rounded-full">
                    {readingHistory.length}
                  </span> */}
                </button>
                <button
                  onClick={() => setActiveTab("favorites")}
                  className={`px-5 py-5 min-w-60 justify-center relative z-50 -mb-[1px] tracking-wider border-2 rounded-t-3xl flex items-center gap-2 transition-all ${activeTab === "favorites"
                    ? "border-gray-500/30 text-white bg-gray-700/20"
                    : "border-transparent text-gray-400 hover:text-gray-200"
                    }`}
                >
                  <Heart size={26} /> Favorites Chapters{" "}
                  {/* <span className="bg-gray-800 text-gray-200 text-xs px-2 py-0.5 rounded-full">
                    {allFavorites.length}
                  </span> */}
                </button>
                <button
                  onClick={() => setActiveTab("bookmarks")}
                  className={`px-5 py-5 min-w-60 justify-center relative z-50 -mb-[1px] tracking-wider border-2 rounded-t-3xl flex items-center gap-2 transition-all ${activeTab === "bookmarks"
                    ? "border-gray-500/30 text-white bg-gray-700/20"
                    : "border-transparent text-gray-400 hover:text-gray-200"
                    }`}
                >
                  <Bookmark size={26} /> Bookmarked Mangas{" "}
                  {/* <span className="bg-gray-800 text-gray-200 text-xs px-2 py-0.5 rounded-full">
                    {allBookmarks.length}
                  </span> */}
                </button>
              </div>
            </div>

            {/* Clean Controls */}
            <div className="flex items-center -mt-2 gap-4">
              {/* Search Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg w-64 focus:outline-none  focus:border-purple-500 text-white placeholder-gray-400 transition-all"
                />
                <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Filter Button (only for history) */}
              {activeTab === "history" && (
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all border focus:outline-none  ${isFilterOpen
                    ? "bg-purple-800/60 text-white border-purple-600"
                    : "bg-gray-900 border-gray-700 hover:bg-gray-700 text-gray-300 hover:text-white"
                    }`}
                >
                  <Sliders size={16} />
                  <span>Filters</span>
                  {(filters.genre.length > 0 || filters.status !== "all") && (
                    <span className="bg-white text-black text-xs px-1.5 py-0.5 rounded-full">
                      {filters.genre.length + (filters.status !== "all" ? 1 : 0)}
                    </span>
                  )}
                </button>
              )}

              {/* Filter Panel */}
              {isFilterOpen && activeTab === "history" && (
                <div className="absolute min-w-fit z-50 top-[22%] right-32 p-4">
                  <div className="w-fit max-w-md">
                    <FilterPanel
                      filters={filters}
                      onFiltersChange={setFilters}
                      onClose={() => setIsFilterOpen(false)}
                      setIsFilterOpen={setIsFilterOpen}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Main Content Grid */}
        <div className="space-y-8">
          {/* BookOpen Tab (UNCHANGED) */}
          {activeTab === "history" && (
            <div className="space-y-6 flex flex-col justify-start">
                    <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                  <div className="p-3 bg-purple-700/50 rounded-xl">
                    <BookOpen size={24} className="text-white" />
                  </div>
                   Continue Reading
                </h2>
                <div className="text-sm text-gray-400">
                 {readingHistory.length} Read
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
                {filteredHistory.length > 0 ? (
                  filteredHistory.map((manga) => (
                    <MangaCard
                      key={manga.manga.id}
                      manga={manga.manga}
                      chapters={manga.chapters}
                      lastChapterRead={manga.lastChapterRead}
                      lastReadAt={manga.lastReadAT}
                      allChaptersList={manga.allChaptersList}
                      onMangaClick={handleMangaClick}
                      isActive={selectedManga?.id === manga.manga.id}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-20">
                    <div className="text-6xl mb-4">📚</div>
                    <p className="text-gray-500 text-lg">No reading history available.</p>
                    <p className="text-gray-600 text-sm mt-2">Start reading some manga to see them here!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Enhanced Favorites Tab */}
          {activeTab === "favorites" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                  <div className="p-3 bg-rose-500/70 rounded-xl">
                    <Heart size={24} className="text-white" />
                  </div>
                  Favorite Chapters
                </h2>
                <div className="text-sm text-gray-400">
                  {filteredFavorites.length} favorite{filteredFavorites.length !== 1 ? 's' : ''}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {filteredFavorites.length > 0 ? (
                  filteredFavorites.map(({ mangaInfo, chapterInfo }) => (
                    <div
                      key={`${mangaInfo.id}-${chapterInfo[0]?.id}`}
                      className="group bg-gray-900/60 backdrop-blur-sm border border-gray-800/50 rounded-2xl overflow-hidden hover:border-gray-700/70 transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/10 cursor-pointer"
                      onClick={() => handleMangaClick(mangaInfo)}
                    >
                      <div className="relative h-52 overflow-hidden">
                        <Image
                          width={300}
                          height={300}
                          src={chapterInfo[0]?.url || mangaInfo.coverImageUrl}
                          alt={mangaInfo.title}
                          className="w-full h-full object-fill group-hover:scale-110 transition-transform duration-700"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

                        {/* Language Badge */}
                        {chapterInfo[0]?.translatedLanguage && (
                          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg text-xs text-white border border-white/20">
                            {langFullNames[chapterInfo[0].translatedLanguage] || chapterInfo[0].translatedLanguage}
                          </div>
                        )}

                        {/* Favorite Button */}
                        <div className="absolute top-3 right-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addToFavorite(mangaInfo, chapterInfo[0]);
                            }}
                            className="p-2 bg-red-600 rounded-full shadow-lg hover:bg-red-700 transition-all transform hover:scale-110 focus:outline-none "
                            title="Remove from favorites"
                          >
                            <Heart size={18} className="fill-white text-white" />
                          </button>
                        </div>

                        {/* Content Info */}
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="font-bold text-white text-lg line-clamp-2 mb-2 drop-shadow-lg">
                            {mangaInfo.title}
                          </h3>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-200 flex items-center gap-2">
                              <BookOpen size={14} />
                              Ch. {chapterInfo[0]?.chapter ?? "N/A"}
                            </p>
                            {chapterInfo[0]?.title && (
                              <p className="text-xs text-gray-300 line-clamp-1">
                                {chapterInfo[0].title}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-20">
                    <div className="text-6xl mb-4">💖</div>
                    <p className="text-gray-500 text-lg">No favorite chapters yet.</p>
                    <p className="text-gray-600 text-sm mt-2">Heart chapters you love to see them here!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Enhanced Bookmarks Tab */}
          {activeTab === "bookmarks" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                  <div className="p-3 bg-blue-700/50 rounded-xl">
                    <Bookmark size={24} className="text-white" />
                  </div>
                  Bookmarked Manga
                </h2>
                <div className="text-sm text-gray-400">
                  {filteredBookmarks.length} bookmark{filteredBookmarks.length !== 1 ? 's' : ''}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                {filteredBookmarks.length > 0 ? (
                  filteredBookmarks.map(({ manga, bookmarkedAt }) => (
                    <div
                      key={manga.id}
                      className="group bg-gray-900/60 backdrop-blur-sm border border-gray-800/50 rounded-2xl overflow-hidden hover:border-gray-700/70 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 cursor-pointer"
                      onClick={() => handleMangaClick(manga)}
                    >
                      <div className="relative h-64 overflow-hidden">
                        <Image
                          width={300}
                          height={300}
                          src={manga.coverImageUrl}
                          alt={manga.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

                        {/* Bookmark Button */}
                        <div className="absolute top-3 right-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addToBookMarks(manga);
                            }}
                            className="p-2 bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 transition-all transform hover:scale-110 focus:outline-none "
                            title="Remove from bookmarks"
                          >
                            <Bookmark size={18} className="fill-white text-white" />
                          </button>
                        </div>

                        {/* Rating Badge */}
                        {manga.rating && (
                          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg text-xs text-white border border-white/20 flex items-center gap-1">
                            <Star size={12} className="text-yellow-400" />
                            {manga.rating?.rating?.average?.toFixed(1) || manga.rating?.follows?.toFixed(1) || "N/A"}
                          </div>
                        )}

                        {/* Content Info */}
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="font-bold text-white text-lg line-clamp-2 mb-2 drop-shadow-lg">
                            {manga.title}
                          </h3>
                          <p className="text-xs text-gray-300 flex items-center gap-2">
                            <Clock size={12} />
                            Bookmarked {new Date(bookmarkedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-20">
                    <div className="text-6xl mb-4">🔖</div>
                    <p className="text-gray-500 text-lg">No bookmarked manga yet.</p>
                    <p className="text-gray-600 text-sm mt-2">Bookmark manga you want to read later!</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-gray-900 rounded-2xl p-8 flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            <p className="text-white">Loading your library...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MangaLibrary;