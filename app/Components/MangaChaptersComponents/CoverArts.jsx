"use client";
import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Filter, Search, X, ChevronDown, Grid, List, Calendar, Globe2, Palette, Brush, Expand } from "lucide-react";
import Image from "next/image";
import StableFlag from "../StableFlag";
import CoverArtsSkeleton from "../Skeletons/MangaChapters/CoverArtsSkeleton"
function CoverArts({ manga, isDark = true }) {
  const [covers, setCovers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLocale, setSelectedLocale] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('updatedAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);

  const coversPerPage = viewMode === 'grid' ? 15 : 12;
  const CACHE_DURATION = 100 * 60 * 1000;

  // Cache functions
  const getCacheKey = (mangaId) => `manga_covers_${mangaId}`;

  const getCachedData = useCallback((mangaId) => {
    if (typeof window === 'undefined') return null;
    try {
      const cached = localStorage.getItem(getCacheKey(mangaId));
      if (!cached) return null;
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp > CACHE_DURATION) {
        localStorage.removeItem(getCacheKey(mangaId));
        return null;
      }
      return data;
    } catch {
      return null;
    }
  }, [CACHE_DURATION]);

  const setCachedData = useCallback((mangaId, data) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(getCacheKey(mangaId), JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (err) {
      console.warn('Cache failed:', err);
    }
  }, []);

  const fetchCovers = useCallback(async (mangaId) => {
    if (!mangaId) return;

    const cachedData = getCachedData(mangaId);
    if (cachedData) {
      setCovers(cachedData);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const resp = await fetch(`/api/manga/${encodeURIComponent(mangaId)}/coverArts`);
      if (!resp.ok) {
        const body = await resp.json().catch(() => ({}));
        throw new Error(body?.error || "Failed to fetch covers");
      }
      const json = await resp.json();
      const coversData = Array.isArray(json.data) ? json.data : [];
      setCovers(coversData);
      setCachedData(mangaId, coversData);
    } catch (err) {
      setError(err.message);
      setCovers([]);
    } finally {
      setLoading(false);
    }
  }, [getCachedData, setCachedData]);

  const availableLocales = useMemo(() => {
    return [...new Set(covers.map(c => c.locale).filter(Boolean))].sort();
  }, [covers]);

  const filteredCovers = useMemo(() => {
    let filtered = [...covers];

    // Locale filter
    if (selectedLocale !== 'all') {
      filtered = filtered.filter(cover => cover.locale === selectedLocale);
    }

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(cover =>
        (cover.volume && cover.volume.toString().includes(term)) ||
        (cover.fileName && cover.fileName.toLowerCase().includes(term)) ||
        (cover.locale && cover.locale.toLowerCase().includes(term))
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal, bVal;
      switch (sortBy) {
        case 'volume':
          aVal = parseInt(a.volume) || 0;
          bVal = parseInt(b.volume) || 0;
          break;
        case 'locale':
          aVal = a.locale || '';
          bVal = b.locale || '';
          break;
        default:
          aVal = new Date(a.updatedAt || a.createdAt || 0);
          bVal = new Date(b.updatedAt || b.createdAt || 0);
      }

      const multiplier = sortOrder === 'asc' ? 1 : -1;
      return aVal < bVal ? -multiplier : aVal > bVal ? multiplier : 0;
    });

    return filtered;
  }, [covers, selectedLocale, searchTerm, sortBy, sortOrder]);

  useEffect(() => {
    setCurrentPage(1);
    setSelectedLocale('all');
    setSearchTerm('');
    if (manga?.id) {
      fetchCovers(manga.id);
    } else {
      setCovers([]);
    }
  }, [manga, fetchCovers]);

  const totalPages = Math.ceil(filteredCovers.length / coversPerPage);
  const currentCovers = filteredCovers.slice(
    (currentPage - 1) * coversPerPage,
    currentPage * coversPerPage
  );

  const goToPage = useCallback((page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }, [totalPages]);

  const openImage = useCallback((url) => {
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  const getLocaleFlag = (locale) => {
    return <StableFlag code={locale} /> || '🌐';
  };

  const resetFilters = () => {
    setSelectedLocale('all');
    setSearchTerm('');
    setCurrentPage(1);
  };

  if (error) {
    return (
      <div className="w-full px-6 py-8">
        <div className="bg-red-950/30 border border-red-800/40 rounded-2xl p-6 text-center">
          <div className="w-12 h-12 bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-6 h-6 text-red-400" />
          </div>
          <p className="text-red-200 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6 px-0 sm:px-6 sm:pl-1">
        <div className="flex items-center gap-x-3 sm:gap-x-4">
          <div className="relative">
            <div
              className={`w-12 h-12 sm:w-14 sm:h-14 ${isDark
                ? "bg-gray-800 shadow-md shadow-black/50"
                : "bg-gray-200 shadow-md shadow-gray-300"
                } rounded-lg flex items-center justify-center`}
            >
              <Palette
                className={`w-7 h-7 sm:w-8 sm:h-8 ${isDark ? "text-yellow-300" : "text-yellow-500"
                  }`}
              />
            </div>
          </div>

          <div className="space-y-1">
            <h1
              className={`text-xl sm:text-2xl font-extrabold ${isDark ? "text-gray-100" : "text-gray-900"
                }`}
            >
              COVER ARTS
            </h1>
            <div
              className={`flex items-center space-x-1.5 sm:space-x-2 ${isDark ? "text-white" : "text-gray-700"
                } text-xs uppercase tracking-wider`}
            >
              <Brush
                className={`w-3 h-3 md:w-4 md:h-4 ${isDark ? "text-amber-500" : "text-amber-600"
                  }`}
              />
              <span className="text-[10px] sm:text-xs">Browse collection</span>
            </div>
          </div>
        </div>

        <div
          className={`flex items-center w-fit flex-col md:flex-row space-x-1 space-y-1 md:space-y-0 sm:space-x-3 ${isDark ? "text-gray-300" : "text-gray-700"
            } text-xs sm:text-sm`}
        >
          {filteredCovers.length > 0 && (
            <div
              className={`flex items-center w-full space-x-2 px-3 sm:px-4 py-2 ${isDark
                ? "bg-white/10 backdrop-blur-md border border-gray-700"
                : "bg-gray-100 border border-gray-300"
                } rounded-lg`}
            >
              <Grid
                className={`w-3 h-3 sm:w-5 sm:h-5 ${isDark ? "text-purple-300" : "text-gray-600"
                  }`}
              />
              <span className="font-semibold">{filteredCovers.length.toLocaleString()}</span>
              <span className={`${isDark ? "text-white" : "text-black"} hidden md:block text-[11px] sm:text-xs`}>
                covers
              </span>
            </div>
          )}

          {totalPages > 1 && (
            <div
              className={`hidden md:flex items-center w-full space-x-2 px-3 py-0.5 sm:px-4 sm:py-2 ${isDark
                ? "bg-white/10 backdrop-blur-md border border-gray-700"
                : "bg-gray-100 border border-gray-300"
                } rounded-lg`}
            >
              <span className="font-semibold">Page</span>
              <span className="font-semibold">{currentPage}</span>
              <span className={isDark ? "text-white" : "text-gray-700"}>/</span>
              <span className={isDark ? "text-white" : "text-gray-700"}>
                {totalPages}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className={`p-2.5 rounded-lg border transition-colors ${isDark
                ? "bg-white/10 backdrop-blur-md border-gray-700 text-gray-300 hover:bg-white/20"
                : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
                }`}
              title={`Switch to ${viewMode === 'grid' ? 'list' : 'grid'} view`}
            >
              {viewMode === 'grid' ?
                <List className="w-4 h-4" /> :
                <Grid className="w-4 h-4" />
              }
            </button>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2.5 rounded-lg border transition-all ${showFilters
                ? (isDark
                  ? "bg-blue-600/20 border-blue-500/40 text-blue-400"
                  : "bg-blue-100 border-blue-300 text-blue-600")
                : (isDark
                  ? "bg-white/10 backdrop-blur-md border-gray-700 text-gray-300 hover:bg-white/20"
                  : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200")
                }`}
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className={`p-6 ${isDark
          ? "bg-white/10 backdrop-blur-md border border-gray-700"
          : "bg-gray-100 border border-gray-300"
          } rounded-lg`}>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2 space-y-2">
              <label className={`text-sm font-medium block ${isDark ? "text-gray-300" : "text-gray-700"
                }`}>Search</label>
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? "text-gray-500" : "text-gray-400"
                  }`} />
                <input
                  type="text"
                  placeholder="Search volumes, files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${isDark
                    ? "bg-gray-800/80 border-gray-700/60 text-white placeholder-gray-500 focus:ring-blue-500/30 focus:border-blue-500/50"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500/30 focus:border-blue-500"
                    } focus:outline-none focus:ring-2`}
                />
              </div>
            </div>

            {/* Language */}
            <div className="space-y-2">
              <label className={`text-sm font-medium flex items-center gap-2 ${isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                <Globe2 className="w-4 h-4" />
                Language
              </label>
              <div className="relative">
                <select
                  value={selectedLocale}
                  onChange={(e) => setSelectedLocale(e.target.value)}
                  className={`w-full px-3 py-2.5 rounded-lg border appearance-none cursor-pointer ${isDark
                    ? "bg-gray-800/80 border-gray-700/60 text-white focus:ring-blue-500/30 focus:border-blue-500/50"
                    : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500/30 focus:border-blue-500"
                    } focus:outline-none focus:ring-2`}
                >
                  <option value="all">All ({covers.length})</option>
                  {availableLocales.map(locale => (
                    <option key={locale} value={locale}>
                      {getLocaleFlag(locale)} {locale.toUpperCase()} ({covers.filter(c => c.locale === locale).length})
                    </option>
                  ))}
                </select>
                <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${isDark ? "text-gray-500" : "text-gray-400"
                  }`} />
              </div>
            </div>

            {/* Sort */}
            <div className="space-y-2">
              <label className={`text-sm font-medium block ${isDark ? "text-gray-300" : "text-gray-700"
                }`}>Sort</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className={`w-full px-3 py-2.5 rounded-lg border appearance-none cursor-pointer ${isDark
                      ? "bg-gray-800/80 border-gray-700/60 text-white focus:ring-blue-500/30 focus:border-blue-500/50"
                      : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500/30 focus:border-blue-500"
                      } focus:outline-none focus:ring-2`}
                  >
                    <option value="updatedAt">Date</option>
                    <option value="volume">Volume</option>
                    <option value="locale">Language</option>
                  </select>
                  <ChevronDown className={`absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none ${isDark ? "text-gray-500" : "text-gray-400"
                    }`} />
                </div>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className={`px-3 py-2.5 rounded-lg border transition-colors ${isDark
                    ? "bg-gray-800/80 border-gray-700/60 text-gray-300 hover:bg-gray-700/60"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
                    }`}
                  title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>
            </div>
          </div>

          {(selectedLocale !== 'all' || searchTerm) && (
            <div className={`mt-4 flex items-center justify-between pt-4 border-t ${isDark ? "border-gray-700/60" : "border-gray-300"
              }`}>
              <span className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"
                }`}>
                Showing {filteredCovers.length} of {covers.length} covers
              </span>
              <button
                onClick={resetFilters}
                className={`text-sm font-medium transition-colors ${isDark ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-500"
                  }`}
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <CoverArtsSkeleton isDark={isDark} />
      ) : filteredCovers.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-zinc-800/60 rounded-full flex items-center justify-center mx-auto mb-6">
            <Grid className="w-10 h-10 text-zinc-600" />
          </div>
          <h3 className="text-xl font-medium text-white mb-2">No covers found</h3>
          <p className="text-zinc-400 mb-6">
            {covers.length === 0
              ? "This manga doesn't have any cover arts yet."
              : "Try adjusting your search or filter criteria."
            }
          </p>
          {(selectedLocale !== 'all' || searchTerm) && (
            <button
              onClick={resetFilters}
              className="px-6 py-3 bg-blue-600/80 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Cover Grid/List */}
          <div className={`grid gap-4 ${viewMode === 'grid'
            ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}
          >
            {currentCovers.map((cover) => (
              <div
                key={cover.id}
                className={`group overflow-hidden  transition-all duration-0 hover:scale-[1.02]`}
              >
                <div className="relative  rounded-2xl  w-full overflow-hidden">
                  <Image
                    src={cover.imageUrl || "https://via.placeholder.com/300x400?text=No+Cover"}
                    alt={`Volume ${cover.volume || 'Cover'}`}
                    width={300}
                    height={400}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/300x400?text=No+Cover";
                    }}
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-3">
                      <div className="text-white bg-purple-950/50  p-2  absolute bottom-0 left-0 right-0 flex items-center justify-center gap-2">
                        <Calendar className="w-4 h-4 text-white" />
                        {new Date(cover.updatedAt || cover.createdAt || Date.now()).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: "2-digit"
                        })}
                      </div>
                      <button
                        onClick={() => openImage(cover.imageUrl)}
                        className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                      >
                        <Expand className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Locale Badge */}
                  {cover.locale && (
                    <div className="absolute top-5 right-0">
                      {getLocaleFlag(cover.locale)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-zinc-800/60 border border-zinc-700/50 text-zinc-300 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-700/60 transition-colors"
              >
                Previous
              </button>

              <div className="flex gap-1">
                {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => {
                  let page = i + 1;
                  if (totalPages > 7) {
                    if (currentPage <= 4) {
                      page = i + 1;
                    } else if (currentPage >= totalPages - 3) {
                      page = totalPages - 6 + i;
                    } else {
                      page = currentPage - 3 + i;
                    }
                  }

                  return (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`w-10 h-10 rounded-xl font-medium transition-colors ${currentPage === page
                        ? "bg-blue-600 text-white"
                        : "bg-zinc-800/60 border border-zinc-700/50 text-zinc-300 hover:bg-zinc-700/60"
                        }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-zinc-800/60 border border-zinc-700/50 text-zinc-300 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-700/60 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default React.memo(CoverArts);