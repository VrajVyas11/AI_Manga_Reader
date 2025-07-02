"use client";
import React, { Suspense, useCallback, useMemo, useState } from "react";
import {
  Star,
  Heart,
  Flame,
  Trophy,
  Eye,
  MessageCircle,
  UserPlus,
} from "lucide-react";
import Image from "next/image"
import AsideComponentSkeleton from "../Skeletons/MangaList/AsideComponentSkeleton";
import { useMangaFetch } from "../../hooks/useMangaFetch";
import { useRouter } from "next/navigation";
import { useManga } from "../../providers/MangaContext";
import { useTheme } from "../../providers/ThemeContext";

function AsideComponent() {
  const { data: ratingData, isLoading: ratingLoading, isError: ratingError, error: ratingErrorMsg } = useMangaFetch('rating', 1);
  const { data: favouriteData, isLoading: favouriteLoading, isError: favouriteError, error: favouriteErrorMsg } = useMangaFetch('favourite', 1);
  const { data: latestArrivalsData, isLoading: latestArrivalsLoading, isError: latestArrivalsError, error: latestArrivalsErrorMsg } = useMangaFetch('latestArrivals', 1);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const processedMangas = useMemo(() => ratingData?.data || [], [ratingData]);
  const processedFavouriteMangas = useMemo(() => favouriteData?.data || [], [favouriteData]);
  const processedLatestArrivalsMangas = useMemo(() => latestArrivalsData?.data || [], [latestArrivalsData]);

  const [selectedCategory, setSelectedCategory] = useState("Top");
  const router = useRouter();
  const { setSelectedManga } = useManga();
  const handleMangaClicked = useCallback((manga) => {
    setSelectedManga(manga);
    router.push(`/manga/${manga.id}/chapters`);
  }, [router, setSelectedManga]);

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(".0", "") + "K";
    }
    return num.toString();
  };

  if (ratingLoading || favouriteLoading || latestArrivalsLoading) {
    return <AsideComponentSkeleton />;
  }

  if (ratingError || favouriteError || latestArrivalsError) {
    return <div className="text-red-500">Error: {ratingErrorMsg?.message || favouriteErrorMsg?.message || latestArrivalsErrorMsg?.message}</div>;
  }

  const mangaToDisplay =
    selectedCategory === "Top"
      ? processedMangas
      : selectedCategory === "Favourite"
        ? processedFavouriteMangas
        : processedLatestArrivalsMangas;

  const statConfig = {
    Top: {
      title: "Top Ranked",
      subtitle: "Highest Rated Series",
      titleIcon: Trophy,
      icon: Star,
      label: "Rating",
      getValue: (m) => m?.rating?.rating?.bayesian?.toFixed(2) ?? "0.00",
      color: isDark ? "text-yellow-400" : "text-yellow-600",
      iconBg: isDark ? "bg-yellow-400/10" : "bg-yellow-600/10",
    },
    Favourite: {
      title: "Fan Favorites",
      subtitle: "Most Loved Series",
      titleIcon: Heart,
      icon: UserPlus,
      label: "Follows",
      getValue: (m) => formatNumber(m?.rating?.follows ?? 0),
      color: isDark ? "text-rose-400" : "text-rose-600",
      iconBg: isDark ? "bg-rose-400/10" : "bg-rose-600/10",
    },
    New: {
      title: "New Arrivals",
      subtitle: "Recently Added Mangas",
      titleIcon: Flame,
      icon: MessageCircle,
      label: "Comments",
      getValue: (m) => m?.rating?.rating?.bayesian?.toFixed(2) ?? "0.00",
      color: isDark ? "text-cyan-400" : "text-cyan-600",
      iconBg: isDark ? "bg-cyan-400/10" : "bg-cyan-600/10",
    },
  };

  const categories = [
    { key: "Top", label: "Top", icon: Trophy, accent: isDark ? "text-yellow-400" : "text-yellow-600" },
    { key: "Favourite", label: "Favourite", icon: Heart, accent: isDark ? "text-rose-400" : "text-rose-600" },
    { key: "New", label: "New", icon: Flame, accent: isDark ? "text-cyan-400" : "text-cyan-600" },
  ];

  const StatIcon = statConfig[selectedCategory].icon;
  const TitleIcon = statConfig[selectedCategory].titleIcon;

  return (
    <Suspense fallback={<AsideComponentSkeleton />}>
      <section
        suppressHydrationWarning
        aria-label="Manga list"
        className="w-full max-w-md mx-auto select-none mb-10 md:mb-0"
        style={{ background: "transparent" }}
      >
        <div className="flex mx-2 md:mx-9 mb-7 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={isDark ? "bg-white/10 p-3 rounded-lg" : "bg-gray-200/50 p-3 rounded-lg"}>
              <TitleIcon className={`w-6 h-6 ${statConfig[selectedCategory].color} drop-shadow-md`} />
            </div>
            <div>
              <h2 className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{statConfig[selectedCategory].title}</h2>
              <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"} uppercase tracking-wide`}>{statConfig[selectedCategory].subtitle}</p>
            </div>
          </div>
          <button className={`flex items-center gap-1.5 px-3 py-3.5 rounded-md text-sm ${isDark ? "text-gray-300 hover:text-white hover:bg-gray-800/50 border-gray-700/50" : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/50 border-gray-300/50"} transition-all duration-200 border`}>
            <Eye className="w-4 h-4" />
            View All
          </button>
        </div>
        <nav className="flex justify-center mx-2 md:mx-0 gap-4 mb-6">
          {categories.map(({ key, label, icon: Icon, accent }) => {
            const active = selectedCategory === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`flex min-w-28 justify-center items-center gap-2 px-4 py-4 rounded-lg font-semibold text-xs md:text-sm transition-colors duration-300 focus:outline-none
                 ${active
                    ? `${isDark ? "bg-[rgba(255,255,255,0.09)]" : "bg-gray-200/50"} ${accent}`
                    : `${isDark ? "text-gray-400 bg-[rgba(255,255,255,0.05)] hover:text-gray-200" : "text-gray-600 bg-gray-100/50 hover:text-gray-900"}`
                  }`}
                aria-pressed={active}
                type="button"
              >
                <Icon
                  className={`w-5 h-5 ${active ? accent : isDark ? "text-gray-500" : "text-gray-400"}`}
                  aria-hidden="true"
                />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>
        <ul className="grid grid-cols-3 md:block md:space-y-3 mx-1 md:mx-3">
          {mangaToDisplay.slice(0, 9).map((manga, idx) => (
            <li
              key={manga.id}
              onClick={() => handleMangaClicked(manga)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleMangaClicked(manga);
                }
              }}
              className={`flex items-center md:gap-1 cursor-pointer rounded-lg md:px-3 py-2 transition-colors duration-250
              focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500
              ${isDark ? "hover:bg-gray-800/40" : "hover:bg-gray-200/40"}`}
              aria-label={`${manga.title} - ${statConfig[selectedCategory].label}: ${statConfig[selectedCategory].getValue(manga)}`}
            >
              <div className="flex-shrink-0 w-5 md:w-8 text-center select-none">
                <span
                  className={`text-2xl md:text-5xl font-extrabold bg-clip-text text-transparent ${isDark ? "bg-gradient-to-b from-gray-400 to-gray-600" : "bg-gradient-to-b from-gray-600 to-gray-800"}`}
                >
                  {idx + 1}
                </span>
              </div>
              <div className="flex-shrink-0 w-10 h-12 md:w-12 md:h-16 rounded-md overflow-hidden shadow-md">
                <Image
                  width={300}
                  height={300}
                  src={manga.coverImageUrl || "./placeholder.jpg"}
                  alt={manga.title ?? "Manga cover"}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[102%]"
                  loading="lazy"
                  decoding="async"
                  onError={() => "./placeholder.jpg"}
                />
              </div>
              <div className="flex flex-col ml-1 md:ml-3 flex-1 min-w-0">
                <h3
                  className={`text-xs md:text-base font-semibold truncate ${isDark ? "text-white" : "text-gray-900"}`}
                  title={manga.title}
                >
                  {manga.title ?? "Untitled Manga"}
                </h3>
                <div className={`flex items-center gap-1 md:gap-2 mt-1 text-xs ${isDark ? "text-gray-400" : "text-gray-600"} select-none ${selectedCategory == "New" ? "hidden" : ""}`}>
                  <span
                    className={`flex items-center justify-center w-5 h-5 rounded-full ${statConfig[selectedCategory].iconBg} ${statConfig[selectedCategory].color}`}
                    aria-hidden="true"
                  >
                    <StatIcon className="w-3.5 h-3.5" />
                  </span>
                  <span className={`font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    {selectedCategory !== "New" && statConfig[selectedCategory].getValue(manga)}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </Suspense>
  );
}

export default React.memo(AsideComponent);