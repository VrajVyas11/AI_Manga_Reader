'use client';
import Image from 'next/image';
import React, { useCallback, useState, useMemo, Suspense, useEffect } from 'react';
import { getRatingColor } from '../../constants/Flags';
import { Star, MessageSquareText, Heart as HeartIcon, Flame, Activity } from 'lucide-react';
import MangaCardSkeleton from '../Skeletons/MangaList/MangaCardSkeleton';
import { useMangaFetch } from '../../hooks/useMangaFetch';
import MangaCardPagination from '../../Components/MangaListComponents/MangaCardPagination';
import StableFlag from '../StableFlag';
import { useManga } from '../../providers/MangaContext';
import { useTheme } from '../../providers/ThemeContext';
import useInView from "../../hooks/useInView";
import Link from 'next/link';
import { useMangaFilters, useFilterStats } from '../../hooks/useMangaFilters';
import {getBlurDataURL} from "../../util/imageOptimization"

const MangaCard = React.memo(() => {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const { data, isLoading, isError, error } = useMangaFetch('latest', 1);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);

    // Dynamically adjust items per page for mobile to reduce rendering load
    useEffect(() => {
        const handleResize = () => {
            setItemsPerPage(window.innerWidth < 640 ? 10 : 20);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Get the original data
    const originalMangas = useMemo(() => data?.data ?? [], [data?.data]);

    // Apply filters using the custom hook
    const filteredMangas = useMangaFilters(originalMangas);

    // Get filter statistics
    const filterStats = useFilterStats(originalMangas, filteredMangas);

    const totalPages = Math.ceil(filteredMangas.length / itemsPerPage);
    const { setSelectedManga } = useManga();

    const handleMangaClicked = useCallback(
        (manga) => {
            setSelectedManga(manga);
        },
        [setSelectedManga]
    );

    const loadMoreMangas = useCallback(() => {
        setCurrentPage(1); // Reset to first page when loading more data
    }, []);

    const currentMangas = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredMangas.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredMangas, currentPage, itemsPerPage]);

    const goToPage = useCallback(
        (page) => {
            if (page < 1 || page > totalPages) return;
            setCurrentPage(page);
            window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
        },
        [totalPages]
    );

    if (isLoading) {
        return <MangaCardSkeleton isDark={isDark} />;
    }

    if (isError) {
        return <div className="text-red-500">Error: {error.message}</div>;
    }

    return (
        <Suspense fallback={<MangaCardSkeleton isDark={isDark} />}>
            <div className="w-full flex flex-col">
                <div className="flex  mb-7 sm:mb-8 items-center gap-3">
                    <div className={`${isDark ? "bg-white/10" : "bg-gray-200/50"} p-2.5 lg:p-3 rounded-lg`}>
                        <Flame
                            className={`w-6 h-6 lg:w-7 lg:h-7 ${isDark ? "text-yellow-300" : "text-yellow-600"
                                } drop-shadow-md`}
                        />
                    </div>
                    <div className="flex-1">
                        <h2
                            className={`text-base lg:text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"
                                } uppercase tracking-wide`}
                        >
                            Latest Releases
                        </h2>
                        <div className="flex items-center gap-3">
                            <p className={`text-[11px] lg:text-xs ${isDark ? "text-gray-400" : "text-gray-600"} uppercase tracking-wide`}>
                                Fresh Manga Updates
                            </p>
                            {filterStats.hasFilters && (
                                <span
                                    className={`text-xs text-purple-300 px-2 py-1 rounded-full ${isDark ? "bg-purple-600/20" : "bg-purple-100 text-purple-700"
                                        }`}
                                >
                                    {filterStats.filteredCount} of {filterStats.originalCount} shown
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {currentMangas.length === 0 ? (
                    <div className={`text-center py-12 mx-auto ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                        <div className="text-lg font-semibold mb-2">No manga found</div>
                        <div className="text-sm">Try adjusting your preferences to see more content</div>
                    </div>
                ) : (
                    <div className="grid w-full gap-2 sm:gap-4  grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 contain-paint">
                        {currentMangas.map((manga, index) => (
                            <Card
                                isDark={isDark}
                                manga={manga}
                                handleMangaClicked={handleMangaClicked}
                                key={`${manga.id}-${currentPage}-${index}`}
                                priority={index < 6} // Prioritize first 6 for initial load (adjust based on visible count)
                            />
                        ))}
                    </div>
                )}

                {loadMoreMangas && currentPage === totalPages && filteredMangas.length > 0 && (
                    <button
                        className={`px-8 py-3 mt-12 ml-12 ${isDark ? "bg-purple-700 hover:bg-purple-800 text-white" : "bg-purple-500 hover:bg-purple-600 text-gray-900"
                            } font-semibold rounded-lg transition-all duration-0 transform hover:scale-105 shadow-lg`}
                    >
                        Load More
                    </button>
                )}
            </div>
            <div className="h-28" />
            {totalPages > 1 && (
                <div className="absolute bottom-0 inset-x-0 w-screen flex justify-center mb-8">
                    <MangaCardPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={goToPage}
                        loadMoreMangas={loadMoreMangas}
                        onLoadMore={loadMoreMangas}
                    />
                </div>
            )}
        </Suspense>
    );
});

MangaCard.displayName = 'MangaCard';
export default MangaCard
// Optimized Card component
const Card = React.memo(({ manga, handleMangaClicked, isDark, priority = false }) => {
    const [ref, inView] = useInView(0.1);

    // Memoize expensive calculations
    const memoizedData = useMemo(
        () => ({
            rating: manga?.rating?.rating?.bayesian?.toFixed(2) ?? 'N/A',
            commentsCount: (() => {
                const count = manga?.rating?.comments?.repliesCount ?? 0;
                return count > 1000 ? count.toString()[0] + 'K' : count;
            })(),
            followsCount: (() => {
                const follows = manga?.rating?.follows ?? 0;
                return follows > 1000 ? follows.toString()[0] + 'K' : follows;
            })(),
            timeAgo: (() => {
                const minutes = Math.floor((new Date() - new Date(manga.updatedAt)) / 60000);
                return `${Math.floor(minutes / 60)}h ${minutes % 60}m ago`;
            })(),
            truncatedTitle: manga.title.length > 40 ? `${manga.title.slice(0, 40)}...` : manga.title,
            statusColor: manga.status === 'completed'
                ? isDark ? 'fill-[#00c8f58b] text-[#00c9f5]' : 'text-[#00a3cc]'
                : manga.status === 'ongoing'
                ? isDark ? 'text-[#04d000]' : 'text-[#03a300]'
                : manga.status === 'hiatus'
                ? isDark ? 'text-[#da7500]' : 'text-[#b35f00]'
                : isDark ? 'text-[#da0000]' : 'text-[#b30000]',
            ratingBg: getRatingColor(manga.contentRating) ?? getRatingColor('default'),
            ratingBorder: getRatingColor(manga.contentRating.toString() + 'Border') ?? getRatingColor('default')
        }),
        [manga, isDark]
    );

    // Memoize click handler
    const handleClick = useCallback(() => {
        handleMangaClicked(manga);
    }, [handleMangaClicked, manga]);

    return (
        <Link
            ref={ref}
            href={`/manga/${manga.id}/chapters`}
            prefetch={true}
            onClick={handleClick}
            className={`manga-card group -mt-2 lg:mt-0 transform transition-all duration-[400ms] ease-in-out cursor-pointer w-full flex justify-center items-start will-change-transform ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
        >
            <div
                className={` origin-center w-full min-h-[267px] sm:min-h-[368px] rounded-2xl  ${isDark ? "bg-[#060111]/50 shadow-slate-600/40" : "bg-gray-100/50 shadow-gray-400"
                    } p-[5px] shadow-[0_-1px_7px_rgba(0,0,0,0.2)] transition-transform duration-300 ease-in-out  will-change-transform`}
            >
                <div
                    className={`
    relative flex h-[200px] sm:h-[280px] flex-col contain-paint
    rounded-t-[10px]
    overflow-hidden  
    ${manga.isCoverImageBlurred
                            ? "before:content-[''] before:absolute before:inset-0 before:bg-black/20 before:backdrop-blur-sm before:transition-all before:duration-300 group-hover:before:opacity-0 pointer-events-none before:z-10 before:rounded-[5px] before:rounded-tl-[20px]"
                            : ""}
    ${isDark ? "bg-gradient-to-tr from-[#1f2020] to-[#000d0e]" : "bg-gradient-to-tr from-gray-200 to-gray-300"}
    will-change-transform
  `}
                >
                    <Image
                        src={manga.coverImageUrl ?? "/placeholder.jpg"}
                        alt={manga.title}
                        fill
                        className="absolute inset-0 mt-6 sm:mt-9 w-full h-full object-fill"
                        placeholder="blur"
                        blurDataURL={getBlurDataURL()} // Low-res placeholder
                        priority={priority} // Eager load for initial visible cards
                        loading={priority ? 'eager' : 'lazy'} // Eager for priority, lazy otherwise
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" // Responsive based on grid cols
                        fetchPriority={priority ? 'high' : 'auto'} // Browser hint for initial
                    />

                    {/* bottom gradient + title */}
                    <div
                        className={`absolute z-50 inset-x-0 bottom-0 ${isDark ? "bg-gradient-to-t from-black via-gray-900 to-transparent" : "bg-gradient-to-t from-gray-900/80 via-gray-800/50 to-transparent"
                            } p-2 sm:p-4`}
                    >
                        <h1 className="flex flex-row w-full font-bold items-center gap-3 sm:items-start justify-center text-[7px] sm:text-xs tracking-[2px] text-white">
                            <StableFlag className="w-4 sm:w-7" code={manga.originalLanguage ?? 'UN'} />
                            {memoizedData.truncatedTitle}
                        </h1>
                    </div>
                    <div className="absolute inset-0 h-7 sm:h-[38px] rounded-t-[12px] backdrop-blur-[2px] z-10" />
                    <div className={`relative z-20 h-[29px] md:h-[39px] -ml-1 -mt-1 w-[60%] -skew-x-[40deg] rounded-br-[10px] ${isDark ? "bg-[#060111] shadow-[-10px_-10px_0_0_#060111]" : "bg-white shadow-[-10px_-10px_0_0_rgb(255,255,255)]"} before:absolute before:right-[-2px] before:top-0 before:h-[12px] before:w-[70px] sm:before:w-[129px] before:rounded-tl-[11px]`} />
                    <div className={`absolute left-0 top-[25px] sm:top-[35px] z-50 h-[19px] w-[105px] before:absolute before:h-full before:w-1/2 sm:before:w-full before:rounded-tl-full ${isDark ? "before:shadow-[-5px_-5px_0_2px_#060111]" : "before:shadow-[-5px_-5px_0_2px_rgb(255,255,255)]"}`} />
                    <div className="absolute top-0 flex h-[30px] w-full justify-between">
                        <div className="h-full flex flex-row justify-center items-center aspect-square">
                            <span className={`absolute gap-2 md:gap-3 top-[3px] sm:top-[7px] left-4 z-30 text-[9px] sm:text-[11px] sm:tracking-widest rounded-full pr-2 sm:min-w-24 flex items-center justify-center font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                                <Activity strokeWidth={3.5} className={` size-2.5 sm:size-4 ${memoizedData.statusColor}`} />
                                <span className=''>{manga.status.charAt(0).toUpperCase() + manga.status.slice(1).toLowerCase()}</span>
                            </span>
                        </div>
                        <div className="flex w-full ">
                            <span
                                className={`${manga.contentRating.toUpperCase() === 'SAFE'
                                    ? 'pr-8'
                                    : manga.contentRating.toUpperCase() === 'EROTICA'
                                        ? 'pr-5'
                                        : 'pr-3'
                                    } z-10 tracking-widest mt-[1.5px] top-0 right-0  flex items-center justify-end text-center border-2 w-full  absolute py-[5px] sm:py-[7px] min-w-36 text-[6px] sm:text-[10px] font-semibold rounded-lg md:rounded-xl ${isDark ? "text-white" : "text-gray-100"} bg-opacity-70 ${memoizedData.ratingBorder} backdrop-blur-lg ${memoizedData.ratingBg}`}
                            >
                                {manga.contentRating.toUpperCase()}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="p-[2px_4px] sm:p-[5px_10px] w-full">
                    <div className={`flex justify-between mt-2 ${isDark ? "text-gray-300" : "text-gray-700"} text-sm`}>
                        <div className="flex text-[10px] sm:text-base items-center gap-0.5 sm:gap-2">
                            <Star className={`w-6 h-6 sm:w-7 sm:h-7  ${isDark ? "text-yellow-500" : "text-yellow-600"} rounded-md p-1`} aria-hidden="true" />
                            <span>{memoizedData.rating}</span>
                        </div>
                        <div className="flex text-[10px] sm:text-base items-center gap-0.5 sm:gap-2">
                            <MessageSquareText className={`w-6 h-6  sm:w-7 sm:h-7  ${isDark ? "text-white/70" : "text-gray-700/70"} rounded-md p-1`} aria-hidden="true" />
                            <span>{memoizedData.commentsCount}</span>
                        </div>
                        <div className="flex text-[10px] sm:text-base items-center gap-0.5 sm:gap-2">
                            <HeartIcon className={`w-6 h-6 sm:w-7 sm:h-7  ${isDark ? "fill-rose-500/50 text-rose-500" : "fill-rose-600/50 text-rose-600"} rounded-md p-1`} aria-hidden="true" />
                            <span>{memoizedData.followsCount}</span>
                        </div>
                    </div>
                    <div className="mt-3 flex flex-col sm:min-h-[92px] justify-between relative">
                        <div className="flex flex-wrap gap-1">
                            {manga.flatTags.slice(0, 4).map((tag) => (
                                <span
                                    key={tag}
                                    className={`${isDark ? "!shadow-[inset_0_0_5px_rgba(200,200,200,0.2)] border-gray-700/30 hover:bg-gray-800" : "bg-gray-200 shadow-md border-gray-300 hover:bg-gray-300"} backdrop-blur-md rounded-lg sm:min-w-16 duration-0  px-2 sm:px-3 py-1 sm:py-1.5 border transition-colors text-center flex flex-row font-bold items-start justify-center text-[9px] sm:text-[10px] sm:tracking-[1px] ${isDark ? "text-white" : "text-gray-900"}`}
                                >
                                    {tag.length > 12 ? tag.slice(0, 12) + "..." : tag}
                                </span>
                            ))}
                        </div>
                        <div className="h-8" />
                        <p suppressHydrationWarning className={`text-[7px] bottom-1 md:bottom-0.5   sm:text-xs tracking-widest w-full absolute z-30 flex justify-center items-center text-center opacity-70 ${isDark ? "text-gray-400" : "text-gray-600"} mt-4`}>
                            Last updated: {memoizedData.timeAgo}
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    );
});

Card.displayName = 'Card';