import React, { useState, useMemo, useEffect, lazy, Suspense, useCallback } from 'react';
import {
  Eye,
  Users,
  User,
  Clock,
  Star,
  Book,
  History,
  ChevronDown,
  Search,
  Languages,
  X,
  Layers,
  GitFork,
  LibraryBig,
  Earth,
  Library,
  ArrowUpDown,
  CheckCircle,
  Filter,
} from 'lucide-react';
import { langFullNames } from '../../constants/Flags';
import { useManga } from '../../providers/MangaContext';
import ChapterListSkeleton from '../Skeletons/MangaChapters/ChapterListSkeleton';
import { useTheme } from '@/app/providers/ThemeContext';

const StableFlag = lazy(() => import('../StableFlag'));

// Memoize FlagFallback to prevent recreation
const FlagFallback = React.memo(() => (
  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse transition-colors duration-0" />
));

const MemoizedStableFlag = React.memo(({ code, className }) => (
  <Suspense fallback={<FlagFallback />}>
    <StableFlag code={code} className={className} />
  </Suspense>
));

const ChapterListWithFilters = ({ chapters, manga, handleChapterClick }) => {
  const { getAllFromReadHistory } = useManga();
  // States
  const [readingHistory, setReadingHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('descending');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [showHistory, setShowHistory] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedVolumes, setExpandedVolumes] = useState({});
  const [expandedChapters, setExpandedChapters] = useState({});

  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Theme classes
  const themeClasses = {
    // Text colors
    primaryText: isDark ? 'text-white' : 'text-gray-900',
    secondaryText: isDark ? 'text-gray-400' : 'text-gray-600',
    accentText: isDark ? 'text-yellow-400' : 'text-purple-600',
    successText: isDark ? 'text-emerald-400' : 'text-emerald-600',
    
    // Background colors
    primaryBg: isDark ? 'bg-gray-850' : 'bg-white',
    secondaryBg: isDark ? 'bg-gray-800' : 'bg-gray-100',
    tertiaryBg: isDark ? 'bg-gray-600/30' : 'bg-gray-200',
    overlayBg: isDark ? 'bg-white/5' : 'bg-black/5',
    cardBg: isDark ? 'bg-gray-500/5' : 'bg-gray-50',
    inputBg: isDark ? 'bg-gray-600/30' : 'bg-white',
    
    // Interactive states
    hoverBg: isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-50',
    activeBg: isDark ? 'bg-purple-900/90' : 'bg-purple-600',
    activeText: isDark ? 'text-white' : 'text-white',
    inactiveBg: isDark ? 'bg-gray-800' : 'bg-gray-200',
    inactiveText: isDark ? 'text-white' : 'text-gray-700',
    
    // Borders
    border: isDark ? 'border-white/30' : 'border-gray-300',
    borderLight: isDark ? 'border-gray-700' : 'border-gray-200',
    
    // Special states
    readBg: isDark ? 'bg-purple-900/20' : 'bg-purple-100',
    unreadBg: isDark ? 'bg-black/20' : 'bg-white',
    disabledBg: isDark ? 'bg-gray-700' : 'bg-gray-300',
    disabledText: isDark ? 'text-gray-400' : 'text-gray-500',
    
    // Buttons
    primaryButton: isDark 
      ? 'bg-purple-900/90 text-white hover:bg-purple-950' 
      : 'bg-purple-600 text-white hover:bg-purple-700',
    secondaryButton: isDark 
      ? 'bg-gray-800 text-white hover:bg-gray-700' 
      : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
    historyButton: isDark 
      ? 'bg-yellow-400 text-gray-900' 
      : 'bg-purple-600 text-white',
    resetButton: isDark 
      ? 'bg-rose-600 hover:bg-rose-700 text-white' 
      : 'bg-red-600 hover:bg-red-700 text-white',
  };

  // Memoize event handlers
  const toggleFilters = useCallback(() => {
    setShowFilters((v) => !v);
  }, []);

  const toggleHistory = useCallback(() => {
    setShowHistory((v) => !v);
  }, []);

  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedLanguage('all');
    setSortOrder('descending');
  }, []);

  const toggleVolume = useCallback((volume) => {
    setExpandedVolumes((prev) => ({
      ...prev,
      [volume]: !prev[volume],
    }));
  }, []);

  const toggleChapter = useCallback((chapter) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapter]: !prev[chapter],
    }));
  }, []);

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleLanguageChange = useCallback((e) => {
    setSelectedLanguage(e.target.value);
  }, []);

  const handleSortChange = useCallback((e) => {
    setSortOrder(e.target.value);
  }, []);

  // Memoize chapter click handler to avoid inline functions
  const handleChapterClickWrapper = useCallback(
    (chapterOrId) => {
      handleChapterClick(chapterOrId);
    },
    [handleChapterClick]
  );

  // Available languages from chapters
  const availableLanguages = useMemo(() => {
    const langs = new Set();
    chapters.forEach((ch) => {
      if (ch.translatedLanguage) langs.add(ch.translatedLanguage);
    });
    return Array.from(langs).sort();
  }, [chapters]);

  // Filter chapters by language and search term
  const filteredChapters = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return chapters.filter((ch) => {
      const matchesLang = selectedLanguage === 'all' || ch.translatedLanguage === selectedLanguage;
      const chapterStr = ch.chapter ? ch.chapter.toLowerCase() : '';
      const titleStr = ch.title ? ch.title.toLowerCase() : '';
      const matchesSearch = term === '' || chapterStr.includes(term) || titleStr.includes(term);
      return matchesLang && matchesSearch;
    });
  }, [chapters, selectedLanguage, searchTerm]);

  // Sort chapters by chapter number
  const sortedChapters = useMemo(() => {
    return [...filteredChapters].sort((a, b) => {
      const aNum = parseFloat(a.chapter ?? '');
      const bNum = parseFloat(b.chapter ?? '');
      if (isNaN(aNum) && isNaN(bNum)) return 0;
      if (isNaN(aNum)) return 1;
      if (isNaN(bNum)) return -1;
      return sortOrder === 'descending' ? bNum - aNum : aNum - bNum;
    });
  }, [filteredChapters, sortOrder]);

  // Group chapters by volume
  const chaptersByVolume = useMemo(() => {
    const map = {};
    sortedChapters.forEach((ch) => {
      const vol = ch.volume ?? 'No Volume';
      const chap = ch.chapter ?? 'No Chapter';
      if (!map[vol]) map[vol] = [];
      const existingGroup = map[vol].find((group) => group.chapter === chap);
      if (existingGroup) {
        existingGroup.chapters.push(ch);
      } else {
        map[vol].push({
          chapter: chap,
          volume: ch.volume,
          chapters: [ch],
        });
      }
    });
    Object.keys(map).forEach((vol) => {
      map[vol].sort((a, b) => {
        const aNum = parseFloat(a.chapter);
        const bNum = parseFloat(b.chapter);
        if (isNaN(aNum) || isNaN(bNum)) return a.chapter.localeCompare(b.chapter);
        return aNum - bNum;
      });
    });
    return map;
  }, [sortedChapters]);

  // Unique volumes sorted
  const uniqueVolumes = useMemo(() => {
    const vols = Object.keys(chaptersByVolume);
    const sortedVols = vols
      .filter((v) => v !== 'No Volume')
      .sort((a, b) => {
        const aNum = parseInt(a);
        const bNum = parseInt(b);
        return aNum - bNum;
      });
    if (vols.includes('No Volume')) sortedVols.push('No Volume');
    if (sortOrder === 'ascending') return sortedVols.reverse();
    return sortedVols;
  }, [chaptersByVolume, sortOrder]);

  // Reading history for current manga
  const readChapters = useMemo(() => {
    const currentMangaHistory = readingHistory.find((h) => h.manga?.id === manga.id);
    return currentMangaHistory ? currentMangaHistory.chapters : [];
  }, [readingHistory, manga.id]);

  // Load reading history
  useEffect(() => {
    const history = getAllFromReadHistory();
    setReadingHistory((prev) => (JSON.stringify(prev) !== JSON.stringify(history) ? history : prev));
  }, [getAllFromReadHistory]);

  // Initialize expanded volumes
  useEffect(() => {
    const initialVolumes = {};
    uniqueVolumes.forEach((vol) => {
      initialVolumes[vol] = true;
    });
    setExpandedVolumes((prev) => {
      if (JSON.stringify(prev) !== JSON.stringify(initialVolumes)) {
        return initialVolumes;
      }
      return prev;
    });
  }, [uniqueVolumes]);

  // Initialize expanded chapters
  useEffect(() => {
    const initialChapters = {};
    uniqueVolumes.forEach((vol) => {
      const chapterGroups = chaptersByVolume[vol] || [];
      chapterGroups.forEach((group) => {
        initialChapters[group.chapter] = true;
      });
    });
    setExpandedChapters((prev) => {
      if (JSON.stringify(prev) !== JSON.stringify(initialChapters)) {
        return initialChapters;
      }
      return prev;
    });
  }, [uniqueVolumes, chaptersByVolume]);

  if (chapters.length <= 0 || !manga) return <ChapterListSkeleton />;
  
  return (
    <div className={`flex flex-col w-full gap-2 sm:gap-4 lg:flex-row ${themeClasses.primaryText} font-sans transition-colors duration-0`}>
      {/* Main content */}
      <div className="flex-1 space-y-2 sm:space-y-4">
        {/* Filters and History buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 sm:mb-4 gap-2 sm:gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-2 sm:gap-4">
            {/* Filter and History buttons on mobile */}
            <div className="flex flex-row justify-between w-full gap-2 sm:hidden">
              <button
                onClick={toggleFilters}
                className={`flex items-center justify-center gap-1 px-4 py-3 rounded font-bold text-xs transition-all duration-0 ${
                  showFilters
                    ? `${themeClasses.primaryButton} rounded-lg shadow-lg`
                    : themeClasses.secondaryButton
                }`}
                aria-pressed={showFilters}
                aria-label="Toggle filters"
                type="button"
              >
                <Filter className="w-4 h-4" />
                Filters
                <ChevronDown className={`w-4 h-4 transition-transform duration-0 ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              <button
                onClick={toggleHistory}
                className={`flex items-center justify-center gap-1 px-4 py-3 rounded font-bold text-xs transition-all duration-0 ${
                  showHistory
                    ? `${themeClasses.primaryButton} rounded-lg shadow-lg`
                    : themeClasses.secondaryButton
                }`}
                aria-pressed={showHistory}
                aria-label="Toggle reading history panel"
                type="button"
              >
                <History className="w-4 h-4" />
                History
                <ChevronDown className={`w-3 h-3 transition-transform duration-0 ${showHistory ? 'rotate-180' : ''}`} />
              </button>
            </div>
            {/* Filters on laptop or when toggled on mobile */}
            <div
              className={`flex flex-col sm:flex-row sm:items-center space-y-1 md:space-y-0 sm:space-x-4 transition-all duration-0 ${
                showFilters ? 'flex' : 'hidden sm:flex'
              } w-full sm:w-auto`}
            >
              <div className="relative w-full sm:w-auto">
                <Search className={`absolute left-2 z-10 top-1/2 -translate-y-1/2 w-3 sm:w-4 h-3 sm:h-4 ${themeClasses.accentText} transition-colors duration-0`} />
                <input
                  type="search"
                  placeholder="Search chapters..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className={`${themeClasses.inputBg} ${themeClasses.primaryText} rounded px-6 sm:px-8 py-1.5 sm:py-2 w-full sm:min-w-[200px] focus:outline-none text-sm sm:text-base border ${themeClasses.border} transition-all duration-0 focus:ring-2 ${isDark ? 'focus:ring-purple-500' : 'focus:ring-purple-500'}`}
                  aria-label="Search chapters"
                  spellCheck={false}
                />
              </div>
              <div className="flex flex-row w-full md:w-fit gap-1 sm:gap-4">
                <div className="relative w-full md:w-fit">
                  <Languages className={`absolute left-2 top-1/2 -translate-y-1/2 w-3 sm:w-4 h-3 sm:h-4 ${themeClasses.accentText} transition-colors duration-0`} />
                  <select
                    value={selectedLanguage}
                    onChange={handleLanguageChange}
                    className={`${themeClasses.inputBg} ${themeClasses.primaryText} rounded px-6 sm:px-8 py-1.5 sm:pt-1.5 sm:pb-2.5 w-full sm:w-auto cursor-pointer focus:outline-none text-sm sm:text-base border ${themeClasses.border} transition-all duration-0`}
                    aria-label="Filter by language"
                  >
                    <option value="all" className={`${isDark ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>All Languages</option>
                    {availableLanguages.map((lang, index) => (
                      <option key={index} value={lang} className={`${isDark ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>
                        {langFullNames[lang] || lang}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="relative w-full md:w-fit">
                  <ArrowUpDown className={`absolute left-2 top-1/2 -translate-y-1/2 w-3 sm:w-4 h-3 sm:h-4 ${themeClasses.accentText} transition-colors duration-0`} />
                  <select
                    value={sortOrder}
                    onChange={handleSortChange}
                    className={`${themeClasses.inputBg} ${themeClasses.primaryText} rounded px-6 sm:px-8 py-1.5 sm:pt-1.5 sm:pb-2.5 w-full sm:w-auto cursor-pointer focus:outline-none text-sm sm:text-base border ${themeClasses.border} transition-all duration-0`}
                    aria-label="Sort order"
                  >
                    <option value="descending" className={`${isDark ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>Newest First</option>
                    <option value="ascending" className={`${isDark ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>Oldest First</option>
                  </select>
                </div>
              </div>
              <button
                onClick={resetFilters}
                disabled={searchTerm === '' && selectedLanguage === 'all' && sortOrder === 'descending'}
                className={`px-2 sm:px-3 min-w-fit py-1.5 sm:py-2 rounded text-xs sm:text-sm font-semibold transition-all duration-0 w-full sm:w-auto ${
                  searchTerm !== '' || selectedLanguage !== 'all' || sortOrder !== 'descending'
                    ? themeClasses.resetButton
                    : `${themeClasses.disabledBg} ${themeClasses.disabledText} cursor-not-allowed`
                }`}
                aria-disabled={searchTerm === '' && selectedLanguage === 'all' && sortOrder === 'descending'}
              >
                Reset Filters
              </button>
            </div>
            {/* History button on laptop */}
            <button
              onClick={toggleHistory}
              className={`hidden sm:flex items-center justify-center gap-2 px-4 py-2 rounded font-semibold text-sm transition-all duration-0 ${
                showHistory ? `${themeClasses.historyButton} shadow` : themeClasses.secondaryButton
              }`}
              aria-pressed={showHistory}
              aria-label="Toggle reading history panel"
              type="button"
            >
              <History className="w-5 h-5" />
              History
              <ChevronDown className={`w-4 h-4 transition-transform duration-0 ${showHistory ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Reading History Panel */}
        {showHistory && (
          <aside
            className={`w-full ${themeClasses.primaryBg} rounded-xl backdrop-blur-md ${themeClasses.overlayBg} p-2 sm:p-4 overflow-y-auto max-h-[300px] sm:max-h-[600px] border ${themeClasses.borderLight} transition-all duration-0`}
            aria-label="Reading history"
          >
            <div className="flex justify-between items-center mb-2 sm:mb-4">
              <h2 className={`text-base sm:text-lg font-semibold ${themeClasses.primaryText} flex items-center gap-1 sm:gap-2 transition-colors duration-0`}>
                <History className={`w-4 sm:w-5 h-4 sm:h-5 ${themeClasses.accentText} transition-colors duration-0`} />
                Reading History
              </h2>
              <button
                onClick={toggleHistory}
                className={`p-0.5 sm:p-1 rounded-full ${themeClasses.hoverBg} ${themeClasses.secondaryText} hover:${themeClasses.primaryText} transition-all duration-0`}
                aria-label="Hide history"
                type="button"
              >
                <X className="w-4 sm:w-5 h-4 sm:h-5" />
              </button>
            </div>
            {readChapters.length === 0 ? (
              <div className={`text-center py-4 sm:py-8 ${themeClasses.secondaryText} text-xs sm:text-base transition-colors duration-0`}>
                No reading history yet. Start reading to track your progress.
              </div>
            ) : (
              <ul className="space-y-1 sm:space-y-2">
                {readChapters
                  .sort((a, b) => new Date(b.lastReadAt).getTime() - new Date(a.lastReadAt).getTime())
                  .map((chapter, index) => (
                    <li key={index}>
                      <button
                        onClick={() => handleChapterClickWrapper(chapter.id)}
                        className={`w-full flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg ${themeClasses.hoverBg} transition-all duration-0 text-left`}
                        aria-label={`Continue reading chapter ${chapter.chapter}`}
                        type="button"
                      >
                        <div className={`w-8 sm:w-12 h-8 sm:h-12 rounded-lg ${themeClasses.secondaryBg} flex items-center justify-center font-bold ${themeClasses.primaryText} text-xs sm:text-lg shadow-sm flex-shrink-0 transition-colors duration-0`}>
                          {chapter.chapter}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium ${themeClasses.primaryText} truncate text-xs sm:text-base transition-colors duration-0`}>
                            {chapter.title || `Chapter ${chapter.chapter}`}
                          </p>
                          <div className={`flex items-center gap-1 sm:gap-2 text-xs ${themeClasses.secondaryText} mt-0.5 sm:mt-1 transition-colors duration-0`}>
                            <MemoizedStableFlag
                              code={chapter.translatedLanguage}
                              className="w-3 sm:w-4 h-3 sm:h-4 rounded-full"
                            />
                            <span className="text-xs">{langFullNames[chapter.translatedLanguage] || chapter.translatedLanguage}</span>
                          </div>
                        </div>
                        <Eye className={`w-3 sm:w-5 h-3 sm:h-5 ${themeClasses.secondaryText} flex-shrink-0 transition-colors duration-0`} />
                      </button>
                    </li>
                  ))}
              </ul>
            )}
          </aside>
        )}

        {/* Volumes and chapters */}
        <div
          style={{ scrollbarWidth: "none" }}
          className="space-y-1 sm:space-y-6 max-h-[600px] sm:max-h-[1200px] overflow-y-auto overflow-x-visible pb-6 sm:pb-12"
        >
          {uniqueVolumes.map((volume, index) => {
            const chapterGroups = chaptersByVolume[volume] || [];
            const isVolumeExpanded = expandedVolumes[volume];
            return (
              <div key={index}>
                <button
                  onClick={() => toggleVolume(volume)}
                  className="w-full flex justify-between overflow-visible items-center py-1.5 sm:py-4 transition-all duration-0"
                  aria-expanded={isVolumeExpanded}
                  aria-label={`Toggle Volume ${volume}`}
                >
                  <h3 className={`${themeClasses.primaryText} text-sm sm:text-lg font-semibold flex justify-start items-center gap-1 sm:gap-3 transition-colors duration-0`}>
                    <LibraryBig className="w-3 sm:w-5 h-3 sm:h-6" />
                    Volume {volume}
                  </h3>
                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1 sm:gap-4 sm:mr-32">
                    <span className={`${themeClasses.primaryText} text-xs sm:text-lg transition-colors duration-0`}>
                      Ch. {chapterGroups[0]?.chapter} - {chapterGroups[chapterGroups.length - 1]?.chapter}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className={`${themeClasses.primaryText} text-xs sm:text-lg mr-1 sm:mr-2 transition-colors duration-0`}>{chapterGroups.length}</span>
                    <ChevronDown
                      className={`w-4 sm:w-6 h-4 sm:h-6 ${themeClasses.primaryText} transition-all duration-0 ${isVolumeExpanded ? 'rotate-180' : ''}`}
                    />
                  </div>
                </button>
                {isVolumeExpanded && (
                  <div className="transition-all duration-0">
                    {chapterGroups.map((group, index) => {
                      const isChapterExpanded = expandedChapters[group.chapter];
                      return (
                        <div key={index} className={`mt-2 md:mt-0 mb-4 ${themeClasses.cardBg} backdrop-blur-3xl rounded shadow-[0_2px_2px_rgba(0,0,0,0.2)] shadow-black/30  transition-colors duration-0`}>
                          <div className="w-full flex justify-between items-center">
                            <button
                              onClick={() => toggleChapter(group.chapter)}
                              className="flex-1 text-left transition-all duration-0"
                              aria-expanded={isChapterExpanded}
                              aria-label={`Toggle Chapter ${group.chapter}`}
                            >
                              <div className={`${themeClasses.primaryText} flex flex-row justify-between rounded-lg font-semibold mb-1 sm:mb-3 transition-colors duration-0`}>
                                <div className={`${isDark ? 'bg-gray-600/10' : 'bg-gray-100'} rounded-lg pl-0 w-full flex flex-row justify-between items-center transition-colors duration-0`}>
                                  <div className={`w-8 sm:w-14 h-full rounded-l-lg ${isDark ? 'bg-gray-400/5' : 'bg-gray-200'} backdrop-blur-md flex justify-center items-center transition-colors duration-0`}>
                                    <Library className={`w-4 sm:w-5 h-4 sm:h-5 ${themeClasses.accentText} transition-colors duration-0`} />
                                  </div>
                                  <span className="flex flex-row justify-start items-center gap-1 sm:gap-2 py-3 text-xs sm:text-base">
                                    Chapter {group.chapter}
                                  </span>
                                  <span className="flex flex-row justify-start items-center gap-1 sm:gap-2 mr-2 sm:mr-3 text-xs sm:text-base">
                                    <Earth className="w-3 sm:w-5 h-3 sm:h-5" />
                                    {group.chapters.length}
                                  </span>
                                </div>
                              </div>
                            </button>
                            <button
                              onClick={() => toggleChapter(group.chapter)}
                              className={`ml-1 sm:ml-5 px-4 py-2.5 sm:py-3 -mt-1 md:-mt-2 h-full flex justify-center items-center ${isDark ? 'bg-gray-600/20' : 'bg-gray-200'} rounded-lg transition-all duration-0`}
                              aria-hidden="true"
                            >
                              <ChevronDown
                                className={`w-5 sm:w-6 h-5 sm:h-6 transition-transform duration-0 ${isChapterExpanded ? 'rotate-180' : ''}`}
                              />
                            </button>
                          </div>
                          {isChapterExpanded && (
                            <div className="flex flex-row mt-2 h-fit">
                              <div className={`ml-3 sm:ml-5 w-1 mb-[46px] md:mb-[51px] ${isDark ? 'bg-gray-700' : 'bg-gray-300'} rounded-3xl transition-colors duration-0`}></div>
                              <div className="space-y-3 sm:space-y-2 w-full pr-1 sm:pr-5 pl-3 sm:pl-4 pb-1 sm:pb-3">
                                {group.chapters.map((chapter, index) => {
                                  const isRead = readChapters.some((c) => c.id === chapter.id);
                                  return (
                                    <div
                                      key={index}
                                      className={`relative p-4 py-1.5 sm:py-3 backdrop-blur-sm w-full rounded-lg border ${themeClasses.border} cursor-pointer transition-all duration-0 ${
                                        isRead ? themeClasses.readBg : themeClasses.unreadBg
                                      } hover:shadow-md`}
                                      onClick={() => handleChapterClickWrapper(chapter)}
                                      role="button"
                                      tabIndex={0}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                          handleChapterClickWrapper(chapter.id);
                                        }
                                      }}
                                    >
                                      {isRead && (
                                        <CheckCircle
                                          strokeWidth={3}
                                          className={`absolute -left-1 -top-1 ${themeClasses.successText} w-4 sm:w-5 h-4 sm:h-5 transition-colors duration-0`}
                                        />
                                      )}
                                      <div className={`absolute -left-4 sm:-left-5 top-1/2 w-4 sm:w-5 h-1 ${isDark ? 'bg-gray-700' : 'bg-gray-300'} transition-colors duration-0`}></div>
                                      <div className="flex flex-col gap-1 sm:gap-3">
                                        <div className="flex items-center md:items-start space-x-4 sm:space-x-3">
                                          <MemoizedStableFlag
                                            code={chapter.translatedLanguage}
                                            className="w-6 h-6 flex-shrink-0"
                                          />
                                          <div className="min-w-0 flex-1">
                                            <h4 className={`${themeClasses.primaryText} font-bold text-xs sm:text-sm sm:mb-2 truncate capitalize transition-colors duration-0`}>
                                              {chapter.title}
                                            </h4>
                                          </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-1 sm:flex sm:flex-row sm:items-start sm:gap-4 ml-3 text-xs sm:text-sm">
                                          <div className="flex items-center space-x-1 sm:space-x-2">
                                            <Users className={`w-2.5 sm:w-4 h-2.5 sm:h-4 ${themeClasses.primaryText} transition-colors duration-0`} />
                                            <span className={`${themeClasses.primaryText} text-xs sm:text-sm truncate transition-colors duration-0`}>
                                              {chapter.relationships.scanlationGroupIds ? 'Scanlations Group' : 'Unknown'}
                                            </span>
                                          </div>
                                          <div className="flex items-center space-x-1 sm:space-x-2">
                                            <Clock className={`w-2.5 sm:w-4 h-2.5 sm:h-4 ${themeClasses.primaryText} transition-colors duration-0`} />
                                            <span className={`${themeClasses.primaryText} text-xs sm:text-sm transition-colors duration-0`}>
                                              {chapter.publishAt
                                                ? new Date(chapter.publishAt).toLocaleDateString()
                                                : 'Unknown'}
                                            </span>
                                          </div>
                                          <div className="flex items-center space-x-1 sm:space-x-2">
                                            <User className={`w-2.5 sm:w-4 h-2.5 sm:h-4 ${themeClasses.primaryText} transition-colors duration-0`} />
                                            <span className={`${isDark ? 'text-[#2ecc71]' : 'text-green-600'} truncate max-w-[80px] sm:max-w-xs text-xs sm:text-sm transition-colors duration-0`}>
                                              {Array.isArray(manga.creatorName)
                                                ? manga.creatorName?.[0]?.attributes.username
                                                : manga.creatorName || 'Unknown'}
                                            </span>
                                          </div>
                                          <div className="flex items-center space-x-1 sm:space-x-2">
                                            <Layers className={`w-2.5 sm:w-4 h-2.5 sm:h-4 ${themeClasses.primaryText} transition-colors duration-0`} />
                                            <span className={`${themeClasses.primaryText} text-xs sm:text-sm transition-colors duration-0`}>{chapter.pageCount}</span>
                                          </div>
                                          <div className="hidden md:flex items-center space-x-1 sm:space-x-2">
                                            <GitFork className={`w-2.5 sm:w-4 h-2.5 sm:h-4 ${themeClasses.primaryText} transition-colors duration-0`} />
                                            <span className={`${themeClasses.primaryText} text-xs sm:text-sm transition-colors duration-0`}>V{chapter.version}</span>
                                          </div>
                                          <div className="flex items-center space-x-1 sm:space-x-2">
                                            {/* Empty placeholder for grid balance */}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChapterListWithFilters;