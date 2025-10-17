import React from 'react';

import { ImageIcon, Settings, BookOpen, Maximize2, Heart } from 'lucide-react';
function ContentSkeleton({ isDark = true }) {

    const buttonPulse = isDark ? 'bg-gray-800' : 'bg-gray-200';
    const redPulse = isDark ? 'bg-red-500/60' : 'bg-red-400/60';

    return (
        <div className={`tracking-wider flex flex-col flex-grow min-w-0 h-full w-full max-w-full scrollbar-thin ${isDark ? 'scrollbar-thumb-purple-600 scrollbar-track-gray-900 bg-black' : 'scrollbar-thumb-purple-400 scrollbar-track-gray-100 bg-white'}`}>
            {/* Top Right Options */}
            <div className="absolute top-12 right-4 z-10 flex gap-2">
                <div className={`${buttonPulse} w-8 h-8 rounded animate-pulse opacity-80 flex items-center justify-center`}>
                    <Settings size={16} className="opacity-50" />
                </div>
                <div className={`${buttonPulse} w-8 h-8 rounded animate-pulse opacity-80 flex items-center justify-center`}>
                    <BookOpen size={16} className="opacity-50" />
                </div>
                <div className={`${buttonPulse} w-8 h-8 rounded animate-pulse opacity-80 flex items-center justify-center`}>
                    <Maximize2 size={16} className="opacity-50" />
                </div>
                <div className={`${redPulse} w-8 h-8 rounded animate-pulse opacity-80 flex items-center justify-center`}>
                    <Heart size={16} className="opacity-50" />
                </div>
            </div>

            {/* Main Manga Content */}
            <div
                style={{
                    scrollbarWidth: "none",
                    scrollbarColor: isDark ? "rgba(155, 89, 182, 0.6) rgba(0, 0, 0, 0.1)" : "rgba(155, 89, 182, 0.6) rgba(255, 255, 255, 0.1)",
                }}
                className="flex items-center justify-center my-auto h-full overflow-y-auto min-w-0 max-w-full"
            >
                <div role="status" className="w-[380px] mt-5 h-[83vh]">
                    <style global jsx>{`
            @keyframes colorShift {
              0% {
                background-color: ${isDark ? '#1e293b99' : '#f3f4f699'};
              }
              100% {
                background-color: ${isDark ? '#11182799' : '#e5e7eb99'};
              }
            }
          `}</style>
                    <div
                        className={`w-[300px] justify-self-center sm:w-[400px] h-[83vh] backdrop-blur-2xl rounded-lg mb-5 flex justify-center items-center transition-all duration-75 ease-in-out ${isDark ? 'bg-black/20' : 'bg-white/80'}`}
                        style={{
                            animation: 'colorShift 1.5s ease-in-out infinite alternate',
                        }}
                    >
                        <ImageIcon className={`w-8 h-8 ${isDark ? 'stroke-gray-400' : 'stroke-gray-600'}`} />
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className={`flex-shrink-0 relative z-50 w-full max-w-full`}>
                <div className={` w-full p-2`}>
                    <div className={`w-full h-1 flex flex-row items-center justify-center gap-1  rounded`}>
                        <div className={`w-1/6 h-1 ${isDark ? 'bg-purple-600/60' : 'bg-purple-400/60'} rounded animate-pulse`}></div>
                        <div className={`w-1/6 h-1 ${isDark ? 'bg-gray-600' : 'bg-gray-400'} rounded animate-pulse`}></div>
                        <div className={`w-1/6 h-1 ${isDark ? 'bg-gray-600' : 'bg-gray-400'} rounded animate-pulse`}></div>
                        <div className={`w-1/6 h-1 ${isDark ? 'bg-gray-600' : 'bg-gray-400'} rounded animate-pulse`}></div>
                        <div className={`w-1/6 h-1 ${isDark ? 'bg-gray-600' : 'bg-gray-400'} rounded animate-pulse`}></div>
                        <div className={`w-1/6 h-1 ${isDark ? 'bg-gray-600' : 'bg-gray-400'} rounded animate-pulse`}></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContentSkeleton;
