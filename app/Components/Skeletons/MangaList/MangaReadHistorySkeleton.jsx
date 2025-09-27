'use client';

import { useTheme } from "@/app/providers/ThemeContext";
import {
    Layers,
    Activity,
    ArrowBigRightDash,
    ChevronDown,
} from 'lucide-react';

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

export default function MangaReadHistorySkeleton() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="w-[100% -12px] mb-9 xl:mb-6">
      <div className="flex items-center justify-between mb-3 sm:mb-6">
        <div className="flex items-center gap-3">
          <div className={`${isDark ? "bg-white/10" : "bg-gray-200/50"} p-2.5 xl:p-3 rounded-lg`}>
            <Layers
              className={`w-6 h-6 xl:w-7 xl:h-7 ${isDark ? "text-purple-400" : "text-purple-600"} drop-shadow-md`}
            />
          </div>
          <div className="flex-1">
            <SkeletonShimmer className="h-6 xl:h-7 w-32 xl:w-40 rounded mb-1" />
            <div className="flex items-center gap-3">
              <SkeletonShimmer className="h-3 xl:h-3 w-32 xl:w-40 rounded" />
            </div>
          </div>
        </div>

        <div
          className={`flex items-center md:hidden lg:flex min-w-fit gap-1.5 sm:gap-1 px-3 xl:px-3.5 py-3.5 rounded-2xl lg:text-sm text-[11px] ${isDark
            ? 'text-gray-300 border-gray-700/0  shadow-[inset_0_0_7px_rgba(200,200,200,0.16)]'
            : 'text-gray-600 border-gray-300/50'
          } transition-all duration-200 border`}
        >
          <SkeletonShimmer className="h-4 w-16 rounded mr-1" />
          <ArrowBigRightDash className="w-4 h-4" />
        </div>
      </div>

      <div className="lg:space-y-4">
        <div
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: `${isDark ? 'rgba(147, 51, 234, 0.6) rgba(0, 0, 0, 0.1)' : 'rgba(147, 51, 234, 0.6) rgba(0, 0, 0, 0.1)'}`,
          }}
          className="space-y-3 overflow-y-auto mt-8 max-h-[322px]"
        >
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className={`relative hidden xl:block rounded-[30px] pl-2 pr-4 ${isDark
                ? 'bg-gray-900/10 border-gray-700/30 !shadow-[inset_0_0_10px_rgba(200,200,200,0.1)]'
                : 'bg-white border-gray-200/10 shadow-black/20'
              } border shadow-sm transform -translate-y-0.5 transition-all duration-0 overflow-hidden`}
            >
              <div
                className={`absolute inset-0 ${isDark
                  ? 'bg-gradient-to-r from-purple-500/10 to-cyan-500/10'
                  : 'bg-gradient-to-r from-purple-300/10 to-cyan-300/10'
                } opacity-0 transition-opacity duration-300`}
              />
              <div className="relative flex items-center p-3 gap-3">
                <div className="flex-shrink-0">
                  <div className={`relative w-[70px] h-[70px] rounded-full overflow-hidden shadow-sm`}>
                    <SkeletonShimmer className="w-full h-full" />
                    <div className={`absolute inset-0 ${isDark ? 'bg-black/20' : 'bg-gray-900/20'} opacity-0 transition-opacity duration-200 flex items-center justify-center`}>
                      <SkeletonShimmer className="w-5 h-5 rounded" />
                    </div>
                  </div>
                </div>

                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="space-y-1">
                      <SkeletonShimmer className="h-5 w-40 rounded" />

                      <div
                        className={`flex items-center ml-2 gap-1.5 text-xs ${isDark ? 'text-gray-400 ' : 'text-gray-600'} transition-colors duration-200`}
                      >
                        <Activity strokeWidth={4} className="w-5 h-3.5" />
                        <SkeletonShimmer className="h-3 w-16 rounded" />
                        <span className="mx-1 text-[15px]">•</span>
                        <SkeletonShimmer className="h-3 w-16 rounded" />
                      </div>
                    </div>

                    <div
                      className={`flex items-center ml-2 justify-center gap-1.5 px-2.5 py-2.5 rounded-2xl text-xs font-medium ${isDark ? 'border border-white/20 text-white bg-gray-500/10' : 'bg-black/5 border border-black/10 text-gray-900'} transition-all duration-200 shadow-sm`}
                    >
                      <ArrowBigRightDash strokeWidth={1.5} className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <SkeletonShimmer className="h-3 w-24 rounded" />
                      <SkeletonShimmer className="h-3 w-12 rounded" />
                    </div>

                    <div className={`w-full ${isDark ? 'bg-gray-700/30' : 'bg-gray-200/30'} rounded-full h-1.5 overflow-hidden`}>
                      <div
                        className={`h-full ${isDark ? 'bg-white/20' : 'bg-black/20'} rounded-full transition-all duration-500 ease-out w-1/2`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: `${isDark ? 'rgba(147, 51, 234, 0.1) rgba(0, 0, 0, 0.1)' : 'rgba(147, 51, 234, 0.1) rgba(0, 0, 0, 0.1)'}`,
          }}
          className={`mobile-scroll-area select-none overflow-x-auto xl:hidden flex gap-3 pb-3  ${isDark ? 'text-white' : 'text-gray-900'}`}
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="w-[76px] shrink-0">
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden  transition-shadow duration-300">
                <SkeletonShimmer className="w-full h-full" />
              </div>
              <SkeletonShimmer className="h-4 w-20 rounded mt-2" />
            </div>
          ))}
        </div>

        <div
          className={`w-full xl:flex hidden items-center justify-center gap-1.5 py-2 rounded-md text-sm font-medium ${isDark ? 'bg-gray-800/10 text-gray-300' : 'bg-gray-100 text-gray-700'} transition-all duration-200 shadow-sm`}
        >
          <ChevronDown className="w-4 h-4" />
          <SkeletonShimmer className="h-4 w-20 rounded" />
        </div>
      </div>
    </div>
  );
}