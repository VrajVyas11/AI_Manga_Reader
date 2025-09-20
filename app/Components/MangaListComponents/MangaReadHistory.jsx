"use client"
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useManga } from '../../providers/MangaContext';
import { BookOpen, ChevronDown, ChevronUp, TrendingUp, Eye, BookOpenCheck, ArrowBigRightDash, Activity } from 'lucide-react';
import Image from 'next/image';
import MangaReadHistorySkeleton from '../Skeletons/MangaList/MangaReadHistorySkeleton';
import { useTheme } from '../../providers/ThemeContext';

function MangaReadHistory() {
    const { getAllFromReadHistory, addToReadHistory, setChapterListForManga, setSelectedManga } = useManga();
    const { theme, mounted } = useTheme();
    const isDark = theme === "dark";
    const [readHistory, setReadHistory] = useState([]);
    const [shownMangasInHistory, setShownMangasInHistory] = useState(2);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        const history = getAllFromReadHistory();
        setReadHistory(history ?? []);
    }, [getAllFromReadHistory]);
    console.log(readHistory);

    const handleMangaCoverImageClicked = useCallback(
        (manga) => {
            setSelectedManga(manga);
        },
        [setSelectedManga]
    );

    const handleChapterClicked = useCallback(
        (manga, chapter, allChaptersList) => {
            setSelectedManga(manga);
            setChapterListForManga(manga.id, allChaptersList);
            addToReadHistory(manga, chapter, allChaptersList);
            // Navigation will be handled by Link component
        },
        [setSelectedManga, setChapterListForManga, addToReadHistory]
    );

    const handleToggleExpand = useCallback(() => {
        const newExpanded = !isExpanded;
        setIsExpanded(newExpanded);
        setShownMangasInHistory(newExpanded ? readHistory.length : 2);
    }, [isExpanded, readHistory.length]);

    const calculateProgress = useCallback((item) => {
        if (!item.allChaptersList || !item.chapters || item.allChaptersList.length === 0) {
            return { percentage: 0, current: 0, total: 0 };
        }

        const totalChapters = item.allChaptersList.length;
        // const currentChapter = item.allChaptersList.findIndex(i => i.id === item.chapters[0].id) ?? 0;
        const percentage = Math.min((item.chapters.length / totalChapters) * 100, 100);

        return {
            percentage: Math.round(percentage),
            current: item?.chapters?.length,
            total: totalChapters,
        };
    }, []);

    const formatTimeAgo = useCallback((lastReadAT) => {
        const readableAt = new Date(lastReadAT);
        const now = new Date();
        const diffInMs = now - readableAt;
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
        const diffInMonths = Math.floor(diffInDays / 30);
        const diffInYears = Math.floor(diffInDays / 365);
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        const diffInSeconds = Math.floor(diffInMs / 1000);

        if (diffInYears >= 1) {
            return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
        } else if (diffInMonths >= 1) {
            return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
        } else if (diffInDays >= 1) {
            return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
        } else if (diffInHours >= 1) {
            return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
        } else if (diffInMinutes >= 1) {
            return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
        } else {
            return `${diffInSeconds} second${diffInSeconds !== 1 ? 's' : ''} ago`;
        }
    }, []);

    const sortedReadHistory = useMemo(() =>
        readHistory.sort((item1, item2) => new Date(item2.lastReadAT) - new Date(item1.lastReadAT)),
        [readHistory]
    );

    if (!mounted) return <MangaReadHistorySkeleton isDark={isDark} />;
    if (readHistory.length == 0) return null
    return (
        <div className="w-[100% -12px] mx-2 md:ml-2 md:px-6 mb-6">
            <div className="flex mb-7 items-center px-1.5 justify-between">
                <div className="flex items-center gap-3">
                    <div className={`${isDark ? "bg-white/10" : "bg-gray-200/50"} p-3 rounded-lg`}>
                        <BookOpenCheck className={`w-6 h-6 ${isDark ? "text-cyan-300" : "text-cyan-600"} drop-shadow-md`} />
                    </div>
                    <div className='leading-5 sm:leading-normal mt-1 sm:mt-0'>
                        <h2 className={`text-[18px] md:text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>READ HISTORY</h2>
                        {readHistory.length > 0 && (
                            <p className={`text-[11px] md:text-xs ${isDark ? "text-gray-400" : "text-gray-600"} uppercase tracking-wide`}>
                                {readHistory.length} Mangas in your history
                            </p>
                        )}
                    </div>
                </div>
                <Link href={"/library"} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className={`flex items-center gap-1.5 px-4 py-4 rounded-2xl text-sm ${isDark ? "text-gray-300 hover:text-white hover:bg-gray-800/50 border-gray-700/0  shadow-[inset_0_0_7px_rgba(200,200,200,0.16)]" : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/50 border-gray-300/50"} transition-all duration-200 border`}>
                      View All
                    <ArrowBigRightDash className="w-5 h-5" />
                  
                </Link>
            </div>

            <div className="space-y-4">
                {readHistory.length === 0 ? (
                    <div className={`rounded-xl p-6 text-center ${isDark ? "bg-gradient-to-br from-gray-900/60 to-purple-900/40" : "bg-gradient-to-br from-gray-100/60 to-purple-100/40"} shadow-lg`}>
                        <BookOpen className={`mx-auto w-12 h-12 ${isDark ? "text-purple-400" : "text-purple-600"} mb-3`} />
                        <h3 className={`text-lg font-semibold ${isDark ? "text-gray-200" : "text-gray-800"}`}>No Reading History</h3>
                        <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"} mt-1`}>Start reading to build your manga history!</p>
                        <div className={`mt-3 flex items-center justify-center gap-2 text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                            <TrendingUp className="w-4 h-4" />
                            <span>Track your progress automatically</span>
                        </div>
                    </div>
                ) : (
                    <>
                        <div
                            style={{
                                scrollbarWidth: "thin",
                                scrollbarColor: `${isDark ? "rgba(147, 51, 234, 0.6) rgba(0, 0, 0, 0.1)" : "rgba(147, 51, 234, 0.6) rgba(0, 0, 0, 0.1)"}`,
                            }}
                            className="space-y-3 overflow-y-auto px-0.5 max-h-[350px]">
                            {sortedReadHistory.slice(0, shownMangasInHistory).map((item, index) => {
                                const progress = calculateProgress(item);
                                return (
                                    <div
                                        key={`${item.manga.id}-${index}`}
                                        className={`relative hidden sm:block rounded-[30px] pl-2 pr-4 ${isDark ? "bg-gray-900/10 border-gray-700/30 hover:border hover:border-gray-400/20 !shadow-[inset_0_0_10px_rgba(200,200,200,0.1)]" : "bg-white border-gray-200/10 hover:border hover:border-gray-400/20 shadow-black/20 hover:shadow-md"} border shadow-sm   transform -translate-y-0.5 hover:-translate-y-1 transition-all duration-0 overflow-hidden`}
                                        style={{ animation: `slideIn ${0.2 + index * 0.1}s ease-out` }}
                                    >
                                        <div className={`absolute inset-0 ${isDark ? "bg-gradient-to-r from-purple-500/10 to-cyan-500/10" : "bg-gradient-to-r from-purple-300/10 to-cyan-300/10"} opacity-0 hover:opacity-100 transition-opacity duration-300`} />
                                        <div className="relative flex items-center p-3 gap-3">
                                            <Link
                                                href={`/manga/${item.manga.id}/chapters`}
                                                prefetch={true}
                                                onClick={() => handleMangaCoverImageClicked(item.manga)}
                                                className="flex-shrink-0"
                                            >
                                                <div className={`relative w-16 h-16 rounded-full overflow-hidden shadow-sm group`}>
                                                    <Image
                                                        width={64}
                                                        height={96}
                                                        src={item.manga.coverImageUrl}
                                                        alt={item.manga.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                        onError={(e) => {
                                                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA2NCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjgwIiBmaWxsPSIjMzc0MTUxIi8+CjxwYXRoIGQ9Ik0zMiA0MEwyOCAzNkwyOCA0NEwzMiA0MFoiIGZpbGw9IiM2QjczODAiLz4KPC9zdmc+';
                                                        }}
                                                    />
                                                    <div className={`absolute inset-0 ${isDark ? "bg-black/20" : "bg-gray-900/20"} opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center`}>
                                                        <Eye className={`w-5 h-5 ${isDark ? "text-white" : "text-gray-200"}`} />
                                                    </div>
                                                </div>
                                            </Link>
                                            <div className="flex-1 min-w-0 space-y-2">
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                                    <div className="space-y-1">
                                                        <Link
                                                            href={`/manga/${item.manga.id}/chapters`}
                                                            prefetch={true}
                                                            onClick={() => handleMangaCoverImageClicked(item.manga)}
                                                            className={`text-base font-semibold line-clamp-1 ${isDark ? "text-white hover:text-purple-300" : "text-gray-900 hover:text-purple-600"} transition-colors duration-200`}
                                                        >
                                                            {item.manga.title}
                                                        </Link>
                                                        {item.chapters?.slice(0, 1).map((chapter, chapterIndex) => (
                                                            <Link
                                                                key={chapterIndex}
                                                                href={`/manga/${item.manga.id}/chapter/${chapter.id}/read`}
                                                                prefetch={true}
                                                                onClick={() => handleChapterClicked(item.manga, chapter, item.allChaptersList)}
                                                                className={`flex items-center ml-2 gap-1.5 text-xs ${isDark ? "text-gray-400 " : "text-gray-600"} transition-colors duration-200`}
                                                            >
                                                                <Activity strokeWidth={4} className="w-5 h-3.5" />
                                                                <span className='font-semibold'>Chapter {chapter.chapter}</span>
                                                                <span className="mx-1 text-[15px]">•</span>
                                                                <span className='opacity-60'>{formatTimeAgo(item.lastReadAT)}</span>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                    <Link
                                                        href={`/manga/${item.manga.id}/chapter/${item.chapters?.[0]?.id}/read`}
                                                        prefetch={true}
                                                        onClick={() => handleChapterClicked(item.manga, item.chapters?.[0], item.allChaptersList)}
                                                        className={`flex items-center ml-2 justify-center gap-1.5 px-2.5 py-2.5 rounded-2xl text-xs font-medium ${isDark ? "border border-white/20 text-white bg-gray-500/10" : "bg-black/5 border border-black/10 text-gray-900 hover:bg-purple-100/70"} transition-all duration-200 shadow-sm hover:shadow-md`}
                                                    >
                                                        <ArrowBigRightDash strokeWidth={1.5} className="w-5 h-5" />
                                                        {/* Continue */}
                                                    </Link>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center justify-between text-xs">
                                                        <span className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>Progress: {progress.current}/{progress.total}</span>
                                                        <span className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>{progress.percentage}%</span>
                                                    </div>
                                                    <div className={`w-full ${isDark ? "bg-gray-700/30" : "bg-gray-200/30"} rounded-full h-1.5 overflow-hidden`}>
                                                        <div
                                                            className={`h-full ${isDark ? "bg-white" : "bg-black"} rounded-full transition-all duration-500 ease-out`}
                                                            style={{ width: `${progress.percentage}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div
                            style={{
                                scrollbarWidth: "thin",
                                scrollbarColor: `${isDark ? "rgba(147, 51, 234, 0.6) rgba(0, 0, 0, 0.1)" : "rgba(147, 51, 234, 0.6) rgba(0, 0, 0, 0.1)"}`,
                            }}
                            className="flex sm:hidden gap-2 overflow-x-auto py-3 -mx-4 px-4"
                        >
                            {sortedReadHistory.map((item, index) => (
                                <Link
                                    key={`mobile-${item.manga.id}-${index}`}
                                    href={`/manga/${item.manga.id}/chapters`}
                                    prefetch={true}
                                    onClick={() => handleMangaCoverImageClicked(item.manga)}
                                    className="flex-shrink-0 w-24"
                                >
                                    <div className={`relative w-24 h-32 rounded-md overflow-hidden border ${isDark ? "border-gray-700/50 shadow-purple-400/20" : "border-gray-200/50 shadow-purple-600/20"} shadow-sm hover:shadow-md transition-all duration-300`}>
                                        <Image
                                            src={item.manga.coverImageUrl}
                                            alt={item.manga.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            onError={(e) => {
                                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA2NCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjgwIiBmaWxsPSIjMzc0MTUxIi8+CjxwYXRoIGQ9Ik0zMiA0MEwyOCAzNkwyOCA0NEwzMiA0MFoiIGZpbGw9IiM2QjczODAiLz4KPC9zdmc+';
                                            }}
                                        />
                                        <div className={`absolute inset-0 ${isDark ? "bg-black/20" : "bg-gray-900/20"} opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center`}>
                                            <Eye className={`w-5 h-5 ${isDark ? "text-white" : "text-gray-200"}`} />
                                        </div>
                                    </div>
                                    <h3 className={`mt-1.5 text-xs font-semibold text-center ${isDark ? "text-white" : "text-gray-900"} line-clamp-2`}>{item.manga.title}</h3>
                                </Link>
                            ))}
                        </div>

                        {readHistory.length > 2 && (
                            <button
                                onClick={handleToggleExpand}
                                className={`w-full sm:flex hidden items-center justify-center gap-1.5 py-2 rounded-md text-sm font-medium ${isDark ? "bg-gray-800/10 text-gray-300 hover:bg-gray-800/60 hover:text-white" : "bg-gray-100/10 text-gray-700 hover:bg-gray-100/60 hover:text-gray-900"} transition-all duration-200 shadow-sm hover:shadow-md`}
                            >
                                {isExpanded ? (
                                    <>
                                        <ChevronUp className="w-4 h-4" />
                                        Show Less
                                    </>
                                ) : (
                                    <>
                                        <ChevronDown className="w-4 h-4" />
                                        Show More
                                    </>
                                )}
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default React.memo(MangaReadHistory);