'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useManga } from '../../providers/MangaContext';
import {
  Bookmark,
  Heart,
  Filter,
  BookOpenText,
  LibraryBig,
} from 'lucide-react';

// Original imports
import { FavoriteChaptersCard as OriginalFavoriteChaptersCard, MobileFavoriteChaptersCard as OriginalMobileFavoriteChaptersCard } from '../../Components/LibraryComponents/FavoriteChaptersCard';
import { MobileReadingHistory as OriginalMobileReadingHistory, ReadingHistory as OriginalReadingHistory } from '../../Components/LibraryComponents/ReadingHistory';
import { FilterPanel as OriginalFilterPanel, MobileFilterPanel as OriginalMobileFilterPanel } from '../../Components/LibraryComponents/FilterPanel';
import { BookMarkedSection as OriginalBookMarkedSection, MobileBookMarkedSection as OriginalMobileBookMarkedSection } from '../../Components/LibraryComponents/BookMarkedSection';
import { SelectedMangaCard as OriginalSelectedMangaCard, MobileSelectedManga as OriginalMobileSelectedManga } from '../../Components/LibraryComponents/SelectedMangaCard';
import OriginalSearchHistory from '../../Components/LibraryComponents/SearchHistory';
import OriginalLibraryLoading from '../../Components/LibraryComponents/LibraryLoading';

// Memoized imports in Library file
const FavoriteChaptersCard = React.memo(OriginalFavoriteChaptersCard);
const MobileFavoriteChaptersCard = React.memo(OriginalMobileFavoriteChaptersCard);
const ReadingHistory = React.memo(OriginalReadingHistory);
const MobileReadingHistory = React.memo(OriginalMobileReadingHistory);
const FilterPanel = React.memo(OriginalFilterPanel);
const MobileFilterPanel = React.memo(OriginalMobileFilterPanel);
const BookMarkedSection = React.memo(OriginalBookMarkedSection);
const MobileBookMarkedSection = React.memo(OriginalMobileBookMarkedSection);
const SelectedMangaCard = React.memo(OriginalSelectedMangaCard);
const MobileSelectedManga = React.memo(OriginalMobileSelectedManga);
const SearchHistory = React.memo(OriginalSearchHistory);
const LibraryLoading = React.memo(OriginalLibraryLoading);


