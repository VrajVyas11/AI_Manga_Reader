'use client';

import { useTheme } from "@/app/providers/ThemeContext";
import {
    MessageCircle,
    Activity,
    Zap,
    ChevronDown,
    Laugh,
    CornerDownRight,
    ScrollText,
} from "lucide-react";

const SkeletonShimmer = ({ className = '' }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <div
      className={`bg-gradient-to-r ${
        isDark
          ? 'from-gray-800 via-gray-700 to-gray-800'
          : 'from-gray-400/70 via-gray-400/50 to-gray-400/70'
      } bg-[length:200%_100%] animate-pulse ${className}`}
    />
  );
};

export default function LatestActivityCommentsSkeleton() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="max-h-screen w-full  relative overflow-hidden">
      <div className="relative py-5 w-full">
        <div className="">
          <div className="flex mb-6 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`relative ${isDark ? "bg-white/10" : "bg-gray-200/50"} p-3 rounded-lg`}>
                <MessageCircle
                  className={`w-6 h-6 md:w-7 md:h-7 ${isDark ? "text-sky-300" : "text-sky-600"} drop-shadow-md`}
                />
                <div className={`absolute -top-1.5 -right-1.5 p-1 w-4.5 h-4.5 ${isDark ? "bg-gradient-to-r from-yellow-400 to-orange-400" : "bg-gradient-to-r from-yellow-600 to-orange-600"} rounded-full border-2 ${isDark ? "border-gray-950" : "border-gray-300"} flex items-center justify-center animate-pulse`}>
                  <Zap className={`w-2.5 h-2.5 ${isDark ? "text-white fill-white" : "text-gray-900 fill-gray-900"}`} />
                </div>
              </div>
              <div className="flex-1">
                <SkeletonShimmer className="h-7 w-64 rounded mb-1" />
                <div className="flex items-center gap-3">
                  <SkeletonShimmer className="h-3 w-48 rounded" />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <SkeletonShimmer className="h-12 w-20 rounded-2xl" />
              <SkeletonShimmer className="h-12 w-36 rounded-2xl" />
            </div>
          </div>

          <div className="relative scale-95 -mt-3 xl:mt-0 xl:scale-100">
            <div className="flex space-x-5 overflow-x-hidden scrollbar-hide pb-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex-shrink-0 w-72 relative group">
                  <div className={`relative h-[288px] ${isDark ? "border-purple-500/0 !shadow-[inset_0_0_25px_rgba(200,200,200,0.08)]" : "bg-white border-purple-400/20"} mt-1 backdrop-blur-2xl overflow-hidden border rounded-[46px] p-5 pb-0 transition-all duration-0 shadow-md`}>
                    <div className="flex items-start space-x-3 mb-3">
                      <div className="relative">
                        <div className={`absolute -inset-1 ${isDark ? "bg-gradient-to-r from-purple-500/80 to-cyan-500/80" : "bg-gradient-to-r from-purple-400/80 to-cyan-400/80"} rounded-full blur opacity-40`}></div>
                        <SkeletonShimmer className={`relative min-w-12 w-12 h-12 rounded-full border-2 ${isDark ? "border-purple-500/30" : "border-purple-400/30"}`} />
                        <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 ${isDark ? "bg-green-500 border-slate-900" : "bg-green-600 border-gray-300"} border-2 rounded-full shadow-lg`}>
                          <div className={`w-full h-full ${isDark ? "bg-green-400" : "bg-green-500"} rounded-full animate-ping opacity-75`}></div>
                        </div>
                      </div>
                      <div className="flex-1 w-2/3">
                        <SkeletonShimmer className={`h-5 w-32 rounded`} />
                        <div className={`flex mb-2 items-center justify-between w-full space-x-2 text-sm ${isDark ? "text-slate-400" : "text-slate-600"} mt-1`}>
                          <span className="flex flex-row items-center justify-start gap-2">
                            <Activity strokeWidth={3.5} className={`w-3.5 h-3.5 -mt-0.5 ${isDark ? "text-cyan-400" : "text-cyan-600"}`} />
                            <SkeletonShimmer className="h-3 w-16 rounded" />
                          </span>
                          <div className={`w-1 h-1 ${isDark ? "bg-slate-500/30" : "bg-slate-400/30"} rounded-full`}></div>
                          <div className={`w-1 h-1 ${isDark ? "bg-slate-500/50" : "bg-slate-400/50"} rounded-full`}></div>
                          <div className={`w-1 h-1 ${isDark ? "bg-slate-500/70" : "bg-slate-400/70"} rounded-full`}></div>
                          <span className="text-xs">
                            <Laugh className={`w-4 h-4 ${isDark ? "text-yellow-400 fill-yellow-400/20" : "text-yellow-600 fill-yellow-600/20"}`} />
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mb-5">
                      <div className="flex items-center space-x-2 text-sm flex-wrap gap-2">
                        <span className={`flex flex-row justify-start items-center ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                          <CornerDownRight strokeWidth={3} className={`w-3.5 h-3.5 mx-2 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
                          <SkeletonShimmer className="h-4 w-24 rounded" />
                        </span>
                      </div>
                    </div>
                    <div className="mb-1">
                      <div className="relative">
                        <div className={`absolute inset-0 ${isDark ? "" : "bg-gray-200/20"} rounded-xl blur-sm`}></div>
                        <div className={`relative rounded-[36px] p-5 py-4 border ${isDark ? "border-yellow-500/10" : "border-yellow-400/10"} shadow-inner`}>
                          <SkeletonShimmer className="h-4 w-full rounded mb-2" />
                          <SkeletonShimmer className="h-4 w-4/5 rounded" />
                        </div>
                      </div>
                    </div>
                    <div
                      className={`w-full mb-1 absolute bottom-0 -ml-4 flex items-center justify-center gap-1.5 py-2 text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-600"} rounded-lg transition-all duration-200`}
                    >
                      <ChevronDown className="w-3 h-3" />
                      <SkeletonShimmer className="h-3 w-20 rounded" />
                    </div>
                    <div className="hidden">
                      <div className={`relative rounded-[36px] p-4 border ${isDark ? "border-yellow-500/10" : "border-yellow-400/10"} shadow-inner`}>
                        <div className={`flex items-center space-x-2`}>
                          <span className="bg-white/10 rounded-full p-1.5 shadow-[0_0_2px_rgba(255,204,0,0.7)] ">
                            <ScrollText className={`w-3.5 h-3.5 ${isDark ? "text-white drop-shadow-[0_0_2px_rgba(255,204,0,0.2)]" : "text-gray-900 drop-shadow-[0_0_2px_rgba(202,138,4,0.7)]"}`} />
                          </span>
                          <SkeletonShimmer className="h-4 w-32 rounded" />
                        </div>
                        <div className="flex ml-9 flex-wrap justify-between items-center gap-2">
                          <div className={`flex flex-row w-full space-x-5 text-[11px] ${isDark ? "text-purple-300" : "text-purple-600"} font-semibold tracking-wide`}>
                            <div className="flex flex-row w-1/2 gap-1 items-center">
                              <span className={` ${isDark ? "text-purple-400" : "text-purple-500"} select-none`}>Chapter :</span>
                              <SkeletonShimmer className="h-3 w-8 rounded" />
                            </div>
                            <div className="flex justify-start flex-row w-1/2 gap-1 items-center">
                              <span className={` ${isDark ? "text-purple-400" : "text-purple-500"} select-none`}>Volume :</span>
                              <SkeletonShimmer className="h-3 w-8 rounded" />
                            </div>
                          </div>
                          <div
                            className={`text-[11px] tracking-wide flex flex-row gap-1 max-w-[60%] ${isDark ? "text-purple-300/90" : "text-purple-600/90"}`}
                          >
                            <span className={`font-semibold tracking-wide ${isDark ? "text-purple-400" : "text-purple-500"} select-none `}>
                              Title:
                            </span>
                            <SkeletonShimmer className="h-3 w-32 rounded" />
                          </div>
                        </div>
                      </div>
                      <div className="h-6" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}