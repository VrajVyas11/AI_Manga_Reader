"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo, memo } from 'react';
import ReadChapterSkeleton from "../../../../../../Components/Skeletons/ReadChapter/ReadChapterSkeleton"
import { useParams, useRouter } from 'next/navigation';
import { ArrowUp } from 'lucide-react';
import { useManga } from '../../../../../../providers/MangaContext';
import _TopRightOptions from "../../../../../../Components/ReadChapterComponents/TopRightOptions"
import { useChapterPagesFetch } from "../../../../../../hooks/useChapterPagesFetch"
import _MiddleImageAndOptions from "../../../../../../Components/ReadChapterComponents/MiddleImageAndOptions";
import _BottomPagesNavigation from "../../../../../../Components/ReadChapterComponents/BottomPagesNavigation"
import _SideBar from "../../../../../../Components/ReadChapterComponents/SideBar"
import { useTheme } from '@/app/providers/ThemeContext';
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

  const scrollContainerRef = useRef(null);
  const { selectedManga, getChapterListForManga, addToReadHistory } = useManga();
  const selectedMemoManga = useMemo(() => selectedManga, [selectedManga, mangaId])
  const chapters = useMemo(() => getChapterListForManga(mangaId))
  const chapterInfo = useMemo(() => chapters.filter((x) => x.id == chapterId)[0]);
  // console.log(chapters)
  // console.log(chapterId);
  const { data: pages, isLoading, isError } = useChapterPagesFetch(chapterId)

  const handleChapterClick = useCallback(
    (id) => {
      // console.log("adding to the history",selectedMemoManga,id)
      addToReadHistory(selectedMemoManga, id)
      router.push(`/manga/${mangaId}/chapter/${id.id}/read`);
    },
    [router, selectedMemoManga, mangaId, pages]
  );
  console.log(selectedMemoManga);

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
  }, [currentIndex, pages, pageTranslations, pageTTS]);

  useEffect(() => {
    if (selectedMemoManga && (selectedMemoManga.originalLanguage == "ko" || selectedMemoManga.originalLanguage == "zh" || selectedMemoManga.originalLanguage == "zh-hk" || selectedMemoManga.flatTags.includes("Long Strip") || selectedMemoManga.flatTags.includes("Web Comic"))) {
      setLayout("vertical")
    }
  }, [mangaId, chapterInfo, selectedMemoManga, pages, chapterId])

  // console.log(selectedManga);
  // console.log(chapterInfo)
  const currentChapterIndex = useMemo(() =>
    chapters && chapters.findIndex(ch => ch.id === chapterInfo.id),
    [chapters, chapterInfo]
  );
  const hasPrevChapter = useMemo(() => currentChapterIndex > 0);
  const hasNextChapter = useMemo(() => currentChapterIndex < chapters.length - 1);
  const goToChapter = useCallback((chapter) => {
    if (chapter) {
      handleChapterClick(chapter);
    }
  }, [handleChapterClick]);

  const goToPrevChapter = useCallback(() =>
    hasPrevChapter && goToChapter(chapters[currentChapterIndex - 1]),
    [hasPrevChapter, currentChapterIndex, chapters, goToChapter]
  );
  const goToNextChapter = useCallback(() =>
    hasNextChapter && goToChapter(chapters[currentChapterIndex + 1]),
    [hasNextChapter, currentChapterIndex, chapters, goToChapter]
  );

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
          currentChapterIndex={currentChapterIndex}
          goToNextChapter={goToNextChapter}
          goToPrevChapter={goToPrevChapter}
          onChapterChange={handleChapterClick}
          hasNextChapter={hasNextChapter}
          hasPrevChapter={hasPrevChapter}
          goToChapter={goToChapter}
          chapterInfo={chapterInfo}
          isCollapsed={isCollapsed}
          mangaInfo={selectedMemoManga}
          setIsCollapsed={setIsCollapsed}
          settingsOpen={settingsOpen}
          setSettingsOpen={setSettingsOpen}
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
            showTranslationTextOverlay={showTranslationTextOverlay}
            setShowTranslationTextOverlay={setShowTranslationTextOverlay}
            currentChapterIndex={currentChapterIndex}
            goToNextChapter={goToNextChapter}
            goToPrevChapter={goToPrevChapter}
            onChapterChange={handleChapterClick}
            hasNextChapter={hasNextChapter}
            hasPrevChapter={hasPrevChapter}
            goToChapter={goToChapter}
            chapterInfo={chapterInfo}
            mangaInfo={selectedMemoManga}
            setAllAtOnce={setAllAtOnce}
            currentIndex={currentIndex}
            layout={layout}
            pages={pages && (quality === "low" ? pages?.chapter?.dataSaver : pages?.chapter?.data)}
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
            className={`flex-grow scroll overflow-y-auto min-w-0 max-w-full scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-900`}>
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
 className={`tracking-wider cursor-pointer fixed bottom-5 right-3 md:bottom-12 md:right-8 w-12 h-12 md:w-16 md:h-16 rounded-full border-4 flex items-center justify-center duration-300 hover:rounded-[50px] hover:w-24 group/button overflow-hidden active:scale-90 ${
   isDark
     ? "border-violet-200 bg-black"
     : "border-purple-600 bg-white"
 }`}
 onClick={() => {
   if (scrollContainerRef.current) {
     scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
   }
 }}
>
 <ArrowUp className={`tracking-wider w-3 h-4 fill-current delay-50 duration-200 group-hover/button:-translate-y-12 ${
   isDark ? "text-white" : "text-gray-800"
 }`} />
 <span className={`tracking-wider font-semibold absolute text-xs opacity-0 group-hover/button:opacity-100 transition-opacity duration-200 ${
   isDark ? "text-white" : "text-gray-800"
 }`}>
   Top
 </span>
</button>
            )}
          </div>
        </div>
      </div>
    ) : (
      <ReadChapterSkeleton />
    )
  );
}