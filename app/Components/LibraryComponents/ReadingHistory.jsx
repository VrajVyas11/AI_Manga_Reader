"use client"
import { useState,useRef } from 'react';
import {
  BookOpen,
  Bookmark,
  History,
  Search,
  Star,
  Clock,
  Users,
  ChevronDown,
  ChevronUp,
  BookOpenCheck,
  ChevronLeft, ChevronRight, MoreHorizontal, Eye,  Play, Plus
} from 'lucide-react';
import Image from 'next/image';
// Reading History Card (responsive)
const ReadingHistoryCard = ({ item, onClick }) => {
    const [showChapters, setShowChapters] = useState(false);
    const manga = item.manga;
    const progress = Math.round(
        (item.chapters.length / (item.allChaptersList.length || 1)) * 100
    );

    return (
        <div className="group relative border border-gray-900 rounded-xl overflow-hidden hover:border-gray-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 text-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/30 via-gray-850/30 to-gray-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md pointer-events-none" />

            <div className="relative flex gap-3 p-3">
                {/* Cover Image */}
                <div className="relative flex-shrink-0">
                    <div className="w-16 sm:w-20 h-20 sm:h-28 rounded-lg overflow-hidden shadow-md ring-1 ring-gray-900/80">
                        <Image
                            width={300}
                            height={300}
                            src={manga.coverImageUrl || '/placeholder.jpg'}
                            alt={manga.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                    </div>
                    {/* Progress badge */}
                    <div className="absolute -top-1 -right-1 bg-gradient-to-r from-gray-900 to-gray-800 text-gray-300 text-[10px] font-semibold px-1.5 sm:px-2 py-0.5 rounded-full shadow-md border border-gray-800/70 select-none">
                        <span className="relative z-10">{progress}%</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900 rounded-full opacity-50 animate-pulse" />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-2">
                    {/* Title and Date */}
                    <div className="flex items-start justify-between">
                        <h3
                            className="text-sm sm:text-base font-semibold text-gray-100 cursor-pointer hover:text-gray-300 transition-colors line-clamp-2 leading-tight"
                            onClick={() => onClick(manga)}
                            title={manga.title}
                        >
                            {manga.title}
                        </h3>
                        <div className="flex items-center min-w-fit gap-1 text-gray-400 text-xs bg-gray-900/70 px-2 py-1 sm:px-2 md:py-0.5 rounded-full select-none">
                            <Clock className="w-3 sm:w-4 h-3 sm:h-4" />
                            <span className="hidden sm:inline">{item.lastReadAT.toLocaleDateString()}</span>
                            <span className="sm:hidden">{item.lastReadAT.toLocaleDateString()}</span>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="flex items-center gap-1 bg-yellow-900/30 px-1.5 sm:px-2 py-0.5 rounded-full border border-yellow-900/50 select-none">
                            <Star className="w-3 sm:w-4 h-3 sm:h-4 text-yellow-400 fill-current" />
                            <span className="text-yellow-400 font-semibold text-xs">
                                {manga?.rating?.rating?.bayesian?.toFixed(1) || 'N/A'}
                            </span>
                        </div>
                        <div className="flex items-center gap-1 bg-purple-900/30 px-1.5 sm:px-2 py-0.5 rounded-full border border-purple-900/50 select-none">
                            <Users className="w-3 sm:w-4 h-3 sm:h-4 text-purple-400" />
                            <span className="text-purple-400 font-semibold text-xs">
                                {(manga?.rating?.follows / 1000).toFixed(1)}K
                            </span>
                        </div>
                        <div className="hidden sm:flex items-center gap-1 bg-green-900/30 px-2 py-0.5 rounded-full border border-green-900/50 select-none">
                            <Bookmark className="w-4 h-4 text-green-400" />
                            <span className="text-green-400 font-semibold text-xs">
                                {manga?.rating?.comments?.repliesCount || 0}
                            </span>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                        {(manga.flatTags || ['Action', 'Adventure', 'Supernatural'])
                            .slice(0, window.innerWidth < 640 ? 2 : 4)
                            .map((tag, idx) => (
                                <span
                                    key={idx}
                                    className="px-1.5 sm:px-2 py-0.5 bg-gray-900/70 text-gray-400 text-[10px] font-medium rounded-full border border-gray-800 backdrop-blur-sm select-none"
                                >
                                    {tag}
                                </span>
                            ))}
                    </div>
                </div>
            </div>

            {/* Chapters Section */}
            <div className="rounded-lg p-2 max-h-46 overflow-y-auto custom-scrollbar">
                <div className="flex items-center justify-between mb-1">
                    <h4 className="text-xs font-semibold text-gray-200 flex items-center gap-1">
                        <BookOpen className="w-3 sm:w-4 h-3 sm:h-4 text-gray-400" />
                        Recent Chapters ({item.chapters.length})
                    </h4>
                    {item.chapters.length > 2 && (
                        <button
                            onClick={() => setShowChapters(!showChapters)}
                            className="flex items-center gap-1 text-gray-400 hover:text-gray-300 text-xs font-medium transition-all hover:bg-gray-800/50 px-2 py-0.5 rounded-full"
                            aria-label={showChapters ? 'Show Less' : 'Show All'}
                        >
                            {showChapters ? (
                                <>
                                    <span className="hidden sm:inline">Show Less</span>
                                    <ChevronUp className="w-3 sm:w-4 h-3 sm:h-4" />
                                </>
                            ) : (
                                <>
                                    <span className="hidden sm:inline">Show All</span>
                                    <ChevronDown className="w-3 sm:w-4 h-3 sm:h-4" />
                                </>
                            )}
                        </button>
                    )}
                </div>

                <div className="space-y-1">
                    {item.chapters
                        .slice(0, showChapters ? item.chapters.length : 2)
                        .map((chapter, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-1 bg-gray-950/90 hover:bg-gray-900/70 border border-gray-800 hover:border-gray-700 rounded-md transition-colors duration-200 cursor-default"
                            >
                                <div className="flex items-center gap-1">
                                    <span className="bg-gray-900 text-gray-300 font-semibold text-[10px] px-1 py-0.5 rounded select-none">
                                        Ch. {chapter.chapter}
                                    </span>
                                    <span className="text-gray-300 text-xs truncate max-w-[100px] sm:max-w-[140px]">
                                        {chapter.title}
                                    </span>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};
export default ReadingHistoryCard


export const MobileReadingHistory = ({ readHistory, filteredHistory, handleMangaClick }) => {
    return (
        <div className="flex flex-col mb-4 rounded-xl  h-full">
            <div className="flex mb-4 gap-3 items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-gray-800/50 p-2 sm:p-3 rounded-lg">
                        <BookOpenCheck className="w-5 h-5 sm:w-6 sm:h-6 text-violet-400" />
                    </div>
                    <div>
                        <h2 className="text-sm sm:text-base font-semibold text-gray-100">Reading History</h2>
                        <p className="text-[8px] sm:text-[9px] text-gray-400 uppercase tracking-wide">Continue where you left off</p>
                    </div>
                </div>
                <div className="flex items-center gap-1 bg-gray-900/80 p-1 px-2 sm:px-3 rounded-full border border-gray-800 text-xs sm:text-sm">
                    <div>{readHistory.length}</div>
                </div>
            </div>

            <div className="flex min-h-full">
                {filteredHistory.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3 sm:gap-4 min-h-fit">
                        {filteredHistory.map((item, idx) => (
                            <ReadingHistoryCard
                                key={`${item.manga.id}-${idx}`}
                                item={item}
                                onClick={handleMangaClick}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center py-8 text-xs text-gray-400">
                        <div className="p-4 bg-gray-900 rounded-full mb-4">
                            <History className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-100 mb-2">
                            No Reading History
                        </h3>
                        <p className="mb-4 max-w-xs">
                            {readHistory.length === 0
                                ? 'Start reading some manga to see your progress here!'
                                : 'No manga match your current filters. Try adjusting your search criteria.'}
                        </p>
                        <button
                            onClick={() => router.push('/search')}
                            className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-gray-300 font-semibold rounded-lg shadow-md transition-all"
                        >
                            <Search className="w-4 h-4 inline mr-1" />
                            Discover Manga
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}


export function ReadingHistory({ readHistory, onMangaClick }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="space-y-6 max-w-3xl min-h-[400px] overflow-y-hidden rounded-xl p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Continue Reading</h2>
          <p className="text-gray-400 mt-1 uppercase tracking-wide text-sm">Pick up where you left off</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => scroll('left')}
            aria-label="Scroll left"
            className="w-9 h-9 rounded-full bg-violet-700 hover:bg-violet-600 flex items-center justify-center text-white transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            aria-label="Scroll right"
            className="w-9 h-9 rounded-full bg-violet-700 hover:bg-violet-600 flex items-center justify-center text-white transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <button
            aria-label="More options"
            className="w-9 h-9 rounded-full bg-violet-700 hover:bg-violet-600 flex items-center justify-center text-white transition"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Scrollable Manga Cards */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-none scroll-smooth py-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {readHistory.map((manga, idx) => (
          <MangaCard
            key={idx}
            genre={manga.manga.flatTags?.[0]}
            image={manga.manga.coverImageUrl}
            rating={manga.manga.rating?.rating?.bayesian?.toFixed(2)}
            title={manga.manga.title}
            views={manga.manga.rating?.follows}
            chapters={manga.allChaptersList.length || 'N/A'}
            status={manga.manga.status}
            lastRead={manga.lastReadAT.toDateString()}
            progress={Math.round(
              (manga.chapters.length / (manga.allChaptersList.length || 1)) * 100
            )}
            onClick={() => onMangaClick(manga.manga)}
          />
        ))}
      </div>
    </section>
  );
}

function MangaCard({
  title,
  image,
  rating,
  views,
  chapters,
  status,
  genre,
  lastRead,
  progress,
  onClick,
  size = 'default',
  orientation = 'horizontal',
}) {
  const isHorizontal = orientation === 'horizontal';

  return (
    <div
      onClick={onClick}
      tabIndex={0}
      role="button"
      className={`group cursor-pointer max-w-52 min-w-72 rounded-lg bg-gray-950 shadow-md transition-transform duration-300 hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-violet-500 ${
        isHorizontal ? 'w-32' : 'w-52'
      }`}
      aria-label={`Open manga ${title}`}
    >
      {/* Image Container */}
      <div
        className={`relative max-h-40  overflow-hidden rounded-lg ${
          isHorizontal ? 'aspect-video' : 'aspect-[3/4]'
        }`}
      >
        <div className=' absolute inset-0 w-full h-full bg-black/20'></div>
        <Image
          src={image || '/placeholder.jpg'}
          alt={title}
          width={300}
          height={300}
          className="w-full h-full  object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
          unoptimized
        />

        {/* Status Badge */}
        {status && (
          <div className="absolute top-3 left-3 bg-black bg-opacity-70 text-white rounded-md px-2 py-0.5 text-xs font-semibold select-none">
            {status}
          </div>
        )}

        {/* Rating Badge */}
        {rating && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-black bg-opacity-70 text-yellow-400 rounded-md px-2 py-1 text-xs font-semibold select-none">
            <Star className="w-3 h-3" />
            <span>{rating}</span>
          </div>
        )}

        {/* Progress Bar */}
        {progress !== undefined && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black bg-opacity-50">
            <div
              className="h-full bg-violet-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Hover Actions */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-30 rounded-lg">
          <button
            onClick={(e) => {
              e.stopPropagation();
              alert(`Start reading ${title}`);
            }}
            className="flex items-center gap-1 bg-violet-700 hover:bg-violet-600 text-white rounded-md px-3 py-1 text-sm font-semibold transition"
            aria-label={`Read ${title}`}
          >
            <Play className="w-4 h-4" />
            Read
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              alert(`Add ${title} to favorites`);
            }}
            className="flex items-center gap-1 bg-transparent border border-white/30 hover:border-violet-500 text-white rounded-md px-3 py-1 text-sm font-semibold transition"
            aria-label={`Add ${title} to favorites`}
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <h3 className="text-white font-semibold truncate" title={title}>
          {title}
        </h3>

        <div className="flex items-center justify-between text-gray-400 text-xs">
          <div className="flex items-center gap-3">
            {chapters && <span>{chapters} chapters</span>}
            {views && (
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>{(views / 1000).toFixed(1)}K</span>
              </div>
            )}
          </div>

          {lastRead && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <time dateTime={new Date(lastRead).toISOString()}>{lastRead}</time>
            </div>
          )}
        </div>

        {genre && (
          <div className="inline-flex items-center gap-1 rounded-md border border-violet-600 px-2 py-0.5 text-violet-400 text-xs font-semibold select-none">
            {genre}
          </div>
        )}
      </div>
    </div>
  );
}


