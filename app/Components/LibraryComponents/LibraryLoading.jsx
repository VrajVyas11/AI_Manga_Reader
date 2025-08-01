import { BookOpen } from "lucide-react";

function LibraryLoading({ isDark }) {
  return (
    <div
      className={`min-h-screen relative z-30 flex items-center justify-center ${isDark ? "bg-transparent" : "bg-gray-50"
        }`}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div
            className={`w-12 h-12 rounded-full animate-spin border-4 border-t-transparent ${isDark
                ? "border-gray-900 border-t-gray-700"
                : "border-gray-300 border-t-gray-500"
              }`}
          />
          <BookOpen
            className={`w-6 h-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${isDark ? "text-gray-400" : "text-gray-600"
              }`}
          />
        </div>
        <div className="text-center">
          <span
            className={`text-lg font-semibold block ${isDark ? "text-gray-100" : "text-gray-900"
              }`}
          >
            Loading your library
          </span>
          <span
            className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"
              }`}
          >
            Please wait while we fetch your data...
          </span>
        </div>
      </div>
    </div>
  );
}

export default LibraryLoading;