'use client';
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from "@/app/providers/ThemeContext";

const SkeletonShimmer = ({ className = '' }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <div
      className={`bg-gradient-to-r ${
        isDark
          ? 'from-gray-800 via-gray-700 to-gray-800'
          : 'from-gray-400/70 via-gray-400/70 to-gray-300/50'
      } bg-[length:200%_100%] animate-pulse ${className}`}
    />
  );
};

const SliderComponentSkeleton = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const thumbnailCount = 8;

  if(!theme) return null

  return (
    <div
      className={`relative w-full min-h-[59vh] sm:h-[60vh] border-b-[16px] overflow-hidden select-none ${
        isDark ? 'border-black/10 bg-black/60' : 'border-gray-300/10 bg-gray-100/80'
      }`}
    >
      {/* Background noise texture */}
      <div
        className={`absolute inset-0 opacity-20 bg-[url('data:image/svg+xml,%3Csvg%20viewBox%3D%270%200%20200%20200%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%3E%3Cfilter%20id%3D%27noiseFilter%27%3E%3CfeTurbulence%20type%3D%27fractalNoise%27%20baseFrequency%3D%270.65%27%20numOctaves%3D%273%27%20stitchTiles%3D%27stitch%27%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%27100%25%27%20height%3D%27100%25%27%20filter%3D%27url%28%23noiseFilter%29%27%2F%3E%3C%2Fsvg%3E')] ${
          isDark ? 'opacity-20' : 'opacity-30'
        }`}
      ></div>

      {/* Progress Timeline */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 z-50 ${
          isDark ? 'bg-gray-800' : 'bg-gray-200'
        }`}
      >
        <SkeletonShimmer className="h-full w-full" />
      </div>

      {/* Main Content Area */}
      <div className="absolute inset-0 flex flex-col md:flex-row">
        {/* Left Panel - Feature Display */}
        <div className="relative w-full md:w-[73%] h-full overflow-hidden">
          {/* Blurred background skeleton */}
          <SkeletonShimmer className="absolute inset-0 blur-md opacity-30" />
          {/* Gradient overlay */}
          <div
            className={`absolute inset-0 z-10 ${
              isDark
                ? 'bg-gradient-to-r from-black via-black/80 to-black/60 sm:to-transparent'
                : 'bg-gradient-to-r from-gray-100/80 via-gray-100/60 to-gray-100/40 sm:to-transparent'
            }`}
          />

          {/* Mobile Navigation Controls */}
          <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center z-40 md:hidden">
            <div
              className={`flex space-x-3 items-center px-4 py-2 rounded-full backdrop-blur-sm ${
                isDark ? 'bg-black/40' : 'bg-gray-200/40'
              }`}
            >
              <button
                disabled
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white cursor-not-allowed ${
                  isDark ? 'bg-black/50 border-white/10' : 'bg-gray-300/50 border-gray-300/50'
                } border`}
              >
                <ChevronLeft size={16} />
              </button>
              <div className="flex space-x-2 items-center">
                {Array.from({ length: thumbnailCount }).map((_, i) => (
                  <SkeletonShimmer
                    key={i}
                    className={`rounded-full ${i === 0 ? 'w-3 h-3' : 'w-2 h-2'}`}
                  />
                ))}
              </div>
              <button
                disabled
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white cursor-not-allowed ${
                  isDark ? 'bg-black/50 border-white/10' : 'bg-gray-300/50 border-gray-300/50'
                } border`}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Content Container */}
          <div className="relative h-full z-20 flex items-center justify-between">
            <div className="w-[75%] md:w-4/5 px-6 md:px-16 md:pl-24 pt-12 pb-32 sm:py-12">
              {/* Language badge */}
              <div
                className={`inline-flex items-center px-3 py-1 mb-4 md:mb-6 rounded-full border backdrop-blur-sm ${
                  isDark ? 'border-purple-600/30 bg-black/30' : 'border-purple-500/30 bg-gray-200/30'
                }`}
              >
                <SkeletonShimmer className="w-6 h-6 rounded-full mr-2" />
                <SkeletonShimmer className="h-4 w-16 rounded" />
              </div>

              {/* Title */}
              <div className="mb-4 md:mb-6">
                <SkeletonShimmer className="h-10 sm:h-14 md:h-20 w-full max-w-[600px] rounded" />
              </div>

              {/* Description */}
              <div className="mb-6 md:mb-8 max-w-xl md:max-w-2xl">
                <SkeletonShimmer className="h-4 sm:h-6 rounded mb-2 w-full" />
                <SkeletonShimmer className="h-4 sm:h-6 rounded mb-2 w-[90%]" />
                <SkeletonShimmer className="h-4 sm:h-6 rounded w-[80%]" />
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap gap-3 md:gap-4">
                <SkeletonShimmer className="h-10 md:h-12 w-28 md:w-40 rounded" />
                <SkeletonShimmer className="h-10 md:h-12 w-36 rounded" />
              </div>
            </div>

            {/* Mobile cover image */}
            <div
              className="absolute top-[70px] right-3 w-24 h-44 md:hidden z-30 rounded-sm overflow-hidden"
              style={{
                boxShadow: isDark
                  ? '0 20px 40px rgba(0,0,0,0.5), 0 0 30px rgba(0,0,0,0.3)'
                  : '0 20px 40px rgba(0,0,0,0.2), 0 0 30px rgba(0,0,0,0.1)',
              }}
            >
              <SkeletonShimmer className="w-full h-full rounded-sm" />
              <div
                className={`absolute inset-0 rounded-sm ${
                  isDark
                    ? 'bg-gradient-to-r from-transparent via-white to-transparent opacity-20'
                    : 'bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-30'
                }`}
              />
            </div>

            {/* Desktop cover image */}
            <div className="hidden md:block md:w-2/5 h-full relative">
              <div
                className="absolute top-1/2 -translate-y-1/2 right-16 w-64 h-[360px] z-30 rounded-sm overflow-hidden"
                style={{
                  boxShadow: isDark
                    ? '0 20px 40px rgba(0,0,0,0.5), 0 0 30px rgba(0,0,0,0.3)'
                    : '0 20px 40px rgba(0,0,0,0.2), 0 0 30px rgba(0,0,0,0.1)',
                }}
              >
                <SkeletonShimmer className="w-full h-full rounded-sm" />
                <div
                  className={`absolute inset-0 rounded-sm ${
                    isDark
                      ? 'bg-gradient-to-tr from-transparent via-white to-transparent opacity-20'
                      : 'bg-gradient-to-tr from-transparent via-gray-300 to-transparent opacity-30'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Navigation & Thumbnails */}
        <div
          className={`relative w-full md:w-[27%] h-full backdrop-blur-sm hidden md:flex flex-col ${
            isDark ? 'bg-black/80' : 'bg-gray-100/80'
          }`}
        >
          {/* Top navigation */}
          <div
            className={`h-24 py-3 flex items-center justify-between px-8 ${
              isDark ? 'border-b border-white/10' : 'border-b border-gray-300/50'
            }`}
          >
            <button
              disabled
              className={`flex items-center gap-3 cursor-not-allowed ${
                isDark ? 'text-white/30' : 'text-gray-600/50'
              }`}
            >
              <span
                className={`w-8 h-8 flex items-center justify-center border rounded-full ${
                  isDark ? 'border-white/10' : 'border-gray-300/50'
                }`}
              >
                <ChevronLeft size={18} />
              </span>
              <span className="hidden sm:block uppercase text-[11px] tracking-widest">
                Prev
              </span>
            </button>
            <div className="text-center">
              <SkeletonShimmer className="h-4 w-12 rounded mx-auto mb-1" />
              <SkeletonShimmer className="h-3 w-20 rounded mx-auto" />
            </div>
            <button
              disabled
              className={`flex items-center gap-3 cursor-not-allowed ${
                isDark ? 'text-white/30' : 'text-gray-600/50'
              }`}
            >
              <span className="hidden sm:block uppercase text-[11px] tracking-widest">
                Next
              </span>
              <span
                className={`w-8 h-8 flex items-center justify-center border rounded-full ${
                  isDark ? 'border-white/10' : 'border-gray-300/50'
                }`}
              >
                <ChevronRight size={18} />
              </span>
            </button>
          </div>

          {/* Thumbnails scroll area */}
          <div
            className="flex-grow p-6 pt-3 overflow-y-auto"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: isDark
                ? 'rgba(155, 89, 182, 0.6) rgba(0, 0, 0, 0.1)'
                : 'rgba(139, 92, 246, 0.6) rgba(0, 0, 0, 0.05)',
            }}
          >
            <h3
              className={`uppercase text-xs tracking-widest mb-3 ${
                isDark ? 'text-white/50' : 'text-gray-600/50'
              }`}
            >
              Discover More
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: thumbnailCount }).map((_, index) => (
                <div
                  key={index}
                  className={`relative cursor-default transition-all duration-300 ${
                    index === 0
                      ? isDark
                        ? 'ring-2 ring-purple-600'
                        : 'ring-2 ring-purple-500'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <div
                    className={`w-full aspect-[2/3] overflow-hidden rounded-sm ${
                      isDark ? 'bg-gray-700' : 'bg-gray-200'
                    }`}
                  >
                    <SkeletonShimmer className="w-full h-full object-cover" />
                    <div
                      className={`absolute inset-0 ${
                        isDark
                          ? 'bg-gradient-to-t from-black via-black/30 to-transparent'
                          : 'bg-gradient-to-t from-gray-100 via-gray-100/30 to-transparent'
                      }`}
                    />
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <div className="flex items-center mb-1 space-x-2">
                      <SkeletonShimmer className="w-5 h-5 rounded-full" />
                      <SkeletonShimmer className="h-3 w-10 rounded" />
                    </div>
                    <SkeletonShimmer className="h-4 w-24 rounded" />
                  </div>

                  {index === 0 && (
                    <div
                      className={`absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center ${
                        isDark ? 'bg-purple-600' : 'bg-purple-500'
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          isDark ? 'bg-gray-300' : 'bg-gray-400'
                        }`}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Side Indicators */}
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-40 hidden md:block">
        <button
          disabled
          className={`w-12 h-12 mb-3 rounded-full flex items-center justify-center text-white cursor-not-allowed ${
            isDark ? 'bg-black/50 border-white/10' : 'bg-gray-200/50 border-gray-300/50'
          } backdrop-blur-sm border`}
        >
          <ChevronLeft size={20} />
        </button>
        <div
          className={`relative w-1 h-40 rounded-full overflow-hidden ${
            isDark ? 'bg-white/20' : 'bg-gray-300/30'
          }`}
        >
          <SkeletonShimmer className="absolute top-0 left-0 right-0 h-full" />
        </div>
      </div>
    </div>
  );
};

export default React.memo(SliderComponentSkeleton);