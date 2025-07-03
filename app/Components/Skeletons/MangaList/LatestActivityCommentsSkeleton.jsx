'use client';

import { useTheme } from "@/app/providers/ThemeContext";

const SkeletonShimmer = ({ className = '' }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <div
      className={`bg-gradient-to-r ${
        isDark
          ? 'from-slate-600/50 to-slate-700/50'
          : 'from-gray-400/70 to-gray-300/70'
      } bg-[length:200%_100%] animate-pulse ${className}`}
    />
  );
};

export default function LatestActivityCommentsSkeleton() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="min-h-fit relative overflow-hidden">
      <div className="relative -mr-4 mb-10 flex justify-center flex-col items-center">
        <div className="max-w-[94%]">
          {/* Header Skeleton */}
          <div className="mb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div
                    className={`w-16 h-16 ${
                      isDark
                        ? 'bg-gradient-to-br from-gray-600/30 to-gray-500/30 border-white/10'
                        : 'bg-gradient-to-br from-gray-300/30 to-gray-200/30 border-gray-300/50'
                    } rounded-2xl animate-pulse backdrop-blur-xl border`}
                  ></div>
                </div>
                <div className="space-y-3">
                  <SkeletonShimmer className="h-8 w-80 rounded-xl" />
                  <SkeletonShimmer className="h-4 w-60 rounded-lg" />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <SkeletonShimmer className="h-12 w-16 rounded-xl" />
                <SkeletonShimmer className="h-12 w-32 rounded-xl" />
              </div>
            </div>
          </div>

          {/* Comment Cards Skeleton */}
          <div className="flex space-x-6 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-shrink-0 w-96">
                <div className="relative group">
                  <div
                    className={`relative ${
                      isDark ? 'bg-slate-900/80 border-white/10' : 'bg-gray-100/80 border-gray-300/50'
                    } backdrop-blur-xl border rounded-2xl p-6 space-y-4`}
                  >
                    {/* Avatar and User */}
                    <div className="flex items-start space-x-4">
                      <div className="relative">
                        <SkeletonShimmer className="w-16 h-16 rounded-full" />
                        <div
                          className={`absolute -bottom-1 -right-1 w-6 h-6 ${
                            isDark ? 'bg-green-500/30' : 'bg-green-400/30'
                          } rounded-full animate-pulse`}
                        ></div>
                      </div>
                      <div className="flex-1 space-y-2">
                        <SkeletonShimmer className="h-5 w-2/3 rounded-lg" />
                        <SkeletonShimmer className="h-3 w-1/2 rounded" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-3">
                      <SkeletonShimmer className="h-4 w-full rounded" />
                      <SkeletonShimmer className="h-4 w-4/5 rounded" />
                      <SkeletonShimmer className="h-16 rounded-xl" />
                      <SkeletonShimmer className="h-4 w-3/4 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}