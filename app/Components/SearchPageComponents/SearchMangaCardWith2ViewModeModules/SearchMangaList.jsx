import React, { memo, lazy } from "react";
import Image from "next/image";
import { Heart, MessageSquareText, Bookmark, Star } from "lucide-react";
import useInView from "@/app/hooks/useInView";

const StableFlag = memo(lazy(() => import("../../StableFlag")));

function SearchMangaList({
  formatCount,
  manga,
  handleMangaClicked,
  timeSinceUpdate,
  isDark = true,
}) {
  const getStatusColor = (status) => {
    const colors = {
      ongoing: "bg-green-500",
      completed: "bg-blue-500",
      hiatus: "bg-yellow-500",
      cancelled: "bg-red-500",
    };
    return colors[status] || "bg-gray-500";
  };

  const getContentRatingColor = (rating) => {
    const colors = {
      safe: "bg-green-600",
      suggestive: "bg-yellow-600",
      erotica: "bg-orange-600",
      pornographic: "bg-red-600",
    };
    return colors[rating] || "bg-gray-600";
  };
  const [ref, inView] = useInView(0.1)
  return (
<article
  ref={ref}
  className={`overflow-x-hidden border transition-opacity duration-500 rounded-lg p-2 cursor-pointer hover:shadow-lg transform
    ${inView
      ? "opacity-100 translate-y-0 transition-transform"
      : "opacity-0 translate-y-10 transition-transform"
    }
    ${isDark
      ? "bg-gray-950 hover:bg-gray-850 border-gray-800 hover:border-gray-700"
      : "bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300 shadow-[0px_0px_6px_rgba(0,0,0,0.4)] shadow-gray-300"
    }
  `}
  onClick={handleMangaClicked}
  role="button"
  aria-label={`Open manga ${manga.title}`}
>
      <div className="flex gap-2 md:gap-4 ">
        {/* Cover Image */}
        <div className="relative flex-shrink-0">
          <Image
            src={manga.coverImageUrl || "/placeholder.jpg"}
            width={64}
            height={80}
            alt={`${manga.title} cover`}
            className="md:w-28 w-20 h-30 md:h-40 object-cover rounded-md"
            loading="lazy"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 p-2 pl-1 pb-0">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row  items-start justify-between gap-3 mb-2">
            <div className="flex flex-row gap-3 justify-center items-center">

              <div className="flex-1 flex flex-col gap-1 -mt-1.5 md:mt-0 md:gap-0 min-w-0">
                <h3 className={`items-start  md:items-center max-w-[90%] md:max-w-full   md:whitespace-nowrap font-semibold gap-3 text-lg leading-tight truncate flex flex-row ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {/* Language Flag */}

                  <StableFlag
                    code={manga.originalLanguage || "UN"}
                    className="w-6 mt-0.5  md:-mt-0.5 h-auto  shadow-[0px_0px_2px_rgba(0,0,0,0.4)]"
                  />

                  {manga.title.length > 30 ? manga.title.slice(0, 30) + "..." : manga.title}
                </h3>
                <p className={`block text-xs md:text-sm mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {manga.artistName?.[0]?.attributes?.name || "Unknown Author"}
                  {manga.year && (
                    <span className={`ml-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>• {manga.year}</span>
                  )}
                  {/* Tags and Update Time */}
                  <span className={`ml-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                    • Updated {timeSinceUpdate(manga.updatedAt)}
                  </span>
                </p>
                <div className={`flex md:hidden items-center gap-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    <span>{manga.rating?.rating.bayesian.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{manga.rating?.follows ? formatCount(manga.rating.follows) : "0"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquareText className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>
                      {manga.rating?.comments?.repliesCount
                        ? formatCount(manga.rating.comments.repliesCount)
                        : "0"}
                    </span>
                  </div>
                  <div className="items-center md:hidden flex gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${getStatusColor(manga.status)}`}
                    />
                    <span className={`text-xs font-medium capitalize ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {manga.status}
                    </span>
                  </div>
                </div>
              </div>

            </div>
            {/* Stats */}
            <div className={`md:flex hidden items-center gap-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4" />
                <span>{manga.rating?.rating.bayesian.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{manga.rating?.follows ? formatCount(manga.rating.follows) : "0"}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquareText className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>
                  {manga.rating?.comments?.repliesCount
                    ? formatCount(manga.rating.comments.repliesCount)
                    : "0"}
                </span>
              </div>
              <div className="items-center md:hidden flex gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${getStatusColor(manga.status)}`}
                />
                <span className={`text-sm font-medium capitalize ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {manga.status}
                </span>
              </div>
            </div>
          </div>

          {/* Status and Stats Row */}
          <div className="flex items-center justify-between gap-4 mb-2">
            <div className="flex flex-wrap gap-1 flex-1 min-w-0">
              {/* Content Rating Badge */}
              <span
                className={`${getContentRatingColor(
                  manga.contentRating
                )}  text-white ${isDark?"bg-opacity-55":""} text-[10px] md:text-xs px-1.5  md:px-2 py-1 capitalize rounded-md truncate`}
              >
                {manga.contentRating === "pornographic" ? "18+" : manga.contentRating}
              </span>

              {manga.flatTags?.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className={`text-[10px] md:text-xs px-1.5  md:px-2 py-1 rounded-md truncate ${isDark
                    ? 'bg-gray-800 text-gray-300'
                    : 'bg-gray-100 text-gray-700'}`}
                  title={tag}
                >
                  {tag}
                </span>
              ))}
              {manga.flatTags?.length > 3 && (
                <span className={`text-xs px-2 py-1 rounded-md ${isDark
                  ? 'bg-gray-700 text-gray-300'
                  : 'bg-gray-200 text-gray-700'}`}>
                  +{manga.flatTags.length - 3}
                </span>
              )}
            </div>
            {/* Status */}
            <div className="items-center hidden md:flex gap-2">
              <div
                className={`w-2 h-2 rounded-full ${getStatusColor(manga.status)}`}
              />
              <span className={`text-sm font-medium capitalize ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {manga.status}
              </span>
            </div>

          </div>
          {/* Description */}
          <p className={`text-sm  mb-2 hidden md:block leading-normal ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <span className="line-clamp-3">{manga.description || "No description available"}</span>
          </p>
        </div>

      </div>
      {/* Mobile Description */}
      <p className={`mt-2 px-1 md:hidden text-sm line-clamp-3  leading-normal ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        {manga.description || "No description available"}
      </p>
    </article>
  );
}

export default memo(SearchMangaList);