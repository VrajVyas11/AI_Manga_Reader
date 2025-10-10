import React from 'react';
import { Book } from 'lucide-react';
import StableFlag from '../../../Components/StableFlag';
import ChapterListWithFiltersSkeleton from './ChapterListSkeleton';

const MemoStableFlag = React.memo(StableFlag);

function TabsAndSectionsSkeleton({ isDark = true }) {
  return (
    <div className={`px-4 sm:px-[70px] animate-pulse ${isDark ? 'text-white' : 'text-gray-900'}`}>
      {/* Tabs Skeleton */}
      <div className="mb-6 sm:mb-8 w-fit">
        <div className={`${isDark ? "bg-gray-600/30" : "bg-white/70 border border-gray-200 shadow-sm"} backdrop-blur-md rounded overflow-x-auto flex-nowrap`}>
          <div className="flex">
            {[...Array(2)].map((_, index) => (
              <div
                key={index}
                className={`px-4 py-2 text-sm md:text-base font-bold ${isDark ? 'bg-gray-600/20 text-transparent' : 'bg-gray-300/50 text-transparent'} rounded w-24 h-8`}
              >
                <div className={`${isDark ? "bg-gray-500/50" : "bg-gray-400/50"} h-4 w-full rounded`} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row w-full gap-4 sm:gap-2">
        {/* Metadata Section Skeleton (Left Column) */}
        <div className="w-full hidden md:flex sm:w-5/12 flex-wrap gap-6 sm:gap-9 h-fit">
          {/* Author and Artist */}
          <div className="flex flex-row gap-4 w-full">
            <div className="min-w-1/3">
              <h3 className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Author</h3>
              <div className={`${isDark ? "bg-white/10" : "bg-gray-100 shadow-md font-semibold border border-gray-200"} backdrop-blur-md min-w-fit px-3 py-2 text-sm rounded w-24 h-8`}>
                <div className={`${isDark ? "bg-gray-500/50" : "bg-gray-400/50"} h-4 w-16 rounded`} />
              </div>
            </div>
            <div>
              <h3 className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Artist</h3>
              <div className={`${isDark ? "bg-white/10" : "bg-gray-100 shadow-md font-semibold border border-gray-200"} backdrop-blur-md min-w-fit px-3 py-2 text-sm rounded w-24 h-8`}>
                <div className={`${isDark ? "bg-gray-500/50" : "bg-gray-400/50"} h-4 w-16 rounded`} />
              </div>
            </div>
          </div>

          {/* Genres */}
          <div className="h-fit">
            <h3 className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Genres</h3>
            <div className="flex gap-2">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className={`${isDark ? "bg-white/10 hover:bg-white/20" : "bg-gray-100 shadow-md font-semibold border border-gray-200 hover:bg-gray-900/20"} backdrop-blur-md min-w-fit px-3 py-2 text-xs rounded w-20 h-6`}
                >
                  <div className={`${isDark ? "bg-gray-500/50" : "bg-gray-400/50"} h-3 w-16 rounded`} />
                </div>
              ))}
            </div>
          </div>

          {/* Themes */}
          <div className="h-fit">
            <h3 className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Themes</h3>
            <div className="flex flex-wrap gap-2">
              {[...Array(2)].map((_, index) => (
                <div
                  key={index}
                  className={`${isDark ? "bg-white/10 hover:bg-white/20" : "bg-gray-100 shadow-md font-semibold border border-gray-200 hover:bg-gray-900/20"} backdrop-blur-md min-w-fit px-3 py-2 text-xs rounded w-20 h-6`}
                >
                  <div className={`${isDark ? "bg-gray-500/50" : "bg-gray-400/50"} h-3 w-16 rounded`} />
                </div>
              ))}
            </div>
          </div>

          {/* Format */}
          <div className="h-fit">
            <h3 className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Format</h3>
            <div className="flex flex-wrap gap-2">
              {[...Array(2)].map((_, index) => (
                <div
                  key={index}
                  className={`${isDark ? "bg-white/10 hover:bg-white/20" : "bg-gray-100 shadow-md font-semibold border border-gray-200 hover:bg-gray-900/20"} backdrop-blur-md min-w-fit px-3 py-2 text-xs rounded w-20 h-6`}
                >
                  <div className={`${isDark ? "bg-gray-500/50" : "bg-gray-400/50"} h-3 w-16 rounded`} />
                </div>
              ))}
            </div>
          </div>

          {/* Demographic */}
          <div>
            <h3 className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Demographic</h3>
            <div className={`${isDark ? "bg-white/10" : "bg-gray-100 shadow-md font-semibold border border-gray-200"} backdrop-blur-md min-w-fit px-3 py-2 text-xs rounded w-24 h-6`}>
              <div className={`${isDark ? "bg-gray-500/50" : "bg-gray-400/50"} h-3 w-20 rounded`} />
            </div>
          </div>

          {/* Read or Buy */}
          <div>
            <h3 className={`font-bold text-lg mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Read or Buy</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className={`${isDark ? "bg-white/10 hover:bg-white/20" : "bg-gray-100 shadow-md font-semibold border border-gray-200 hover:bg-gray-900/20 hover:border-gray-300"} backdrop-blur-md rounded px-3 py-2 flex items-center w-24 h-8`}
                >
                  <Book className={`w-4 h-4 mr-2 ${isDark ? 'text-white' : 'text-gray-900'}`} />
                  <div className={`${isDark ? "bg-gray-500/50" : "bg-gray-400/50"} h-3 w-16 rounded`} />
                </div>
              ))}
            </div>
          </div>

          {/* Track */}
          <div>
            <h3 className={`font-bold text-lg mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Track</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className={`${isDark ? "bg-white/10 hover:bg-white/20" : "bg-gray-100 shadow-md font-semibold border border-gray-200 hover:bg-gray-900/20 hover:border-gray-300"} backdrop-blur-md rounded px-3 py-2 flex items-center w-24 h-8`}
                >
                  <Book className={`w-4 h-4 mr-2 ${isDark ? 'text-white' : 'text-gray-900'}`} />
                  <div className={`${isDark ? "bg-gray-500/50" : "bg-gray-400/50"} h-3 w-16 rounded`} />
                </div>
              ))}
            </div>
          </div>

          {/* Alternative Titles */}
          <div>
            <h3 className={`font-bold text-lg mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Alternative Titles</h3>
            <div className="space-y-2">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-2 py-1 px-2 rounded-md ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} w-full h-8`}
                >
                  <MemoStableFlag
                    code="en"
                    className="w-6 sm:w-8 h-6 sm:h-8 rounded-md shadow-sm"
                    alt="flag"
                  />
                  <div className={`${isDark ? "bg-gray-500/50" : "bg-gray-400/50"} h-3 w-32 rounded`} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area Skeleton (Right Column) */}
        <div className="w-full sm:-mt-6 sm:ml-5">
          {/* Placeholder for ChapterList skeleton */}
          <div className={`${isDark ? "bg-gray-600/20" : "bg-gray-100"} backdrop-blur-md rounded p-4`}>
            <ChapterListWithFiltersSkeleton isDark={isDark} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TabsAndSectionsSkeleton;