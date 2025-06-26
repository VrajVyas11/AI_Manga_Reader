import {
  Heart,
  BookOpenCheck,
} from 'lucide-react';
export const FavoriteChaptersCard = ({ favorites, onMangaClick }) => {
    return (
        <div className="space-y-5">
            <div className="flex-1 mt-2 flex flex-col shadow-lg">
                <div className="flex mb-5 gap-3 items-center justify-between">
                    <div className="flex items-center gap-3 justify-between">
                        <div className="bg-gray-800/50 p-3 rounded-lg">
                            <BookOpenCheck className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-base font-semibold text-gray-100">Favorites</h2>
                            <p className="text-[9px] text-gray-400 uppercase tracking-wide">Your favorites chapters</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 bg-gray-900/80 p-1 px-3 rounded-full border border-gray-800">
                        <div>{favorites.length}</div>
                    </div>
                </div>

                <div className="flex-1 max-h-[25vh] overflow-scroll custom-scrollbar space-y-2">
                    {favorites.length > 0 ? (
                        favorites.map((item, idx) => (
                            <CompactMangaCard
                                key={idx}
                                item={item}
                                onClick={onMangaClick}
                                type="favorite"
                            />
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center py-6">
                            <div className="p-3 bg-gray-900 rounded-full mb-3">
                                <Heart className="w-6 h-6 text-gray-400" />
                            </div>
                            <p className="text-gray-600 text-sm font-medium">No favorites yet</p>
                            <p className="text-gray-700 text-xs mt-1">Heart your favorite chapters</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


// Compact Card for Favorites (responsive)
export const CompactMangaCard = ({ item, onClick, type }) => {
    const manga = item.manga || item.mangaInfo || item;
    const isChapter = type === 'favorite' && item.chapterInfo;

    return (
        <div
            onClick={() => onClick(manga)}
            className={`group backdrop-blur-sm border border-gray-900 rounded-lg ${isChapter ? "p-2 sm:p-3 bg-gray-950/90" : "p-0"
                } cursor-pointer hover:border-gray-700 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 text-sm`}
            title={manga.title}
        >
            <div className={`flex gap-2 sm:gap-3 ${isChapter ? "" : "flex-col"}`}>
                <div className={`relative ${isChapter ? "w-12 sm:w-16 h-12 sm:h-16" : "w-full h-16 sm:h-18"
                    } rounded-full overflow-hidden flex-shrink-0 ring-1 ring-gray-900/80`}>
                    <img
                        src={manga.coverImageUrl || '/placeholder.jpg'}
                        alt={manga.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                    />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                    {isChapter ? (
                        <>
                            <div className="text-xs sm:text-sm font-semibold text-gray-100 truncate">
                                {item.chapterInfo[0]?.title || 'Chapter Title'}
                            </div>
                            <div className="text-xs text-gray-400 select-none">
                                Ch. {item.chapterInfo[0]?.chapter}
                            </div>
                            <div className="text-xs text-gray-600 truncate max-w-full">
                                Manga: <span className="text-gray-400">{manga.title}</span>
                            </div>
                        </>
                    ) : (
                        <h4 className="text-gray-100 mb-2 sm:mb-4 text-xs text-center font-semibold line-clamp-2 group-hover:text-gray-300 transition-colors">
                            {manga.title}
                        </h4>
                    )}
                </div>
            </div>
        </div>
    );
};

// Mobile Right Sidebar (drawer)
export const MobileFavoriteChaptersCard = ({ favorites ,handleMangaClick}) => {
    return (
        <div className="flex flex-col h-auto">
            <div className="flex mb-4 items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-gray-800/50 p-2 sm:p-3 rounded-lg">
                        <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-rose-400" />
                    </div>
                    <div>
                        <h2 className="text-sm sm:text-base font-semibold text-gray-100">Favorites</h2>
                        <p className="text-[8px] sm:text-[9px] text-gray-400 uppercase tracking-wide">Your favorite chapters</p>
                    </div>
                </div>
                <div className="bg-white/10 rounded-full p-1 px-2 sm:px-3 text-xs sm:text-sm">{favorites.length}</div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {favorites.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {favorites.map((item, idx) => (
                            <CompactMangaCard
                                key={idx}
                                item={item}
                                onClick={handleMangaClick}
                                type="favorite"
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center py-8">
                        <div className="p-4 bg-gray-900 rounded-full mb-4">
                            <Heart className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-100 mb-2">No Favorites</h3>
                        <p className="text-gray-400 text-sm">Heart your favorite chapters to see them here!</p>
                    </div>
                )}
            </div>
        </div>
    );
};