import React, { useCallback, useMemo, memo, lazy, Suspense } from "react";
import { useRouter } from 'next/navigation';
import { Star } from "lucide-react";
import { useManga } from "../../providers/MangaContext";
import SearchMangaCardSkeleton from "../Skeletons/SearchPage/SearchMangaCardSkeleton";
import SearchMangaListSkeleton from "../Skeletons/SearchPage/SearchMangaListSkeleton";
const SearchMangaCard = memo(
  lazy(() => import("./SearchMangaCardWith2ViewModeModules/SearchMangaCard"))
);
const SearchMangaList = memo(
  lazy(() => import("./SearchMangaCardWith2ViewModeModules/SearchMangaList"))
);

// Memoized StarRating component
const StarRating = memo(({ rating }) => {
  const fullStars = Math.floor(rating / 2);
  const fractionalPart = rating / 2 - fullStars;
  const hasHalfStar = fractionalPart >= 0.35;

  return (
    <div className="flex gap-0.5" aria-label={`Rating: ${rating.toFixed(1)} out of 10`}>
      {[...Array(5)].map((_, i) => {
        if (i < fullStars) {
          return (
            <Star
              key={i}
              className="w-[15px] h-[15px] text-amber-400 fill-current"
              aria-hidden="true"
            />
          );
        }
        if (i === fullStars && hasHalfStar) {
          return (
            <Star
              key={i}
              className="w-[17px] h-[17px] -mt-0.5"
              style={{
                fill: "url(#half-gradient)",
                stroke: "none",
              }}
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="half-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="50%" stopColor="#fbbf24" />
                  <stop offset="50%" stopColor="#475569" />
                </linearGradient>
              </defs>
            </Star>
          );
        }
        return (
          <Star
            key={i}
            className="w-[15px] h-[15px] text-slate-600 fill-current"
            aria-hidden="true"
          />
        );
      })}
    </div>
  );
});

const formatCount = (num) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

const timeSinceUpdate = (dateString) => {
  const timeDiff = Date.now() - new Date(dateString);
  const minutes = Math.floor(timeDiff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  return `${minutes}m`;
};

// Clean manga object to remove circular references
const cleanManga = (manga) => {
  try {
    return JSON.parse(
      JSON.stringify(manga, (key, value) => {
        // Skip React-specific or non-serializable properties
        if (key.startsWith('__react')) return undefined;
        if (typeof value === 'object' && value !== null) {
          // Handle circular references by skipping them
          try {
            JSON.stringify(value);
            return value;
          } catch (e) {
            return null; // Replace circular objects with null
          }
        }
        return value;
      })
    );
  } catch (error) {
    console.error('Failed to clean manga:', error);
    return { id: manga.id, title: manga.title || 'Unknown' }; // Fallback
  }
};

const SearchMangaCardWith2ViewMode = ({ manga, viewMode,isDark=true }) => {
  if (!manga.id) return null
  const router = useRouter();
  const { setSelectedManga } = useManga();
  const mangadata = useMemo(() => manga, [manga]);
  const mangaId = useMemo(() => manga.id, [manga.id]);
  // console.log(cleanManga(manga));

  const handleMangaClicked = useCallback((manga) => {
    if (manga) {
      const cleanedManga = cleanManga(mangadata); // Clean before setting
      setSelectedManga(cleanedManga);
      router.push(`/manga/${mangaId}/chapters`);
    }
  }, [router, setSelectedManga]);

  const cardProps = useMemo(
    () => ({
      StarRating,
      handleMangaClicked,
      manga,
      timeSinceUpdate,
      formatCount,
    }),
    [handleMangaClicked, manga]
  );

  return (
    viewMode === "grid" ? (
      <Suspense fallback={<SearchMangaCardSkeleton isDark={isDark} />}>
        <SearchMangaCard {...cardProps} key={mangaId} isDark={isDark} />
      </Suspense>
    ) : (
      <Suspense fallback={<SearchMangaListSkeleton isDark={isDark} />}>
      <SearchMangaList {...cardProps} key={mangaId} isDark={isDark} />
      </Suspense>
    )
  )

};

export default memo(SearchMangaCardWith2ViewMode);