const Library = () => {
  const router = useRouter();
  const { getSelectedManga, getAllFavorites, getAllBookMarks, getAllFromReadHistory } = useManga();
  const [searchHistory, setSearchHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    genre: [],
    status: 'all',
    sort: 'recent',
  });

  // Mobile states
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('history'); // 'history', 'bookmarks', 'favorites'

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

  const handleMangaClick = useCallback(
    (manga) => router.push(`/manga/${manga.id}/chapters`),
    [router]
  );
  const handleSearchClick = useCallback(
    (query) => router.push(`/search?query=${encodeURIComponent(query)}`),
    [router]
  );

  const selectedManga = getSelectedManga();
  const favorites = Object.values(getAllFavorites());
  const bookmarks = getAllBookMarks();
  const readHistory = getAllFromReadHistory();

  // Filter and sort reading history
  const filteredHistory = useMemo(() => {
    let filtered = [...readHistory];

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
  }, [readHistory, filters]);

  if (isLoading) {
    return (
     <LibraryLoading/>
    );
  }

  return (
    <div className="min-h-[89vh] pt-20 md:pt-0 md:mt-0">
      {/* Mobile Filter Panel */}
      <MobileFilterPanel
        filters={filters}
        onFiltersChange={setFilters}
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
      />

      {/* Header */}
      <div className="w-full -mt-5 md:mt-0 bg-black/30 border-b border-purple-500/20">
        <div className="flex items-center justify-between px-4 sm:px-7 py-4 relative overflow-hidden">
          {/* Left section - Icon and title */}
          <div className="flex items-center gap-2 sm:gap-4 relative z-10">
            <div className="relative group">
              <div className="absolute inset-0 rounded-xl transition-all duration-300"></div>
              <div className="relative bg-gradient-to-br from-slate-800 to-gray-900 p-2 sm:p-3 rounded-xl border border-purple-400/30 shadow-xl">
                <LibraryBig className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 drop-shadow-lg" />
              </div>
            </div>

            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent tracking-tight">
                Library
              </h2>
              <p className="text-xs text-gray-400 font-medium tracking-wide max-w-md hidden sm:block">
                Reading History • Favourites • Bookmarks & More
              </p>
            </div>
          </div>

          {/* Right section - Action buttons */}
          <div className="flex items-center gap-1 sm:gap-3 relative z-10">
            {/* Desktop buttons - hidden on mobile */}
            <div className="flex items-center gap-3">
              <button className="group relative overflow-hidden flex items-center gap-2 px-2.5 md:px-4 py-2.5  rounded-full bg-gradient-to-r from-indigo-600/20 to-indigo-500/10 border border-indigo-400/30 text-indigo-300 text-sm font-medium hover:from-indigo-500/30 hover:to-indigo-400/20 hover:text-indigo-200 hover:border-indigo-300/50 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/25">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/0 via-indigo-400/10 to-indigo-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <BookOpenText className="w-4 h-4 relative z-10" />
                <span className="relative z-10 hidden md:block">History ({readHistory.length})</span>
              </button>

              <button className="group relative overflow-hidden flex items-center gap-2 px-2.5 md:px-4 py-2.5 rounded-full bg-gradient-to-r from-rose-600/20 to-rose-500/10 border border-rose-400/30 text-rose-300 text-sm font-medium hover:from-rose-500/30 hover:to-rose-400/20 hover:text-rose-200 hover:border-rose-300/50 transition-all duration-300 hover:shadow-lg hover:shadow-rose-500/25">
                <div className="absolute inset-0 bg-gradient-to-r from-rose-400/0 via-rose-400/10 to-rose-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <Heart className="w-4 h-4 relative z-10" />
                <span className="relative z-10 hidden md:block">Favourite ({favorites.length})</span>
              </button>

              <button className="group relative overflow-hidden flex items-center gap-2 px-2.5 md:px-4 py-2.5 rounded-full bg-gradient-to-r from-emerald-600/20 to-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-sm font-medium hover:from-emerald-500/30 hover:to-emerald-400/20 hover:text-emerald-200 hover:border-emerald-300/50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-emerald-400/10 to-emerald-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <Bookmark className="w-4 h-4 relative z-10" />
                <span className="relative z-10 hidden md:block">Bookmarks ({bookmarks.length})</span>
              </button>
            </div>

            {/* Mobile stats */}
            <div className="lg:hidden flex items-center ml-2 gap-1 text-xs">
              <div className="bg-gray-900/50 px-3  py-2.5  rounded-full border border-gray-800">
                <span className="text-gray-300">{readHistory.length + favorites.length + bookmarks.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-full px-1 sm:px-1 pt-1">
        {/* Mobile Tabs */}
        <div className="lg:hidden flex gap-1 mb-3 flex-row items-center w-full">
          <div className="flex items-center w-full p-1 bg-black/30 rounded-lg border border-gray-800">
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 flex items-center justify-center gap-1 px-3 py-3 rounded-md text-[11px] font-medium transition-all ${activeTab === 'history'
                ? 'bg-white/10 text-gray-100 shadow-md'
                : 'text-gray-400 hover:text-gray-300'
                }`}
            >
              <BookOpenText className="w-4 h-4" />
              <span className="inline text-[11px]">History</span>
              <span className="sm:hidden">({readHistory.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('bookmarks')}
              className={`flex-1 flex items-center justify-center gap-1 px-3 py-3 rounded-md text-[11px] font-medium transition-all ${activeTab === 'bookmarks'
                ? 'bg-gray-800 text-gray-100 shadow-md'
                : 'text-gray-400 hover:text-gray-300'
                }`}
            >
              <Bookmark className="w-4 h-4" />
              <span className="inline  text-[11px]">Bookmarks</span>
              <span className="sm:hidden">({bookmarks.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex-1 flex  items-center justify-center gap-1 px-3 py-3 rounded-md text-[11px] font-medium transition-all ${activeTab === 'favorites'
                ? 'bg-gray-800 text-gray-100 shadow-md'
                : 'text-gray-400 hover:text-gray-300'
                }`}
            >
              <Heart className="w-4 h-4" />
              <span className="inline text-[11px]">Favorites</span>
              <span className="sm:hidden ">({favorites.length})</span>
            </button>
          </div>

          {/* Mobile Filter Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-black/30 hover:bg-gray-800/50 border border-gray-800 rounded-lg text-gray-300 transition-all"
            >
              <Filter className="w-5 h-5" />
              {(filters.genre.length > 0 || filters.status !== 'all' || filters.sort !== 'recent') && (
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              )}
            </button>
          </div>
        </div>


        {selectedManga && (
          <MobileSelectedManga selectedManga={selectedManga} />)}
        {/* Content Layout */}
        <div className="flex flex-col lg:flex-row w-full gap-1 h-auto md:h-[75vh]">
          {/* Desktop Left Sidebar - Filters */}
          <div className="hidden lg:block overflow-y-hidden bg-black/30 backdrop-blur-xl rounded-lg pb-4 max-w-80">
            <FilterPanel filters={filters} onFiltersChange={setFilters} />
          </div>

          {/* Main Content Area */}
          <div className="flex flex-col border border-gray-900 bg-black/30 rounded-xl p-3 sm:p-4 shadow-lg ">
            {/* Mobile Content based on active tab */}
            <div className="lg:hidden h-auto w-auto relative">
              {activeTab === 'history' && (
                <MobileReadingHistory readHistory={readHistory} filteredHistory={filteredHistory} handleMangaClick={handleMangaClick} />
              )}
              {activeTab === 'favorites' && (
                <MobileFavoriteChaptersCard favorites={favorites} handleMangaClick={handleMangaClick} />
              )}
              
              {activeTab === 'bookmarks' && (
                  <MobileBookMarkedSection bookmarks={bookmarks} handleMangaClick={handleMangaClick} />
              )}
            </div>

            {/* Desktop Layout */}
            <ReadingHistory readHistory={readHistory} filteredHistory={filteredHistory} handleMangaClick={handleMangaClick} />

            {/* Desktop Bottom Section */}
            <div className="hidden lg:grid grid-cols-2 border gap-2 border-white/5 px-4 rounded-xl">
              {/* Search History Section */}
              <SearchHistory handleSearchClick={handleSearchClick} searchHistory={searchHistory} />

              {/* Currently Reading/Selected */}
              {selectedManga && (
                <SelectedMangaCard selectedManga={selectedManga} />)}
            </div>
          </div>

          {/* Right Sidebar - Bookmarks (3 per row), Favorites, Search History */}
          <div className="w-fit max-w-sm bg-black/30 backdrop-blur-xl flex flex-col gap-4 overflow-hidden rounded-xl p-4 border-[1px] border-white/10">
            <BookMarkedSection bookmarks={bookmarks} />
            <div className='hidden md:block'>
              <FavoriteChaptersCard
                favorites={favorites}
                searchHistory={searchHistory}
                onMangaClick={handleMangaClick}
                onSearchClick={handleSearchClick}
              /></div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Library;