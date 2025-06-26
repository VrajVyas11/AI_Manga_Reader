import { BookOpen } from 'lucide-react'

function LibraryLoading() {
  return (
     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 to-gray-900">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-gray-900 border-t-gray-700 rounded-full animate-spin" />
                <BookOpen className="w-6 h-6 text-gray-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div className="text-center">
                <span className="text-lg font-semibold text-gray-100 block">
                  Loading your library
                </span>
                <span className="text-gray-400 text-xs">
                  Please wait while we fetch your data...
                </span>
              </div>
            </div>
          </div>
  )
}

export default LibraryLoading