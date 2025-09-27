'use client';

import { useTheme } from '@/app/providers/ThemeContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SkeletonShimmer = ({ className = '' }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
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

export default function SliderComponentSkeleton() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      className={`relative w-full min-h-[50vh] sm:h-[60vh] border-b-[16px] ${isDark ? 'border-black bg-black/60' : 'border-white bg-white/60'} overflow-hidden`}
    >
      <div className="absolute top-0 left-0 right-0 h-1 z-50 bg-gray-800">
        <SkeletonShimmer className="h-full w-full" />
      </div>

      <div className="absolute inset-0 flex flex-col lg:flex-row">
        <div className="relative w-full lg:w-[73%] h-full overflow-hidden">
          <SkeletonShimmer className="absolute inset-0 bg-cover bg-center filter blur-lg opacity-30" />

          {isDark && (
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/60 sm:to-transparent z-10" />
          )}

          <div className="absolute bottom-1 left-0 right-0 flex items-center justify-center z-40 lg:hidden">
            <div className="flex space-x-3 items-center px-4 py-2 rounded-full">
              <div
                className={`w-8 h-8 ${isDark ? 'bg-white/10' : 'bg-black/10'} border ${isDark ? 'border-white/10' : 'border-black/10'} rounded-full flex items-center justify-center ${isDark ? 'text-white' : 'text-black'} mr-2`}
              >
                <ChevronLeft size={16} />
              </div>
              <div className="flex space-x-2 items-center">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-white w-3' : isDark ? 'bg-white/40' : 'bg-black/40'} transition-all duration-300`}
                  />
                ))}
              </div>
              <div
                className={`w-8 h-8 ${isDark ? 'bg-white/10' : 'bg-black/10'} border ${isDark ? 'border-white/10' : 'border-black/10'} rounded-full flex items-center justify-center ${isDark ? 'text-white' : 'text-black'} ml-2`}
              >
                <ChevronRight size={16} />
              </div>
            </div>
          </div>

          <div className="relative h-full mt-3 md:-mt-5 z-20 md:px-7 lg:px-0 flex items-center justify-between">
            <div className="w-[75%] lg:w-4/5 px-8 pl-6 lg:px-16 lg:pl-24 pt-12 pb-32 sm:py-12">
              <div
                className={`inline-flex items-center px-3 py-2 mb-4 lg:mb-6 rounded-full border bg-black/5 backdrop-blur-sm ${isDark ? 'border-white/30' : 'border-black/30'}`}
              >
                <SkeletonShimmer className="h-5 w-5 rounded-full ml-2"/>
                <SkeletonShimmer className="h-3 w-16 rounded ml-2" />
              </div>
              <h1
                className={`text-xl sm:text-3xl lg:text-5xl font-bold mb-4 lg:mb-6 leading-tight transition-all duration-0 ${isDark ? 'text-white' : 'text-black'}`}
              >
                <span className="block relative">
                  <SkeletonShimmer className="h-8 sm:h-12 lg:h-16 w-full max-w-md rounded relative line-clamp-1 xl:line-clamp-none z-10" />
                  <div className="absolute -bottom-2 lg:-bottom-3 left-0 h-2 lg:h-3 w-16 lg:w-24 bg-purple-800 z-0" />
                </span>
              </h1>
              <div className={`text-[11px] line-clamp-3 sm:text-sm lg:text-base mb-6 lg:mb-8 max-w-xl lg:max-w-2xl transition-all duration-0 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                <SkeletonShimmer className="h-4 w-full rounded mb-2" />
                <SkeletonShimmer className="h-4 w-4/5 rounded mb-2" />
                <SkeletonShimmer className="h-4 w-3/4 rounded" />
              </div>
              <div className="flex flex-wrap gap-3 lg:gap-4">
                <SkeletonShimmer
                  className={`px-3 lg:px-6 py-2 lg:py-3 w-32  font-medium rounded-sm transition-colors duration-0 text-[11px] sm:text-sm lg:text-base inline-block `}
                />


                <SkeletonShimmer
                  className={`px-3 lg:px-6 py-2 lg:py-3 w-44 h-9 rounded-sm transition-colors duration-0 text-[11px] sm:text-sm lg:text-base `}
                />

              </div>
            </div>
            <div className="absolute top-[55px] right-6 md:top-[85px] md:right-10 lg:right-3 w-[100px] h-40 md:h-60 md:w-[170px] lg:hidden z-30 transition-all duration-500 block">
              <div className={`relative w-full h-full overflow-hidden rounded-sm`}>
                <SkeletonShimmer className="w-full object-fill h-full block" />
                <div className="absolute z-50 inset-0 bg-gradient-to-r [box-shadow:inset_0_0_20px_10px_rgba(20,20,20,1)] pointer-events-none" />
              </div>
            </div>
            <div className="hidden lg:block lg:w-2/5 h-full relative">
              <div className="absolute top-1/2 -translate-y-[44%] right-10 w-48 h-[280px] xl:right-16 xl:w-64 xl:h-[360px] z-30 transition-all duration-500 block">
                <div className={`relative w-full h-full overflow-hidden rounded-sm`}>
                  <SkeletonShimmer className="w-full h-full object-cover rounded-sm block" />
                  <div className="absolute inset-0 rounded-sm bg-gradient-to-tr from-transparent via-white to-transparent opacity-20 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`relative w-full lg:w-[27%] h-full backdrop-blur-sm hidden lg:flex flex-col ${isDark ? 'bg-black/80' : 'bg-white/80'}`}>
          <div className={`h-24 border-b py-3 px-8 flex items-center justify-between ${isDark ? 'border-gray-700/0' : 'border-gray-300/50'}`}>
            <div
              className={`flex items-center gap-3 transition-colors duration-0 ${isDark ? 'text-white/70' : 'text-black/70'}`}
            >
              <span className={`w-8 h-8 flex items-center justify-center rounded-full border transition-colors duration-0 ${isDark ? 'border-white/30 bg-black/50' : 'border-black/30 bg-white/50'}`}>
                <ChevronLeft size={18} />
              </span>
              <span className="hidden sm:block uppercase text-[11px] tracking-widest">Prev</span>
            </div>
            <div className="text-center flex flex-col">
              <SkeletonShimmer className={`h-3 w-8 rounded mx-auto mb-1 ${isDark ? "text-white/50" : "text-black/50"}`} />
              <SkeletonShimmer className={`h-3 w-24 rounded mx-auto ${isDark ? "text-white/30" : "text-black/30"}`} />
            </div>
            <div
              className={`flex items-center gap-3 transition-colors duration-0 ${isDark ? 'text-white/70' : 'text-black/70'}`}
            >
              <span className="hidden sm:block uppercase text-[11px] tracking-widest">Next</span>
              <span className={`w-8 h-8 flex items-center justify-center rounded-full border transition-colors duration-0 ${isDark ? 'border-white/30 bg-black/50' : 'border-black/30 bg-white/50'}`}>
                <ChevronRight size={18} />
              </span>
            </div>
          </div>

          <div className="flex-grow p-6 pt-3 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(0,0,0,0.6) rgba(0,0,0,0.1)' }}>
            <SkeletonShimmer className={`h-4 w-32 rounded uppercase text-xs tracking-widest mb-3 ${isDark ? "text-white/50" : "text-black/50"}`} />
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className={`relative cursor-pointer transition-all duration-150 ${index === 0 ? 'ring-2 ring-black' : isDark ? 'opacity-70' : ''}`}
                >
                  <div className="w-full aspect-[2/3] overflow-hidden rounded-sm">
                    <div
                      className={`relative w-full h-full overflow-hidden rounded-sm will-change-transform`}
                    >
                      <SkeletonShimmer className="w-full h-full object-cover block" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent pointer-events-none" />
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <div className="flex items-center mb-1">
                      <SkeletonShimmer className="h-5 w-5 rounded-full ml-2" />
                      <SkeletonShimmer className="h-3 w-8 rounded ml-2" />
                    </div>
                    <SkeletonShimmer className={`h-4 w-24 rounded ${isDark ? 'text-white' : 'text-black'}`} />
                  </div>

                  {index === 0 && (
                    <div className="absolute top-2 right-2 w-4 h-4 bg-black rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-40 hidden lg:block">
        <div
          className={`w-12 h-12 mb-3 rounded-full flex items-center justify-center transition-colors duration-0 border hover:bg-white hover:text-black hover:border-white ${isDark ? 'bg-black/50 border-white/10 text-white' : 'bg-white/50 border-black/10 text-black'}`}
        >
          <ChevronLeft size={20} />
        </div>
        <div className="relative w-1 h-40 bg-white/20 rounded-full overflow-hidden">
          <SkeletonShimmer className="absolute top-0 left-0 right-0 bg-black h-1/4" />
        </div>
      </div>
    </div>
  );
}