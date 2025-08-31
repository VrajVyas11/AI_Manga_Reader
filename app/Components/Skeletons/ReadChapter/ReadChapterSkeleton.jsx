import { ArrowLeft, ImageIcon } from 'lucide-react';
import React from 'react'

function ReadChapterSkeleton() {

    return (
        <div className="flex flex-row w-full h-[89vh] bg-black text-white overflow-hidden">
            {/* Left Sidebar */}
            <div className="relative px-3 rounded-r-lg left-0 -bottom-1 border-[1px] border-l-0 border-gray-800/90 h-[88vh] w-64 bg-black/25 backdrop-blur-3xl flex flex-col z-40 shadow-[0_0_10px_rgba(0,0,0,1)] shadow-black/80">
                {/* Header */}
                <div className="py-2 border-b border-slate-800/50">
                    <div className="group absolute top-3 left-3 w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/50 animate-pulse flex justify-center items-center"><ArrowLeft className="w-5 h-5 opacity-60" /></div>

                    {/* Manga Info */}
                    <div className="flex flex-col mt-7 justify-center items-center gap-4">
                        <div className="w-20 h-20 rounded-full overflow-hidden shadow-[0_0_5px_rgba(0,0,0,1)] flex-shrink-0 bg-gradient-to-br from-purple-500/60 to-violet-500/60 animate-pulse"></div>
                        <div className="w-32 h-4 bg-gray-700 rounded animate-pulse"></div>
                    </div>
                </div>

                {/* Reading Status */}
                <div className="pl-4 flex flex-row w-full border-l-4 border-l-yellow-500/60 ml-2 mt-6 mb-3 items-center justify-start gap-2">
                    <div className="w-16 h-3 bg-gray-700 rounded animate-pulse"></div>
                    <div className="flex items-center justify-start gap-2">
                        <div className="w-20 h-3 bg-yellow-500/60 rounded animate-pulse"></div>
                        <div className="w-4 h-3 bg-gray-700 rounded animate-pulse"></div>
                    </div>
                </div>

                {/* Chapter Navigation Header */}
                <div className="flex justify-start text-sm px-2 items-center gap-4 mt-4 mb-2">
                    <div className="w-5 h-5 bg-gray-700 rounded animate-pulse"></div>
                    <div className="w-32 h-4 bg-gray-700 rounded animate-pulse"></div>
                </div>

                {/* Language Selector */}
                <div className="p-2 py-1">
                    <div className="w-full flex items-center justify-between p-3 bg-slate-800/60 rounded-md border border-slate-700/50">
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 bg-slate-400/60 rounded animate-pulse"></div>
                            <div className="w-24 h-3 bg-gray-700/60 rounded animate-pulse"></div>
                        </div>
                        <div className="w-4 h-4 bg-slate-400/60 rounded animate-pulse"></div>
                    </div>
                </div>

                {/* Chapter Selector */}
                <div className="p-2 py-1">
                    <div className="w-full flex items-center justify-between p-3 bg-slate-800/60 rounded-md border border-slate-700/50">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-slate-400/60 rounded animate-pulse"></div>
                            <div className="w-36 h-3 bg-gray-700/60 rounded animate-pulse"></div>
                        </div>
                        <div className="w-4 h-4 bg-slate-400/60 rounded animate-pulse"></div>
                    </div>
                </div>

                {/* Navigation Controls */}
                <div className="py-1 px-2 mt-4">
                    <div className="flex gap-2">
                        <div className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-slate-800/60 border border-slate-700/50">
                            <div className="w-5 h-5 bg-gray-700 rounded animate-pulse"></div>
                        </div>
                        <div className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-slate-800/60 border border-slate-700/50">
                            <div className="w-5 h-5 bg-gray-700 rounded animate-pulse"></div>
                        </div>
                    </div>
                </div>

                {/* Bottom Menu */}
                <div className="mt-3 pt-3 border-t border-slate-800/50">
                    <div className="space-y-1">
                        {/* Settings Toggle */}
                        <div className="w-full flex items-center justify-between p-3 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 bg-slate-300/60 rounded animate-pulse"></div>
                                <div className="w-16 h-3 bg-gray-700 rounded animate-pulse"></div>
                            </div>
                            <div className="relative w-11 h-6 rounded-full bg-purple-500/60 animate-pulse">
                                <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transform translate-x-5"></div>
                            </div>
                        </div>

                        {/* Manga Details */}
                        <div className="w-full flex items-center gap-3 p-3 rounded-lg">
                            <div className="w-5 h-5 bg-gray-700 rounded animate-pulse"></div>
                            <div className="w-24 h-3 bg-gray-700 rounded animate-pulse"></div>
                        </div>

                        {/* Favorites */}
                        <div className="w-full flex items-center gap-3 p-3 rounded-lg">
                            <div className="w-5 h-5 bg-red-600/60 rounded animate-pulse"></div>
                            <div className="w-28 h-3 bg-gray-700 rounded animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex w-full justify-center items-center flex-col bg-black">
                {/* Top Right Options */}
                <div className="absolute top-24 right-4 z-10 flex gap-2">
                    <div className="w-8 h-8 bg-gray-800 rounded animate-pulse"></div>
                    <div className="w-8 h-8 bg-gray-800 rounded animate-pulse"></div>
                    <div className="w-8 h-8 bg-gray-800 rounded animate-pulse"></div>
                    <div className="w-8 h-8 bg-red-500/60 rounded animate-pulse"></div>
                </div>

                {/* Main Manga Content */}
                <div role="status" className="w-[380px] mt-5 h-[83vh]">

                    <style global="jsx">{`
        @keyframes colorShift {
          0% {
            background-color: #1e293b99; /* Tailwind gray-800 */
          }
          100% {
            background-color: #11182799; /* Tailwind gray-700 */
          }
        }
      `}</style>
                    <div
                        className="w-[400px] h-[83vh] backdrop-blur-2xl  rounded-lg mb-5 flex justify-center items-center transition-all duration-75 ease-in-out"
                        style={{
                            animation: 'colorShift 1.5s ease-in-out infinite alternate',
                        }}
                    >
                        <ImageIcon  className="w-8 h-8 stroke-gray-400" />
                    </div>
                </div>


                {/* Progress Bar */}
                <div className="bg-black w-full p-2">
                    <div className="w-full h-1 flex flex-row items-center justify-center gap-1 bg-gray-800 rounded">
                        <div className="w-1/6 h-1 bg-purple-600/60 rounded animate-pulse"></div>
                        <div className="w-1/6 h-1 bg-gray-600 rounded animate-pulse"></div>
                        <div className="w-1/6 h-1 bg-gray-600 rounded animate-pulse"></div>
                        <div className="w-1/6 h-1 bg-gray-600 rounded animate-pulse"></div>
                        <div className="w-1/6 h-1 bg-gray-600 rounded animate-pulse"></div>
                        <div className="w-1/6 h-1 bg-gray-600 rounded animate-pulse"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ReadChapterSkeleton