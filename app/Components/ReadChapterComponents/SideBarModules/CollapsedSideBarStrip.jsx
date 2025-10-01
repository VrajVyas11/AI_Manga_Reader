import React from 'react';
import { Heart, Menu, BookOpenText, ArrowBigDownDash, ArrowBigUpDash } from 'lucide-react';
import ChaptersQuickSelect from './ChaptersQuickSelect';

function CollapsedSideBarStrip({
  isFavorite,
  toggleFavorite,
  mangaInfo,
  setIsCollapsed,
  CoverImage,
  hasPrevChapter,
  goToNextChapter,
  hasNextChapter,
  sortOrder,
  goToPrevChapter,
  handleChapterClick,
  filteredChapters,
  goToLastChapter,
  goToFirstChapter,
  setSortOrder,
  setSearchQuery,
  searchQuery,
  chapterInfo,
  dropdownRef,
  setChapterDropdownOpen,
  chapterDropdownOpen,
  addToReadHistory,
  isDark = true
}) {
  return (
    <div className="tracking-wider relative mt-5  h-[89vh] md:h-[88.5vh] z-40 flex justify-center items-center">
      <div
        className={`
        tracking-wider h-full pt-5 md:pt-7 w-14 md:w-[70px] py-4 flex flex-col items-center justify-between shadow-[5px_0_15px_rgba(0,0,0,0.4)]
        border-r
        ${isDark
            ? 'bg-black/25 backdrop-blur-3xl border-purple-700/20 shadow-gray-800/20'
            : 'bg-white/90 backdrop-blur-md border-gray-300 shadow-gray-300/50'}
        px-1.5 md:px-2
      `}
      >
        <div className="tracking-wider flex flex-col items-center h-full justify-between gap-y-3 md:gap-y-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              e.nativeEvent?.stopImmediatePropagation();
              setIsCollapsed(false);
            }}
            className={`
            tracking-wider w-12 h-12 rounded-full flex items-center justify-center relative group transition-colors duration-0
            border
            ${isDark
                ? 'bg-gray-800/50 border-purple-700/20 text-gray-200 hover:bg-purple-900/30'
                : 'bg-gray-50  border-gray-300 text-gray-700 hover:bg-purple-200'}
          `}
            aria-label="Expand sidebar"
          >
            <Menu className={`${isDark ? 'text-gray-200' : 'text-gray-700'} w-4 md:w-5 h-4 md:h-5`} />
            <span
              className={`
              tracking-wider absolute hidden group-hover:block rounded-md py-0.5 px-1.5 md:py-1 md:px-2
              top-1/2 -translate-y-1/2 -right-14 md:-right-16
              ${isDark ? 'bg-gray-900/90 text-white text-[10px] md:text-xs' : 'bg-gray-100 text-gray-900 text-xs'}
            `}
            >
              Expand
            </span>
          </button>

          <div className="flex flex-col items-center gap-y-1.5 md:gap-y-6">
            <div
              className="tracking-wider relative w-12"
              ref={dropdownRef}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  e.nativeEvent?.stopImmediatePropagation();
                  setChapterDropdownOpen((prev) => !prev);
                }}
                className={`
                tracking-wider w-12 h-12 rounded-full flex items-center justify-center relative group transition-colors duration-0
                border
                ${isDark
                    ? 'bg-gray-800/50 border-purple-700/20 text-gray-200 hover:bg-purple-900/30'
                    : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-purple-200'}
              `}
                aria-label="Select chapter"
                aria-expanded={chapterDropdownOpen}
              >
                <BookOpenText className={`${isDark ? 'text-gray-200' : 'text-gray-700'} w-4 md:w-5 h-4 md:h-5`} />
                <span
                  className={`
                  tracking-wider absolute -top-2 -right-2 rounded-full bg-purple-600/70 text-white text-[10px] md:text-xs
                  w-4 md:w-5 h-4 md:h-5 flex items-center justify-center font-medium border border-purple-700/20 capitalize
                `}
                >
                  {chapterInfo.chapter}
                </span>
                <span
                  className={`
                  tracking-wider absolute hidden group-hover:block rounded-md py-0.5 px-1.5 md:py-1 md:px-2
                  top-1/2 -translate-y-1/2 -right-20 md:-right-24
                  ${isDark ? 'bg-gray-900/90 text-white text-[10px] md:text-xs' : 'bg-gray-100 text-gray-900 text-xs'}
                `}
                >
                  Select Chapter
                </span>
              </button>

              {chapterDropdownOpen && (
                <div className="absolute -top-[150%] left-14 z-50">
                  <ChaptersQuickSelect
                    isDark={isDark}
                    mangaInfo={mangaInfo}
                    addToReadHistory={addToReadHistory}
                    searchQuery={searchQuery}
                    chapterInfo={chapterInfo}
                    setSearchQuery={setSearchQuery}
                    setSortOrder={setSortOrder}
                    sortOrder={sortOrder}
                    goToFirstChapter={goToFirstChapter}
                    goToLastChapter={goToLastChapter}
                    filteredChapters={filteredChapters}
                    handleChapterClick={handleChapterClick}
                    setChapterDropdownOpen={setChapterDropdownOpen}
                  />
                </div>
              )}
            </div>

            <div
              className={`
              tracking-wider w-12 h-12 rounded-full relative group border-2 shadow-md
              ${isDark ? 'border-purple-700/20' : 'border-purple-400/40'}
            `}
            >
              <CoverImage
                ariaLabel={mangaInfo.title}
                src={mangaInfo.coverImageUrl}
                alt={mangaInfo.title}
                className="tracking-wider object-cover rounded-full w-full h-full transition-transform duration-300 group-hover:scale-110"
              />
              <div
                className={`
                flex absolute -right-2 md:-right-3 -top-3 md:-top-4 flex-row text-[9px] md:text-[10px] truncate
                rounded-full font-medium border capitalize p-0.5 md:p-1 px-1 md:px-1.5
                ${isDark
                    ? 'bg-purple-600/70 text-white border border-purple-700/20'
                    : 'bg-purple-300/70 text-purple-900 border border-purple-400/40'}
              `}
              >
                {chapterInfo.translatedLanguage}
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                e.nativeEvent?.stopImmediatePropagation();
                toggleFavorite();
              }}
              className={`
              w-10 md:w-12 h-10 md:h-12 tracking-wider rounded-full flex items-center justify-center relative group transition-all duration-0
              ${isFavorite
                  ? isDark
                    ? 'bg-red-900/30 text-red-400 border border-red-700/20' // favorite + dark
                    : 'bg-red-200 text-red-500 border border-red-300'       // favorite + light
                  : isDark
                    ? 'bg-gray-800/50 text-gray-400 border border-gray-700/20 hover:bg-red-900/30 hover:text-red-400' // not favorite + dark
                    : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-red-200 hover:text-red-600'           // not favorite + light
                }
            `}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`w-5 md:w-6 h-5 md:h-6 ${isFavorite ? ` ${isDark ? "animate-pulse" : "fill-red-500"}` : ''}`} />
              <span
                className={`
                tracking-wider absolute hidden group-hover:block rounded-md py-0.5 px-1.5 md:py-1 md:px-2
                top-1/2 -translate-y-1/2 -right-20 md:-right-24
                ${isDark ? 'bg-gray-900/90 text-white text-[10px] md:text-xs' : 'bg-gray-100 text-gray-900 text-xs'}
              `}
              >
                {isFavorite ? 'Unfavorite' : 'Favorite'}
              </span>
            </button>
          </div>

          <div className="tracking-wider flex flex-col items-center gap-1.5 md:gap-2">
            <div className="tracking-wider flex w-12 md:w-12 flex-col justify-between gap-1.5 md:gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  e.nativeEvent?.stopImmediatePropagation();
                  goToPrevChapter();
                }}
                disabled={!hasPrevChapter}
                className={`
                tracking-wider w-12 h-12 rounded-full flex items-center justify-center relative group transition-colors duration-0
                border
                ${hasPrevChapter
                    ? isDark
                      ? 'bg-purple-900/30 border-purple-700/20 text-white hover:bg-purple-800/40'
                      : 'bg-purple-200 border-purple-400 text-purple-900 hover:bg-purple-300'
                    : isDark
                      ? 'bg-gray-800/30 border-gray-700/20 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'}
              `}
                aria-label="Previous chapter"
                type="button"
              >
                <ArrowBigUpDash className={`tracking-wider w-5 md:w-6 h-5 md:h-6 ${isDark ? 'text-white' : 'text-purple-900'}`} />
              </button>

              <div className="flex text-[10px] md:text-[11px] my-1 md:my-2 flex-row space-x-0.5 md:space-x-1 justify-center items-center">
                {chapterInfo.chapter} / {filteredChapters.length}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  e.nativeEvent?.stopImmediatePropagation();
                  goToNextChapter();
                }}
                disabled={!hasNextChapter}
                className={`
                tracking-wider w-12 h-12 rounded-full flex items-center justify-center relative group transition-colors duration-0
                border
                ${hasNextChapter
                    ? isDark
                      ? 'bg-purple-900/30 border-purple-700/20 text-white hover:bg-purple-800/40'
                      : 'bg-purple-200 border-purple-400 text-purple-900 hover:bg-purple-300'
                    : isDark
                      ? 'bg-gray-800/30 border-gray-700/20 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'}
              `}
                aria-label="Next chapter"
                type="button"
              >
                <ArrowBigDownDash className={`tracking-wider w-5 md:w-6 h-5 md:h-6 ${isDark ? 'text-white' : 'text-purple-900'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(CollapsedSideBarStrip);