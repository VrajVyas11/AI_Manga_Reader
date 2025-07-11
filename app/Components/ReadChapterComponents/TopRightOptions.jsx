import React, { useState, useCallback, useMemo, memo } from 'react'
import { Settings, BookOpen, Maximize2, Heart, X, ChevronDown, File, Languages, GalleryHorizontalEnd, Layers2, RectangleGoggles, Sparkles, LayoutDashboard } from 'lucide-react'
import { useManga } from '../../providers/MangaContext'
// import PageAndChapterNavigation from './InfoSideBarModules/PageAndChaptersNavigation'
import ShowSettingsPopUP from "./TopRightOptionsModules/ShowSettingsPopUp"
import ChapterQuickSelect from "./TopRightOptionsModules/ChapterQuickSelect"
function TopRightOptions({
    setLayout,
    setCurrentIndex,
    layout,
    isCollapsed,
    currentIndex,
    panels,
    pages,
    setPanels,
    allAtOnce,
    setAllAtOnce,
    setQuality,
    quality,
    mangaInfo,
    chapterInfo,
    allChapters = [],
    goToChapter,
    currentChapterIndex,
    goToNextChapter,
    goToPrevChapter,
    onChapterChange,
    hasNextChapter,
    hasPrevChapter,
    showTranslationAndSpeakingOptions,
    setShowTranslationAndSpeakingOptions
}) {
    const [showSettings, setShowSettings] = useState(false)
    const [showChapters, setShowChapters] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [sortOrder, setSortOrder] = useState('desc')
    const { addToFavorite, getAllFavorites } = useManga()
    const isFavorite = useMemo(() => getAllFavorites()[mangaInfo?.id], [getAllFavorites, mangaInfo?.id])

    const goToFirstChapter = useCallback(() =>
        goToChapter(allChapters[allChapters.length - 1]),
        [allChapters, goToChapter]
    );
    const goToLastChapter = useCallback(() =>
        goToChapter(allChapters[0]),
        [allChapters, goToChapter]
    );

    const toggleSettings = () => {
        setShowSettings(!showSettings)
        setShowChapters(false) // Close other panels
    }

    const toggleChapters = () => {
        setShowChapters(!showChapters)
        setShowSettings(false) // Close other panels
    }

    const toggleFavorite = useCallback(() => {
        if (mangaInfo && chapterInfo) {
            addToFavorite(mangaInfo, chapterInfo)
        }
    }, [addToFavorite, mangaInfo, chapterInfo])

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen()
        } else {
            document.exitFullscreen()
        }
    }

    const sortedChapters = useMemo(() =>
        [...allChapters].sort((a, b) => {
            const aNum = parseFloat(a.chapter);
            const bNum = parseFloat(b.chapter);
            return sortOrder === 'asc' ? aNum - bNum : bNum - aNum;
        }), [allChapters, sortOrder]
    )

    const filteredChapters = useMemo(() =>
        searchQuery.trim()
            ? sortedChapters.filter(ch => ch.chapter.toLowerCase().includes(searchQuery.toLowerCase()))
            : sortedChapters,
        [sortedChapters, searchQuery]
    )

    return (
        <div className="fixed top-24 right-5 z-50">
            {/* Floating Controls */}
            <div className="flex gap-3 mb-4">
                <button
                    onClick={toggleSettings}
                    className="bg-purple-950/40 border border-white/10 text-white rounded-xl p-3 hover:bg-black/70 transition-all duration-200 hover:-translate-y-0.5 backdrop-blur-md"
                    title="Settings"
                >
                    <Settings size={16} />
                </button>

                <button
                    onClick={toggleChapters}
                    className="bg-purple-950/40 border border-white/10 text-white rounded-xl p-3 hover:bg-black/70 transition-all duration-200 hover:-translate-y-0.5 backdrop-blur-md"
                    title="Chapters"
                >
                    <BookOpen size={16} />
                </button>

                <button
                    onClick={toggleFullscreen}
                    className="bg-purple-950/40 border border-white/10 text-white rounded-xl p-3 hover:bg-black/70 transition-all duration-200 hover:-translate-y-0.5 backdrop-blur-md"
                    title="Fullscreen"
                >
                    <Maximize2 size={16} />
                </button>

                <button
                    onClick={toggleFavorite}
                    className={`border border-white/10 rounded-xl p-3 transition-all duration-200 hover:-translate-y-0.5 backdrop-blur-md ${isFavorite
                        ? 'bg-red-500/80 text-white hover:bg-red-500/60'
                        : 'bg-purple-950/40 text-white hover:bg-black/70'
                        }`}
                    title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                    <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
            </div>

            {/* Settings Panel */}
            {showSettings && (
                <ShowSettingsPopUP
                    toggleSettings={toggleSettings}
                    setLayout={setLayout}
                    layout={layout}
                    panels={panels}
                    setPanels={setPanels}
                    allAtOnce={allAtOnce}
                    setAllAtOnce={setAllAtOnce}
                    setQuality={setQuality}
                    quality={quality}
                    showTranslationAndSpeakingOptions={showTranslationAndSpeakingOptions}
                    setShowTranslationAndSpeakingOptions={setShowTranslationAndSpeakingOptions}
                />
            )}

            {/* Chapter Selector */}
            {showChapters && (
                <ChapterQuickSelect chapterInfo={chapterInfo} toggleChapters={toggleChapters} goToChapter={goToChapter} sortOrder={sortOrder} searchQuery={searchQuery} goToFirstChapter={goToFirstChapter} goToLastChapter={goToLastChapter} filteredChapters={filteredChapters} setSearchQuery={setSearchQuery} setSortOrder={setSortOrder} />
            )}
        </div>
    )
}

export default TopRightOptions