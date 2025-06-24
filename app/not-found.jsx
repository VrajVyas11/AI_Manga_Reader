"use client"
import { ArrowLeft, BookOpen, Search, TriangleAlert } from 'lucide-react';
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
    <div className="min-h-screen md:min-h-[89vh] bg-black/30 flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        {/* Clean 404 Display */}
        <div className="text-center mb-8 mt-20 md:mt-7">
          <div className="relative justify-center flex items-center gap-3 flex-row  mb-6">
              <TriangleAlert className="w-20 h-20 md:w-24 md:h-24 text-red-500" />
            <h1 className="text-7xl md:text-8xl font-bold text-gray-800 tracking-tight">404</h1>
          </div>
          
          <h2 className="text-2xl font-semibold text-white mb-3">Page Not Found</h2>
          <p className="text-gray-400 leading-relaxed">
            You might be lost. Try going back to the manga list or navigate to find what you're looking for.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mb-8">
          <button
            onClick={handleGoHome}
            className="w-full flex items-center justify-center gap-3 bg-purple-950 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-900 transition-colors duration-200"
          >
            <BookOpen className="w-5 h-5" />
            Go to Manga List
          </button>
          
          <button
            onClick={handleGoBack}
            className="w-full flex items-center justify-center gap-3 bg-gray-800 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200 border border-gray-700"
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

      {/* Subtle background grid */}
      <div className="fixed inset-0 pointer-events-none opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}></div>
      </div>
    </div>
  );
}