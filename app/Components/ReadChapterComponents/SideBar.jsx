import React, {
  useState,
  useCallback,
  useEffect,
  memo,
  useRef,
  useMemo,
} from 'react';
import CollapsedSideBarStrip from './SideBarModules/CollapsedSideBarStrip';
import { useManga } from '../../providers/MangaContext';
import { langFullNames } from '@/app/constants/Flags';
import Image from 'next/image';
import {
  ChevronDown,
  BookOpen,
  Settings,
  Heart,
  ArrowLeft,
  Info,
  Logs,
  ArrowBigRightDash,
  ArrowBigLeftDash,
  Languages,
} from 'lucide-react';
import StableFlag from '../../Components/StableFlag';
import ChaptersQuickSelect from './SideBarModules/ChaptersQuickSelect';

const SideBar = ({
  isCollapsed,
  isDark=true,
  // pages,
  setIsCollapsed,
  mangaInfo,
  // panels,
  // setCurrentIndex,
  chapterInfo,
  goToNextChapter,
  hasNextChapter,
  hasPrevChapter,
  goToChapter,
  // currentIndex = 1,
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
  // console.log(allChapters);

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
    // const defaultLang = languages.includes('en') ? 'en' : languages[0];

    return {
      uniqueChapters: Array.from(chaptersMap.values()),
      availableLanguages: languages,
      chapterLanguageMap: chapterLangMap,
    };
  }, [allChapters, chapterInfo]);

  // Get languages for selected chapter
 const availableLanguagesForCurrentChapter = useMemo(() => {
  const currentChapterNum = chapterInfo.chapter;
  const chaptersForCurrent = chapterLanguageMap.get(currentChapterNum) || [];
  // Extract languages and remove duplicates using Set
  const uniqueLanguages = Array.from(
    new Set(chaptersForCurrent.map((ch) => ch.translatedLanguage))
  );
  return uniqueLanguages;
}, [chapterLanguageMap, chapterInfo.chapter]);
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
      [...uniqueChapters].sort((a, b) => {
        const aNum = parseFloat(a.chapter);
        const bNum = parseFloat(b.chapter);
        return sortOrder === 'asc' ? aNum - bNum : bNum - aNum;
      }),
    [uniqueChapters, sortOrder]
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
    if (uniqueChapters.length > 0) {
      const firstChapter = [...uniqueChapters].sort(
        (a, b) => parseFloat(a.chapter) - parseFloat(b.chapter)
      )[0];
      goToChapter(firstChapter);
      setChapterDropdownOpen(false);
    }
  }, [uniqueChapters, goToChapter]);

  const goToLastChapter = useCallback(() => {
    if (uniqueChapters.length > 0) {
      const lastChapter = [...uniqueChapters].sort(
        (a, b) => parseFloat(b.chapter) - parseFloat(a.chapter)
      )[0];
      goToChapter(lastChapter);
      setChapterDropdownOpen(false);
    }
  }, [uniqueChapters, goToChapter]);

  const handleLanguageChange = useCallback(
    (language) => {
      setSelectedLanguage(language);
      setLanguageDropdownOpen(false);
      // console.log(language)
      // Find the same chapter in the new language, or fallback to first available
      const currentChapterNum = chapterInfo.chapter;
      const sameChapterInNewLang = allChapters.find(
        (ch) => ch.chapter === currentChapterNum && ch.translatedLanguage === language
      );

      if (sameChapterInNewLang) {
        goToChapter(sameChapterInNewLang);
        // console.log(sameChapterInNewLang)
      } else {
        // Fallback to first chapter in new language
        const firstChapterInNewLang = allChapters
          .filter((ch) => ch.translatedLanguage === language)
          .sort((a, b) => parseFloat(a.chapter) - parseFloat(b.chapter))[0];
        // console.log("here in else", firstChapterInNewLang)
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
      isDark={isDark}
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
    className={`
      absolute md:relative px-2 rounded-r-lg left-0 bottom-1 md:-bottom-6 border-[1px] border-l-0
      h-[89vh] w-52 md:w-72 md:h-[88vh] md:px-3 flex flex-col z-40 shadow-[0_0_10px_rgba(0,0,0,1)]
      ${isDark
        ? 'border-gray-800/90 bg-black/90 md:bg-black/25 backdrop-blur-3xl shadow-black/80'
        : 'border-gray-300/70 bg-white/90 md:bg-white/70 backdrop-blur-md shadow-gray-400/50'}
    `}
  >
    {/* Header */}
    <div className={`py-1.5 border-b relative md:py-2 ${
      isDark ? 'border-slate-800/50' : 'border-gray-300/50'
    }`}>
      <button
        onClick={() => setIsCollapsed(true)}
        className={`
          group absolute top-2 left-2 w-7 h-7 rounded-xl border flex items-center justify-center
          transition-all duration-0 md:w-10 md:h-10 md:top-3 md:left-3
          ${isDark
            ? 'bg-slate-800/80 border-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-700/80 hover:border-slate-600/50'
            : 'bg-gray-50 shadow-[0_0_5px_rgba(0,0,0,1)] shadow-gray-300 border-gray-300 hover:bg-gray-200 hover:border-gray-400'}
        `}
        aria-label="Collapse sidebar"
      >
        <ArrowLeft className={`${isDark ? 'text-slate-300' : 'text-gray-700'} w-3 h-3 md:w-5 md:h-5`} />
      </button>

      {/* Manga Info */}
      <div className="flex flex-col mt-12 justify-center items-center gap-3 md:mt-7 md:gap-4">
        <div
          className={`
            w-14 h-14 rounded-full overflow-hidden  flex-shrink-0
            md:w-20 md:h-20
            ${isDark ? 'shadow-[0_0_5px_rgba(0,0,0,1)] shadow-purple-400' : 'shadow-[0_0_5px_rgba(0,0,0,1)] shadow-gray-900 '}
          `}
        >
          <CoverImage {...coverImageProps} />
        </div>

        <h2
          className={`
            text-[11px] font-serif font-semibold text-center capitalize line-clamp-2
            md:text-sm
            ${isDark ? 'text-white' : 'text-gray-900'}
          `}
        >
          {mangaInfo.title}
        </h2>
      </div>
    </div>

    <div className={`pl-2 flex flex-row w-full border-l-4 ml-1 mt-4 mb-2 items-start justify-start gap-2 md:pl-4 md:ml-2 md:mt-6 md:mb-3 ${
      isDark ? 'border-l-yellow-500' : 'border-l-yellow-400'
    }`}>
      <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-[11px] md:text-sm`}>Reading</p>
      <div className="flex items-center gap-2">
        <span className={`${isDark ? 'text-yellow-500' : 'text-yellow-600'} text-[11px] md:text-sm`}>By Chapter</span>
        <ChevronDown className={`${isDark ? 'text-gray-400' : 'text-gray-600'} w-3 h-3 md:w-4 md:h-4`} />
      </div>
    </div>

    <div className={`flex mt-5 justify-start text-[11px] px-1.5 items-center gap-2 md:text-sm md:px-2 md:gap-4 md:mt-4 md:mb-2 ${
      isDark ? 'text-white' : 'text-gray-900'
    }`}>
      <Logs className={`${isDark ? 'text-white' : 'text-gray-900'} w-4 h-4 md:w-5 md:h-5`} /> Chapter Navigation
    </div>

    {/* Language Selector */}
    <div className="p-2 py-1">
      <div className="relative" ref={languageDropdownRef}>
        <button
          onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
          className={`
            w-full flex items-center justify-between p-2 rounded-md transition-all duration-0 border
            md:p-3
            ${isDark
              ? 'bg-slate-800/60 hover:bg-slate-700/60 text-white border-slate-700/50 hover:border-slate-600/50'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border-gray-300 hover:border-gray-400'}
          `}
          aria-label="Select language"
        >
          <div className="flex items-center gap-2 md:gap-3">
            <Languages className={`${isDark ? 'text-slate-400' : 'text-gray-500'} w-3 h-3 md:w-4 md:h-4`} />
            <span className={`text-[11px] font-medium md:text-sm`}>
              Language: {selectedLanguage.toUpperCase() || langFullNames[selectedLanguage]}
            </span>
          </div>
          <ChevronDown
            className={`w-3 h-3 transition-transform duration-200 md:w-4 md:h-4 ${
              languageDropdownOpen ? 'rotate-180' : ''
            } ${isDark ? 'text-slate-400' : 'text-gray-500'}`}
          />
        </button>

        {languageDropdownOpen && (
          <div
            style={{
              scrollbarWidth: 'none',
              scrollbarColor: 'rgba(155, 89, 182, 0.6) rgba(0, 0, 0, 0.1)',
            }}
            className={`
              absolute top-full left-0 right-0 mt-2 rounded-lg shadow-xl max-h-36 overflow-y-auto z-50
              md:max-h-48
              ${isDark
                ? 'bg-slate-900/95 backdrop-blur-sm border border-slate-700/50'
                : 'bg-white/95 backdrop-blur-sm border border-gray-300'}
            `}
          >
            {availableLanguagesForCurrentChapter.map((lang,index) => (
              <button
                key={index}
                onClick={() => handleLanguageChange(lang)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2 transition-colors duration-0 rounded-md md:px-4 md:py-3 md:text-sm
                  hover:bg-slate-800/60
                  ${selectedLanguage === lang
                    ? isDark
                      ? 'bg-purple-500/20 text-white border-l-2 border-purple-500'
                      : 'bg-purple-200 text-purple-900 border-l-2 border-purple-600'
                    : isDark
                    ? 'text-slate-300'
                    : 'text-gray-700'}
                `}
              >
                <StableFlag
                  code={lang || 'en'}
                  className="w-4 h-4 rounded shadow-sm md:w-5 md:h-5"
                  alt="flag"
                />
                <span className="font-medium">{langFullNames[lang] || lang}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>

    {/* Chapter Selector */}
    <div className="p-2 py-1">
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setChapterDropdownOpen(!chapterDropdownOpen)}
          className={`
            w-full flex items-center justify-between p-2 rounded-md transition-all duration-0 border
            md:p-3
            ${isDark
              ? 'bg-slate-800/60 hover:bg-slate-700/60 text-white border-slate-700/50 hover:border-slate-600/50'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border-gray-300 hover:border-gray-400'}
          `}
          aria-label="Select chapter"
        >
          <div className="flex items-center gap-1 md:gap-0.5">
            <BookOpen className={`${isDark ? 'text-slate-400' : 'text-gray-500'} w-3 h-3 min-w-fit md:w-4 md:h-4`} />
            <span className="text-[11px] font-medium line-clamp-1 md:text-sm">
              Chapter {chapterInfo.chapter} : {chapterInfo.title}
            </span>
          </div>
          <ChevronDown
            className={`w-3 h-3 ml-2 min-w-fit transition-transform duration-200 md:w-4 md:h-4 md:ml-4 ${
              chapterDropdownOpen ? 'rotate-180' : ''
            } ${isDark ? 'text-slate-400' : 'text-gray-500'}`}
          />
        </button>

        {chapterDropdownOpen && (
          <div className={`absolute -bottom-[220%] left-48 z-50 md:left-56 md:-bottom-[250%]`}>
            <ChaptersQuickSelect
            isDark={isDark}
              searchQuery={searchQuery}
              chapterInfo={chapterInfo}
              setSearchQuery={setSearchQuery}
              setSortOrder={setSortOrder}
              sortOrder={sortOrder}
              goToFirstChapter={goToFirstChapter}
              goToLastChapter={goToLastChapter}
              filteredChapters={filteredChapters}
              goToChapter={goToChapter}
              setChapterDropdownOpen={setChapterDropdownOpen}
            />
          </div>
        )}
      </div>
    </div>

    {/* Navigation Controls */}
    <div className="py-1 mt-3 md:mt-4 px-2">
      <div className="flex gap-2">
        <button
          onClick={goToPrevChapter}
          disabled={!hasPrevChapter}
          className={`
            flex-1 flex items-center justify-center gap-2 rounded-md transition-all duration-0 font-medium px-4 py-2 md:text-sm
            ${hasPrevChapter
              ? isDark
                ? 'bg-slate-800/60 hover:bg-slate-700/60 text-white border border-slate-700/50 hover:border-slate-600/50'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-900 border border-gray-300 hover:border-gray-400'
              : isDark
              ? 'bg-slate-800/30 text-slate-500 cursor-not-allowed border border-slate-800/30'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-100'
            }
          `}
        >
          <ArrowBigLeftDash className={`${isDark ? 'fill-white text-white' : 'fill-gray-900 text-gray-900'} w-4 h-4 md:w-5 md:h-5`} />
        </button>

        <button
          onClick={goToNextChapter}
          disabled={!hasNextChapter}
          className={`
            flex-1 flex items-center justify-center gap-2 rounded-md transition-all duration-0 font-medium px-4 py-2 md:text-sm
            ${hasNextChapter
              ? isDark
                ? 'bg-slate-800/60 hover:bg-slate-700/60 text-white border border-slate-700/50 hover:border-slate-600/50'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-900 border border-gray-300 hover:border-gray-400'
              : isDark
              ? 'bg-slate-800/30 text-slate-500 cursor-not-allowed border border-slate-800/30'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-100'
            }
          `}
        >
          <ArrowBigRightDash className={`${isDark ? 'fill-white text-white' : 'fill-gray-900 text-gray-900'} w-4 h-4 md:w-5 md:h-5`} />
        </button>
      </div>
    </div>

    {/* Bottom Menu */}
    <div className={`mt-2 my-1 md:my-0 pt-2 border-t md:mt-3 md:pt-3 ${
      isDark ? 'border-slate-800/50' : 'border-gray-300/50'
    }`}>
      <div className="space-y-1">
        {/* Settings Toggle */}
        <button
          onClick={() => setSettingsOpen(!settingsOpen)}
          className={`
            w-full flex items-center justify-between rounded-lg transition-colors duration-0 focus:outline-none p-3 md:text-sm
            ${isDark
              ? 'text-slate-300 hover:text-white'
              : 'text-gray-700 hover:text-gray-900'}
          `}
          aria-pressed={settingsOpen}
          aria-label="Toggle settings"
          type="button"
        >
          <div className="flex items-center gap-2 md:gap-3">
            <Settings className={`${isDark ? 'text-slate-300' : 'text-gray-700'} w-4 h-4 md:w-5 md:h-5`} />
            <span className="text-[11px] font-medium select-none md:text-sm">Settings</span>
          </div>

          {/* Toggle switch */}
          <div
            className={`relative w-11 h-6 rounded-full transition-colors duration-0 ${
              settingsOpen ? 'bg-purple-500' : (isDark ? 'bg-slate-600' : 'bg-gray-300')
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                settingsOpen ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </div>
        </button>

        {/* Manga Details */}
        <button className={`
          w-full flex items-center gap-2 p-2 rounded-lg transition-all duration-0 md:p-3 md:text-sm
          ${isDark
            ? 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200'}
        `}>
          <Info className={`${isDark ? 'text-slate-300' : 'text-gray-700'} w-4 h-4 md:w-5 md:h-5`} />
          <span className="text-[11px] font-medium select-none md:text-sm">Manga Details</span>
        </button>

        {/* Reading List */}
        <button
          onClick={toggleFavorite}
          className={`
            w-full flex items-center gap-2 p-2 rounded-lg transition-all duration-0 md:p-3 md:text-sm
            ${isDark
              ? 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200'}
          `}
        >
          <div className="flex items-center gap-2">
            {isFavorite ? (
              <Heart className="w-4 h-4 text-red-600 fill-current md:w-5 md:h-5" />
            ) : (
              <Heart className={`w-4 h-4 md:w-5 md:h-5 ${isDark ? '' : 'text-gray-700'}`} />
            )}
            <span className="text-[11px] font-medium select-none md:text-sm">
              Favorites {isFavorite ? 'Listed' : 'List'}
            </span>
          </div>
        </button>
      </div>
    </div>
  </div>
);
};

export default React.memo(SideBar);