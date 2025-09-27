'use client';

import { useTheme } from '@/app/providers/ThemeContext';
import { Star, MessageSquareText, Heart as HeartIcon, Flame, Activity } from 'lucide-react';

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

export default function MangaCardSkeleton() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="w-full flex  flex-col">
      <div className="flex mb-7 sm:mb-8 items-center gap-3">
        <div className={`${isDark ? "bg-white/10" : "bg-gray-200/50"} p-2.5 lg:p-3 rounded-lg`}>
          <Flame
            className={`w-6 h-6 lg:w-7 lg:h-7 ${isDark ? "text-yellow-300" : "text-yellow-600"} drop-shadow-md`}
          />
        </div>
        <div className="flex-1">
          <SkeletonShimmer className="h-6 lg:h-8 w-32 lg:w-40 rounded mb-1" />
          <div className="flex items-center gap-3">
            <SkeletonShimmer className="h-3 lg:h-4 w-24 lg:w-32 rounded" />
          </div>
        </div>
      </div>

      <div className="grid w-full gap-2 sm:gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 20 }).map((_, index) => (
          <div
            key={index}
            className={`manga-card group -mt-2 lg:mt-0 transform transition-all duration-[400ms] ease-in-out cursor-pointer w-full flex justify-center items-start opacity-100 translate-y-0`}
          >
            <div
              className={`origin-center w-full min-h-[267px] sm:min-h-[368px] rounded-2xl ${isDark ? "bg-[#060111]/50 shadow-slate-600/40" : "bg-gray-100/50 shadow-gray-400"} p-[5px] shadow-[0_-1px_7px_rgba(0,0,0,0.2)] transition-transform duration-300 ease-in-out will-change-transform`}
            >
              <div
                className={`
                  relative flex h-[200px] sm:h-[280px] flex-col
                  rounded-t-[10px]
                  overflow-hidden  
                  ${isDark ? "bg-gradient-to-tr from-[#1f2020] to-[#000d0e]" : "bg-gradient-to-tr from-gray-200 to-gray-300"}
                  will-change-transform
                `}
              >
                <SkeletonShimmer className="absolute inset-0 mt-6 sm:mt-9 w-full h-full" />

                <div
                  className={`absolute z-50 inset-x-0 bottom-0 ${isDark ? "bg-gradient-to-t from-black via-gray-900 to-transparent" : "bg-gradient-to-t from-gray-900/80 via-gray-800/50 to-transparent"} p-2 sm:p-4`}
                >
                  <h1 className="flex flex-row w-full font-bold items-center gap-3 sm:items-start justify-center text-[7px] sm:text-xs tracking-[2px] text-white">
                    <SkeletonShimmer className="h-3 w-7 rounded-lg" />
                    <SkeletonShimmer className="h-2 sm:h-3 w-24 sm:w-32 rounded" />
                  </h1>
                </div>
                <div className="absolute inset-0 h-7 sm:h-[38px] rounded-t-[12px] backdrop-blur-[2px] z-10" />
                <div className={`relative z-20 h-[29px] md:h-[39px] -ml-1 -mt-1 w-[60%] -skew-x-[40deg] rounded-br-[10px] ${isDark ? "bg-[#060111] shadow-[-10px_-10px_0_0_#060111]" : "bg-white shadow-[-10px_-10px_0_0_rgb(255,255,255)]"} before:absolute before:right-[-2px] before:top-0 before:h-[12px] before:w-[70px] sm:before:w-[129px] before:rounded-tl-[11px]`} />
                <div className={`absolute left-0 top-[25px] sm:top-[35px] z-50 h-[19px] w-[105px] before:absolute before:h-full before:w-1/2 sm:before:w-full before:rounded-tl-full ${isDark ? "before:shadow-[-5px_-5px_0_2px_#060111]" : "before:shadow-[-5px_-5px_0_2px_rgb(255,255,255)]"}`} />
                <div className="absolute top-0 flex h-[30px] w-full justify-between">
                  <div className="h-full flex flex-row justify-center items-center aspect-square">
                    <span className={`absolute gap-2 md:gap-3 top-[3px] sm:top-[7px] left-4 z-30 text-[9px] sm:text-[11px] sm:tracking-widest rounded-full pr-2 sm:min-w-24 flex items-center justify-center font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                      <Activity strokeWidth={3.5} className={` size-2.5 sm:size-4 opacity-75 ${isDark ? "text-[#04d000]" : "text-[#03a300]"}`} />
                      <SkeletonShimmer className="h-3 w-16 rounded ml-2" />
                    </span>
                  </div>
                  <div className="flex w-full ">
                    <span
                      className={`pr-8 z-10 tracking-widest mt-[1.5px] top-0 right-0  flex items-center justify-end text-center border-2 w-full  absolute py-[5px] sm:py-[7px] min-w-36 text-[6px] sm:text-[10px] font-semibold rounded-lg md:rounded-xl ${isDark ? "text-white" : "text-gray-100"} bg-opacity-70 border-gray-500/30 backdrop-blur-lg bg-gray-500/30`}
                    >
                      <SkeletonShimmer className="h-3 w-16 rounded opacity-0" />
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-[2px_4px] sm:p-[5px_10px] w-full">
                <div className={`flex justify-between mt-2 ${isDark ? "text-gray-300" : "text-gray-700"} text-sm`}>
                  <div className="flex text-[10px] sm:text-base items-center gap-0.5 sm:gap-2">
                    <Star className={`w-6 h-6 sm:w-7 sm:h-7  ${isDark ? "text-yellow-500" : "text-yellow-600"} rounded-md p-1`} />
                    <SkeletonShimmer className="h-3 w-8 rounded" />
                  </div>
                  <div className="flex text-[10px] sm:text-base items-center gap-0.5 sm:gap-2">
                    <MessageSquareText className={`w-6 h-6  sm:w-7 sm:h-7  ${isDark ? "text-white/70" : "text-gray-700/70"} rounded-md p-1`} />
                    <SkeletonShimmer className="h-3 w-8 rounded" />
                  </div>
                  <div className="flex text-[10px] sm:text-base items-center gap-0.5 sm:gap-2">
                    <HeartIcon className={`w-6 h-6 sm:w-7 sm:h-7  ${isDark ? "fill-rose-500/50 text-rose-500" : "fill-rose-600/50 text-rose-600"} rounded-md p-1`} />
                    <SkeletonShimmer className="h-3 w-8 rounded" />
                  </div>
                </div>
                <div className="mt-3 flex flex-col sm:min-h-[92px] justify-between relative">
                  <div className="flex flex-wrap gap-1">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <span
                        key={i}
                        className={`${isDark ? "!shadow-[inset_0_0_5px_rgba(200,200,200,0.2)] border-gray-700/30" : "bg-gray-200 shadow-md border-gray-300"} backdrop-blur-md rounded-lg sm:min-w-16 duration-0  px-2 sm:px-3 py-1 sm:py-1.5 border transition-colors text-center flex flex-row font-bold items-start justify-center text-[9px] sm:text-[10px] sm:tracking-[1px] ${isDark ? "text-white" : "text-gray-900"}`}
                      >
                        <SkeletonShimmer className="h-3 w-12 rounded opacity-25" />
                      </span>
                    ))}
                  </div>
                  <div className="h-8" />
                  <SkeletonShimmer className={`text-[7px] bottom-1 md:bottom-0.5 sm:text-xs tracking-widest w-20 justify-self-center ml-16 absolute z-30 flex justify-center items-center text-center opacity-10 ${isDark ? "text-gray-400" : "text-gray-600"} mt-4 h-3 rounded`} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="h-28" />
    </div>
  );
}