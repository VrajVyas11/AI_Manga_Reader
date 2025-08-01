import {
    Bookmark,
    Heart,
    Star,
    Play,
} from "lucide-react";
import { useCallback, useMemo } from "react";
import { useManga } from "../../providers/MangaContext";
import Image from "next/image";

function ReadingHistoryCard({
    manga,
    isActive = false,
    chapters,
    lastChapterRead,
    lastReadAt,
    allChaptersList,
    onMangaClick,
    isDark,
}) {
    const { addToBookMarks, getAllBookMarks, addToFavorite, getAllFavorites } = useManga();
    const progress = calculateProgress({ manga, allChaptersList, chapters });

    const isBookmarked = useMemo(() => {
        const bookmarks = getAllBookMarks();
        return bookmarks.some((bookmark) => bookmark.manga.id === manga.id);
    }, [getAllBookMarks, manga.id]);

    const isFavorited = useMemo(() => {
        const favorites = getAllFavorites();
        return favorites[manga.id];
    }, [getAllFavorites, manga.id]);

    const handleBookmark = useCallback(
        (e) => {
            e.stopPropagation();
            addToBookMarks(manga);
        },
        [addToBookMarks, manga]
    );

    const handleFavorite = useCallback(
        (e) => {
            e.stopPropagation();
            addToFavorite(manga, lastChapterRead);
        },
        [addToFavorite, manga, lastChapterRead]
    );

    return (
        <div
            className={`relative group overflow-hidden rounded-3xl transition-all duration-300 cursor-pointer ${isActive
                    ? "ring-1 ring-purple-500/50 shadow-purple-500/20"
                    : isDark
                        ? "hover:ring-1 hover:ring-gray-600 hover:shadow-xl"
                        : "hover:ring-1 hover:ring-gray-300 hover:shadow-lg"
                } bg-transparent`}
            onClick={() => onMangaClick(manga)}
            aria-label={`Manga card for ${manga.title}`}
        >
            <div className="relative h-56 overflow-hidden rounded-t-3xl">
                <Image
                    width={300}
                    height={300}
                    src={manga.coverImageUrl || manga.cover}
                    alt={manga.title}
                    className="w-full h-full object-fill group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                />
                <div
                    className={`absolute inset-0 rounded-t-3xl ${isDark
                            ? "bg-gradient-to-t from-black/90 via-black/40 to-transparent"
                            : "bg-gradient-to-t from-white/90 via-black/20 to-transparent"
                        }`}
                />
                <div className="absolute bottom-1 left-4 right-4">
                    <div
                        className={`flex items-center justify-between gap-3 mt-2 text-sm select-none ${isDark ? "text-gray-300" : "text-black"
                            }`}
                    >
                        <span className="flex items-center gap-1">
                            <Star size={14} className={`${isDark
                                ? "text-yellow-400" : " text-yellow-500 fill-yellow-400"}`} />
                            {manga?.rating?.rating?.average?.toFixed(2) ??
                                manga.rating?.follows?.toFixed(2) ??
                                "N/A"}
                        </span>
                        {lastReadAt && (
                            <time
                                dateTime={lastReadAt.toISOString()}
                                className={`${isDark ? "text-gray-200" : "text-black"} text-xs`}
                                title={`Last read on ${lastReadAt.toLocaleDateString()}`}
                            >
                                {lastReadAt.toLocaleDateString()}
                            </time>
                        )}
                    </div>
                    <h3
                        className={`font-semibold mt-1 text-lg line-clamp-1 drop-shadow-md ${isDark ? "text-white" : "text-black"
                            }`}
                    >
                        {manga.title}
                    </h3>
                    <p
                        className={`text-xs line-clamp-1 ${isDark ? "text-gray-400" : "text-gray-700"
                            }`}
                    >
                        Ch.{" "}
                        {lastChapterRead
                            ? `${lastChapterRead.chapter} : ${lastChapterRead.title}`
                            : "N/A"}
                    </p>
                </div>
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={handleFavorite}
                        className={`p-1.5 rounded-full transition-all focus:outline-none ${isFavorited
                                ? "bg-red-600 text-white shadow-lg"
                                : isDark
                                    ? "bg-black hover:bg-red-600 text-gray-300 hover:text-white"
                                    : "bg-gray-200 hover:bg-red-600 text-gray-700 hover:text-white"
                            }`}
                        aria-label="Add to favorites"
                    >
                        <Heart size={16} className={isFavorited ? "fill-current" : ""} />
                    </button>
                    <button
                        onClick={handleBookmark}
                        className={`p-1.5 rounded-full transition-all focus:outline-none ${isBookmarked
                                ? "bg-blue-600 text-white shadow-lg"
                                : isDark
                                    ? "bg-black hover:bg-blue-600 text-gray-300 hover:text-white"
                                    : "bg-gray-200 hover:bg-blue-600 text-gray-700 hover:text-white"
                            }`}
                        aria-label="Add to bookmarks"
                    >
                        <Bookmark size={16} className={isBookmarked ? "fill-current" : ""} />
                    </button>
                </div>
            </div>

            {isActive && (
                <div
                    className={`absolute top-3 left-3 rounded-full flex items-center gap-1 px-3 py-2 text-xs select-none ${isDark
                            ? "bg-purple-900/70 backdrop-blur-xl shadow-lg shadow-black text-white"
                            : "bg-purple-600/70 backdrop-blur-sm shadow-md shadow-purple-400 text-white"
                        }`}
                >
                    <Play size={12} className="fill-current" /> Reading
                </div>
            )}

            <div className="p-4 pt-2">
                <div
                    className={`flex items-center justify-between mb-1 text-xs select-none ${isDark ? "text-gray-400" : "text-gray-700"
                        }`}
                >
                    <span>
                        Progress:{" "}
                        <span className={`${isDark ? "text-white" : "text-black"} font-medium`}>
                            {progress.current}/{progress.total}
                        </span>{" "}
                        <span className="hidden sm:block"> chapters</span>
                    </span>
                    <span className={`${isDark ? "text-white" : "text-black"} font-semibold`}>
                        {progress.percentage}%
                    </span>
                </div>
                <div
                    className={`w-full rounded-full h-2 overflow-hidden ${isDark ? "bg-gray-700" : "bg-gray-300"
                        }`}
                >
                    <div
                        className={`h-full rounded-full transition-all duration-700 ease-out relative ${isDark ? "bg-white" : "bg-black"
                            }`}
                        style={{ width: `${progress.percentage}%` }}
                    >
                        <div
                            className={`absolute inset-0 rounded-full animate-pulse ${isDark ? "bg-white/20" : "bg-black/40"
                                }`}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

// Utility: Calculate reading progress
const calculateProgress = (item) => {
    if (!item.allChaptersList || !item.chapters || item.allChaptersList.length === 0) {
        return { percentage: 0, current: 0, total: 0 };
    }
    const totalChapters = item.allChaptersList.length;
    const percentage = Math.min((item.chapters.length / totalChapters) * 100, 100);
    return {
        percentage: Math.round(percentage),
        current: item.chapters.length,
        total: totalChapters,
    };
};

export default ReadingHistoryCard;