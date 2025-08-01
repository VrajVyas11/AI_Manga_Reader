import {
    Heart,
    BookOpen,
} from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { langFullNames } from "../../constants/Flags";
import ConfirmationDialog from "./ConfirmationDialog";

function FavoriteCard({ mangaInfo, chapterInfo, onMangaClick, addToFavorite }) {
    const [showConfirm, setShowConfirm] = useState(false);

    const handleRemoveClick = (e) => {
        e.stopPropagation();
        setShowConfirm(true);
    };

    const confirmRemove = () => {
        addToFavorite(mangaInfo, chapterInfo[0]);
        setShowConfirm(false);
    };

    const cancelRemove = () => setShowConfirm(false);

    return (
        <>
            <div
                className="group  rounded-2xl overflow-hidden hover:border-gray-700/70 transition-all duration-300 hover:shadow-[0_0_7px_rgba(0,0,0,1)] hover:shadow-red-500/20 "
            >
                <div
                    onClick={() => onMangaClick(mangaInfo)}
                    className="relative cursor-pointer h-auto w-full overflow-hidden">
                    <Image
                        width={300}
                        height={300}
                        src={chapterInfo[0]?.url || mangaInfo.coverImageUrl}
                        alt={mangaInfo.title}
                        className="w-full h-full  group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                    {/* Favorite Button */}
                    <div className="absolute z-50 top-3 right-3">
                        <button
                            onClick={handleRemoveClick}
                            className="p-2 bg-red-600 rounded-full shadow-lg hover:bg-red-700 transition-all transform hover:scale-110 focus:outline-none "
                            title="Remove from favorites"
                            aria-label="Remove from favorites"
                        >
                            <Heart size={18} className="fill-white text-white" />
                        </button>
                    </div>

                    {/* Content Info */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent rounded-t-3xl" />
                    <div className="absolute bottom-3 left-4 right-4">
                        <h3 className="font-bold max-w-[74%] text-white text-lg line-clamp-1 mb-2 drop-shadow-lg">
                            {mangaInfo.title}
                        </h3>
                        <div className="space-x-1 w-full flex flex-row justify-start items-center">
                            <p className="text-sm absolute right-0 bottom-1 text-gray-200 flex items-center gap-2">
                                <BookOpen size={14} />
                                Ch. {chapterInfo[0]?.chapter ?? "N/A"}
                            </p>
                            <div className=" w-full flex flex-row items-center gap-2">
                                {/* Language Badge */}
                                {chapterInfo[0]?.translatedLanguage && (
                                    <div className="w-fit bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg text-xs text-white border border-white/20">
                                        {langFullNames[chapterInfo[0].translatedLanguage] ||
                                            chapterInfo[0].translatedLanguage}
                                    </div>
                                )}
                                {chapterInfo[0]?.title && (
                                    <p className="text-xs w-full max-w-[54%] text-gray-300 line-clamp-1">
                                        {chapterInfo[0].title}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showConfirm && (
                <ConfirmationDialog
                    message={`Remove "${mangaInfo.title}" from favorites?`}
                    onConfirm={confirmRemove}
                    onCancel={cancelRemove}
                />
            )}
        </>
    );

}

export default FavoriteCard