// ChapterQuickSelect.jsx
import React, { memo, useMemo } from 'react'
import { X, ChevronDown, File } from 'lucide-react'
import { langFullNames } from '../../../constants/Flags';
import Link from 'next/link';

const ChapterQuickSelect = memo(({
    toggleChapters,
    chapterInfo,
    addToReadHistory,
    mangaInfo,
    sortOrder,
    searchQuery,
    goToFirstChapter,
    goToLastChapter,
    filteredChapters,
    setSearchQuery,
    setSortOrder,
    isDark = true
}) => {
    const mangaId = useMemo(() => mangaInfo.id, [mangaInfo.id])
    return (
        <div className={`absolute top-12 -left-12 border rounded-2xl backdrop-blur-xl ${isDark
            ? "bg-black/95 border-white/10"
            : "bg-white/95 border-gray-300"
            }`}>
            <div
                style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: isDark
                        ? 'rgba(155, 89, 182, 0.6) rgba(0, 0, 0, 0.1)'
                        : 'rgba(59, 130, 246, 0.6) rgba(0, 0, 0, 0.1)'
                }}
                className={`tracking-wider relative p-2 md:p-3 pt-0 w-48 md:w-64 max-h-64 md:max-h-80 overflow-y-auto backdrop-blur-lg rounded-2xl shadow-2xl z-50 ${isDark ? "bg-black/95" : "bg-white/95"
                    }`}
            >
                <div className="flex items-center justify-between">
                    <h3 className={`font-semibold ml-2 ${isDark ? "text-white" : "text-gray-800"
                        }`}>Chapters</h3>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            e.nativeEvent?.stopImmediatePropagation();
                            toggleChapters();
                        }}
                        className={`transition-colors ${isDark
                            ? "text-gray-400 hover:text-white"
                            : "text-gray-600 hover:text-gray-800"
                            }`}
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className={`tracking-wider sticky top-0 w-full md:-top-3 p-2 border-b ${isDark
                    ? "bg-black/95 border-purple-700/30"
                    : "bg-white/95 border-blue-300/30"
                    }`}>
                    <div className="tracking-wider w-full flex items-center gap-1.5 md:gap-2">
                        <input
                            type="text"
                            placeholder="Search chapters..."
                            value={searchQuery}
                            autoFocus
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`tracking-wider flex-1 border rounded-md px-1.5 md:px-2 py-0.5 md:py-1 text-[10px] md:text-sm focus:outline-none ${isDark
                                ? "bg-gray-800/50 border-purple-700/20 text-white focus:border-purple-500"
                                : "bg-gray-100/50 border-blue-300/20 text-gray-800 focus:border-blue-500"
                                }`}
                            aria-label="Search chapters"
                        />
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                e.nativeEvent?.stopImmediatePropagation();
                                setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
                            }}
                            className={`tracking-wider p-0.5 md:p-1 rounded-md transition-colors ${isDark
                                ? "bg-purple-700/50 hover:bg-purple-900/30 text-gray-200"
                                : "bg-purple-600/60 hover:bg-blue-600/30 text-white"
                                }`}
                            aria-label={`Sort chapters ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
                        >
                            <ChevronDown className={`w-3 md:w-4 h-3 md:h-4 ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
                        </button>
                    </div>
                    <div className="tracking-wider flex gap-0.5 md:gap-1 mt-0.5 md:mt-3">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                e.nativeEvent?.stopImmediatePropagation();
                                goToFirstChapter();
                            }}
                            className={`tracking-wider flex-1 py-0.5 md:py-1 text-[10px] md:text-xs rounded-md transition-colors ${isDark
                                ? "bg-purple-700/50 hover:bg-purple-800/40 text-white"
                                : "bg-purple-600/60 hover:bg-blue-600/40 text-white"
                                }`}
                            aria-label="Go to first chapter"
                        >
                            First
                        </button>
                        <button
                            onClick={goToLastChapter}
                            className={`tracking-wider flex-1 py-0.5 md:py-1 text-[10px] md:text-xs rounded-md transition-colors ${isDark
                                ? "bg-purple-700/50 hover:bg-purple-800/40 text-white"
                                : "bg-purple-600/60 hover:bg-blue-600/40 text-white"
                                }`}
                            aria-label="Go to last chapter"
                        >
                            Last
                        </button>
                    </div>
                </div>
                <div className="tracking-wider py-0.5 md:py-1">
                    {filteredChapters.map((chapter) => (
                        <Link
                            key={chapter.id}
                            href={`/manga/${mangaId}/chapter/${chapter.id}/read`}
                            prefetch={true}
                            onClick={(e) => {
                                e.nativeEvent?.stopImmediatePropagation();
                                addToReadHistory(mangaInfo, chapter);
                            }}
                            className={`w-full tracking-wider text-left px-2 md:px-3 py-1.5 md:py-2 text-[10px] md:text-sm transition-colors block ${chapter.id === chapterInfo.id
                                ? isDark
                                    ? 'bg-purple-900/50 text-white'
                                    : 'bg-purple-600/60 text-white'
                                : isDark
                                    ? 'text-gray-200 hover:bg-purple-900/30'
                                    : 'text-gray-700 hover:bg-blue-500/20'
                                }`}
                            aria-label={`Go to chapter ${chapter.title}`}
                        >
                            <div className="tracking-wider font-medium">
                                Chapter. {chapter.chapter} ({langFullNames[chapter.translatedLanguage]})
                            </div>
                            <div className={`tracking-wider text-[9px] md:text-xs flex items-center mt-0.5 ${isDark ? "text-gray-400" : "text-gray-500"
                                }`}>
                                <File className="w-3 md:w-4 h-3 md:h-4" />
                                <span className="tracking-wider ml-0.5 md:ml-1">{chapter.pageCount} pages</span>
                                <span className="tracking-wider mx-0.5 md:mx-1">•</span>
                                <span>{new Date(chapter.publishAt).toLocaleDateString()}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
});
ChapterQuickSelect.displayName = "ChapterQuickSelect"
export default ChapterQuickSelect;