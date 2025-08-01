import {
  Bookmark,
  Clock,
  Star,
} from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import ConfirmationDialog from "./ConfirmationDialog";

function BookmarkCard({ manga, bookmarkedAt, onMangaClick, addToBookMarks }) {
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
      <div
        className="group bg-gray-900/60 backdrop-blur-sm border border-gray-800/50 rounded-2xl overflow-hidden hover:border-gray-700/70 transition-all duration-300  hover:shadow-[0_0_7px_rgba(0,0,0,1)] hover:shadow-blue-500/20 cursor-pointer"
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
                    <div className="absolute z-30 inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />

          {/* Bookmark Button */}
          <div className="absolute   top-3 right-3">
            <button
              onClick={handleRemoveClick}
              className="p-2 bg-blue-700 rounded-full shadow-lg hover:bg-blue-700 transition-all transform hover:scale-110 focus:outline-none "
              title="Remove from bookmarks"
              aria-label="Remove from bookmarks"
            >
              <Bookmark size={18} className="fill-white text-white" />
            </button>
          </div>

          {/* Rating Badge */}
          {manga.rating && (
            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg text-xs text-white border border-white/20 flex items-center gap-1">
              <Star size={12} className="text-yellow-400" />
              {manga.rating?.rating?.average?.toFixed(1) ||
                manga.rating?.follows?.toFixed(1) ||
                "N/A"}
            </div>
          )}

          {/* Content Info */}
          <div className="absolute z-50 bottom-0 left-0 right-0 p-4">
            <h3 className="font-bold text-white text-lg line-clamp-1 mb-1 drop-shadow-lg">
              {manga.title}
            </h3>
            <p className="text-xs text-gray-300 flex items-center gap-2">
              <Clock size={12} />
               {new Date(bookmarkedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
      {showConfirm && (
        <ConfirmationDialog
          message={`Remove "${manga.title}" from bookmarks?`}
          onConfirm={confirmRemove}
          onCancel={cancelRemove}
        />
      )}
    </>
  );
}

export default BookmarkCard