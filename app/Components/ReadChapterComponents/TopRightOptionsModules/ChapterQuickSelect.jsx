    import React, {memo } from 'react'
    import { X, ChevronDown, File } from 'lucide-react'
import { langFullNames } from '../../../constants/Flags';
    const ChapterQuickSelect = memo(({toggleChapters,chapterInfo,goToChapter,sortOrder,searchQuery,goToFirstChapter, goToLastChapter, filteredChapters, setSearchQuery, setSortOrder}) => (
       <div className="bg-black/95 absolute top-12 -left-12 border border-white/10 rounded-2xl  backdrop-blur-xl">
        
            <div
                style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(155, 89, 182, 0.6) rgba(0, 0, 0, 0.1)' }}
                className="tracking-wider relative  p-2 md:p-3 pt-0  w-48 md:w-64 max-h-64 md:max-h-80 overflow-y-auto bg-black/95 backdrop-blur-lg  rounded-2xl shadow-2xl z-50"
            >
                <div className="flex items-center justify-between">
                        <h3 className="text-white font-semibold ml-2">Chapters</h3>
                        <button
                            onClick={toggleChapters}
                            className="text-gray-400  hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                <div className="tracking-wider sticky top-0 w-full md:-top-3  bg-black/95 p-2 border-b border-purple-700/30">
                    <div className="tracking-wider w-full flex items-center gap-1.5 md:gap-2">
                        <input
                            type="text"
                            placeholder="Search chapters..."
                            value={searchQuery}
                            autoFocus
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="tracking-wider flex-1 bg-gray-800/50 border border-purple-700/20 rounded-md px-1.5 md:px-2 py-0.5 md:py-1 text-[10px] md:text-sm text-white focus:outline-none focus:border-purple-500"
                            aria-label="Search chapters"
                        />
                        <button
                            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                            className="tracking-wider p-0.5 md:p-1 rounded-md bg-purple-700/50 hover:bg-purple-900/30 text-gray-200"
                            aria-label={`Sort chapters ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
                        >
                            <ChevronDown className={`w-3 md:w-4 h-3 md:h-4 ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
                        </button>
                    </div>
                    <div className="tracking-wider flex gap-0.5 md:gap-1 mt-0.5 md:mt-3">
                        <button
                            onClick={goToFirstChapter}
                            className="tracking-wider flex-1 py-0.5 md:py-1 text-[10px] md:text-xs bg-purple-700/50 hover:bg-purple-800/40 text-white rounded-md"
                            aria-label="Go to first chapter"
                        >
                            First
                        </button>
                        <button
                            onClick={goToLastChapter}
                            className="tracking-wider flex-1 py-0.5 md:py-1 text-[10px] md:text-xs bg-purple-700/50 hover:bg-purple-800/40 text-white rounded-md"
                            aria-label="Go to last chapter"
                        >
                            Last
                        </button>
                    </div>
                </div>
                <div className="tracking-wider py-0.5 md:py-1">
                    {filteredChapters.map((chapter) => (
                        <button
                            key={chapter.id}
                            onClick={() => goToChapter(chapter)}
                            className={`w-full tracking-wider text-left px-2 md:px-3 py-1.5 md:py-2 text-[10px] md:text-sm hover:bg-purple-900/30 ${chapter.id === chapterInfo.id ? 'bg-purple-900/50 text-white' : 'text-gray-200'}`}
                            aria-label={`Go to chapter ${chapter.title}`}
                        >
                            <div className="tracking-wider font-medium">Chapter. {chapter.chapter} ({langFullNames[chapter.translatedLanguage]}) </div>
                            <div className="tracking-wider text-[9px] md:text-xs text-gray-400 flex items-center mt-0.5">
                                <File className="w-3 md:w-4 h-3 md:h-4" />
                                <span className="tracking-wider ml-0.5 md:ml-1">{chapter.pageCount} pages</span>
                                <span className="tracking-wider mx-0.5 md:mx-1">•</span>
                                <span>{new Date(chapter.publishAt).toLocaleDateString()}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    ));

    export default ChapterQuickSelect