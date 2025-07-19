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
}) {
  return (
    <div className="relative ml-1 p-1.5 w-44 md:ml-2 md:p-2 md:w-64 bg-black/95 backdrop-blur-3xl border border-purple-700/30 rounded-lg shadow-xl">
      <div className="p-1 border-b border-purple-700/30 flex flex-col gap-1 md:p-2 md:gap-2">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 md:w-3.5 md:h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search chapters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-7 pr-2 py-1 bg-gray-800/60 border border-purple-700/30 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 text-xs md:pl-9 md:pr-3 md:py-1.5 md:text-sm"
          />
        </div>

        <div className="flex gap-1">
          <button
            onClick={() =>
              setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
            }
            className="flex items-center gap-1 px-1.5 py-1 bg-gray-800/60 hover:bg-purple-900/40 rounded-md text-gray-300 hover:text-white transition-colors text-[10px] md:gap-1.5 md:px-2 md:py-1.5 md:text-xs"
            aria-label={`Sort chapters ${
              sortOrder === 'asc' ? 'descending' : 'ascending'
            }`}
          >
            <ArrowUpDown className="w-3 h-3 md:w-3.5 md:h-3.5" />
            <span>{sortOrder === 'asc' ? 'Oldest' : 'Newest'}</span>
          </button>

          <button
            onClick={goToFirstChapter}
            className="flex-1 px-1.5 py-1 bg-purple-900/60 hover:bg-purple-800/70 text-white rounded-md text-xs transition-colors md:px-2 md:py-1.5 md:text-xs"
          >
            First
          </button>

          <button
            onClick={goToLastChapter}
            className="flex-1 px-1.5 py-1 bg-purple-900/60 hover:bg-purple-800/70 text-white rounded-md text-xs transition-colors md:px-2 md:py-1.5 md:text-xs"
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
          <div className="text-center py-4 text-gray-400 font-medium text-xs md:py-6 md:text-sm">
            <BookOpen className="w-7 h-7 mx-auto mb-1 opacity-50 md:w-10 md:h-10" />
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
              className={`w-full text-left p-1.5 rounded-md mb-1 transition-colors font-medium text-xs md:p-2 md:mb-1.5 md:text-sm ${
                chapter.id === chapterInfo.id
                  ? 'bg-purple-900/40 text-white border border-purple-700/30 shadow-md'
                  : 'text-gray-300 hover:bg-purple-900/40 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="mb-0.5 text-sm leading-tight truncate md:text-base">
                    Chapter {chapter.chapter} : {chapter.title}
                  </div>
                  <div className="text-[9px] text-gray-400 flex items-center gap-2 flex-wrap md:text-xs md:gap-3">
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