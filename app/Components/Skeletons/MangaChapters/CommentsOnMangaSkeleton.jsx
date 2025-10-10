/* eslint-disable @next/next/no-img-element */
'use client';

import React from "react";
import {
  MessageCircle,
  ExternalLink,
  Clock,
  Heart,
  MessageSquare,
  Calendar,
  Flame,
  Users,
  Loader2,
  CircleFadingArrowUp,
} from "lucide-react";

const SkeletonShimmer = ({ className = '', isDark }) => {
  return (
    <div
      className={`bg-gradient-to-r ${
        isDark
          ? 'from-gray-800 via-gray-700 to-gray-800'
          : 'from-gray-400/70 via-gray-400/50 to-gray-400/70'
      } bg-[length:200%_100%] animate-pulse ${className}`}
    />
  );
};

const CommentsOnMangaSkeleton = ({ isDark = true }) => {
  // Transition class for smooth color/background changes
  const transitionClass = "transition-colors duration-0 ease-in-out";

  return (
    <div className={`${transitionClass} max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 pb-8 ${isDark ? "" : "bg-white text-black"}`}>
      {/* Comments container */}
      <div
        className={isDark ? "pb-4 sm:pb-6 rounded-3xl" : "pb-4 sm:pb-6 rounded-3xl bg-white"}
        aria-label="Comments container"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6 px-0 sm:px-6 sm:pl-1">
          <div className="flex items-center gap-x-3 sm:gap-x-4">
            <div className="relative">
              <div
                className={isDark ? "w-12 h-12 sm:w-14 sm:h-14 bg-gray-800 rounded-lg flex items-center justify-center shadow-md shadow-black/50" : "w-12 h-12 sm:w-14 sm:h-14 bg-gray-200 rounded-lg flex items-center justify-center shadow-md shadow-gray-300"}
              >
                <MessageCircle
                  className={isDark ? "w-7 h-7 sm:w-8 sm:h-8 text-gray-300" : "w-7 h-7 sm:w-8 sm:h-8 text-gray-700"}
                />
              </div>
              <div
                className={isDark ? "absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-600 rounded-full border-2 border-gray-900 flex items-center justify-center animate-pulse" : "absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-400 rounded-full border-2 border-white flex items-center justify-center animate-pulse"}
              >
                <div
                  className={isDark ? "w-1.5 h-1.5 bg-white rounded-full" : "w-1.5 h-1.5 bg-green-900 rounded-full"}
                ></div>
              </div>
            </div>

            <div className="space-y-1">
              <h1
                className={isDark ? "text-xl sm:text-2xl font-extrabold text-gray-100" : "text-xl sm:text-2xl font-extrabold text-gray-900"}
              >
                COMMUNITY
              </h1>
              <div
                className={isDark ? "flex items-center space-x-1.5 sm:space-x-2 text-white text-xs uppercase tracking-wider" : "flex items-center space-x-1.5 sm:space-x-2 text-gray-700 text-xs uppercase tracking-wider"}
              >
                <Flame
                  className={isDark ? "w-3 h-3 md:w-4 md:h-4 text-amber-500" : "w-3 h-3 md:w-4 md:h-4 text-amber-600"}
                />
                <span className="text-[10px] sm:text-xs">Join the discussion</span>
              </div>
            </div>
          </div>

          <div
            className={isDark ? "flex items-center w-fit flex-col md:flex-row space-x-1 space-y-1 md:space-y-0 sm:space-x-3 text-gray-300 text-xs sm:text-sm" : "flex items-center w-fit flex-col md:flex-row space-x-1 space-y-1 md:space-y-0 sm:space-x-3 text-gray-700 text-xs sm:text-sm"}
          >
            <div
              className={isDark ? "flex items-center w-full space-x-2 px-3 sm:px-4 py-2 bg-white/10 backdrop-blur-md border border-gray-700 rounded-lg" : "flex items-center w-full space-x-2 px-3 sm:px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg"}
            >
              <Users
                className={isDark ? "w-3 h-3 sm:w-5 sm:h-5 text-purple-300" : "w-3 h-3 sm:w-5 sm:h-5 text-gray-600"}
              />
              <SkeletonShimmer className="font-semibold h-4 w-8 rounded" isDark={isDark} />
              <span className={`${isDark ? "text-white" : "text-black"} hidden md:block text-[11px] sm:text-xs`}>
                voices
              </span>
            </div>

            <div
              className={isDark ? "hidden md:flex items-center  w-full space-x-2 px-3 py-0.5 sm:px-4 sm:py-2 bg-white/10 backdrop-blur-md border border-gray-700 rounded-lg" : "hidden md:flex items-center  w-full space-x-2 px-3 py-0.5 sm:px-4 sm:py-2 bg-gray-100 border border-gray-300 rounded-lg"}
            >
              <span className="font-semibold ">Page </span>
              <SkeletonShimmer className="font-semibold h-4 w-4 rounded" isDark={isDark} />
              <span className={isDark ? "text-white" : "text-gray-700"}>/</span>
              <SkeletonShimmer className="h-4 w-6 rounded" isDark={isDark} />
            </div>
          </div>
        </div>

        {/* Comments Timeline */}
        <div
          className={isDark ? "space-y-4 max-h-[900px] overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-500 [&::-webkit-scrollbar-track]: overflow-auto sm:space-y-6 pr-2" : "space-y-4 max-h-[900px] overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-track]: overflow-auto sm:space-y-6 pr-2"}
        >
          {Array.from({ length: 5 }).map((_, index) => (
            <article
              key={index}
              className={isDark ? "group relative bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl transition-all duration-0 hover:shadow-lg hover:shadow-purple-600/20 transform hover:-translate-y-0.5" : "group relative bg-gray-50 border border-gray-300 rounded-2xl transition-all duration-0 hover:shadow-md hover:shadow-gray-400 transform hover:-translate-y-0.5"}
            >
              <div className="flex absolute right-2 sm:right-3 top-2 sm:top-3 w-fit items-center space-x-1 sm:space-x-2">
                <div
                  className={isDark ? "flex items-center w-full space-x-1.5 sm:space-x-2 px-2 sm:px-3 py-1 sm:py-2 bg-rose-800/10 border border-rose-700 rounded-xl hover:border-rose-600 transition-all duration-0 text-xs sm:text-sm" : "flex items-center w-full space-x-1.5 sm:space-x-2 px-2 sm:px-3 py-1 sm:py-2 bg-rose-200 border border-rose-400 rounded-xl hover:border-rose-600 transition-all duration-0 text-xs sm:text-sm text-rose-700"}
                >
                  <Heart
                    className={isDark ? "w-3 h-3 sm:w-4 sm:h-4 text-rose-600 fill-rose-500" : "w-3 h-3 sm:w-4 sm:h-4 text-rose-600 fill-rose-400"}
                  />
                  <SkeletonShimmer className="text-white font-semibold w-full text-[10px] sm:text-xs h-3 rounded" isDark={isDark} />
                </div>
                <div
                  className={isDark ? "hidden md:flex w-full min-w-fit items-center space-x-1.5 sm:space-x-2 px-2 sm:px-3 py-1 sm:py-2 bg-green-800/10 border border-green-700 rounded-xl hover:border-green-600 transition-all duration-0 text-xs sm:text-sm" : "hidden md:flex w-full min-w-fit items-center space-x-1.5 sm:space-x-2 px-2 sm:px-3 py-1 sm:py-2 bg-green-200 border border-green-400 rounded-xl hover:border-green-600 transition-all duration-0 text-xs sm:text-sm text-green-700"}
                >
                  <CircleFadingArrowUp
                    className={isDark ? "w-3 h-3 sm:w-4 sm:h-4 text-green-400" : "w-3 h-3 sm:w-4 sm:h-4 text-green-600"}
                  />
                  <SkeletonShimmer className="text-white font-semibold w-full text-[10px] sm:text-xs h-3 rounded" isDark={isDark} />
                </div>
              </div>

              <div className="absolute -bottom-2 sm:-bottom-3 right-2 sm:right-3">
                <div
                  className={isDark ? "p-1.5 sm:p-2 text-white hover:text-purple-500 hover:bg-purple-900/30 rounded-xl transition-all duration-0 group" : "p-1.5 sm:p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-200 rounded-xl transition-all duration-0 group"}
                >
                  <ExternalLink
                    className={isDark ? "w-3 h-3 sm:w-4 sm:h-4 group-hover:rotate-12 transition-transform duration-0" : "w-3 h-3 sm:w-4 sm:h-4 group-hover:rotate-12 transition-transform duration-0 text-gray-700"}
                  />
                </div>
              </div>
              <div className="p-4 sm:p-6 relative">
                {/* User Profile Header */}
                <div className="flex items-start space-x-3 sm:space-x-4 mb-4 sm:mb-5">
                  <div className="relative flex-shrink-0">
                    <SkeletonShimmer className={isDark ? "w-10 h-10 sm:w-12 sm:h-12 rounded-xl border-2 border-gray-700 transition-all duration-0 shadow-md" : "w-10 h-10 sm:w-12 sm:h-12 rounded-xl border-2 border-gray-300 transition-all duration-0 shadow-md"} isDark={isDark} />
                    {/* Online Indicator */}
                    <div
                      className={isDark ? "absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-600 rounded-full border-2 border-gray-900 flex items-center justify-center animate-pulse" : "absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-400 rounded-full border-2 border-white flex items-center justify-center animate-pulse"}
                    ></div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 sm:space-x-3 mb-1 sm:mb-2">
                      <SkeletonShimmer className={isDark ? "text-base sm:text-lg font-bold text-gray-100 transition-colors truncate h-5 w-32 rounded" : "text-base sm:text-lg font-bold text-gray-900 transition-colors truncate h-5 w-32 rounded"} isDark={isDark} />
                      <SkeletonShimmer className={isDark ? "px-2 py-0.5 bg-purple-700/30 border border-purple-700 rounded-full text-[10px] sm:text-xs text-purple-400 font-medium h-4 w-16" : "px-2 py-0.5 bg-gray-200 border border-gray-300 rounded-full text-[10px] sm:text-xs text-gray-700 font-medium h-4 w-16 "} isDark={isDark} />
                    </div>

                    <div
                      className={isDark ? "flex items-center space-x-3 sm:space-x-4 text-[10px] sm:text-xs text-white" : "flex items-center space-x-3 sm:space-x-4 text-[10px] sm:text-xs text-gray-700"}
                    >
                      <div className="flex items-center space-x-1 hover:text-gray-500 transition-colors">
                        <Clock
                          className={isDark ? "w-3 h-3" : "w-3 h-3 text-gray-700"}
                        />
                        <SkeletonShimmer className="h-3 w-16 rounded" isDark={isDark} />
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar
                          className={isDark ? "w-3 h-3" : "w-3 h-3 text-gray-700"}
                        />
                        <SkeletonShimmer className="h-3 w-20 rounded" isDark={isDark} />
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageSquare
                          className={isDark ? "w-3 h-3" : "w-3 h-3 text-gray-700"}
                        />
                        <SkeletonShimmer className="h-3 w-16 rounded" isDark={isDark} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comment Content */}
                <div
                  className={isDark ? "space-y-3 sm:space-y-4 text-gray-300 leading-snug ml-12 sm:ml-16 text-xs sm:text-sm" : "space-y-3 sm:space-y-4 text-gray-900 leading-snug ml-12 sm:ml-16 text-xs sm:text-sm"}
                >
                  <SkeletonShimmer className={isDark ? "text-gray-400 text-xs sm:text-sm leading-relaxed h-4 w-full rounded" : "text-gray-700 text-xs sm:text-sm leading-relaxed h-4 w-full rounded"} isDark={isDark} />
                  <SkeletonShimmer className={isDark ? "text-gray-400 text-xs sm:text-sm leading-relaxed h-4 w-3/4 rounded" : "text-gray-700 text-xs sm:text-sm leading-relaxed h-4 w-3/4 rounded"} isDark={isDark} />
                  <SkeletonShimmer className={isDark ? "text-gray-400 text-xs sm:text-sm leading-relaxed h-4 w-1/2 rounded" : "text-gray-700 text-xs sm:text-sm leading-relaxed h-4 w-1/2 rounded"} isDark={isDark} />
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Load More Section Skeleton */}
        <div className="mt-8 sm:mt-12 text-center px-4 sm:px-6">
          <div
            className={isDark ? "group relative px-8 sm:px-10 py-3 sm:py-4 bg-white/5 backdrop-blur-md border border-white/10 text-white font-semibold text-xs sm:text-sm rounded-2xl shadow-md hover:shadow-lg transition-all duration-0 transform hover:scale-105 hover:-translate-y-0.5 overflow-hidden" : "group relative px-8 sm:px-10 py-3 sm:py-4 bg-gray-200 border border-gray-300 text-gray-900 font-semibold text-xs sm:text-sm rounded-2xl shadow-md hover:shadow-md transition-all duration-0 transform hover:scale-105 hover:-translate-y-0.5 overflow-hidden"}
          >
            {/* Animated Background */}
            <div
              className={isDark ? "absolute inset-0 bg-purple-900/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" : "absolute inset-0 bg-gray-300/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"}
            ></div>

            <div className="relative flex items-center justify-center space-x-2 sm:space-x-3">
              <Loader2
                className={isDark ? "w-4 h-4 sm:w-5 sm:h-5 animate-spin" : "w-4 h-4 sm:w-5 sm:h-5 animate-spin text-gray-700"}
              />
              <SkeletonShimmer className="h-4 w-32 rounded" isDark={isDark} />
              <div
                className={isDark ? "px-1.5 py-0.5 bg-white/20 rounded-full text-xs font-semibold" : "px-1.5 py-0.5 bg-gray-300 rounded-full text-xs font-semibold text-gray-900"}
              >
                <SkeletonShimmer className="h-3 w-16 rounded" isDark={isDark} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentsOnMangaSkeleton;