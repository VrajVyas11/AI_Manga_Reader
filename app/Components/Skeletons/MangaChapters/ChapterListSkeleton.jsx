import React from 'react';
import {
  Filter,
  History,
  ChevronDown,
  Search,
  Languages,
  ArrowUpDown,
  LibraryBig,
  Library,
  Earth,
  X,
  CheckCircle,
} from 'lucide-react';

// Memoized SkeletonFlag for placeholder flags
const SkeletonFlag = React.memo(() => (
  <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-gray-700 animate-pulse" />
));

SkeletonFlag.displayName="SkeletonFlag"
// Skeleton Button Component
const SkeletonButton = ({ children, className, icon: Icon, chevron, disabled = false }) => (
  <div
    className={`flex items-center justify-center gap-1 px-4 py-3 rounded text-xs font-bold bg-gray-800 animate-pulse ${className} ${
      disabled ? 'opacity-50 cursor-not-allowed' : ''
    }`}
  >
    {Icon && <Icon className="w-4 h-4" />}
    {children}
    {chevron && <ChevronDown className="w-4 h-4" />}
  </div>
);

// Skeleton Input Component
const SkeletonInput = ({ icon: Icon }) => (
  <div className="relative w-full sm:w-auto animate-pulse">
    {Icon && <Icon className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />}
    <div className="bg-gray-600/30 rounded px-8 py-2 w-full sm:min-w-[200px] h-9 sm:h-10" />
  </div>
);

// Skeleton Select Component
const SkeletonSelect = ({ icon: Icon }) => (
  <div className="relative w-full sm:w-auto animate-pulse">
    {Icon && <Icon className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />}
    <div className="bg-gray-600/30 rounded px-8 py-2 w-full h-9 sm:h-10" />
  </div>
);

// Skeleton Chapter Card
const SkeletonChapterCard = ({ isRead = false }) => (
  <div
    className={`relative p-4 py-3 bg-black/20 backdrop-blur-sm w-full rounded-lg border border-white/30 animate-pulse ${
      isRead ? 'bg-purple-900/20' : ''
    }`}
  >
    {isRead && <CheckCircle className="absolute -left-1 -top-1 text-emerald-400 w-5 h-5" />}
    <div className="absolute -left-5 top-1/2 w-5 h-1 bg-gray-700"></div>
    <div className="flex flex-col gap-3">
      <div className="flex items-center space-x-3">
        <SkeletonFlag />
        <div className="min-w-0 flex-1">
          <div className="h-4 sm:h-5 bg-gray-700 rounded w-3/4" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-1 sm:flex sm:gap-4 ml-3 text-sm">
        {Array(4)
          .fill(0)
          .map((_, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-700 rounded" />
              <div className="h-3 sm:h-4 bg-gray-700 rounded w-20 sm:w-24" />
            </div>
          ))}
      </div>
    </div>
  </div>
);

