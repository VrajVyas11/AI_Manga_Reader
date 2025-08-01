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
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [filters, setFilters] = useState({
    genre: [],
    status: "all",
    sort: "recent",
  });

  useEffect(() => {
    setIsLoading(false)
  }, [])

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

    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100 overflow-hidden">
      {isLoading ? <LibraryLoading />
        :
        <div className="relative z-10 max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <header className="flex flex-col sm:flex-row justify-between items-center sm:items-end gap-6 mb-10">
            {/* Left: Logo + Title + Subtitle */}
            <div className="flex mx-2 mb-2 items-center gap-3">
              <div className={`bg-white/10 p-3 rounded-lg`}>
                <NotebookTabs
                  className={`w-6 h-6 md:w-7 md:h-7 text-yellow-300 drop-shadow-md`}
                />
              </div>
              <div>
                <h2
                  className={`text-xl md:text-2xl font-bold text-white uppercase tracking-wide`}
                >
                  Manga Library
                </h2>
                <p className={`text-xs text-gray-400 uppercase tracking-wide`}>
                  Your personalized manga collection
                </p>
              </div>
            </div>

            {/* Right: Selected Manga Inline */}
            {selectedManga && (
              <div
                className="group flex shadow-[0_0_7px_rgba(0,0,0,1)] shadow-purple-500/20 items-center gap-4 bg-gray-900/30 backdrop-blur-sm border border-gray-800/40 rounded-full p-2 pr-3  max-w-sm w-full sm:w-auto transition focus:outline-none "
                aria-label={`Continue reading ${selectedManga.title}`}
              >
                <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 shadow-md">
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
                  <div className="text-left text-[11px] text-gray-400">
                    Currently Reading
                  </div>
                  <h3 className=" font-semibold text-white truncate">
                    {selectedManga.title}
                  </h3>
                </div>
                <button
                  onClick={() => router.push(`/manga/${selectedManga.id}/chapters`)}
                  className="hidden cursor-pointer sm:flex items-center gap-1 bg-white/90 hover:bg-white backdrop-blur-md text-xs p-3 rounded-full ml-auto select-none"
                >
                  <Play size={17} className="text-black fill-black" />
                </button>
              </div>
            )}
          </header>
          {/* Navigation & Controls */}
          <div className="mb-8">
            {/* Tabs */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              {/* Tabs Navigation */}
              <div className=" border shadow-[0_0_7px_rgba(0,0,0,1)] shadow-purple-500/10 w-full max-w-[51rem] border-white/10 backdrop-blur-lg rounded-3xl overflow-hidden">
                  <div className="flex w-full flex-row gap-6 justify-between items-center">
                    {[
                      {
                        id: "history",
                        label: "Reading History",
                        icon: BookOpen,
                        count: readingHistory.length,
                      },
                      {
                        id: "favorites",
                        label: "Favorites Chapters",
                        icon: Heart,
                        count: allFavorites.length,
                      },
                      {
                        id: "bookmarks",
                        label: "Bookmarked Mangas",
                        icon: Bookmark,
                        count: allBookmarks.length,
                      },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-5 font-semibold py-5 text-sm min-w-60 justify-center relative z-50 tracking-wider border-b-2 border-t-0 rounded-3xl flex items-center gap-2 duration-0 transition-all ${activeTab === tab.id
                            ? "border-gray-500/40 hover:border-0 text-white bg-gray-800/30 backdrop-blur-lg"
                            : "border-transparent text-gray-400 hover:text-gray-200"
                          }`}
                      >
                        <tab.icon strokeWidth={3} size={22} /> {tab.label}
                        <span className="bg-gray-800 flex justify-center items-center text-gray-200 text-[10px] min-w-6 min-h-6 rounded-full">
                          {tab.count}
                        </span>
                      </button>
                    ))}
                  </div>
              </div>
              {/* Controls */}
              <div className="flex items-center gap-4">
                {/* Search Input */}
                <div className="relative shadow-[0_0_7px_rgba(0,0,0,1)] shadow-purple-500/5 overflow-hidden rounded-3xl">
                  <input
                    type="text"
                    placeholder={`Search ${activeTab}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-14 pr-4 py-5 bg-gray-950 border border-white/10 rounded-3xl w-80 focus:outline-none  focus:border-purple-500 text-white placeholder-gray-400 transition-all"
                  />
                  <Search size={22} className="absolute left-5 top-[22px] text-gray-400" />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-5 top-2.5 text-gray-400 hover:text-white transition-colors"
                      aria-label="Clear search"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                {/* Filter Button (only for history) */}
                  <button
                  disabled={activeTab !== "history"}
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`flex disabled:opacity-70 disabled:cursor-not-allowed  font-bold items-center gap-2 px-7 backdrop-blur-lg py-5 rounded-3xl transition-all border focus:outline-none  ${isFilterOpen
                        ? "bg-purple-800/20 text-white border-purple-600/10"
                        : "bg-white/90 border-white/10 hover:bg-white text-black"
                      }`}
                  >
                    <Sliders strokeWidth={3} size={16} />
                    <span>Filters</span>
                    {(filters.genre.length > 0 || filters.status !== "all") && (
                      <span className="bg-white text-black text-xs px-1.5 py-0.5 rounded-full">
                        {filters.genre.length + (filters.status !== "all" ? 1 : 0)}
                      </span>
                    )}
                  </button>
                {/* Filter Panel */}
                {isFilterOpen && activeTab === "history" && (
                  <div className="absolute min-w-fit z-50 top-[12%] right-40 p-4">
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
            {/* History Tab */}
            {activeTab === "history" && (
              <div className="space-y-6 flex flex-col justify-start">
                {/* <div className="flex items-center justify-between">
                <div className="flex mx-2 mb-2 items-center gap-3">
                  <div className={`bg-white/10 p-3 rounded-lg`}>
                    <Sparkles className={`w-5 h-5 text-purple-400 drop-shadow-md`} />
                  </div>
                  <div>
                    <h2
                      className={`text-lg md:text-xl font-bold text-white uppercase tracking-wide`}
                    >
                      Continue Reading
                    </h2>
                    <p className={`text-[10px] text-gray-400 uppercase tracking-wide`}>
                      Keep Track of Your Reading History
                    </p>
                  </div>
                </div>

                <div className="text-sm bg-gray-900  border-gray-800 border p-3 rounded-lg text-gray-400">
                  Shown {filteredHistory.length} / {readingHistory.length}
                </div>
              </div> */}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
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
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-20">
                      <div className="text-6xl mb-4">📚</div>
                      <p className="text-gray-500 text-lg">No reading history available.</p>
                      <p className="text-gray-600 text-sm mt-2">
                        Start reading some manga to see them here!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Favorites Tab */}
            {activeTab === "favorites" && (
              <div className="space-y-6">
                {/* <div className="flex items-center justify-between">
                <div className="flex mx-2 mb-2 items-center gap-3">
                  <div className={`bg-white/10 p-3 rounded-lg`}>
                    <Heart className={`w-5 h-5 text-red-400 drop-shadow-md`} />
                  </div>
                  <div>
                    <h2
                      className={`text-lg md:text-xl font-bold text-white uppercase tracking-wide`}
                    >
                      Favorite Chapters
                    </h2>
                    <p className={`text-[10px] text-gray-400 uppercase tracking-wide`}>
                      Your Favorite Chapter List for you to go back to
                    </p>
                  </div>
                </div>
                <div className="text-sm bg-gray-900  border-gray-800 border p-3 rounded-lg text-gray-400">
                  Shown {filteredFavorites.length} / {allFavorites.length}
                </div>
              </div> */}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {filteredFavorites.length > 0 ? (
                    filteredFavorites.map(({ mangaInfo, chapterInfo }) => (
                      <FavoriteCard
                        key={`${mangaInfo.id}-${chapterInfo[0]?.id}`}
                        mangaInfo={mangaInfo}
                        chapterInfo={chapterInfo}
                        onMangaClick={handleMangaClick}
                        addToFavorite={addToFavorite}
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-20">
                      <div className="text-6xl mb-4">💖</div>
                      <p className="text-gray-500 text-lg">No favorite chapters yet.</p>
                      <p className="text-gray-600 text-sm mt-2">
                        Heart chapters you love to see them here!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Bookmarks Tab */}
            {activeTab === "bookmarks" && (
              <div className="space-y-6">
                {/* <div className="flex items-center justify-between">
                <div className="flex mx-2 mb-2 items-center gap-3">
                  <div className={`bg-white/10 p-3 rounded-lg`}>
                    <Bookmark className={`w-5 h-5 text-blue-400 drop-shadow-md`} />
                  </div>
                  <div>
                    <h2
                      className={`text-lg md:text-xl font-bold text-white uppercase tracking-wide`}
                    >
                      Bookmarked Manga
                    </h2>
                    <p className={`text-[10px] text-gray-400 uppercase tracking-wide`}>
                      Your Saved Mangas to Revisit
                    </p>
                  </div>
                </div>
                <div className="text-sm bg-gray-900  border-gray-800 border p-3 rounded-lg text-gray-400">
                  Shown {filteredBookmarks.length} / {allBookmarks.length}
                </div>
              </div> */}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                  {filteredBookmarks.length > 0 ? (
                    filteredBookmarks.map(({ manga, bookmarkedAt }) => (
                      <BookmarkCard
                        key={manga.id}
                        manga={manga}
                        bookmarkedAt={bookmarkedAt}
                        onMangaClick={handleMangaClick}
                        addToBookMarks={addToBookMarks}
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-20">
                      <div className="text-6xl mb-4">🔖</div>
                      <p className="text-gray-500 text-lg">No bookmarked manga yet.</p>
                      <p className="text-gray-600 text-sm mt-2">
                        Bookmark manga you want to read later!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      }
    </div>
  );
};

export default MangaLibrary;