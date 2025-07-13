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
  ArrowLeft,
  List,
  Info,
  ToggleRight,
  ToggleLeft,
  MessageSquare,
  Bookmark,
  Star,
  Calendar,
  Eye,
  Layers,
  Logs,
  ArrowBigLeft,
  ArrowBigRightDash,
  ArrowBigLeftDash,
  Languages,
} from 'lucide-react';
import StableFlag from '../../Components/StableFlag';

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
    <div className="relative  px-3 rounded-r-lg  left-0 -bottom-6 border-[1px] border-l-0 border-gray-800/90  h-[88vh] w-72 bg-gradient-to-b from-slate-950/70 via-slate-900/70 to-slate-950/70 flex flex-col z-40 shadow-[0_0_10px_rgba(0,0,0,1)] shadow-black/80">
      {/* Header */}
      <div className="py-2 border-b border-slate-800/50">
        <button
          onClick={() => setIsCollapsed(true)}
          className="group absolute top-3 left-3 w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center text-slate-300 hover:text-white transition-all duration-300 hover:bg-slate-700/80 hover:border-slate-600/50"
          aria-label="Collapse sidebar"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>


        {/* Manga Info */}
        <div className="flex flex-col mt-7 justify-center items-center gap-4">
          <div className="w-20 h-20 rounded-full overflow-hidden shadow-[0_0_5px_rgba(0,0,0,1)] shadow-purple-400   flex-shrink-0">
            <CoverImage {...coverImageProps} />
          </div>

          <h2 className="text-sm font-semibold text-center capitalize text-white line-clamp-2  leading-tight">
            {mangaInfo.title}
          </h2>
        </div>
      </div>
      {/* <div className="flex flex-wrap items-center justify-between gap-1  w-full max-w-full px-3">
  <span
    className={` py-1 text-xs rounded-md font-semibold whitespace-nowrap ${
      mangaInfo.status === 'ongoing'
        ? ' text-green-400 '
        : mangaInfo.status === 'completed'
        ? ' text-blue-400 '
        : mangaInfo.status === 'hiatus'
        ? ' text-orange-400 '
        : mangaInfo.status === 'cancelled'
        ? ' text-red-400 '
        : ' text-gray-400 '
    }`}
  >
    {mangaInfo.status.toUpperCase()}
  </span>

  <span className=" py-1 text-xs  text-purple-400 rounded-md font-semibold  whitespace-nowrap">
    {mangaInfo.year}
  </span>

  <span className=" py-1 text-xs  text-green-500 rounded-md font-semibold capitalize whitespace-nowrap">
    {mangaInfo.contentRating}
  </span>
  </div> */}
      <div className='pl-4 flex flex-row w-full border-l-4 border-l-yellow-500 ml-2 mt-6 mb-3 items-start justify-start gap-2'>
        <p className="text-gray-400 text-sm">Reading</p>
        <div className="flex items-center gap-2 ">
          <span className="text-yellow-500 text-sm ">By Chapter</span>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </div>
      <div className='flex justify-start text-sm px-2 items-center gap-4 mt-4 mb-2'><Logs className='w-5 h-5' /> Chapter Navigation</div>
      {/* Language Selector */}
      <div className="p-2 py-1 ">
        <div className="relative" ref={languageDropdownRef}>
          <button
            onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
            className="w-full flex items-center justify-between p-3 bg-slate-800/60 hover:bg-slate-700/60 rounded-md transition-all duration-200 text-white border border-slate-700/50 hover:border-slate-600/50"
            aria-label="Select language"
          >
            <div className="flex items-center gap-3">
              <Languages className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-medium">
                Language: {selectedLanguage.toUpperCase() || langFullNames[selectedLanguage]}
              </span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${languageDropdownOpen ? 'rotate-180' : ''
                }`}
            />
          </button>

          {languageDropdownOpen && (
            <div
              style={{
                scrollbarWidth: "none",
                scrollbarColor: "rgba(155, 89, 182, 0.6) rgba(0, 0, 0, 0.1)",
              }}
              className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-sm border border-slate-700/50 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto">
              {availableLanguages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800/60 transition-colors text-sm ${selectedLanguage === lang
                    ? 'bg-purple-500/20 text-white border-l-2 border-purple-500'
                    : 'text-slate-300'
                    }`}
                >
                  <StableFlag
                    code={lang || "en"}
                    className="w-5 h-5 rounded shadow-sm"
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
            className="w-full flex items-center justify-between p-3 bg-slate-800/60 hover:bg-slate-700/60 rounded-md transition-all duration-200 text-white border border-slate-700/50 hover:border-slate-600/50"
            aria-label="Select chapter"
          >
            <div className="flex items-center gap-0.5 ">
              <BookOpen className="w-4 h-4 min-w-fit text-slate-400 " />
              <span className="text-sm font-medium line-clamp-1">Chapter {chapterInfo.chapter} : {chapterInfo.title}</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 ml-4 min-w-fit text-slate-400 transition-transform duration-200 ${chapterDropdownOpen ? 'rotate-180' : ''
                }`}
            />
          </button>

          {/* Chapter Dropdown List - Keep as is, it's perfect */}
          {chapterDropdownOpen && (
            <div className="absolute -bottom-[250%] left-52 ml-2 p-2 w-64 bg-gray-900/40  backdrop-blur-lg border border-purple-700/30 rounded-lg shadow-xl z-50">
              <div className="p-2 border-b border-purple-700/30 flex flex-col gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search chapters..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-gray-800/60 border border-purple-700/30 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 text-sm "
                  />
                </div>

                <div className="flex gap-1.5">
                  <button
                    onClick={() =>
                      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
                    }
                    className="flex items-center gap-1.5 px-2 py-1.5 bg-gray-800/60 hover:bg-purple-900/40 rounded-md text-gray-300 hover:text-white transition-colors  text-xs"
                    aria-label={`Sort chapters ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
                  >
                    <ArrowUpDown className="w-3.5 h-3.5" />
                    <span>{sortOrder === 'asc' ? 'Oldest' : 'Newest'}</span>
                  </button>

                  <button
                    onClick={goToFirstChapter}
                    className="flex-1 px-2 py-1.5 bg-purple-900/60 hover:bg-purple-800/70 text-white rounded-md text-xs   transition-colors"
                  >
                    First
                  </button>

                  <button
                    onClick={goToLastChapter}
                    className="flex-1 px-2 py-1.5 bg-purple-900/60 hover:bg-purple-800/70 text-white rounded-md text-xs   transition-colors"
                  >
                    Last
                  </button>
                </div>
              </div>

              <div
                className="p-1.5 overflow-y-auto max-h-[28vh] h-auto"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgba(155, 89, 182, 0.6) rgba(0, 0, 0, 0.1)',
                }}
              >
                {filteredChapters.length === 0 ? (
                  <div className="text-center py-6 text-gray-400 font-medium  text-sm">
                    <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-50" />
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
                      className={`w-full text-left p-2 rounded-md mb-1.5 transition-colors font-medium  text-sm ${chapter.id === chapterInfo.id
                          ? 'bg-purple-900/40 text-white border border-purple-700/30 shadow-md'
                          : 'text-gray-300 hover:bg-purple-900/40 hover:text-white'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="mb-0.5 text-base leading-tight truncate">
                            Chapter {chapter.chapter} : {chapter.title}
                          </div>
                          <div className="text-xs text-gray-400 flex items-center gap-3 flex-wrap">
                            <div className="flex items-center gap-1">
                              <File className="w-3 h-3" />
                              <span>{chapter.pageCount} pages</span>
                            </div>
                            <span>{new Date(chapter.publishAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="py-1 px-2 mt-4">
        <div className="flex gap-2">
          <button
            onClick={goToPrevChapter}
            disabled={!hasPrevChapter}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all duration-200 font-medium ${hasPrevChapter
              ? 'bg-slate-800/60 hover:bg-slate-700/60 text-white border border-slate-700/50 hover:border-slate-600/50'
              : 'bg-slate-800/30 text-slate-500 cursor-not-allowed border border-slate-800/30'
              }`}
          >
            <ArrowBigLeftDash className="w-5 h-5 fill-white" />
          </button>

          <button
            onClick={goToNextChapter}
            disabled={!hasNextChapter}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all duration-200 font-medium ${hasNextChapter
              ? 'bg-slate-800/60 hover:bg-slate-700/60 text-white border border-slate-700/50 hover:border-slate-600/50'
              : 'bg-slate-800/30 text-slate-500 cursor-not-allowed border border-slate-800/30'
              }`}
          >
            <ArrowBigRightDash className="w-5 h-5 fill-white" />
          </button>
        </div>
      </div>

      {/* Bottom Menu */}
      <div className="mt-3 pt-3 border-t border-slate-800/50">
        <div className=" space-y-1">
          {/* Settings Toggle */}
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className="w-full flex items-center justify-between p-3 rounded-lg
        transition-colors duration-200
        text-slate-300 hover:text-white focus:outline-none "
            aria-pressed={settingsOpen}
            aria-label="Toggle settings"
            type="button"
          >
            <div className="flex items-center gap-3">
              {/* You can replace this with your Settings icon or SVG */}
              <Settings className="w-5 h-5 text-slate-300"
              />
              <span className="text-sm font-medium select-none">Settings</span>
            </div>

            {/* Toggle switch */}
            <div
              className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${settingsOpen ? 'bg-purple-500' : 'bg-slate-600'
                }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${settingsOpen ? 'translate-x-5' : 'translate-x-0'
                  }`}
              />
            </div>
          </button>

          {/* Manga Details */}
          <button className="w-full flex items-center gap-3 p-3 hover:bg-slate-800/60 rounded-lg transition-all duration-200 text-slate-300 hover:text-white">
            <Info className="w-5 h-5" />
            <span className="text-sm font-medium">Manga Details</span>
          </button>

          {/* Reading List */}
          <button
            onClick={toggleFavorite}
            className="w-full flex items-center gap-3 p-3 hover:bg-slate-800/60 rounded-lg transition-all duration-200 text-slate-300 hover:text-white"
          >
            <div className="flex items-center gap-3">
              {isFavorite ? (
                <Heart className="w-5 h-5 text-red-600 fill-current" />
              ) : (
                <Heart className="w-5 h-5" />
              )}
              <span className="text-sm font-medium">
                Favorites {isFavorite ? "Listed" : "List"}
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SideBar;