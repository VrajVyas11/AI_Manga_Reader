'use client';
import React from 'react';
import { BookOpenCheck, Eye } from 'lucide-react';
import { useTheme } from "@/app/providers/ThemeContext";


const SkeletonShimmer = ({ className = '' }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <div
      className={`bg-gradient-to-r ${
        isDark
          ? 'from-gray-800 via-gray-700 to-gray-800'
          : 'from-gray-400/70 via-gray-300/70 to-gray-300/50'
      } bg-[length:200%_100%] animate-pulse ${className}`}
    />
  );
};

const MangaReadHistorySkeleton = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="w-[calc(100%-12px)] mx-2 md:ml-2 md:px-6 mb-6">
      {/* Header */}
      <div className="flex mb-7 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`${isDark ? 'bg-white/10' : 'bg-gray-200/50'} p-3 rounded-lg`}>
            <BookOpenCheck className={`w-6 h-6 ${isDark ? 'text-cyan-300' : 'text-cyan-600'} drop-shadow-md`} />
          </div>
          <div className="leading-5 sm:leading-normal mt-1 sm:mt-0">
            <SkeletonShimmer className="h-5 w-32 rounded" />
            <SkeletonShimmer className="h-3 w-24 rounded mt-1" />
          </div>
        </div>
        <div
          className={`flex items-center gap-1.5 px-3 py-3.5 rounded-md text-transparent border animate-pulse ${
            isDark ? 'bg-gray-700/50 border-gray-700/50' : 'bg-gray-200/50 border-gray-300/50'
          }`}
        >
          <Eye className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
          <SkeletonShimmer className="h-3 w-12 rounded" />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {/* Desktop & Tablet View */}
        <div className="hidden sm:block space-y-3">
          {[...Array(2)].map((_, index) => (
            <div
              key={index}
              className={`relative rounded-xl border ${
                isDark ? 'border-white/10 bg-gray-900/50' : 'border-gray-300/50 bg-gray-100/80'
              } backdrop-blur-sm overflow-hidden animate-pulse`}
            >
              <div className="relative flex items-center p-2 gap-3">
                {/* Manga Cover */}
                <div className="relative w-20 h-24 rounded-md overflow-hidden">
                  <SkeletonShimmer className="w-full h-full" />
                </div>
                {/* Manga Info */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex flex-row gap-3 w-full items-center justify-between">
                    <div className="flex flex-col w-full items-start justify-between space-y-2">
                      <SkeletonShimmer className="h-4 w-40 rounded" />
                      <div className="flex items-center gap-2">
                        <SkeletonShimmer className="h-3 w-20 rounded" />
                        <div
                          className={`w-1 h-1 rounded-full ${
                            isDark ? 'bg-gray-600' : 'bg-gray-500'
                          }`}
                        />
                        <SkeletonShimmer className="h-3 w-16 rounded" />
                      </div>
                    </div>
                    <div
                      className={`w-20 h-10 rounded-lg border ${
                        isDark ? 'bg-gray-700/50 border-white/10' : 'bg-gray-200/50 border-gray-300/50'
                      }`}
                    />
                  </div>
                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <SkeletonShimmer className="h-3 w-24 rounded" />
                      <SkeletonShimmer className="h-3 w-12 rounded" />
                    </div>
                    <div
                      className={`w-full rounded-full h-1.5 overflow-hidden ${
                        isDark ? 'bg-gray-700/50' : 'bg-gray-200/50'
                      }`}
                    >
                      <div
                        className={`h-full rounded-full w-1/2 animate-pulse ${
                          isDark ? 'bg-gray-200/30' : 'bg-gray-400/30'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View: Only cover image and title */}
        <div className="flex sm:hidden gap-2 overflow-x-auto pb-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="flex-shrink-0 w-24 animate-pulse">
              <div
                className={`relative w-24 h-32 border rounded ${
                  isDark ? 'border-white/30 bg-gray-700/50' : 'border-gray-300/50 bg-gray-200/50'
                }`}
              />
              <SkeletonShimmer className="h-3 w-20 rounded mt-2 mx-auto" />
            </div>
          ))}
        </div>

        {/* Expand/Collapse Button Placeholder */}
        <div
          className={`w-full hidden sm:flex items-center justify-center gap-2 py-2.5 rounded-lg animate-pulse ${
            isDark ? 'bg-gray-700/50' : 'bg-gray-200/50'
          }`}
        >
          <SkeletonShimmer
            className={`h-4 w-4 rounded ${isDark ? 'bg-gray-600' : 'bg-gray-500'}`}
          />
          <SkeletonShimmer
            className={`h-4 w-20 rounded ${isDark ? 'bg-gray-600' : 'bg-gray-500'}`}
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(MangaReadHistorySkeleton);