import { memo } from "react";
import { Star, BookOpen } from "lucide-react";
import StableFlag from "../../StableFlag";

const SearchMangaCardSkeleton = () => {
    const ratingStyle = "bg-gray-600 text-gray-50";
    const statusStyle = "bg-gray-500";

    // StarRating skeleton with gray stars
    const StarRating = () => (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-3 h-3 text-gray-500" />
            ))}
        </div>
    );

    // Placeholder block
    const Placeholder = ({ className }) => (
        <div className={`bg-gray-900 rounded ${className}`} />
    );

    return (
        <article
            className="group relative w-full max-w-sm mx-auto cursor-pointer animate-pulse"
            role="button"
            tabIndex={0}
            aria-label="Loading manga card skeleton"
        >
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-900 transition-all duration-500 ease-out group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:shadow-purple-500/20">
                <div className="absolute inset-0">
                    <Placeholder className="w-full h-full" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
                </div>

                <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-20">
                    <div className="flex items-center gap-1.5">
                        <span className={`${statusStyle} w-2 h-2 rounded-full`} />
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-3 z-20 flex flex-row whitespace-break-spaces items-center gap-2">
                    <div className="bg-black/20 shadow-lg p-0.5 min-w-fit">
                        <StableFlag code="UN" className="h-auto w-7" />
                    </div>
                    <Placeholder className="h-4 w-32 rounded" />
                </div>

                <div
                    className="absolute inset-0 bg-black/70 backdrop-blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-100 ease-out translate-y-4 group-hover:translate-y-0 z-30
          md:opacity-0 md:group-hover:opacity-100 md:translate-y-4 md:group-hover:translate-y-0
          [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:translate-y-4 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:bg-black/70 [@media(hover:hover)]:backdrop-blur-3xl"
                >
                    <div className="h-full flex flex-col p-3 sm:p-4">
                        <div>
                            <div className="flex items-center justify-between mb-1 sm:mb-1.5 min-h-10 sm:min-h-12">
                                <Placeholder className="h-6 w-full max-w-[80%] rounded" />
                            </div>

                            <div className="flex items-center gap-1 sm:gap-1.5 mb-1.5 sm:mb-2">
                                <Placeholder className="h-5 w-6 rounded" />
                                <StarRating />
                                <Placeholder className="h-4 w-10 ml-1 rounded" />
                            </div>
                        </div>

                        <div className="flex-1 mb-2 sm:mb-3">
                            <Placeholder className="h-16 w-full rounded" />
                        </div>

                        <div className="mb-2 sm:mb-3">
                            <div className="flex flex-wrap gap-1">
                                <span
                                    className={`${ratingStyle} px-1 sm:px-1.5 bg-opacity-55 py-0.5 rounded-md text-[9px] sm:text-[10px] font-semibold backdrop-blur-sm`}
                                >
                                    {/* Empty content rating */}
                                </span>
                                {[...Array(3)].map((_, i) => (
                                    <Placeholder
                                        key={i}
                                        className="h-5 w-12 rounded-md"
                                    />
                                ))}
                            </div>
                        </div>

                        <button
                            className="w-full bg-purple-700/40 text-white font-semibold py-2 px-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-1 sm:gap-1.5 group/btn text-sm sm:text-base"
                            aria-label="Loading read now button"
                        >
                            <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 transition-transform group-hover/btn:translate-x-0.5" />
                            Read now
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default memo(SearchMangaCardSkeleton);