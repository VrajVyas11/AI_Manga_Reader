/* eslint-disable @next/next/no-img-element */
import { Heart, BookOpen } from "lucide-react";
import { useState } from "react";
import { langFullNames } from "../../constants/Flags";
import ConfirmationDialog from "./ConfirmationDialog";
import Image from "next/image";
import Link from "next/link";

function FavoriteCard({ mangaInfo, chapterInfo, onMangaClick, addToFavorite, isDark }) {
    const [showConfirm, setShowConfirm] = useState(false);
    const [imageSrc, setImageSrc] = useState(chapterInfo[0]?.url ?? mangaInfo.coverImageUrl ?? "./placeholder.jpg");
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
                className={`group rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer ${isDark
                    ? "hover:border-gray-700/70 hover:shadow-[0_0_7px_rgba(0,0,0,1)] hover:shadow-red-500/20"
                    : "hover:border-gray-300 hover:shadow-md"
                    }`}
            >
                {console.log(chapterInfo)}
                <Link
                    href={`/manga/${mangaInfo.id}/chapter/${chapterInfo[0].id}/read`}
                    prefetch={true}
                    onClick={() => onMangaClick(mangaInfo,chapterInfo[0])}
                    className="relative h-auto w-full overflow-hidden"
                >
                    <Image
                        width={100}
                        height={100}
                        src={imageSrc}
                        alt={mangaInfo.title}
                        className="w-full h-full max-h-[175px] object-cover group-hover:scale-105 transition-all duration-100 xs:w-full xs:h-[175px]"
                        onError={(e) => {
                            e.currentTarget.style.height = "175px";
                            setImageSrc(mangaInfo.coverImageUrl);
                        }}
                    />
                    {/* Favorite Button */}
                    <div className="absolute z-50 top-3 right-3">
                        <button
                            onClick={handleRemoveClick}
                            className={`p-2 rounded-full shadow-lg transition-all transform hover:scale-110 focus:outline-none ${isDark ? "bg-red-600 hover:bg-red-700" : "bg-red-400 hover:bg-red-500"
                                } text-white`}
                            title="Remove from favorites"
                            aria-label="Remove from favorites"
                        >
                            <Heart size={18} className="fill-white" />
                        </button>
                    </div>

                    {/* Content Info */}
                    <div
                        className={`absolute inset-0 rounded-t-3xl ${isDark
                            ? "bg-gradient-to-t from-black/90 via-black/60 to-transparent"
                            : "bg-gradient-to-t from-black/50 via-black/40 to-transparent"
                            }`}
                    />
                    <div className="absolute bottom-3 left-4 right-4">
                        <h3
                            className={`font-bold max-w-[74%] mb-2 text-lg line-clamp-1 drop-shadow-lg text-white`}
                        >
                            {mangaInfo.title}
                        </h3>
                        <div className="flex items-center gap-2 w-full">
                            {/* Language Badge */}
                            {chapterInfo[0]?.translatedLanguage && (
                                <div
                                    className={`w-fit rounded-lg px-2 py-1 text-xs border ${isDark
                                        ? "bg-black/60 border-white/20 text-white backdrop-blur-sm"
                                        : "bg-gray-200 border-gray-300 text-gray-800"
                                        }`}
                                >
                                    {langFullNames[chapterInfo[0].translatedLanguage] ??
                                        chapterInfo[0].translatedLanguage}
                                </div>
                            )}
                            {chapterInfo[0]?.title && (
                                <p
                                    className={`text-xs max-w-[54%] line-clamp-1 text-gray-300
                  `}
                                >
                                    {chapterInfo[0].title}
                                </p>
                            )}
                            <p
                                className={`text-sm p-2 absolute right-0 -bottom-1 text-gray-200 flex items-center gap-2 ${isDark ? "" : "bg-black/80 rounded-xl"
                                    }`}
                            >
                                <BookOpen size={14} />
                                Ch. {chapterInfo[0]?.chapter ?? "N/A"}
                            </p>
                        </div>
                    </div>
                </Link>
            </div>
            {showConfirm && (
                <ConfirmationDialog
                    message={`Remove "${mangaInfo.title}" from favorites?`}
                    onConfirm={confirmRemove}
                    onCancel={cancelRemove}
                    isDark={isDark}
                />
            )}
        </>
    );
}

export default FavoriteCard;