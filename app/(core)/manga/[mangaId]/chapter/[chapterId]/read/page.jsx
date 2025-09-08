"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo, memo } from 'react';
import ReadChapterSkeleton from "../../../../../../Components/Skeletons/ReadChapter/ReadChapterSkeleton"
import { useParams, useRouter } from 'next/navigation';
// import Link from 'next/link';
import { ArrowUp } from 'lucide-react';
import { useManga } from '../../../../../../providers/MangaContext';
import _TopRightOptions from "../../../../../../Components/ReadChapterComponents/TopRightOptions"
import { useChapterPagesFetch } from "../../../../../../hooks/useChapterPagesFetch"
import _MiddleImageAndOptions from "../../../../../../Components/ReadChapterComponents/MiddleImageAndOptions";
import _BottomPagesNavigation from "../../../../../../Components/ReadChapterComponents/BottomPagesNavigation"
import _SideBar from "../../../../../../Components/ReadChapterComponents/SideBar"
import { useTheme } from '@/app/providers/ThemeContext';
import GOTONextChapterPopUpAtLastPage from '../../../../../../Components/ReadChapterComponents/GOTONextChapterPopUpAtLastPage';
const SideBar = memo(_SideBar);
const MiddleImageAndOptions = memo(_MiddleImageAndOptions);
const BottomPagesNavigation = memo(_BottomPagesNavigation);
const TopRightOptions = memo(_TopRightOptions);

