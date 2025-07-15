import React from 'react';
import {
  BookOpen,
  File,
  Search,
  ArrowUpDown,
} from 'lucide-react';
function ChaptersQuickSelect({chapterInfo,searchQuery,setSearchQuery,setSortOrder,sortOrder,goToFirstChapter,goToLastChapter,filteredChapters,goToChapter,setChapterDropdownOpen}) {
    return (
        <div className="relative ml-2 p-2 w-64 bg-black/95  backdrop-blur-3xl border border-purple-700/30 rounded-lg shadow-xl">
            <div className="p-2 border-b border-purple-700/30  flex flex-col gap-2">
                <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search chapters..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 bg-gray-800/60 border border-purple-700/30 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 text-sm "
                    />
                </div>

                <div className="flex gap-1.5">
                    <button
                        onClick={() =>
                            setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
                        }
                        className="flex items-center gap-1.5 px-2 py-1.5 bg-gray-800/60 hover:bg-purple-900/40 rounded-md text-gray-300 hover:text-white transition-colors  text-xs"
                        aria-label={`Sort chapters ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
                    >
                        <ArrowUpDown className="w-3.5 h-3.5" />
                        <span>{sortOrder === 'asc' ? 'Oldest' : 'Newest'}</span>
                    </button>

                    <button
                        onClick={goToFirstChapter}
                        className="flex-1 px-2 py-1.5 bg-purple-900/60 hover:bg-purple-800/70 text-white rounded-md text-xs   transition-colors"
                    >
                        First
                    </button>

                    <button
                        onClick={goToLastChapter}
                        className="flex-1 px-2 py-1.5 bg-purple-900/60 hover:bg-purple-800/70 text-white rounded-md text-xs   transition-colors"
                    >
                        Last
                    </button>
                </div>
            </div>

            <div
                className="p-1.5 overflow-y-auto max-h-[28vh] h-auto"
                style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'rgba(155, 89, 182, 0.6) rgba(0, 0, 0, 0.1)',
                }}
            >
                {filteredChapters.length === 0 ? (
                    <div className="text-center py-6 text-gray-400 font-medium  text-sm">
                        <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-50" />
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
                            className={`w-full text-left p-2 rounded-md mb-1.5 transition-colors font-medium  text-sm ${chapter.id === chapterInfo.id
                                ? 'bg-purple-900/40 text-white border border-purple-700/30 shadow-md'
                                : 'text-gray-300 hover:bg-purple-900/40 hover:text-white'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                    <div className="mb-0.5 text-base leading-tight truncate">
                                        Chapter {chapter.chapter} : {chapter.title}
                                    </div>
                                    <div className="text-xs text-gray-400 flex items-center gap-3 flex-wrap">
                                        <div className="flex items-center gap-1">
                                            <File className="w-3 h-3" />
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
    )
}

export default React.memo(ChaptersQuickSelect);