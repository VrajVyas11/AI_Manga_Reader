import { langFullNames } from '@/app/constants/Flags';
import React, { memo } from 'react'
function CollapsedSideBarStrip({ isFavorite, toggleFavorite, mangaInfo, HeartIcon, MenuIcon, setIsCollapsed, CoverImage, BookIcon, PageIcon, hasPrevChapter, goToNextChapter, hasNextChapter, sortOrder, goToPrevChapter, SvgIcon, goToChapter, filteredChapters, goToLastChapter, goToFirstChapter, setSortOrder, setSearchQuery, searchQuery, chapterInfo, dropdownRef, setChapterDropdownOpen, chapterDropdownOpen }) {
    console.log(chapterInfo)
    const ChapterQuickSelect = memo(() => (
        <div className="relative w-12" ref={dropdownRef}>
            <button
                onClick={() => setChapterDropdownOpen(prev => !prev)}
                className="w-12 h-12 rounded-lg bg-gray-800/50 border border-purple-700/20 flex items-center justify-center text-gray-200 hover:bg-purple-900/30 transition-colors duration-300 relative group"
                aria-label="Select chapter"
                aria-expanded={chapterDropdownOpen}
            >
                <BookIcon />
                <span className="absolute -top-2 -right-2 bg-purple-600 text-xs text-white rounded-full w-5 h-5 flex items-center justify-center">{chapterInfo.chapter}</span>
                <span className="absolute hidden group-hover:block bg-gray-900/90 text-white text-xs py-1 px-2 rounded-md -right-24 top-1/2 -translate-y-1/2">Select Chapter</span>
            </button>

            {chapterDropdownOpen && (
                <div
                    style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(155, 89, 182, 0.6) rgba(0, 0, 0, 0.1)' }}
                    className="absolute left-14 p-3 pt-0 top-0 -mt-28 w-64 max-h-80 overflow-y-auto bg-gray-900/95 backdrop-blur-lg border border-purple-700/30 rounded-lg shadow-2xl z-50">
                    <div className="sticky top-0 pt-5 bg-gray-900/95 p-2 border-b border-purple-700/30">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="Search chapters..."
                                value={searchQuery}
                                autoFocus
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 bg-gray-800/50 border border-purple-700/20 rounded-md px-2 py-1 text-sm text-white focus:outline-none focus:border-purple-500"
                                aria-label="Search chapters"
                            />
                            <button
                                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                                className="p-1 rounded-md bg-gray-800/50 hover:bg-purple-900/30 text-gray-200"
                                aria-label={`Sort chapters ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
                            >
                                <SvgIcon className={`w-4 h-4 ${sortOrder === 'asc' ? 'rotate-180' : ''}`}>
                                    <polyline points="6 9 12 15 18 9" />
                                </SvgIcon>
                            </button>
                        </div>
                        <div className="flex gap-1 mt-1">
                            <button
                                onClick={goToFirstChapter}
                                className="flex-1 py-1 text-xs bg-purple-900/30 hover:bg-purple-800/40 text-white rounded-md"
                                aria-label="Go to first chapter"
                            >
                                First
                            </button>
                            <button
                                onClick={goToLastChapter}
                                className="flex-1 py-1 text-xs bg-purple-900/30 hover:bg-purple-800/40 text-white rounded-md"
                                aria-label="Go to last chapter"
                            >
                                Last
                            </button>
                        </div>
                    </div>
                    <div className="py-1">
                        {filteredChapters.map((chapter) => (
                            <button
                                key={chapter.id}
                                onClick={() => goToChapter(chapter)}
                                className={`w-full text-left px-3 py-2 text-sm hover:bg-purple-900/30 ${chapter.id === chapterInfo.id ? 'bg-purple-900/50 text-white' : 'text-gray-200'}`}
                                aria-label={`Go to chapter ${chapter.title}`}
                            >
                                <div className="font-medium">Chapter. {chapter.chapter} ({langFullNames[chapter.translatedLanguage]}) </div>
                                <div className="text-xs text-gray-400 flex items-center mt-0.5">
                                    <PageIcon />
                                    <span className="ml-1">{chapter.pageCount} pages</span>
                                    <span className="mx-1">•</span>
                                    <span>{new Date(chapter.publishAt).toLocaleDateString()}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    ));

    return (
        <div className="relative left-0 top-0 h-[91.7vh] z-40 flex justify-center items-center">
            <div className="h-full pt-16 w-[70px] bg-gray-900/90 backdrop-blur-lg border-r border-purple-900/20  py-6 px-2 flex flex-col items-center justify-between shadow-[5px_0_15px_rgba(0,0,0,0.4)]">
                <div className="flex flex-col items-center h-full justify-around space-y-4">
                    <div className='flex flex-col items-center space-y-2'>
                        <div className="w-12 h-12 rounded-lg mb-1 relative group border-2 border-purple-700/20 shadow-md">
                            <CoverImage
                                src={mangaInfo.coverImageUrl}
                                alt={mangaInfo.title}
                                className="object-cover rounded-lg w-full h-full transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className='flex absolute -right-3 -top-4 flex-row  text-[10px] truncate bg-purple-900/90 text-white p-1 px-1.5 rounded-full font-medium border border-purple-700/20 capitalize'>{chapterInfo.translatedLanguage}</div>

                            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <span className="absolute hidden group-hover:block bg-gray-900/90 text-white text-xs py-1 px-2 rounded-md -right-24 top-1/2 line-clamp-1 -translate-y-1/2">{mangaInfo.title}</span>
                        </div>

                        <button
                            onClick={() => setIsCollapsed(false)}
                            className="w-12 h-12 rounded-lg bg-gray-800/50 border border-purple-700/20 flex items-center justify-center text-gray-200 hover:bg-purple-900/30 transition-colors duration-300 relative group"
                            aria-label="Expand sidebar"
                        >
                            <MenuIcon />
                            <span className="absolute hidden group-hover:block bg-gray-900/90 text-white text-xs py-1 px-2 rounded-md -right-16 top-1/2 -translate-y-1/2">Expand</span>
                        </button>

                    </div>
                    <ChapterQuickSelect />

                    <div className="flex flex-col items-center gap-2">
                        <div className="flex w-14 flex-col justify-between gap-2">
                            <button
                                onClick={goToPrevChapter}
                                disabled={!hasPrevChapter}
                                className={`flex-1 py-2 h-12 rounded-lg flex flex-col items-center justify-center border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 ${hasPrevChapter
                                    ? 'bg-purple-900/30 border-purple-700/20 text-white hover:bg-purple-800/40'
                                    : 'bg-gray-800/30 border-gray-700/20 text-gray-500 cursor-not-allowed'
                                    }`}
                                aria-label="Previous chapter"
                                type="button"
                            >
                                <SvgIcon className="w-5 h-5 rotate-90 mb-1" aria-hidden="true">
                                    <polyline points="15 18 9 12 15 6" />
                                </SvgIcon>
                                <span className="text-xs select-none">Next</span>
                            </button>
                            <div className='flex text-[11px] my-2 flex-row space-x-1 justify-center items-center'>{chapterInfo.chapter} / {filteredChapters.length}</div>
                            <button
                                onClick={goToNextChapter}
                                disabled={!hasNextChapter}
                                className={`flex-1 py-2  h-12 rounded-lg flex flex-col items-center justify-center border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 ${hasNextChapter
                                    ? 'bg-purple-900/30 border-purple-700/20 text-white hover:bg-purple-800/40'
                                    : 'bg-gray-800/30 border-gray-700/20 text-gray-500 cursor-not-allowed'
                                    }`}
                                aria-label="Next chapter"
                                type="button"
                            >
                                <SvgIcon className="w-5 h-5 rotate-90 mb-1" aria-hidden="true">
                                    <polyline points="9 18 15 12 9 6" />
                                </SvgIcon>
                                <span className="text-xs select-none">Prev</span>
                            </button>
                        </div>

                    </div>
                </div>
                <button
                    onClick={toggleFavorite}
                    className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300 relative group ${isFavorite ? 'bg-red-900/30 text-red-400 border border-red-700/20' : 'bg-gray-800/50 text-gray-400 border border-gray-700/20 hover:bg-red-900/30 hover:text-red-400'}`}
                    aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                    <HeartIcon filled={isFavorite} className={`w-6 h-6 ${isFavorite ? 'animate-pulse' : ''}`} />
                    <span className="absolute hidden group-hover:block bg-gray-900/90 text-white text-xs py-1 px-2 rounded-md -right-24 top-1/2 -translate-y-1/2">{isFavorite ? 'Unfavorite' : 'Favorite'}</span>
                </button>
            </div>
        </div>
    )
}

export default CollapsedSideBarStrip