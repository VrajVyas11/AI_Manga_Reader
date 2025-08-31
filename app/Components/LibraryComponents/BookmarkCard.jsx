import { Bookmark, Clock, Star } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import ConfirmationDialog from "./ConfirmationDialog";
import Link from "next/link";

function BookmarkCard({ manga, bookmarkedAt, onMangaClick, addToBookMarks, isDark }) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleRemoveClick = (e) => {
    e.stopPropagation();
    setShowConfirm(true);
  };

  const confirmRemove = () => {
    addToBookMarks(manga);
    setShowConfirm(false);
  };

  const cancelRemove = () => setShowConfirm(false);

  return (
    <>
      <Link
        href={`/manga/${manga.id}/chapters`}
        prefetch={true}
        className={`group rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${isDark
          ? "bg-gray-900/60 backdrop-blur-sm border border-gray-800/50 hover:border-gray-700/70 hover:shadow-[0_0_7px_rgba(0,0,0,1)] hover:shadow-blue-500/20"
          : "bg-white border border-gray-300 shadow-sm hover:border-gray-400 hover:shadow-md"
          }`}
        onClick={() => onMangaClick(manga)}
      >
        <div className="relative h-64 overflow-hidden">
          <Image
            width={300}
            height={300}
            src={manga.coverImageUrl}
            alt={manga.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
          />
          <div
            className={`absolute inset-0 z-30 ${isDark
              ? "bg-gradient-to-t from-black via-black/70 to-transparent"
              : "bg-gradient-to-t from-black via-black/20 to-transparent"
              }`}
          />

          {/* Bookmark Button */}
          <div className="absolute top-3 right-3">
            <button
              onClick={handleRemoveClick}
              className={`p-2 rounded-full shadow-lg transition-all transform hover:scale-110 focus:outline-none ${isDark ? "bg-blue-700 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"
                } text-white`}
              title="Remove from bookmarks"
              aria-label="Remove from bookmarks"
            >
              <Bookmark size={18} className="fill-white" />
            </button>
          </div>

          {/* Rating Badge */}
          {manga.rating && (
            <div
              className={`absolute top-3 left-3 flex items-center gap-1 rounded-lg px-2 py-1 text-xs border ${isDark
                ? "bg-black/60 border-white/20 text-white backdrop-blur-sm"
                : "bg-gray-200 border-gray-300 text-black"
                }`}
            >
              <Star size={12} className={`${isDark
                ? "text-yellow-400" : " text-yellow-600 fill-yellow-400"}`} />
              {manga.rating?.rating?.average?.toFixed(1) ||
                manga.rating?.follows?.toFixed(1) ||
                "N/A"}
            </div>
          )}

          {/* Content Info */}
          <div className="absolute bottom-0 left-0 right-0 p-4 z-50">
            <h3 className={`text-white font-bold text-lg line-clamp-1 mb-1 drop-shadow-lg`}>
              {manga.title}
            </h3>
            <p className={`text-gray-300 flex items-center gap-2 text-xs`}>
              <Clock size={12} />
              {new Date(bookmarkedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </Link>
      {showConfirm && (
        <ConfirmationDialog
          message={`Remove "${manga.title}" from bookmarks?`}
          onConfirm={confirmRemove}
          onCancel={cancelRemove}
          isDark={isDark}
        />
      )}
    </>
  );
}

export default BookmarkCard;