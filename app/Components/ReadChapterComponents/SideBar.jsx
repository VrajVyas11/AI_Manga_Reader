import React, {
  useState,
  useCallback,
  useEffect,
  memo,
  useRef,
  useMemo,
} from 'react';
import CollapsedSideBarStrip from './InfoSideBarModules/CollapsedSideBarStrip';
import { useManga } from '../../providers/MangaContext';
import { langFullNames } from '@/app/constants/Flags';
import Image from 'next/image';
import {
  ChevronUp,
  ChevronDown,
  Menu,
  BookOpen,
  File,
  Settings,
  X,
  Search,
  ArrowUpDown,
  Globe,
    Heart,
  ArrowLeft as ArrowLeftIcon,
  List,
  Info,
  ToggleRight,
  ToggleLeft,
} from 'lucide-react';

const SideBar = ({
  isCollapsed,
  pages,
  setIsCollapsed,
  mangaInfo,
  panels,
  setCurrentIndex,
  chapterInfo,
  goToNextChapter,
  hasNextChapter,
  hasPrevChapter,
  goToChapter,
  currentIndex = 1,
  goToPrevChapter,
  allChapters = [],
  setSettingsOpen,
  settingsOpen
}) => {
  const [chapterDropdownOpen, setChapterDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedLanguage, setSelectedLanguage] = useState(
    chapterInfo.translatedLanguage
  );
  const { addToFavorite, getAllFavorites } = useManga();
  const dropdownRef = useRef(null);
  const languageDropdownRef = useRef(null);
  const settingsRef = useRef(null);

  const isFavorite = useMemo(
    () => getAllFavorites()[mangaInfo.id],
    [getAllFavorites, mangaInfo.id]
  );

  // Get unique chapters and available languages
  const { uniqueChapters, availableLanguages, chapterLanguageMap } = useMemo(() => {
    const chaptersMap = new Map();
    const languagesSet = new Set();
    const chapterLangMap = new Map();

    allChapters.forEach((chapter) => {
      const chapterNum = chapter.chapter;
      languagesSet.add(chapter.translatedLanguage);

      if (!chaptersMap.has(chapterNum)) {
        chaptersMap.set(chapterNum, chapter);
      }

      if (!chapterLangMap.has(chapterNum)) {
        chapterLangMap.set(chapterNum, []);
      }
      chapterLangMap.get(chapterNum).push(chapter);
    });

    // Set default language to English if available, otherwise first available
    const languages = Array.from(languagesSet);
    const defaultLang = languages.includes('en') ? 'en' : languages[0];

    return {
      uniqueChapters: Array.from(chaptersMap.values()),
      availableLanguages: languages,
      chapterLanguageMap: chapterLangMap,
    };
  }, [allChapters]);

  // Get chapters for selected language
  const chaptersForLanguage = useMemo(() => {
    return allChapters.filter(
      (chapter) => chapter.translatedLanguage === selectedLanguage
    );
  }, [allChapters, selectedLanguage]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setChapterDropdownOpen(false);
      }
      if (
        languageDropdownRef.current &&
        !languageDropdownRef.current.contains(event.target)
      ) {
        setLanguageDropdownOpen(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setSettingsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!mangaInfo || !chapterInfo) return null;

  const toggleFavorite = useCallback(
    () => addToFavorite(mangaInfo, chapterInfo),
    [addToFavorite, mangaInfo, chapterInfo]
  );

  const sortedChapters = useMemo(
    () =>
      [...chaptersForLanguage].sort((a, b) => {
        const aNum = parseFloat(a.chapter);
        const bNum = parseFloat(b.chapter);
        return sortOrder === 'asc' ? aNum - bNum : bNum - aNum;
      }),
    [chaptersForLanguage, sortOrder]
  );

  const filteredChapters = useMemo(
    () =>
      searchQuery.trim()
        ? sortedChapters.filter((ch) =>
            ch.chapter.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : sortedChapters,
    [sortedChapters, searchQuery]
  );

  const goToFirstChapter = useCallback(() => {
    if (chaptersForLanguage.length > 0) {
      const firstChapter = [...chaptersForLanguage].sort(
        (a, b) => parseFloat(a.chapter) - parseFloat(b.chapter)
      )[0];
      goToChapter(firstChapter);
      setChapterDropdownOpen(false);
    }
  }, [chaptersForLanguage, goToChapter]);

  const goToLastChapter = useCallback(() => {
    if (chaptersForLanguage.length > 0) {
      const lastChapter = [...chaptersForLanguage].sort(
        (a, b) => parseFloat(b.chapter) - parseFloat(a.chapter)
      )[0];
      goToChapter(lastChapter);
      setChapterDropdownOpen(false);
    }
  }, [chaptersForLanguage, goToChapter]);

  const handleLanguageChange = useCallback(
    (language) => {
      setSelectedLanguage(language);
      setLanguageDropdownOpen(false);

      // Find the same chapter in the new language, or fallback to first available
      const currentChapterNum = chapterInfo.chapter;
      const sameChapterInNewLang = allChapters.find(
        (ch) => ch.chapter === currentChapterNum && ch.translatedLanguage === language
      );

      if (sameChapterInNewLang) {
        goToChapter(sameChapterInNewLang);
      } else {
        // Fallback to first chapter in new language
        const firstChapterInNewLang = allChapters
          .filter((ch) => ch.translatedLanguage === language)
          .sort((a, b) => parseFloat(a.chapter) - parseFloat(b.chapter))[0];

        if (firstChapterInNewLang) {
          goToChapter(firstChapterInNewLang);
        }
      }
      setChapterDropdownOpen(false);
    },
    [chapterInfo.chapter, allChapters, goToChapter]
  );

  const CoverImage = memo(({ src, alt, className }) => (
    <Image
      src={src}
      alt={alt}
      width={200}
      height={300}
      className={className}
      onError={(e) => {
        e.target.src = '/placeholder-cover.png';
      }}
    />
  ));
    const coverImageProps = useMemo(() => ({
      src: mangaInfo.coverImageUrl,
      alt: mangaInfo.title,
      className: 'object-cover w-full h-full'
    }), [mangaInfo.coverImageUrl, mangaInfo.title]);
  

  if (isCollapsed) {
    return (
      <CollapsedSideBarStrip
        isFavorite={isFavorite}
        toggleFavorite={toggleFavorite}
        mangaInfo={mangaInfo}
        setIsCollapsed={setIsCollapsed}
        CoverImage={CoverImage}
        hasPrevChapter={hasPrevChapter}
        goToNextChapter={goToNextChapter}
        hasNextChapter={hasNextChapter}
        sortOrder={sortOrder}
        goToPrevChapter={goToPrevChapter}
        goToChapter={goToChapter}
        filteredChapters={filteredChapters}
        goToLastChapter={goToLastChapter}
        goToFirstChapter={goToFirstChapter}
        setSortOrder={setSortOrder}
        setSearchQuery={setSearchQuery}
        searchQuery={searchQuery}
        chapterInfo={chapterInfo}
        dropdownRef={dropdownRef}
        setChapterDropdownOpen={setChapterDropdownOpen}
        chapterDropdownOpen={chapterDropdownOpen}
      />
    );
  }

  return (
    <div
      className="fixed left-0 bottom-0 flex flex-col shadow-2xl z-40 "
      style={{ height: '89vh' }}
    >
      <div className="tracking-wider h-[86vh] md:h-[87.7vh] mt-3 md:mt-4 w-[280px] md:w-[340px]  rounded-r-2xl px-3 md:px-5 pt-2 md:pt-3 pb-1.5 md:pb-2 flex flex-col shadow-[0_0_20px_rgba(0,0,0,0.5)] border-r border-purple-500/20">
        <div className="tracking-wider absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 rounded-full bg-purple-700/10 blur-2xl -z-10"></div>
        <div className="tracking-wider absolute bottom-0 left-0 w-24 md:w-32 h-24 md:h-32 rounded-full bg-yellow-500/10 blur-2xl -z-10"></div>

        <div className="tracking-wider flex items-center justify-between mb-1.5 md:mb-2">
          <div className="tracking-wider flex items-center">
            <button
              onClick={() => setIsCollapsed(true)}
              className="tracking-wider w-7 md:w-9 h-7 md:h-9 rounded-lg bg-gray-800/50 border border-purple-700/20 flex items-center justify-center text-gray-200 transition-all duration-300 group"
              aria-label="Collapse sidebar"
            >
              <ArrowLeftIcon className="tracking-wider w-3 md:w-4 h-3 md:h-4" />
              <span className="tracking-wider absolute hidden group-hover:block bg-gray-900/90 text-white text-[10px] md:text-xs py-0.5 md:py-1 px-1.5 md:px-2 rounded-md left-10 md:left-12 top-5 md:top-7">Collapse</span>
            </button>
            <h1 className="tracking-wider ml-6 md:ml-8 text-sm md:text-base font-bold uppercase bg-gradient-to-r from-purple-300 to-yellow-200 bg-clip-text text-transparent">
              Manga Explorer
            </h1>
          </div>
          <button
            onClick={toggleFavorite}
            className={`w-7 md:w-9 h-7 md:h-9 rounded-lg flex items-center justify-center transition-all duration-300 group ${isFavorite ? 'bg-red-900/30 text-red-400 border border-red-700/20' : 'bg-gray-800/50 text-gray-400 border border-gray-700/20 hover:bg-red-900/30 hover:text-red-400'}`}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-4 md:w-5 h-4 md:h-5 ${isFavorite ? 'animate-pulse fill-rose-500/40' : ''}`} />
            <span className="tracking-wider absolute hidden group-hover:block bg-gray-900/90 text-white text-[10px] md:text-xs py-0.5 md:py-1 px-1.5 md:px-2 rounded-md right-10 md:right-12 top-5 md:top-7">{isFavorite ? 'Unfavorite' : 'Favorite'}</span>
          </button>
        </div>

        <div className="tracking-wider bg-gray-800/50 rounded-xl border border-purple-700/20 mb-1.5 md:mb-2">
          <div className="tracking-wider flex p-2 md:p-3 items-center">
            <div className="tracking-wider w-12 md:w-16 h-18 md:h-24 rounded-lg overflow-hidden border-2 border-purple-700/20 shadow-md">
              <CoverImage {...coverImageProps} />
            </div>
            <div className="tracking-wider ml-2 md:ml-3 flex-1">
              <h2 className="tracking-wider text-sm md:text-base font-bold text-white line-clamp-1">{mangaInfo.title}</h2>
              <div className="tracking-wider flex items-center mt-1 md:mt-1.5 gap-1 md:gap-1.5 flex-wrap">
                <span className={`px-1 md:px-1.5 py-0.5 text-[10px] md:text-xs rounded-md font-medium ${mangaInfo.status === 'ongoing' ? 'bg-green-900/30 text-green-400 border border-green-700/20' : mangaInfo.status === 'completed' ? 'bg-blue-900/30 text-blue-400 border border-blue-700/20' : mangaInfo.status === 'hiatus' ? 'bg-gray-800/50 text-orange-400 border border-orange-700/20' : mangaInfo.status === 'cancelled' ? "bg-gray-800/50 text-red-400 border border-red-700/20" : 'bg-gray-800/50 text-gray-400 border border-gray-700/20'}`}>
                  {mangaInfo.status.toUpperCase()}
                </span>
                <span className="tracking-wider px-1 md:px-1.5 py-0.5 text-[10px] md:text-xs bg-purple-900/30 text-purple-400 rounded-md font-medium border border-purple-700/20">{mangaInfo.year}</span>
                <span className="tracking-wider px-1 md:px-1.5 py-0.5 text-[10px] md:text-xs bg-yellow-900/20 text-yellow-300 rounded-md font-medium border capitalize border-yellow-700/20">{mangaInfo.contentRating}</span>
              </div>
            </div>
          </div>


      {/* Language Selector */}
      <div className="p-4 border-b border-purple-900/20">
        <div className="relative" ref={languageDropdownRef}>
          <button
            onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
            className="w-full flex items-center justify-between p-3 bg-gray-800/60 hover:bg-purple-900/40 rounded-lg border border-purple-700/30 transition-colors font-semibold text-white tracking-wide"
            aria-label="Select language"
          >
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-purple-400" />
              <span>{langFullNames[selectedLanguage] || selectedLanguage}</span>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-gray-400 transition-transform ${
                languageDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {languageDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-gray-900/95 backdrop-blur-lg border border-purple-700/30 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto">
              {availableLanguages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className={`w-full text-left px-4 py-3 hover:bg-purple-900/40 transition-colors font-medium tracking-wide ${
                    selectedLanguage === lang
                      ? 'bg-purple-900/60 text-white'
                      : 'text-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-purple-400" />
                    <span>{langFullNames[lang] || lang}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chapter Dropdown Button */}
      <div className="p-4 border-b border-purple-900/20 relative" ref={dropdownRef}>
        <button
          onClick={() => setChapterDropdownOpen((open) => !open)}
          className="w-full flex items-center justify-between p-3 bg-gray-800/60 hover:bg-purple-900/40 rounded-lg border border-purple-700/30 transition-colors font-semibold text-white tracking-wide"
          aria-label="Toggle chapter list"
        >
          <div className="flex items-center gap-3">
            <List className="w-5 h-5 text-purple-400" />
            <span>Chapters ({filteredChapters.length})</span>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform ${
              chapterDropdownOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Chapter Dropdown List */}
        {chapterDropdownOpen && (
          <div
            className="absolute top-0 left-80 ml-2 w-72  bg-gray-900/95 backdrop-blur-lg border border-purple-700/30 rounded-lg shadow-xl z-50 "
          >
            <div className="p-3 border-b border-purple-700/30 flex flex-col gap-3">
              <div className="relative ">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search chapters..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800/60 border border-purple-700/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 font-medium tracking-wide"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
                  }
                  className="flex items-center gap-2 px-3 py-2 bg-gray-800/60 hover:bg-purple-900/40 rounded-lg text-gray-300 hover:text-white transition-colors font-semibold tracking-wide"
                  aria-label={`Sort chapters ${
                    sortOrder === 'asc' ? 'descending' : 'ascending'
                  }`}
                >
                  <ArrowUpDown className="w-4 h-4" />
                  <span className="text-sm">{sortOrder === 'asc' ? 'Oldest' : 'Newest'}</span>
                </button>

                <button
                  onClick={goToFirstChapter}
                  className="flex-1 px-3 py-2 bg-purple-900/60 hover:bg-purple-800/70 text-white rounded-lg text-sm font-semibold tracking-wide transition-colors"
                >
                  First
                </button>

                <button
                  onClick={goToLastChapter}
                  className="flex-1 px-3 py-2 bg-purple-900/60 hover:bg-purple-800/70 text-white rounded-lg text-sm font-semibold tracking-wide transition-colors"
                >
                  Last
                </button>
              </div>
            </div>

            <div className="p-2 overflow-y-auto max-h-[30vh] h-auto "
              style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(155, 89, 182, 0.6) rgba(0, 0, 0, 0.1)' }}
            >
              {filteredChapters.length === 0 ? (
                <div className="text-center py-8 text-gray-400 font-medium tracking-wide">
                  <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No chapters found</p>
                </div>
              ) : (
                filteredChapters.map((chapter) => (
                  <button
                    key={chapter.id}
                    onClick={() => {
                      goToChapter(chapter);
                      setChapterDropdownOpen(false);
                    }}
                    className={`w-full text-left p-3 rounded-lg mb-2 transition-colors font-medium tracking-wide ${
                      chapter.id === chapterInfo.id
                        ? 'bg-purple-900/70 text-white border border-purple-700/60 shadow-md'
                        : 'text-gray-300 hover:bg-purple-900/40 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="mb-1 text-lg leading-tight">
                          Chapter {chapter.chapter}
                        </div>
                        <div className="text-sm text-gray-400 flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <File className="w-3 h-3" />
                            <span>{chapter.pageCount} pages</span>
                          </div>
                          <span>{new Date(chapter.publishAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      {chapter.id === chapterInfo.id && (
                        <div className="text-purple-400">
                          <BookOpen className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Controls */}
      <div className="p-4 border-t border-purple-900/20 bg-gray-900/50 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <button
            onClick={goToPrevChapter}
            disabled={!hasPrevChapter}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
              hasPrevChapter
                ? 'bg-purple-900/60 hover:bg-purple-800/80 text-white'
                : 'bg-gray-800/30 text-gray-500 cursor-not-allowed'
            }`}
          >
            <ChevronUp className="w-4 h-4" />
            Previous
          </button>

          <div className="text-center">
            <div className="text-sm text-gray-400 tracking-wide">Chapter</div>
            <div className="text-xl font-extrabold text-white tracking-wide">
              {chapterInfo.chapter}
            </div>
          </div>

          <button
            onClick={goToNextChapter}
            disabled={!hasNextChapter}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
              hasNextChapter
                ? 'bg-purple-900/60 hover:bg-purple-800/80 text-white'
                : 'bg-gray-800/30 text-gray-500 cursor-not-allowed'
            }`}
          >
            Next
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>
      <button onClick={()=>setSettingsOpen(!settingsOpen)} className=' flex flex-row justify-between w-full items-center p-4'><Settings className=' w-5 h-5'/>Settings {settingsOpen?<ToggleRight className=' w-5 h-5' />:<ToggleLeft className=' w-5 h-5'/>}</button>
    </div>
              </div>
          </div>
  );
};

export default SideBar;