// Main Skeleton Component
const ChapterListWithFiltersSkeleton = () => {
  const [showFilters] = React.useState(false);
  const [showHistory] = React.useState(false);

  return (
    <div className="flex flex-col  w-full gap-4 lg:flex-row text-white font-sans">
      {/* Main content */}
      <div className="flex-1 space-y-4">
        {/* Filters and History buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-4">
            {/* Filter and History buttons on mobile */}
            <div className="flex flex-row justify-between w-full gap-2 sm:hidden">
              <SkeletonButton
                className='bg-purple-900/90'
                icon={Filter}
                chevron
              >
                Filters
              </SkeletonButton>
              <SkeletonButton
                className={showHistory ? 'bg-purple-900/90' : ''}
                icon={History}
                chevron
              >
                History
              </SkeletonButton>
            </div>
            {/* Filters on laptop or when toggled on mobile */}
            <div
              className={`flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 ${
                showFilters ? 'flex' : 'hidden sm:flex'
              } w-full sm:w-auto`}
            >
              <SkeletonInput icon={Search} placeholder="Search chapters..." />
              <div className="flex flex-row w-full sm:w-fit gap-4">
                <SkeletonSelect icon={Languages} />
                <SkeletonSelect icon={ArrowUpDown} />
              </div>
              <SkeletonButton className="bg-rose-600 w-full sm:w-auto">Reset Filters</SkeletonButton>
            </div>
            {/* History button on laptop */}
            <SkeletonButton
              className={`hidden sm:flex ${showHistory ? 'bg-yellow-400' : ''}`}
              icon={History}
              chevron
            >
              History
            </SkeletonButton>
          </div>
        </div>

        {/* Reading History Panel */}
        {showHistory && (
          <aside className="w-full bg-gray-850 rounded-xl backdrop-blur-md bg-white/5 p-4 animate-pulse">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-yellow-400" />
                <div className="h-5 bg-gray-700 rounded w-32" />
              </div>
              <X className="w-5 h-5 text-gray-400" />
            </div>
            <ul className="space-y-2">
              {Array(3)
                .fill(0)
                .map((_, idx) => (
                  <li key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50">
                    <div className="w-12 h-12 rounded-lg bg-gray-700 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-700 rounded w-3/4 mb-1" />
                      <div className="flex items-center gap-2">
                        <SkeletonFlag />
                        <div className="h-3 bg-gray-700 rounded w-20" />
                      </div>
                    </div>
                    <div className="w-5 h-5 bg-gray-700 rounded flex-shrink-0" />
                  </li>
                ))}
            </ul>
          </aside>
        )}

        {/* Volumes and chapters */}
        <div
          style={{ scrollbarWidth: 'none' }}
          className="space-y-6 max-h-[1200px] overflow-auto pb-12"
        >
          {Array(2)
            .fill(0)
            .map((_, volIdx) => (
              <div key={volIdx} className="animate-pulse">
                {/* Volume Header */}
                <div className="w-full flex justify-between items-center py-4">
                  <div className="flex justify-start items-center gap-3">
                    <LibraryBig className="w-5 h-6" />
                    <div className="h-5 bg-gray-700 rounded w-24" />
                  </div>
                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4 sm:mr-32">
                    <div className="h-4 bg-gray-700 rounded w-16" />
                  </div>
                  <div className="flex items-center">
                    <div className="h-4 bg-gray-700 rounded w-8 mr-2" />
                    <ChevronDown className="w-6 h-6 text-white" />
                  </div>
                </div>
                {/* Chapters */}
                <div>
                  {Array(2)
                    .fill(0)
                    .map((_, chapIdx) => (
                      <div
                        key={chapIdx}
                        className="mt-0 mb-4 bg-gray-500/5 backdrop-blur-3xl rounded"
                      >
                        {/* Chapter Header */}
                        <div className="w-full flex justify-between items-center">
                          <div className="flex-1">
                            <div className="flex flex-row justify-between rounded-lg mb-3">
                              <div className="bg-gray-600/10 rounded-lg pl-0 w-full flex flex-row justify-between items-center">
                                <div className="w-14 h-full rounded-l-lg bg-gray-400/5 backdrop-blur-md flex justify-center items-center">
                                  <Library className="w-5 h-5 text-yellow-400" />
                                </div>
                                <div className="h-4 bg-gray-700 rounded w-20 py-3" />
                                <div className="flex flex-row items-center gap-2 mr-3">
                                  <Earth className="w-5 h-5" />
                                  <div className="h-4 bg-gray-700 rounded w-8" />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="ml-5 px-4 py-3 h-full flex justify-center items-center bg-gray-600/20 rounded-lg">
                            <ChevronDown className="w-6 h-6" />
                          </div>
                        </div>
                        {/* Chapter Cards */}
                        <div className="flex flex-row mt-2 h-fit">
                          <div className="ml-5 w-1 mb-[51px] bg-gray-700 rounded-3xl"></div>
                          <div className="space-y-2 w-full pr-5 pl-4 pb-3">
                            {Array(2)
                              .fill(0)
                              .map((_, cardIdx) => (
                                <SkeletonChapterCard key={cardIdx} isRead={cardIdx === 0} />
                              ))}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ChapterListWithFiltersSkeleton;