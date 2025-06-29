import React, { memo } from "react";
import { Star } from "lucide-react";


function SearchMangaListSkeleton() {
  const getStatusColor = () => "bg-gray-500";
  const getContentRatingColor = () => "bg-gray-600";

  // Helper to render gray block placeholders
  const Placeholder = ({ className }) => (
    <div className={`bg-gray-800 rounded ${className}`} />
  );

  return (
    <article
      className="bg-gray-900 overflow-x-hidden border border-gray-800 animate-pulse  rounded-lg p-2 cursor-default select-none"
      aria-label="Loading manga card skeleton"
    >
      <div className="flex gap-2 md:gap-4">
        {/* Cover Image Placeholder */}
        <div className="relative flex-shrink-0">
          <Placeholder className="md:w-28 w-20 h-30 md:h-40 rounded-md" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 p-2 pl-1 pb-0">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row items-start justify-between gap-3 mb-2">
            <div className="flex flex-row gap-3 justify-center items-center w-full">
              <div className="flex-1 flex flex-col gap-1 -mt-1.5 md:mt-0 md:gap-0 min-w-0">
                <h3 className="flex items-center gap-2 max-w-[90%] md:max-w-full md:whitespace-nowrap font-semibold text-lg leading-tight truncate">
                  {/* Flag placeholder */}
                  <div className="w-6 h-4 bg-gray-700 rounded shadow-md" />
                  {/* Title placeholder */}
                  <Placeholder className="h-5 w-40 rounded" />
                </h3>
                <div className="text-gray-400  text-xs md:text-sm mt-0.5 flex flex-wrap gap-2">
                  <Placeholder className="h-3 w-24 rounded" />
                  <Placeholder className="h-3 w-12 rounded" />
                  <Placeholder className="h-3 w-20 rounded" />
                </div>

                {/* Mobile stats */}
                <div className="flex md:hidden items-center gap-4 text-gray-400 text-sm mt-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-gray-600" />
                      <Placeholder className="h-4 w-6 rounded" />
                    </div>
                  ))}
                  <div className="items-center flex gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${getStatusColor()}`}
                    />
                    <Placeholder className="h-4 w-16 rounded" />
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop stats */}
            <div className="md:flex hidden items-center gap-4 text-gray-400 text-sm">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-gray-600" />
                  <Placeholder className="h-4 w-6 rounded" />
                </div>
              ))}
              <div className="items-center hidden md:flex gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${getStatusColor()}`}
                />
                <Placeholder className="h-4 w-16 rounded" />
              </div>
            </div>
          </div>

          {/* Status and Tags Row */}
          <div className="flex items-center justify-between gap-4 mb-2">
            <div className="flex flex-wrap gap-1 flex-1 min-w-0">
              <span
                className={`${getContentRatingColor()} text-white bg-opacity-55 text-[10px] md:text-xs px-1.5 md:px-2 py-1 capitalize rounded-md truncate`}
              >
                {/* Empty content rating */}
              </span>
              {[...Array(3)].map((_, i) => (
                <span
                  key={i}
                  className="bg-gray-800 text-gray-300 text-[10px] md:text-xs px-1.5 md:px-2 py-1 rounded-md truncate"
                >
                  {/* Empty tag */}
                </span>
              ))}
              <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-md">
                {/* +N tags */}
              </span>
            </div>
            <div className="items-center hidden md:flex gap-2">
              <div
                className={`w-2 h-2 rounded-full ${getStatusColor()}`}
              />
              <Placeholder className="h-4 w-16 rounded" />
            </div>
          </div>

          {/* Description */}
          <div className="text-gray-400 text-sm mb-2 hidden md:block leading-normal">
            <Placeholder className="h-12 w-full rounded" />
          </div>
        </div>
      </div>

      {/* Mobile Description */}
      <div className="text-gray-400 mt-2 px-1 md:hidden text-sm leading-normal line-clamp-3">
        <Placeholder className="h-12 w-full rounded" />
      </div>
    </article>
  );
}

export default memo(SearchMangaListSkeleton);