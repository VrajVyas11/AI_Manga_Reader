'use client';

import { useTheme } from '@/app/providers/ThemeContext';
import {
  Star,
  Heart,
  Flame,
  Trophy
} from "lucide-react";

const SkeletonShimmer = ({ className = '' }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <div
      className={`bg-gradient-to-r ${
        isDark
          ? 'from-gray-800 via-gray-700 to-gray-800'
          : 'from-gray-300 via-gray-200 to-gray-300'
      } bg-[length:200%_100%] animate-pulse ${className}`}
    />
  );
};

export default function AsideComponentSkeleton() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const statConfig = {
    Top: {
      color: isDark ? "text-yellow-400" : "text-yellow-600",
    },
  };

  const categories = [
    {
      icon: Trophy,
      accent: isDark ? "text-yellow-400" : "text-yellow-600",
    },
    {
      icon: Heart,
      accent: isDark ? "text-rose-400" : "text-rose-600",
    },
    {
      icon: Flame,
      accent: isDark ? "text-cyan-400" : "text-cyan-600",
    },
  ];

  return (
    <section
      aria-label="Manga list"
      className="w-full mb-9"
    >
      <div className="flex mb-7 sm:mb-8 items-center gap-3">
        <div className={`${isDark ? "bg-white/10" : "bg-gray-200/50"} p-2.5 min-w-fit rounded-lg`}>
          <Trophy
            className={`w-6 h-6 xl:w-7 xl:h-7 ${statConfig.Top.color} drop-shadow-md`}
          />
        </div>
        <div className="flex-1">
          <SkeletonShimmer
            className={`h-6 w-32 xl:w-40 rounded mb-1 ${isDark ? "bg-gray-700" : "bg-gray-200"}`}
          />
          <SkeletonShimmer
            className={`h-3 w-40 xl:w-48 rounded ${isDark ? "bg-gray-700" : "bg-gray-200"}`}
          />
        </div>
      </div>

      <nav className="flex justify-center gap-4 px-3 mb-5">
        {categories.map(({ icon: Icon, accent }, index) => {
          const active = index === 0;
          return (
            <div
              key={index}
              className={`flex min-w-24 sm:min-w-28 md:min-w-[32%] justify-center items-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold transition-colors duration-200
                ${
                  active
                    ? `${isDark ? "bg-[rgba(255,255,255,0.08)]" : "bg-gray-200/50"} ${accent}`
                    : `${isDark ? "text-gray-400 bg-[rgba(255,255,255,0.04)]" : "text-gray-600 bg-gray-100/50"}`
                }`}
            >
              <Icon
                className={`w-5 h-5 min-w-fit ${active ? accent : isDark ? "text-gray-500" : "text-gray-400"}`}
              />
              <SkeletonShimmer className="h-4 w-16 md:hidden xl:block rounded" />
            </div>
          );
        })}
      </nav>

      <ul className="grid grid-cols-3 ml-2 sm:ml-0 md:block gap-x-0 gap-y-3 lg:gap-3">
        {Array.from({ length: 9 }).map((_, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-1 lg:gap-4 rounded-md px-3 md:px-0 py-2 transition-colors duration-200
              ${isDark ? "hover:bg-gray-800/40" : "hover:bg-gray-200/40"}`}
          >
            <div className="hidden sm:flex w-6 md:w-7 text-center">
              <span
                className={`text-3xl md:text-5xl font-extrabold bg-clip-text text-transparent ${
                  isDark
                    ? "bg-gradient-to-b from-gray-600 to-gray-700"
                    : "bg-gradient-to-b from-gray-400 to-gray-600"
                }`}
              >
                {idx + 1}
              </span>
            </div>

            <div className="flex-shrink-0 w-9 h-11 -ml-2 sm:-ml-0 md:w-12 md:h-16 rounded-lg sm:rounded-md overflow-hidden shadow-sm">
              <SkeletonShimmer className="w-full h-full" />
            </div>

            <div className="flex flex-col ml-1 sm:ml-2 flex-1 min-w-0">
              <SkeletonShimmer
                className={`h-4 w-24 md:w-32 rounded mb-1 ${isDark ? "bg-gray-700" : "bg-gray-200"}`}
              />
              <div
                className={`flex items-center gap-2 mt-1 text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                <div
                  className={`flex items-center justify-center w-5 h-5 rounded-full ${
                    isDark ? "bg-yellow-400/10" : "bg-yellow-600/10"
                  } ${isDark ? "text-yellow-400" : "text-yellow-600"}`}
                >
                  <Star className="w-3.5 h-3.5" />
                </div>
                <SkeletonShimmer
                  className={`h-3 w-8 rounded ${isDark ? "bg-gray-700" : "bg-gray-200"}`}
                />
              </div>
            </div>
          </div>
        ))}
      </ul>
    </section>
  );
}