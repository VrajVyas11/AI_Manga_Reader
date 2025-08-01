import {
    Bookmark,
    Heart,
    Star,
    Play,
} from "lucide-react";
import {  useCallback, useMemo } from "react";
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
            className={`relative group overflow-hidden rounded-3xl shadow-lg transition-all duration-300 cursor-pointer ${isActive
                ? "ring-1 ring-purple-500/50 shadow-purple-500/20"
                : "hover:ring-1 hover:ring-gray-600 hover:shadow-xl"
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent rounded-t-3xl" />
                <div className="absolute bottom-1 left-4 right-4">
                    <div className="flex items-center justify-between gap-3 mt-2 text-gray-300 text-sm select-none">
                        <span className="flex items-center gap-1">
                            <Star size={14} className="text-yellow-400" />
                            {manga?.rating?.rating?.average?.toFixed(2) ??
                                manga.rating?.follows?.toFixed(2) ??
                                "N/A"}
                        </span>
                        {lastReadAt && (
                            <time
                                dateTime={lastReadAt.toISOString()}
                                className="text-xs text-gray-200"
                                title={`Last read on ${lastReadAt.toLocaleDateString()}`}
                            >
                                {lastReadAt.toLocaleDateString()}
                            </time>
                        )}
                    </div>
                    <h3 className="font-semibold mt-1 text-lg text-white line-clamp-1 drop-shadow-md">
                        {manga.title}
                    </h3>
                    <p className="text-xs text-gray-400 line-clamp-1">
                        Ch.{" "}
                        {lastChapterRead
                            ? `${lastChapterRead.chapter} : ${lastChapterRead.title}`
                            : "N/A"}
                    </p>
                </div>
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={handleFavorite}
                        className={`p-1.5 rounded-full transition-all focus:outline-none  ${isFavorited
                            ? "bg-red-600 text-white shadow-lg"
                            : "bg-black hover:bg-red-600 text-gray-300 hover:text-white"
                            }`}
                        aria-label="Add to favorites"
                    >
                        <Heart size={16} className={isFavorited ? "fill-current" : ""} />
                    </button>
                    <button
                        onClick={handleBookmark}
                        className={`p-1.5 rounded-full transition-all focus:outline-none  ${isBookmarked
                            ? "bg-blue-600 text-white shadow-lg"
                            : "bg-black hover:bg-blue-600 text-gray-300 hover:text-white"
                            }`}
                        aria-label="Add to bookmarks"
                    >
                        <Bookmark size={16} className={isBookmarked ? "fill-current" : ""} />
                    </button>
                </div>
            </div>

            {isActive && (
                <div className="absolute top-3 left-3 bg-purple-900/70 backdrop-blur-xl shadow-lg shadow-black text-white text-xs px-3 py-2 rounded-full flex items-center gap-1  select-none">
                    <Play size={12} className="fill-current" /> Reading
                </div>
            )}

            <div className="p-4 pt-2">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-1 select-none">
                    <span>
                        Progress:{" "}
                        <span className="font-medium text-white">
                            {progress.current}/{progress.total}
                        </span>{" "}
                        chapters
                    </span>
                    <span className="font-semibold text-white">{progress.percentage}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                        className="h-full bg-white rounded-full transition-all duration-700 ease-out relative"
                        style={{ width: `${progress.percentage}%` }}
                    >
                        <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    )
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

export default ReadingHistoryCard