export default function ReadChapter() {
  const { mangaId, chapterId } = useParams();
  const { theme } = useTheme();
  const isDark = theme == "dark";
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(true);
  const [layout, setLayout] = useState('horizontal');
  const [panels, setPanels] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMessage, setShowMessage] = useState(false);
  const [fullOCRResult, setFullOCRResult] = useState("");
  const [pageTranslations, setPageTranslations] = useState({});
  const [isItTextToSpeech, setIsItTextToSpeech] = useState(false);
  const [allAtOnce, setAllAtOnce] = useState(false);
  const [pageTTS, setPageTTS] = useState({});
  const [quality, setQuality] = useState("low");
  const [showTranslationAndSpeakingOptions, setShowTranslationAndSpeakingOptions] = useState(true);
  const [showTranslationTextOverlay, setShowTranslationTextOverlay] = useState(true);
  
  // Add state for selected language from sidebar
  const [selectedLanguage, setSelectedLanguage] = useState('');

  const scrollContainerRef = useRef(null);
  const { selectedManga, getChapterListForManga, addToReadHistory } = useManga();
  const selectedMemoManga = useMemo(() => selectedManga, [selectedManga])
  const chapters = useMemo(() => getChapterListForManga(mangaId), [getChapterListForManga, mangaId])
  const chapterInfo = useMemo(() => chapters.filter((x) => x.id == chapterId)[0], [chapterId, chapters]);

  const { data: pages, isLoading, isError } = useChapterPagesFetch(chapterId)

  // Initialize selectedLanguage when chapterInfo is available
  useEffect(() => {
    if (chapterInfo && !selectedLanguage) {
      setSelectedLanguage(chapterInfo.translatedLanguage);
    }
  }, [chapterInfo, selectedLanguage]);

  // console.log(selectedMemoManga);

  useEffect(() => {
    if (pages && pages?.chapter?.dataSaver?.length > 0 && pages?.chapter?.data?.length > 0) {
      const currentPage = quality === "low" ? pages?.chapter?.dataSaver[currentIndex] : pages?.chapter?.data[currentIndex];
      if (pageTranslations[currentPage]) {
        setFullOCRResult(pageTranslations[currentPage].ocrResult);
        setShowMessage(true);
      } else if (!pageTranslations[currentPage] && pageTTS[currentPage]) {
        setFullOCRResult(pageTTS[currentPage].ocrResult);
        setShowMessage(true);
      } else {
        setFullOCRResult("");
        setShowMessage(false);
      }
    }
  }, [currentIndex, pages, pageTranslations, pageTTS, quality]);

  useEffect(() => {
    if (selectedMemoManga && (selectedMemoManga.originalLanguage == "ko" || selectedMemoManga.originalLanguage == "zh" || selectedMemoManga.originalLanguage == "zh-hk" || selectedMemoManga.flatTags.includes("Long Strip") || selectedMemoManga.flatTags.includes("Web Comic"))) {
      setLayout("vertical")
    }
  }, [mangaId, chapterInfo, selectedMemoManga, pages, chapterId])

  // Get unique chapter numbers in selected language, sorted by chapter number
  const uniqueChapterNumbersInSelectedLanguage = useMemo(() => {
    if (!selectedLanguage || !chapters) return [];
    const chaptersInLang = chapters.filter(ch => ch.translatedLanguage === selectedLanguage);
    const uniqueNumbers = [...new Set(chaptersInLang.map(ch => ch.chapter))];
    return uniqueNumbers.sort((a, b) => parseFloat(a) - parseFloat(b));
  }, [chapters, selectedLanguage]);

  // Get all unique chapter numbers across all languages
  const allUniqueChapterNumbers = useMemo(() => {
    if (!chapters) return [];
    const uniqueNumbers = [...new Set(chapters.map(ch => ch.chapter))];
    return uniqueNumbers.sort((a, b) => parseFloat(a) - parseFloat(b));
  }, [chapters]);

  const currentChapterIndex = useMemo(() =>
    chapters && chapters.findIndex(ch => ch.id === chapterInfo?.id),
    [chapters, chapterInfo]
  );

  const currentChapterNumberIndexInSelectedLang = useMemo(() =>
    uniqueChapterNumbersInSelectedLanguage.findIndex(chNum => chNum === chapterInfo?.chapter),
    [uniqueChapterNumbersInSelectedLanguage, chapterInfo]
  );

  const currentChapterNumberIndexInAll = useMemo(() =>
    allUniqueChapterNumbers.findIndex(chNum => chNum === chapterInfo?.chapter),
    [allUniqueChapterNumbers, chapterInfo]
  );

  const hasPrevChapter = useMemo(() => {
    // Check if there's a previous chapter number in selected language
    if (currentChapterNumberIndexInSelectedLang > 0) return true;
    // If no prev chapter in selected language, check if there's any prev chapter number in other languages
    return currentChapterNumberIndexInAll > 0;
  }, [currentChapterNumberIndexInSelectedLang, currentChapterNumberIndexInAll]);

  const hasNextChapter = useMemo(() => {
    // Check if there's a next chapter number in selected language
    if (currentChapterNumberIndexInSelectedLang < uniqueChapterNumbersInSelectedLanguage.length - 1) return true;
    // If no next chapter in selected language, check if there's any next chapter number in other languages
    return currentChapterNumberIndexInAll < allUniqueChapterNumbers.length - 1;
  }, [currentChapterNumberIndexInSelectedLang, uniqueChapterNumbersInSelectedLanguage.length, currentChapterNumberIndexInAll, allUniqueChapterNumbers.length]);

  const handleChapterClick = useCallback((chapter) => {
    if (chapter) {
      addToReadHistory(selectedMemoManga, chapter)
      router.prefetch(`/manga/${mangaId}/chapter/${chapter.id}/read`)
      router.push(`/manga/${mangaId}/chapter/${chapter.id}/read`)
    }
  }, [addToReadHistory, mangaId, router, selectedMemoManga]);

  const goToPrevChapter = useCallback(() => {
    if (!hasPrevChapter || !chapterInfo) return;

    // First try to find previous chapter number in selected language
    if (currentChapterNumberIndexInSelectedLang > 0) {
      const prevChapterNumber = uniqueChapterNumbersInSelectedLanguage[currentChapterNumberIndexInSelectedLang - 1];
      
      // Find the first chapter with this chapter number in selected language
      const prevChapter = chapters.find(ch => 
        ch.translatedLanguage === selectedLanguage && 
        ch.chapter === prevChapterNumber
      );
      
      if (prevChapter) {
        handleChapterClick(prevChapter);
        return;
      }
    }

    // If no previous chapter number in selected language, fall back to any language
    if (currentChapterNumberIndexInAll > 0) {
      const prevChapterNumber = allUniqueChapterNumbers[currentChapterNumberIndexInAll - 1];
      
      // Find the first chapter with this chapter number in any language
      const prevChapter = chapters.find(ch => ch.chapter === prevChapterNumber);
      
      if (prevChapter) {
        handleChapterClick(prevChapter);
        // Update selected language to match the chapter we're navigating to
        setSelectedLanguage(prevChapter.translatedLanguage);
      }
    }
  }, [
    hasPrevChapter, 
    chapterInfo, 
    currentChapterNumberIndexInSelectedLang, 
    uniqueChapterNumbersInSelectedLanguage, 
    handleChapterClick, 
    chapters,
    selectedLanguage,
    setSelectedLanguage,
    currentChapterNumberIndexInAll,
    allUniqueChapterNumbers
  ]);

  const goToNextChapter = useCallback(() => {
    if (!hasNextChapter || !chapterInfo) return;

    // First try to find next chapter number in selected language
    if (currentChapterNumberIndexInSelectedLang < uniqueChapterNumbersInSelectedLanguage.length - 1) {
      const nextChapterNumber = uniqueChapterNumbersInSelectedLanguage[currentChapterNumberIndexInSelectedLang + 1];
      
      // Find the first chapter with this chapter number in selected language
      const nextChapter = chapters.find(ch => 
        ch.translatedLanguage === selectedLanguage && 
        ch.chapter === nextChapterNumber
      );
      
      if (nextChapter) {
        handleChapterClick(nextChapter);
        return;
      }
    }

    // If no next chapter number in selected language, fall back to any language
    if (currentChapterNumberIndexInAll < allUniqueChapterNumbers.length - 1) {
      const nextChapterNumber = allUniqueChapterNumbers[currentChapterNumberIndexInAll + 1];
      
      // Find the first chapter with this chapter number in any language
      const nextChapter = chapters.find(ch => ch.chapter === nextChapterNumber);
      
      if (nextChapter) {
        handleChapterClick(nextChapter);
        // Update selected language to match the chapter we're navigating to
        setSelectedLanguage(nextChapter.translatedLanguage);
      }
    }
  }, [
    hasNextChapter, 
    chapterInfo, 
    currentChapterNumberIndexInSelectedLang, 
    uniqueChapterNumbersInSelectedLanguage, 
    handleChapterClick, 
    chapters,
    selectedLanguage,
    setSelectedLanguage,
    currentChapterNumberIndexInAll,
    allUniqueChapterNumbers
  ]);

  return (
    chapterId && mangaId && pages && !isError && chapterInfo && !isLoading ? (
      <div
        className={`tracking-wider ${isDark ? "bg-black/20  text-white" : "bg-white text-black"} relative z-20 flex flex-row w-full h-[92vh] md:h-[91.3vh] justify-between items-start -mt-5   overflow-hidden`}
      >
        <SideBar
          panels={panels}
          isDark={isDark}
          pages={pages && (quality === "low" ? pages?.chapter?.dataSaver : pages?.chapter?.data)}
          setCurrentIndex={setCurrentIndex}
          currentIndex={currentIndex}
          allChapters={chapters}
          handleChapterClick={handleChapterClick}
          addToReadHistory={addToReadHistory}
          currentChapterIndex={currentChapterIndex}
          goToNextChapter={goToNextChapter}
          goToPrevChapter={goToPrevChapter}
          hasNextChapter={hasNextChapter}
          hasPrevChapter={hasPrevChapter}
          chapterInfo={chapterInfo}
          isCollapsed={isCollapsed}
          mangaInfo={selectedMemoManga}
          setIsCollapsed={setIsCollapsed}
          settingsOpen={settingsOpen}
          setSettingsOpen={setSettingsOpen}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
        />
        <div
          className="tracking-wider flex flex-col flex-grow min-w-0 h-full w-full max-w-full  scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-900"
        >
          {settingsOpen && <TopRightOptions
            isDark={isDark}
            allAtOnce={allAtOnce}
            quality={quality}
            isCollapsed={isCollapsed}
            setQuality={setQuality}
            allChapters={chapters}
            addToReadHistory={addToReadHistory}
            showTranslationTextOverlay={showTranslationTextOverlay}
            setShowTranslationTextOverlay={setShowTranslationTextOverlay}
            currentChapterIndex={currentChapterIndex}
            hasNextChapter={hasNextChapter}
            hasPrevChapter={hasPrevChapter}
            handleChapterClick={handleChapterClick}
            chapterInfo={chapterInfo}
            mangaInfo={selectedMemoManga}
            setAllAtOnce={setAllAtOnce}
            currentIndex={currentIndex}
            layout={layout}
            panels={panels}
            setCurrentIndex={setCurrentIndex}
            setLayout={setLayout}
            setPanels={setPanels}
            setShowTranslationAndSpeakingOptions={setShowTranslationAndSpeakingOptions}
            showTranslationAndSpeakingOptions={showTranslationAndSpeakingOptions}
          />}
          <div
            ref={scrollContainerRef}
            style={{
              scrollbarWidth: "none",
              scrollbarColor: "rgba(155, 89, 182, 0.6) rgba(0, 0, 0, 0.1)",
            }}
            className={`flex-grow mt-1 scroll overflow-y-auto min-w-0 max-w-full scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-900`}>
            {currentIndex == (quality === "low" ? pages?.chapter?.dataSaver?.length - 1 : pages?.chapter?.data?.length - 1) && <GOTONextChapterPopUpAtLastPage
              isDark={isDark}
              onNext={goToNextChapter}
              autoAdvanceTime={10}
            />
            }
            <MiddleImageAndOptions
              isDark={isDark}
              layout={layout}
              isLoading={isLoading}
              pages={pages}
              showTranslationTextOverlay={showTranslationTextOverlay}
              showTranslationAndSpeakingOptions={showTranslationAndSpeakingOptions}
              quality={quality}
              currentIndex={currentIndex}
              panels={panels}
              chapterInfo={chapterInfo}
              pageTranslations={pageTranslations}
              setPageTranslations={setPageTranslations}
              pageTTS={pageTTS}
              setPageTTS={setPageTTS}
              fullOCRResult={fullOCRResult}
              setFullOCRResult={setFullOCRResult}
              isItTextToSpeech={isItTextToSpeech}
              setIsItTextToSpeech={setIsItTextToSpeech}
              showMessage={showMessage}
              setShowMessage={setShowMessage}
              allAtOnce={allAtOnce}
              isCollapsed={isCollapsed}
              goToPrevChapter={goToPrevChapter}
              hasPrevChapter={hasPrevChapter}
              goToNextChapter={goToNextChapter}
              hasNextChapter={hasNextChapter}
              className="min-w-0 max-w-full"
            />
          </div>

          <div className="flex-shrink-0 relative z-50 w-full max-w-full">
            <BottomPagesNavigation
              isDark={isDark}
              setCurrentIndex={setCurrentIndex}
              currentIndex={currentIndex}
              layout={layout}
              panels={panels}
              pages={pages && (quality === "low" ? pages?.chapter?.dataSaver : pages?.chapter?.data)}
            />
            {layout === "vertical" && (
              <button
                className={`tracking-wider cursor-pointer fixed bottom-5 right-3 md:bottom-12 md:right-8 w-12 h-12 md:w-16 md:h-16 rounded-full border-4 flex items-center justify-center duration-300 hover:rounded-[50px] hover:w-24 group/button overflow-hidden active:scale-90 ${isDark
                  ? "border-violet-200 bg-black"
                  : "border-purple-600 bg-white"
                  }`}
                onClick={() => {
                  if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
              >
                <ArrowUp className={`tracking-wider w-3 h-4 fill-current delay-50 duration-200 group-hover/button:-translate-y-12 ${isDark ? "text-white" : "text-gray-800"
                  }`} />
                <span className={`tracking-wider font-semibold absolute text-xs opacity-0 group-hover/button:opacity-100 transition-opacity duration-200 ${isDark ? "text-white" : "text-gray-800"
                  }`}>
                  Top
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    ) : (
      <ReadChapterSkeleton isDark={isDark} />
    )
  );
}