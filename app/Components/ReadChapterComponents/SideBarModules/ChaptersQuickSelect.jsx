import React from 'react';
import { BookOpen, File, Search, ArrowUpDown } from 'lucide-react';

function ChaptersQuickSelect({
  chapterInfo,
  searchQuery,
  setSearchQuery,
  setSortOrder,
  sortOrder,
  goToFirstChapter,
  goToLastChapter,
  filteredChapters,
  goToChapter,
  setChapterDropdownOpen,
  isDark=true,
}) {
  return (
    <div
      className={`
        relative ml-1 p-1.5 w-44 md:ml-2 md:p-2 md:w-64 rounded-lg shadow-xl border
        backdrop-blur-3xl
        ${isDark
          ? 'bg-black/95 border-purple-700/30'
          : 'bg-white/90 border-purple-300'}
      `}
    >
      <div
        className={`
          p-1 border-b flex flex-col gap-1 md:p-2 md:gap-2
          ${isDark ? 'border-purple-700/30' : 'border-purple-300'}
        `}
      >
        <div className="relative">
          <Search
            className={`absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 md:w-3.5 md:h-3.5 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}
          />
          <input
            type="text"
            placeholder="Search chapters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`
              w-full pl-7 pr-2 py-1 rounded-md text-xs md:pl-9 md:pr-3 md:py-1.5 md:text-sm
              focus:outline-none focus:border-purple-500
              border
              ${isDark
                ? 'bg-gray-800/60 border-purple-700/30 text-white placeholder-gray-400'
                : 'bg-gray-100 border-purple-300 text-gray-900 placeholder-gray-500'}
              transition-colors duration-200
            `}
          />
        </div>

        <div className="flex gap-1">
          <button
            onClick={() =>
              setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
            }
            aria-label={`Sort chapters ${
              sortOrder === 'asc' ? 'descending' : 'ascending'
            }`}
            className={`
              flex items-center gap-1 px-1.5 py-1 rounded-md text-[10px] md:gap-1.5 md:px-2 md:py-1.5 md:text-xs
              transition-colors duration-200
              ${isDark
                ? 'bg-gray-800/60 hover:bg-purple-900/40 text-gray-300 hover:text-white'
                : 'bg-gray-200 hover:bg-purple-300 text-gray-700 hover:text-white'}
            `}
          >
            <ArrowUpDown className="w-3 h-3 md:w-3.5 md:h-3.5" />
            <span>{sortOrder === 'asc' ? 'Oldest' : 'Newest'}</span>
          </button>

          <button
            onClick={goToFirstChapter}
            className={`
              flex-1 px-1.5 py-1 rounded-md text-xs md:px-2 md:py-1.5 md:text-xs
              transition-colors duration-200
              ${isDark
                ? 'bg-purple-900/60 hover:bg-purple-800/70 text-white'
                : 'bg-purple-600 hover:bg-purple-700 text-white'}
            `}
          >
            First
          </button>

          <button
            onClick={goToLastChapter}
            className={`
              flex-1 px-1.5 py-1 rounded-md text-xs md:px-2 md:py-1.5 md:text-xs
              transition-colors duration-200
              ${isDark
                ? 'bg-purple-900/60 hover:bg-purple-800/70 text-white'
                : 'bg-purple-600 hover:bg-purple-700 text-white'}
            `}
          >
            Last
          </button>
        </div>
      </div>

      <div
        className="p-1 overflow-y-auto max-h-[20vh] md:max-h-[28vh] h-auto"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(155, 89, 182, 0.6) rgba(0, 0, 0, 0.1)',
        }}
      >
        {filteredChapters.length === 0 ? (
          <div
            className={`
              text-center py-4 font-medium text-xs md:py-6 md:text-sm
              ${isDark ? 'text-gray-400' : 'text-gray-600'}
            `}
          >
            <BookOpen
              className={`mx-auto mb-1 opacity-50 md:w-10 md:h-10 ${
                isDark ? 'w-7 h-7' : 'w-7 h-7'
              }`}
            />
            <p>No chapters found</p>
          </div>
        ) : (
          filteredChapters.map((chapter) => (
            <button
              key={chapter.id}
              onClick={() => {
                goToChapter(chapter);
                setChapterDropdownOpen(false);
              }}
              className={`
                w-full text-left p-1.5 rounded-md mb-1 font-medium text-xs md:p-2 md:mb-1.5 md:text-sm
                transition-colors duration-200
                ${
                  chapter.id === chapterInfo.id
                    ? isDark
                      ? 'bg-purple-900/40 text-white border border-purple-700/30 shadow-md'
                      : 'bg-purple-300/40 text-purple-900 border border-purple-400 shadow-md'
                    : isDark
                    ? 'text-gray-300 hover:bg-purple-900/40 hover:text-white'
                    : 'text-gray-700 hover:bg-purple-300 hover:text-purple-900'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="mb-0.5 text-sm leading-tight truncate md:text-base">
                    Chapter {chapter.chapter} : {chapter.title}
                  </div>
                  <div
                    className={`
                      text-[9px] flex items-center gap-2 flex-wrap md:text-xs md:gap-3
                      ${isDark ? 'text-gray-400' : 'text-gray-600'}
                    `}
                  >
                    <div className="flex items-center gap-1">
                      <File className="w-2.5 h-2.5 md:w-3 md:h-3" />
                      <span>{chapter.pageCount} pages</span>
                    </div>
                    <span>{new Date(chapter.publishAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

export default React.memo(ChaptersQuickSelect);