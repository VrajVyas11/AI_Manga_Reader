import React, { memo, useMemo } from "react";
import { Star, BookOpen } from "lucide-react";
import { langToCountry } from "../../../constants/Flags"
import StableFlag from "../../StableFlag";
import useInView from "@/app/hooks/useInView";
import Image from "next/image";
import Link from "next/link";

const contentRatingStyles = {
  safe: "bg-emerald-600 text-emerald-50",
  suggestive: "bg-orange-600 text-orange-50",
  erotica: "bg-red-600 text-red-50",
  pornographic: "bg-red-800 text-red-50",
};

const statusStyles = {
  ongoing: "bg-emerald-500",
  completed: "bg-blue-500",
  hiatus: "bg-amber-500",
  cancelled: "bg-red-500",
};

// Mock StarRating component
const StarRating = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`w-3 h-3 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-500'
          }`}
      />
    ))}
  </div>
);

const SearchMangaCard = ({
  formatCount = (num) => num?.toLocaleString() ?? '0',
  manga = {
    title: "Attack on Titan",
    coverImageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop",
    contentRating: "suggestive",
    status: "completed",
    originalLanguage: "JP",
    description: "Humanity fights for survival against giant humanoid Titans. When the colossal Titan appears and breaches their wall, Eren Yeager and his friends join the fight to reclaim their world.",
    updatedAt: "2024-01-15T10:30:00Z",
    rating: {
      rating: { bayesian: 9.2 },
      follows: 2500000,
      comments: { repliesCount: 45000 },
      bookmarks: 890000
    },
    flatTags: ["Action", "Drama", "Military", "Supernatural", "Thriller", "Gore"]
  },
  handleMangaClicked = () => console.log('Manga clicked'),
  isDark = true,
}) => {
  const remainingTagsCount = useMemo(() => {
    const limit = 4;
    return Math.max(0, (manga.flatTags?.length ?? 0) - limit);
  }, [manga.flatTags]);

  const ratingStyle = useMemo(
    () => contentRatingStyles[manga.contentRating?.toLowerCase()] ?? "bg-gray-600 text-gray-50",
    [manga.contentRating]
  );

  const statusStyle = useMemo(
    () => statusStyles[manga.status] ?? "bg-gray-500",
    [manga.status]
  );

  const bayesianRating = useMemo(
    () => manga?.rating?.rating?.bayesian ?? 0,
    [manga?.rating?.rating?.bayesian]
  );
  const [ref, inView] = useInView(0.1)
  return (
    <Link
      href={`/manga/${manga?.id}/chapters`}
      prefetch={true}
      ref={ref}
      className={`group relative w-full transform transition-all rounded-xl overflow-hidden  duration-500  max-w-sm mx-auto cursor-pointer ${inView
        ? "opacity-100 translate-y-0"
        : "opacity-0 translate-y-10"
        }`}
      onClick={handleMangaClicked}
      role="button"
      tabIndex={0}
    >
      <div className={`relative aspect-[3/4] rounded-xl overflow-hidden transition-all duration-500 ease-out group-hover:scale-[1.02] group-hover:shadow-2xl ${isDark
        ? 'bg-gray-900 group-hover:shadow-purple-500/20'
        : 'bg-gray-100 group-hover:shadow-purple-500/20'}`}>
        {/* Cover Image - keep size as is */}
        <div className="absolute inset-0">
          <Image
            width={300}
            height={300}
            src={manga.coverImageUrl ?? "./placeholder.jpg"}
            alt={manga.title}
            blurDataURL="./placeholder.jpg"
            className="w-full h-full object-fill transition-transform duration-700 ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
        </div>

        {/* Top badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-20">
          <div className="flex items-center gap-1.5">
            <span className={`${statusStyle} w-2 h-2 rounded-full`} />
          </div>
        </div>

        {/* Title - Always visible */}
        <div className="absolute bottom-0 left-0 right-0 p-3 z-20 flex flex-row whitespace-break-spaces items-center gap-2">
          <div className={`shadow-lg p-0.5 min-w-fit ${isDark ? 'bg-black/20' : ''}`}>
            <StableFlag code={langToCountry[manga.originalLanguage ?? "UN"]} className="h-auto w-7" />
          </div>
          <h3 className="text-white  w-full text-sm font-semibold leading-tight mb-0.5 line-clamp-2 drop-shadow-lg">
            {manga.title}
          </h3>
        </div>

        {/* Hover overlay with details */}
        <div className={`absolute inset-0 backdrop-blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-100 ease-out translate-y-4 group-hover:translate-y-0 z-30 
md:opacity-0 md:group-hover:opacity-100 md:translate-y-4 md:group-hover:translate-y-0
[@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:translate-y-4 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:backdrop-blur-3xl ${isDark
            ? 'bg-black/70 [@media(hover:hover)]:bg-black/70'
            : 'bg-white/80 [@media(hover:hover)]:bg-white/80'}`}>

          <div className="h-full flex flex-col p-3 sm:p-4">
            {/* Header with title and rating */}
            <div>
              <div className="flex items-center justify-between mb-1 sm:mb-1.5 min-h-10 sm:min-h-12">
                <h3 className={`text-center text-base sm:text-lg font-semibold leading-tight flex-1 line-clamp-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {manga.title}
                </h3>
              </div>

              {bayesianRating > 0 && (
                <div className="flex items-center gap-1 sm:gap-1.5 mb-1.5 sm:mb-2">
                  <span className="text-amber-400 text-sm sm:text-base font-semibold">
                    {bayesianRating.toFixed(1)}
                  </span>
                  <StarRating rating={Math.floor(bayesianRating / 2)} />
                  <span className={`text-[10px] sm:text-xs ml-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    ({formatCount(manga?.rating?.follows ?? 0)} follows)
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="flex-1 mb-2 sm:mb-3">
              <p className={`text-[11px] sm:text-xs leading-normal line-clamp-3 sm:line-clamp-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {manga.description ?? "No description available."}
              </p>
            </div>

            {/* Tags */}
            <div className="mb-2 sm:mb-3">
              <div className="flex flex-wrap gap-1">
                <span
                  className={`${ratingStyle} px-1 sm:px-1.5 ${isDark ? "bg-opacity-55" : ""} py-0.5 rounded-md text-[9px] sm:text-[10px] font-semibold backdrop-blur-sm`}
                >
                  {(manga.contentRating ?? "Unknown").toUpperCase()}
                </span>
                {(manga.flatTags ?? []).slice(0, window.innerWidth < 640 ? 2 : 3).map((tag) => (
                  <span
                    key={tag}
                    className={`border px-1 sm:px-1.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-semibold backdrop-blur-sm bg-opacity-90 ${isDark
                      ? 'bg-purple-900/30 border-purple-600/30 text-purple-200'
                      : 'bg-purple-100/80 border-purple-300/50 text-purple-800'}`}
                  >
                    {tag}
                  </span>
                ))}
                {remainingTagsCount > 0 && (
                  <span className={`border text-[8px] sm:text-[9px] px-1.5 sm:px-2 py-0.5 rounded-full font-medium ${isDark
                    ? 'bg-gray-800/60 border-gray-600/30 text-gray-300'
                    : 'bg-gray-200/80 border-gray-400/30 text-gray-700'}`}>
                    +{remainingTagsCount}
                  </span>
                )}
              </div>
            </div>

            {/* Read Now Button */}
            <button className={`w-full text-white font-semibold py-2 px-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-1 sm:gap-1.5 group/btn text-sm sm:text-base ${isDark
              ? 'bg-purple-700/40'
              : 'bg-purple-600/80 hover:bg-purple-700/90'}`}>
              <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 transition-transform group-hover/btn:translate-x-0.5" />
              Read Now
            </button>
          </div>
        </div>
      </div>
    </Link>
  );

};

export default memo(SearchMangaCard);