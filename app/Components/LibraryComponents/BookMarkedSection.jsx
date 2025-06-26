import Image from 'next/image';
import {
  BookOpen,
  Bookmark,
} from 'lucide-react';

export const MobileBookMarkedSection = ({ bookmarks, handleMangaClick }) => {
  return(  <div className="flex w-full flex-col h-full">
        <div className="flex mb-4 items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="bg-gray-800/50 p-2 sm:p-3 rounded-lg">
                    <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400" />
                </div>
                <div>
                    <h2 className="text-sm sm:text-base font-semibold text-gray-100">BookMarked Mangas</h2>
                    <p className="text-[8px] sm:text-[9px] text-gray-400 uppercase tracking-wide">Book marked manga collections</p>
                </div>
            </div>
            <div className="bg-white/10 rounded-full p-1 px-2 sm:px-3 text-xs sm:text-sm">{bookmarks.length}</div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
            {bookmarks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {bookmarks.map((manga, idx) => (
                        <div
                            key={manga.manga.id}
                            onClick={() => handleMangaClick(manga.manga)}
                            className="group border border-gray-800 hover:border-gray-700 bg-gray-950/50 hover:bg-gray-900/50 rounded-lg p-3 cursor-pointer transition-all duration-300 hover:-translate-y-0.5"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-16 sm:w-14 sm:h-18 rounded-md overflow-hidden shadow-md flex-shrink-0">
                                    <Image
                                        width={56}
                                        height={72}
                                        src={manga.manga.coverImageUrl || '/placeholder.jpg'}
                                        alt={manga.manga.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm sm:text-base font-semibold text-gray-100 truncate mb-1">
                                        {manga.manga.title}
                                    </h3>
                                    <div className="flex items-center gap-1 text-xs text-gray-400">
                                        <Bookmark className="w-3 h-3 text-indigo-400" />
                                        <span>{new Date(manga.bookmarkedAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-8">
                    <div className="p-4 bg-gray-900 rounded-full mb-4">
                        <Bookmark className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-100 mb-2">No Bookmarks</h3>
                    <p className="text-gray-400 text-sm">Start bookmarking your favorite manga!</p>
                </div>
            )}
        </div>
    </div>)
}
export const BookMarkedSection = ({ bookmarks }) => {
    return (
        <section
            aria-label="BookMarked Mangas"
            className="w-full hidden md:block mb-10 md:mb-0  rounded-xl  shadow-xl"
        >
            <div className="flex mb-7 items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-gray-800/50 p-3 rounded-lg">
                        <BookOpen className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                        <h2 className="text-base font-semibold text-gray-100">BookMarked Mangas</h2>
                        <p className="text-[9px] text-gray-400 uppercase tracking-wide">Book marked manga collections</p>
                    </div>
                </div>
                <div className=' bg-white/10 rounded-full p-1 px-3'>{bookmarks.length}</div>
            </div>

            {/* Manga List */}
            <ul className="w-full gap-2 flex flex-col max-h-[170px] overflow-y-auto custom-scrollbar">
                {bookmarks.slice(0, 9).map((manga, idx) => (
                    <li
                        key={manga.manga.id}
                        tabIndex={0}
                        className="group border-l-8 border-purple-950 pl-3 mr-3 flex items-center md:gap-1 cursor-pointer rounded-lg  py-2 transition-colors duration-250 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 hover:bg-gray-800/50"
                        aria-label={`${manga.manga.title} - Bookmarked`}
                    >

                        {/* Cover */}
                        <div className="flex-shrink-0  w-10 h-12 md:w-12 md:h-16 rounded-md overflow-hidden shadow-md">
                            <Image
                                width={48}
                                height={64}
                                src={manga.manga.coverImageUrl || '/placeholder.jpg'}
                                alt={`Cover for ${manga.manga.title || 'unknown manga'}`}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[102%]"
                                loading="lazy"
                                decoding="async"
                                onError={(e) => (e.target.src = '/placeholder.jpg')}
                            />
                        </div>

                        {/* Title & Stats */}
                        <div className="flex flex-col ml-1 md:ml-3 flex-1 min-w-0">
                            <h3
                                className="text-gray-100 text-xs md:text-base font-semibold truncate"
                                title={manga.manga.title}
                            >
                                {manga.manga.title || 'Untitled Manga'}
                            </h3>

                            <div className="flex items-center gap-1 md:gap-1 mt-1 text-xs text-gray-400">
                                <span
                                    className="flex items-center justify-center w-5 h-5 rounded-full  text-indigo-400"
                                >
                                    <Bookmark className="w-4 h-4" />
                                </span>
                                <span className="font-medium text-gray-300">{new Date(manga.bookmarkedAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    )
}

