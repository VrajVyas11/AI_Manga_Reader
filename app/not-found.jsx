"use client"
import { ArrowLeft, BookOpen, OctagonAlert, Search} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Custom404() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const handleGoHome = () => {
    router.push('/manga-list');
  };

  return (
    <div className="min-h-screen w-full md:min-h-[88vh] bg-black/30 flex items-center justify-center px-3 md:px-6">
      <div className="max-w-xl w-full mt-10  md:mt-7 bg-black/5 border-[1px] border-gray-400/40 backdrop-blur-md p-4 px-4 md:px-12 rounded-xl">
        {/* Clean 404 Display */}
        <div className="text-center mb-8 mt-4">
          <div className="relative justify-center flex items-center gap-3 flex-row mb-5 md:mb-6">
            <OctagonAlert className="w-[70px] h-[70px] md:w-24 md:h-24 text-red-500" />
            <h1 className="text-6xl md:text-8xl font-bold text-gray-400 tracking-tight">404</h1>
          </div>
          <h2 className="text-2xl font-semibold text-white mb-3">Page Not Found</h2>
          <p className="text-gray-400 leading-relaxed text-xs md:text-base">
            You might be lost. Try going back to the manga list or navigate to find what you're looking for.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="md:space-y-3 space-x-3 md:space-x-0 flex flex-row md:flex-col mb-4 md:mb-8">
          <button
            onClick={handleGoHome}
            className="w-full flex items-center justify-center gap-3 bg-purple-950 text-white py-2 px-2 md:py-3 md:px-4 rounded-lg font-medium hover:bg-purple-900 transition-colors duration-200"
          >
            <BookOpen className="w-5 h-5" />
            <span className='md:hidden'>Home</span>
            <span className='hidden md:block'>Go to Manga List</span>
          </button>

          <button
            onClick={handleGoBack}
            className="w-full flex items-center justify-center gap-3 bg-gray-800 text-white py-2 px-2 md:py-3 md:px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200 border border-gray-700"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>

        {/* Minimal Footer */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 text-gray-600 mb-2">
            <div className="w-8 h-px bg-gray-700"></div>
            <Search className="w-4 h-4" />
            <div className="w-8 h-px bg-gray-700"></div>
          </div>
          <p className="text-gray-500 text-sm">
            Error 404 - Page does not exist
          </p>
        </div>
      </div>
    </div>
  );
}