import React from 'react';
import {  Heart, Menu, BookOpenText, ArrowBigDownDash, ArrowBigUpDash } from 'lucide-react';
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
  goToChapter,
  filteredChapters,
  goToLastChapter,
  goToFirstChapter,
  setSortOrder,
  setSearchQuery,
  searchQuery,
  chapterInfo,
  dropdownRef,
  setChapterDropdownOpen,
  chapterDropdownOpen
}) {
  return (
    <div className="tracking-wider relative left-0 top-0 h-[90vh] md:h-[91.7vh] z-40 flex justify-center items-center">
      <div className="tracking-wider h-full pt-5 md:pt-7 w-14 md:w-[70px] bg-black/25 backdrop-blur-3xl border-r border-purple-700/20 py-4 shadow-gray-800/20 md:py-6 px-1.5 md:px-2 flex flex-col items-center justify-between shadow-[5px_0_15px_rgba(0,0,0,0.4)]">
        <div className="tracking-wider flex flex-col items-center  h-full justify-between gap-y-3 md:gap-y-4">
          <button
            onClick={() => setIsCollapsed(false)}
            className="tracking-wider w-12 h-12 rounded-full bg-gray-800/50 border border-purple-700/20 flex items-center justify-center text-gray-200 hover:bg-purple-900/30 transition-colors duration-300 relative group"
            aria-label="Expand sidebar"
          >
            <Menu className="w-4 md:w-5 h-4 md:h-5" />
            <span className="tracking-wider absolute hidden group-hover:block bg-gray-900/90 text-white text-[10px] md:text-xs py-0.5 md:py-1 px-1.5 md:px-2 rounded-md -right-14 md:-right-16 top-1/2 -translate-y-1/2">Expand</span>
          </button>
          <div className="flex flex-col items-center gap-y-1.5 md:gap-y-6">
            <div className="tracking-wider relative w-12" ref={dropdownRef}>
              <button
                onClick={() => setChapterDropdownOpen(prev => !prev)}
                className="tracking-wider w-12 h-12 rounded-full bg-gray-800/50 border border-purple-700/20 flex items-center justify-center text-gray-200 hover:bg-purple-900/30 transition-colors duration-300 relative group"
                aria-label="Select chapter"
                aria-expanded={chapterDropdownOpen}
              >
                <BookOpenText className="w-4 md:w-5 h-4 md:h-5" />
                <span className="tracking-wider absolute -top-2 -right-2 bg-purple-600/70 text-[10px] md:text-xs text-white rounded-full w-4 md:w-5 h-4 md:h-5 flex items-center justify-center">{chapterInfo.chapter}</span>
                <span className="tracking-wider absolute hidden group-hover:block bg-gray-900/90 text-white text-[10px] md:text-xs py-0.5 md:py-1 px-1.5 md:px-2 rounded-md -right-20 md:-right-24 top-1/2 -translate-y-1/2">Select Chapter</span>
              </button>

              {chapterDropdownOpen && (<div className="absolute -top-[150%] left-14 z-50">
                <ChaptersQuickSelect
                  searchQuery={searchQuery} chapterInfo={chapterInfo} setSearchQuery={setSearchQuery} setSortOrder={setSortOrder} sortOrder={sortOrder} goToFirstChapter={goToFirstChapter} goToLastChapter={goToLastChapter} filteredChapters={filteredChapters} goToChapter={goToChapter} setChapterDropdownOpen={setChapterDropdownOpen}
                />
              </div>)
              }
            </div>
            <div
              className="tracking-wider w-12 h-12 rounded-full  relative group border-2 border-purple-700/20 shadow-md">
              <CoverImage
                ariaLabel={mangaInfo.title}
                src={mangaInfo.coverImageUrl}
                alt={mangaInfo.title}
                className="tracking-wider object-cover rounded-full w-full h-full transition-transform duration-300 group-hover:scale-110"
              />
              <div className="flex absolute -right-2 md:-right-3 -top-3 md:-top-4 flex-row text-[9px] md:text-[10px] truncate bg-purple-600/70  text-white p-0.5 md:p-1 px-1 md:px-1.5 rounded-full font-medium border border-purple-700/20 capitalize">{chapterInfo.translatedLanguage}</div>
            </div>
            <button
              onClick={toggleFavorite}
              className={`w-10 md:w-12 h-10  md:h-12 tracking-wider rounded-full flex items-center justify-center transition-all duration-300 relative group ${isFavorite ? 'bg-red-900/30 text-red-400 border border-red-700/20' : 'bg-gray-800/50 text-gray-400 border border-gray-700/20 hover:bg-red-900/30 hover:text-red-400'
                }`}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`w-5 md:w-6 h-5 md:h-6 ${isFavorite ? 'animate-pulse' : ''}`} />
              <span className="tracking-wider absolute hidden group-hover:block bg-gray-900/90 text-white text-[10px] md:text-xs py-0.5 md:py-1 px-1.5 md:px-2 rounded-md -right-20 md:-right-24 top-1/2 -translate-y-1/2">{isFavorite ? 'Unfavorite' : 'Favorite'}</span>
            </button>
          </div>
          <div className="tracking-wider flex flex-col items-center gap-1.5 md:gap-2">
            <div className="tracking-wider flex w-12 md:w-12 flex-col justify-between gap-1.5 md:gap-2">

              <button
                onClick={goToPrevChapter}
                disabled={!hasPrevChapter}
                className={`tracking-wider w-12 h-12 rounded-full bg-gray-800/50 border border-purple-700/20 flex items-center justify-center text-gray-200 hover:bg-purple-900/30 transition-colors duration-300 relative group ${hasPrevChapter
                  ? 'bg-purple-900/30 border-purple-700/20 text-white hover:bg-purple-800/40'
                  : 'bg-gray-800/30 border-gray-700/20 text-gray-500 cursor-not-allowed'
                  }`}
                aria-label="Previous chapter"
                type="button"
              >
                <ArrowBigUpDash className="tracking-wider w-5 md:w-6 h-5 md:h-6" />
              </button>
              <div className="flex text-[10px] md:text-[11px] my-1 md:my-2 flex-row space-x-0.5 md:space-x-1 justify-center items-center">{chapterInfo.chapter} / {filteredChapters.length}</div>
              <button
                onClick={goToNextChapter}
                disabled={!hasNextChapter}
                className={`tracking-wider w-12 h-12 rounded-full bg-gray-800/50 border border-purple-700/20 flex items-center justify-center text-gray-200 hover:bg-purple-900/30 transition-colors duration-300 relative group ${hasNextChapter
                  ? 'bg-purple-900/30 border-purple-700/20 text-white hover:bg-purple-800/40'
                  : 'bg-gray-800/30 border-gray-700/20 text-gray-500 cursor-not-allowed'
                  }`}
                aria-label="Next chapter"
                type="button"
              >
                <ArrowBigDownDash className="tracking-wider w-5 md:w-6 h-5 md:h-6 " />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(CollapsedSideBarStrip);