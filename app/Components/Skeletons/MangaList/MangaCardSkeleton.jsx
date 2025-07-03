'use client';
import { useTheme } from '@/app/providers/ThemeContext';
import { Flame } from 'lucide-react';

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

export default function MangaCardSkeleton({ count = 12 }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="w-full flex flex-col mb-10">
      {/* Header Section */}
      <div className="flex mx-1 sm:mx-5 xl:mx-16 mb-7 sm:mb-8 items-center gap-3">
        <div className={`${isDark ? 'bg-white/10' : 'bg-gray-200/50'} p-3 rounded-lg`}>
          <Flame className={`w-6 h-6 ${isDark ? 'text-yellow-400' : 'text-yellow-600'} drop-shadow-md`} />
        </div>
        <div>
          <h2
            className={`text-xl md:text-2xl font-bold uppercase tracking-wide ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            Latest Releases
          </h2>
          <p
            className={`text-xs uppercase tracking-wide ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            Fresh Manga Updates
          </p>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid w-[95%] sm:gap-y-4 mx-auto md:mx-5 xl:ml-16 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="manga-card w-full flex justify-center items-start">
            <div
              className={`w-full sm:w-[250px] overflow-hidden min-h-[290px] sm:min-h-[400px] rounded-lg p-[5px] ${
                isDark
                  ? 'bg-[#0c0221]/50 shadow-slate-600 shadow-[0_0_4px_rgba(0,0,0,1)]'
                  : 'bg-gray-100/80 shadow-gray-400 shadow-[0_0_4px_rgba(0,0,0,0.2)]'
              }`}
            >
              {/* Image Section */}
              <div className="relative flex h-[155px] sm:h-[250px] flex-col rounded-[5px]">
                <SkeletonShimmer className="object-fill relative -mt-[1px] flex h-[155px] sm:h-[250px] flex-col rounded-[5px] rounded-tl-[20px]" />
                
                {/* Title overlay */}
                <div
                  className={`absolute inset-x-0 bottom-0 p-2 sm:p-4 ${
                    isDark
                      ? 'bg-gradient-to-t from-black via-gray-900 to-transparent'
                      : 'bg-gradient-to-t from-gray-100 via-gray-200/50 to-transparent'
                  }`}
                >
                  <div className="flex flex-row w-full items-center gap-3 sm:items-start justify-center">
                    <SkeletonShimmer className="w-4 sm:w-7 h-3 sm:h-5 rounded" />
                    <SkeletonShimmer className="h-2 sm:h-3 w-24 sm:w-32 rounded" />
                  </div>
                </div>

                {/* Status badge area */}
                <div
                  className={`absolute z-20 h-[29px] md:h-[39px] -ml-1 -mt-1 w-[60%] -skew-x-[40deg] rounded-br-[10px] ${
                    isDark
                      ? 'bg-[#0c0221] shadow-[-10px_-10px_0_0_#0c0221]'
                      : 'bg-gray-100 shadow-[-10px_-10px_0_0_rgba(229,231,235,0.8)]'
                  } before:absolute before:right-[-2px] before:top-0 before:h-[12px] before:w-[70px] sm:before:w-[129px] before:rounded-tl-[11px]`}
                />
                <div
                  className={`absolute left-0 top-6 sm:top-[34px] h-[55px] w-[125px] before:absolute before:h-full before:w-1/2 sm:before:w-full before:rounded-tl-[15px] ${
                    isDark
                      ? 'before:shadow-[-5px_-5px_0_2px_#0c0221]'
                      : 'before:shadow-[-5px_-5px_0_2px_rgba(229,231,235,0.8)]'
                  }`}
                />
                
                {/* Top badges */}
                <div className="absolute top-0 flex h-[30px] w-full justify-between">
                  <div className="h-full flex flex-row justify-center items-center aspect-square">
                    <span
                      className={`absolute -ml-2 sm:-ml-3 lg:-ml-0 -mt-[7px] sm:-mt-[8px] top-0 left-0 z-30 text-[9px] sm:text-[11px] sm:tracking-widest rounded-full pr-2 sm:min-w-24 flex items-center justify-start font-bold ${
                        isDark ? 'text-transparent' : 'text-transparent'
                      }`}
                    >
                      <SkeletonShimmer className="size-3 mx-4 sm:size-4 mt-2 sm:mt-4 rounded-full" />
                      <SkeletonShimmer className="h-4 w-12 mt-2 sm:mt-4 sm:w-16 ml-1 rounded" />
                    </span>
                  </div>
                  <div className="flex">
                    <SkeletonShimmer
                      className={`z-10 mt-[1px] sm:mt-[2px] mr-2 top-0 right-0 absolute py-[3px] sm:py-[7px] min-w-36 h-6 sm:h-8 rounded-lg md:rounded-xl ${
                        isDark ? '' : ''
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-[2px_4px] sm:p-[5px_10px] w-full">
                {/* Stats Row */}
                <div className="flex justify-between mt-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex text-[11px] sm:text-base items-center gap-0.5 sm:gap-2"
                    >
                      <SkeletonShimmer className="w-6 h-6 sm:w-7 sm:h-7 rounded-md" />
                      <SkeletonShimmer className="h-3 sm:h-4 w-6 sm:w-8 rounded" />
                    </div>
                  ))}
                </div>

                {/* Tags and Content */}
                <div className="mt-3 flex flex-col sm:min-h-[100px] justify-between">
                  <div className="flex flex-wrap gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <SkeletonShimmer
                        key={i}
                        className={`h-6 sm:h-8 w-12 sm:w-16 rounded border ${
                          isDark ? 'border-gray-700' : 'border-gray-300/50'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="h-8" />
                  <div className="bottom-2 md:bottom-3 mx-auto relative z-30 flex justify-center items-center w-full">
                    <SkeletonShimmer className="h-2 sm:h-3 w-24 sm:w-32 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};