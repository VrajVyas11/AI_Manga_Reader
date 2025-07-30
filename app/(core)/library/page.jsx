"use client";
import {
  Bookmark,
  Clock,
  Flame,
  Heart,
  History,
  Search,
  Star,
  Filter,
  ChevronDown,
  ChevronRight,
  Play,
  X,
  Sliders,
  ArrowRight,
  Library
} from "lucide-react";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useManga } from "../../providers/MangaContext";
import Image from "next/image";
import { FilterPanel, MobileFilterPanel as OriginalMobileFilterPanel } from '../../Components/LibraryComponents/FilterPanel';
// ========== COMPONENTS ========== //
const FloatingQuickAccess = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <button className="p-3 bg-purple-600 hover:bg-purple-700 rounded-full shadow-lg transition-all hover:scale-110">
        <Search size={20} />
      </button>
      <button className="p-3 bg-gray-800 border border-gray-700 hover:bg-gray-700 rounded-full shadow-lg transition-all hover:scale-110">
        <Filter size={20} />
      </button>
      <button className="p-3 bg-gray-800 border border-gray-700 hover:bg-gray-700 rounded-full shadow-lg transition-all hover:scale-110">
        <Bookmark size={20} />
      </button>
    </div>
  );
};
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
}) => {
  const progress = calculateProgress({ manga, allChaptersList, chapters });

  return (
    <div
      className={`relative group overflow-hidden rounded-3xl shadow-lg transition-all duration-300 ${isActive ? "ring-2 ring-purple-500/50" : "hover:ring-1 hover:ring-gray-600"
        } bg-transparent`}
      aria-label={`Manga card for ${manga.title}`}
    >
      <div className="relative h-56 overflow-hidden rounded-t-3xl">
        <img
          src={manga.coverImageUrl || manga.cover}
          alt={manga.title}
          className="w-full h-full object-fill group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent rounded-t-3xl" />
        <div className="absolute bottom-2 left-4 right-4">
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
          <h3 className="font-semibold text-lg text-white line-clamp-1 drop-shadow-md">
            {manga.title}
          </h3>
          <p className="text-xs text-gray-400 mt-1 line-clamp-1">
            Ch.{" "}
            {lastChapterRead
              ? `${lastChapterRead.chapter} : ${lastChapterRead.title}`
              : "N/A"}
          </p>

        </div>
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            aria-label="Add to favorites"
            className="p-1.5 bg-gray-800 rounded-full hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <Heart size={16} />
          </button>
          <button
            aria-label="Add to bookmarks"
            className="p-1.5 bg-gray-800 rounded-full hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Bookmark size={16} />
          </button>
        </div>
      </div>

      {isActive && (
        <div className="absolute top-3 left-3 bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md select-none">
          <Play size={14} /> Reading
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
            className="h-full bg-gradient-to-r from-purple-100 to-purple-200 rounded-full transition-all duration-700 ease-out relative"
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
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const { getSelectedManga, getAllFavorites, getAllBookMarks, getAllFromReadHistory } =
    useManga();
  const [searchHistory, setSearchHistory] = useState([]);
  // console.log(getSelectedManga());
  // console.log(getAllFavorites());
  // console.log(getAllBookMarks());
  // console.log(getAllFromReadHistory());
  // console.log(searchHistory);

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

  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [filters, setFilters] = useState({
    genre: [],
    status: "all",
    sort: "recent",
  });

  // Mobile states
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Your provided data (replace these with your actual data source)
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
  console.log(getSelectedManga());
  console.log(getAllFavorites());
  console.log(getAllBookMarks());
  console.log(getAllFromReadHistory());
  console.log(searchHistory);

  const filteredHistory = useMemo(() => {
    let filtered = [...readingHistory];

    if (filters.genre.length > 0) {
      filtered = filtered.filter((item) =>
        item.manga.flatTags?.some((tag) => filters.genre.includes(tag))
      );
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter((item) => item.manga.status === filters.status);
    }

    filtered.sort((a, b) => {
      switch (filters.sort) {
        case 'recent':
          return new Date(b.lastReadAT) - new Date(a.lastReadAT);
        case 'rating':
          return (
            (b.manga.rating?.rating?.bayesian || 0) -
            (a.manga.rating?.rating?.bayesian || 0)
          );
        case 'popular':
          return (b.manga.rating?.follows || 0) - (a.manga.rating?.follows || 0);
        case 'title':
          return a.manga.title.localeCompare(b.manga.title);
        case 'progress':
          const progressA =
            (a.chapters.length / (a.allChaptersList.length || 1)) * 100;
          const progressB =
            (b.chapters.length / (b.allChaptersList.length || 1)) * 100;
          return progressB - progressA;
        default:
          return 0;
      }
    });

    return filtered;
  }, [readingHistory, filters]);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 overflow-hidden">
      {/* Main Content */}
      <div className="relative z-10 max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center sm:items-end gap-6 mb-10">
          {/* Left: Logo + Title + Subtitle */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 max-w-full sm:max-w-[60%] min-w-0">
            <div className="p-2 bg-white/20  rounded-lg flex-shrink-0">
              <Library size={46} className="text-yellow-400" />
            </div>
            <div className="min-w-0">
              <h1 className="text-3xl font-bold bg-white bg-clip-text text-transparent truncate">
                Manga Library
              </h1>
              <p className="text-gray-400 mt-1 truncate">
                Your personalized manga universe
              </p>
            </div>
          </div>

          {/* Right: Selected Manga Inline */}
          {selectedManga && (
            <button
              onClick={() => router.push(`/manga/${selectedManga.id}/chapters`)}
  
              className="group flex items-center gap-4 bg-gray-900/30 backdrop-blur-sm border border-gray-800/40 rounded-full    p-2 pr-4  shadow-xl max-w-sm w-full sm:w-auto cursor-pointer transition  focus:outline-none focus:ring-2 focus:ring-purple-500"
              aria-label={`Continue reading ${selectedManga.title}`}
            >
              {/* Cover Thumbnail */}
              <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 shadow-md">
                <img
                  src={selectedManga.coverImageUrl}
                  alt={selectedManga.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              </div>

              {/* Info */}
              <div className="flex flex-col min-w-0">
                <div className=" text-left text-xs text-gray-400">Currently Reading</div>
                <h3 className="text-lg font-semibold text-white truncate">
                  {selectedManga.title}
                </h3>
              </div>

              {/* Reading Badge */}
              <div className="hidden sm:flex items-center gap-1 bg-white/90 hover:bg-white backdrop-blur-md  text-xs p-3 rounded-full ml-auto select-none">
                <Play size={20} className="text-black fill-black" />

              </div>
            </button>
          )}
        </header>
{/* <hr className="w-full mb-5 border border-white/10 border-dashed "/> */}
        {/* Main Grid */}
        <div className="grid grid-cols-12 gap-8">
          {/* Left Sidebar - Currently Reading & Filters */}
          <div className={`${isFilterOpen?"lg:col-span-3":""} space-y-6`}>
            {/* Filters Panel (Collapsible) */}
            {isFilterOpen &&<div className="sticky top-0 w-[320px] overflow-y-hidden rounded-lg pb-4 ">
              <FilterPanel filters={filters} setIsFilterOpen={setIsFilterOpen} onFiltersChange={setFilters} />
            </div>}
          </div>

          {/* Main Content Area */}
          <div className={`${isFilterOpen?"lg:col-span-9":"lg:col-span-12 -mt-8"} space-y-8`}>
            {/* Tabs Navigation */}
            <div className="flex overflow-x-auto justify-between w-full scrollbar-hide border-b border-gray-800">
              <div className=" flex flex-row justify-start items-center">
                <button
                  onClick={() => setActiveTab("history")}
                  className={`px-5 py-3 border-b-2 flex items-center gap-2 transition-all ${activeTab === "history"
                    ? "border-purple-500 text-purple-400"
                    : "border-transparent text-gray-400 hover:text-gray-200"
                    }`}
                >
                  <History size={16} /> History{" "}
                  <span className="bg-gray-800 text-gray-200 text-xs px-2 py-0.5 rounded-full">
                    {readingHistory.length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("favorites")}
                  className={`px-5 py-3 border-b-2 flex items-center gap-2 transition-all ${activeTab === "favorites"
                    ? "border-purple-500 text-purple-400"
                    : "border-transparent text-gray-400 hover:text-gray-200"
                    }`}
                >
                  <Heart size={16} /> Favorites{" "}
                  <span className="bg-gray-800 text-gray-200 text-xs px-2 py-0.5 rounded-full">
                    {allFavorites.length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("bookmarks")}
                  className={`px-5 py-3 border-b-2 flex items-center gap-2 transition-all ${activeTab === "bookmarks"
                    ? "border-purple-500 text-purple-400"
                    : "border-transparent text-gray-400 hover:text-gray-200"
                    }`}
                >
                  <Bookmark size={16} /> Bookmarks{" "}
                  <span className="bg-gray-800 text-gray-200 text-xs px-2 py-0.5 rounded-full">
                    {allBookmarks.length}
                  </span>
                </button>
              </div>
              <div className="flex justify-self-end -mt-2 items-center gap-4">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-800 hover:bg-gray-800 rounded-lg transition-all"
                >
                  <Sliders size={16} />
                  <span>Filters</span>
                </button>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search library..."
                    className="pl-10 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg w-64 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                  <Search size={18} className="absolute left-3 top-2.5 text-gray-500" />
                </div>
              </div>
            </div>

            {/* Active Tab Content */}
            {activeTab === "history" && (
              <div className="space-y-6 flex flex-col justify-start">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <History size={20} /> Continue Reading
                  </h2>
                </div>

                <div className={`grid grid-cols-1 sm:grid-cols-2 ${isFilterOpen?"lg:grid-cols-5":"lg:grid-cols-6"}  gap-3`}>
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
                    <p className="text-gray-500 col-span-full text-center py-10">
                      No reading history available.
                    </p>
                  )}
                </div>
              </div>
            )}

            {activeTab === "favorites" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Heart size={20} className="text-red-400" /> Favorite Chapters
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allFavorites.map(({ mangaInfo, chapterInfo }) => (
                    <div
                      key={mangaInfo.id}
                      className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-all group"
                    >
                      <div className="relative h-48">
                        <img
                          src={mangaInfo.coverImageUrl}
                          alt={mangaInfo.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="font-bold text-white line-clamp-1">
                            {mangaInfo.title}
                          </h3>
                          <p className="text-xs text-gray-300 mt-1">
                            Ch. {chapterInfo[0]?.chapter ?? "N/A"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {chapterInfo[0]?.title ?? ""}
                          </p>
                        </div>
                        <div className="absolute top-3 right-3">
                          <button className="p-1.5 bg-gray-900/80 rounded-full hover:bg-red-500 transition-colors">
                            <Heart size={16} className="fill-red-500 text-red-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "bookmarks" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Bookmark size={20} className="text-blue-400" /> Bookmarked Mangas
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allBookmarks.map(({ manga, bookmarkedAt }) => (
                    <div
                      key={manga.id}
                      className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-all group"
                    >
                      <div className="relative h-48">
                        <img
                          src={manga.coverImageUrl}
                          alt={manga.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="font-bold text-white line-clamp-1">
                            {manga.title}
                          </h3>
                          <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                            <Clock size={12} />{" "}
                            {new Date(bookmarkedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="absolute top-3 right-3">
                          <button className="p-1.5 bg-gray-900/80 rounded-full hover:bg-blue-500 transition-colors">
                            <Bookmark size={16} className="fill-blue-500 text-blue-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Quick Access */}
      <FloatingQuickAccess />

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-100px) translateX(10px);
          }
          100% {
            transform: translateY(0) translateX(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default MangaLibrary;