import React from 'react';
import { ArrowLeft } from 'lucide-react';

function SidebarSkeleton({ isDark = true, isCollapsed = false }) {
  const bgClass = isDark ? 'bg-black/25' : 'bg-white/70';
  const borderClass = isDark ? 'border-gray-800/90' : 'border-gray-300/70';
  const shadowClass = isDark ? 'shadow-black/80' : 'shadow-gray-400/50';
  const pulseBg = isDark ? 'bg-gray-700' : 'bg-gray-300';
  const headerBorder = isDark ? 'border-slate-800/50' : 'border-gray-300/50';
  const buttonBg = isDark ? 'bg-slate-800/80' : 'bg-gray-200/80';
  const buttonBorder = isDark ? 'border-slate-700/50' : 'border-gray-300/50';
  const iconPulse = isDark ? 'bg-slate-400/60' : 'bg-gray-400/60';
  const cardBg = isDark ? 'bg-slate-800/60' : 'bg-gray-100/60';
  const cardBorder = isDark ? 'border-slate-700/50' : 'border-gray-300/50';
  const readingBorder = isDark ? 'border-l-yellow-500/60' : 'border-l-yellow-400/60';
  const yellowPulse = isDark ? 'bg-yellow-500/60' : 'bg-yellow-400/60';
  const navButtonBg = isDark ? 'bg-slate-800/60' : 'bg-gray-100/60';
  const navButtonBorder = isDark ? 'border-slate-700/50' : 'border-gray-300/50';
  const settingsPulse = isDark ? 'bg-slate-300/60' : 'bg-gray-300/60';
  const toggleBg = isDark ? 'bg-purple-500/60' : 'bg-purple-400/60';
  const detailPulse = isDark ? 'bg-gray-700' : 'bg-gray-300';
  const favPulse = isDark ? 'bg-red-600/60' : 'bg-red-400/60';
  const collapsedBg = isDark ? 'bg-black/25' : 'bg-white/90';
  const collapsedBorder = isDark ? 'border-purple-700/20' : 'border-gray-300';
  const collapsedShadow = isDark ? 'shadow-gray-800/20' : 'shadow-gray-300/50';

  if (isCollapsed) {
    // Collapsed skeleton (narrow strip, similar to CollapsedSideBarStrip)
    return (
      <div className={`tracking-wider relative mt-5 h-[89vh] md:h-[88.5vh] z-40 flex justify-center items-center`}>
        <div
          className={`
            tracking-wider h-full pt-5 md:pt-7 w-14 md:w-[70px] py-4 flex flex-col items-center justify-between shadow-[5px_0_15px_rgba(0,0,0,0.4)]
            border-r ${collapsedBorder} ${collapsedShadow}
            ${collapsedBg} backdrop-blur-3xl px-1.5 md:px-2
          `}
        >
          <div className="tracking-wider flex flex-col items-center h-full justify-between gap-y-3 md:gap-y-4">
            {/* Expand button */}
            <div className={`${buttonBg} ${buttonBorder} w-12 h-12 rounded-full flex items-center justify-center animate-pulse`}></div>

            <div className="flex flex-col items-center gap-y-1.5 md:gap-y-6">
              {/* Chapter select button */}
              <div className={`${buttonBg} ${buttonBorder} w-12 h-12 rounded-full relative animate-pulse flex items-center justify-center`}>
                <div className={`${pulseBg} w-4 h-4 rounded-full absolute -top-2 -right-2`}></div>
              </div>

              {/* Cover image */}
              <div className={`w-12 h-12 rounded-full relative border-2 shadow-md animate-pulse ${isDark ? 'border-purple-700/20' : 'border-purple-400/40'}`}>
                <div className={`${pulseBg} w-full h-full rounded-full`}></div>
                <div className={`${pulseBg} w-3 h-3 rounded-full bg-purple-400/40 absolute -right-2 -top-3`}></div>
              </div>

              {/* Favorite button */}
              <div className={`${buttonBg} ${buttonBorder} w-10 md:w-12 h-10 md:h-12 rounded-full flex items-center justify-center animate-pulse`}></div>
            </div>

            <div className="tracking-wider flex flex-col items-center gap-1.5 md:gap-2">
              <div className="tracking-wider flex w-12 md:w-12 flex-col justify-between gap-1.5 md:gap-2">
                {/* Prev chapter button */}
                <div className={`${navButtonBg} ${navButtonBorder} w-12 h-12 rounded-full flex items-center justify-center animate-pulse`}></div>

                {/* Chapter indicator */}
                <div className="flex text-[10px] md:text-[11px] my-1 md:my-2 flex-row space-x-0.5 md:space-x-1 justify-center items-center">
                  <div className={`${pulseBg} w-4 h-2 rounded`}></div>
                  <div className={`${pulseBg} w-4 h-2 rounded mx-1`}></div>
                </div>

                {/* Next chapter button */}
                <div className={`${navButtonBg} ${navButtonBorder} w-12 h-12 rounded-full flex items-center justify-center animate-pulse`}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full skeleton (similar to original, refined for better visual match)
  return (
    <div className={`relative px-3 rounded-r-lg left-0 -bottom-1 border-[1px] border-l-0 ${borderClass} h-[88vh] w-64 ${bgClass} backdrop-blur-3xl flex flex-col z-40 shadow-[0_0_10px_rgba(0,0,0,1)] ${shadowClass}`}>
      {/* Header */}
      <div className={`py-2 ${headerBorder}`}>
        <div className={`group absolute top-3 left-3 w-10 h-10 rounded-xl ${buttonBg} ${buttonBorder} animate-pulse flex justify-center items-center`}>
          <ArrowLeft className="w-5 h-5 opacity-60" />
        </div>

        {/* Manga Info */}
        <div className="flex flex-col mt-7 justify-center items-center gap-4">
          <div className={`w-20 h-20 rounded-full overflow-hidden shadow-[0_0_5px_rgba(0,0,0,1)] flex-shrink-0 ${isDark ? 'shadow-purple-400' : 'shadow-gray-900'} animate-pulse bg-gradient-to-br from-purple-500/60 to-violet-500/60`}></div>
          <div className={`${pulseBg} w-32 h-4 rounded animate-pulse opacity-80`}></div>
        </div>
      </div>

      {/* Reading Status */}
      <div className={`pl-4 flex flex-row w-full border-l-4 ${readingBorder} ml-2 mt-6 mb-3 items-center justify-start gap-2`}>
        <div className={`${pulseBg} w-16 h-3 rounded animate-pulse opacity-70`}></div>
        <div className="flex items-center justify-start gap-2">
          <div className={`${yellowPulse} w-20 h-3 rounded animate-pulse`}></div>
          <div className={`${pulseBg} w-4 h-3 rounded animate-pulse opacity-60`}></div>
        </div>
      </div>

      {/* Chapter Navigation Header */}
      <div className="flex justify-start text-sm px-2 items-center gap-4 mt-4 mb-2">
        <div className={`${iconPulse} w-5 h-5 rounded animate-pulse`}></div>
        <div className={`${pulseBg} w-32 h-4 rounded animate-pulse opacity-80`}></div>
      </div>

      {/* Language Selector */}
      <div className="p-2 py-1">
        <div className={`w-full flex items-center justify-between p-3 ${cardBg} rounded-md ${cardBorder} animate-pulse`}>
          <div className="flex items-center gap-3">
            <div className={`${iconPulse} w-4 h-4 rounded`}></div>
            <div className={`${pulseBg} w-24 h-3 rounded opacity-60`}></div>
          </div>
          <div className={`${iconPulse} w-4 h-4 rounded`}></div>
        </div>
      </div>

      {/* Chapter Selector */}
      <div className="p-2 py-1">
        <div className={`w-full flex items-center justify-between p-3 ${cardBg} rounded-md ${cardBorder} animate-pulse`}>
          <div className="flex items-center gap-2">
            <div className={`${iconPulse} w-4 h-4 rounded`}></div>
            <div className={`${pulseBg} w-36 h-3 rounded opacity-60`}></div>
          </div>
          <div className={`${iconPulse} w-4 h-4 rounded`}></div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="py-1 px-2 mt-4">
        <div className="flex gap-2">
          <div className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md ${navButtonBg} ${navButtonBorder} animate-pulse opacity-80`}></div>
          <div className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md ${navButtonBg} ${navButtonBorder} animate-pulse opacity-80`}></div>
        </div>
      </div>

      {/* Bottom Menu */}
      <div className={`mt-3 pt-3 ${headerBorder}`}>
        <div className="space-y-1">
          {/* Settings Toggle */}
          <div className={`w-full flex items-center justify-between p-3 rounded-lg animate-pulse opacity-90`}>
            <div className="flex items-center gap-3">
              <div className={`${settingsPulse} w-5 h-5 rounded`}></div>
              <div className={`${pulseBg} w-16 h-3 rounded`}></div>
            </div>
            <div className={`relative w-11 h-6 rounded-full ${toggleBg}`}>
              <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transform translate-x-5 animate-pulse"></div>
            </div>
          </div>

          {/* Manga Details */}
          <div className={`w-full flex items-center gap-3 p-3 rounded-lg animate-pulse opacity-80`}>
            <div className={`${detailPulse} w-5 h-5 rounded`}></div>
            <div className={`${detailPulse} w-24 h-3 rounded`}></div>
          </div>

          {/* Favorites */}
          <div className={`w-full flex items-center gap-3 p-3 rounded-lg animate-pulse opacity-80`}>
            <div className={`${favPulse} w-5 h-5 rounded`}></div>
            <div className={`${detailPulse} w-28 h-3 rounded`}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SidebarSkeleton;