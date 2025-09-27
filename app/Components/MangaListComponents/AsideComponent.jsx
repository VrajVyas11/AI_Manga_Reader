"use client";
import React, { Suspense, useCallback, useMemo, useState } from "react";
import {
  Star,
  Heart,
  Flame,
  Trophy,
  MessageCircle,
  UserPlus,
} from "lucide-react";
import Image from "next/image";
import AsideComponentSkeleton from "../Skeletons/MangaList/AsideComponentSkeleton";
import { useMangaFetch } from "../../hooks/useMangaFetch";
import { useManga } from "../../providers/MangaContext";
import { useTheme } from "../../providers/ThemeContext";
import Link from "next/link";

function AsideComponent() {
  const {
    data: ratingData,
    isLoading: ratingLoading,
    isError: ratingError,
    error: ratingErrorMsg,
  } = useMangaFetch("rating", 1);
  const {
    data: favouriteData,
    isLoading: favouriteLoading,
    isError: favouriteError,
    error: favouriteErrorMsg,
  } = useMangaFetch("favourite", 1);
  const {
    data: latestArrivalsData,
    isLoading: latestArrivalsLoading,
    isError: latestArrivalsError,
    error: latestArrivalsErrorMsg,
  } = useMangaFetch("latestArrivals", 1);

  const { theme } = useTheme();
  const isDark = theme === "dark";

  const processedMangas = useMemo(() => ratingData?.data ?? [], [ratingData]);
  const processedFavouriteMangas = useMemo(
    () => favouriteData?.data ?? [],
    [favouriteData]
  );
  const processedLatestArrivalsMangas = useMemo(
    () => latestArrivalsData?.data ?? [],
    [latestArrivalsData]
  );

  const [selectedCategory, setSelectedCategory] = useState("Top");
  const { setSelectedManga } = useManga();
  const handleMangaClicked = useCallback(
    (manga) => {
      setSelectedManga(manga);
    },
    [setSelectedManga]
  );

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(".0", "") + "K";
    }
    return String(num);
  };

  if (ratingLoading || favouriteLoading || latestArrivalsLoading) {
    return <AsideComponentSkeleton isDark={isDark} />;
  }

  if (ratingError || favouriteError || latestArrivalsError) {
    return (
      <div className="text-red-500 text-sm">
        Error:{" "}
        {ratingErrorMsg?.message ??
          favouriteErrorMsg?.message ??
          latestArrivalsErrorMsg?.message}
      </div>
    );
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
      getValue: (m) =>
        m?.rating?.rating?.bayesian?.toFixed(2) ?? "0.00",
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
      getValue: (m) =>
        m?.rating?.rating?.bayesian?.toFixed(2) ?? "0.00",
      color: isDark ? "text-cyan-400" : "text-cyan-600",
      iconBg: isDark ? "bg-cyan-400/10" : "bg-cyan-600/10",
    },
  } ;

  const categories = [
    {
      key: "Top",
      label: "Top",
      icon: Trophy,
      accent: isDark ? "text-yellow-400" : "text-yellow-600",
    },
    {
      key: "Favourite",
      label: "Favourite",
      icon: Heart,
      accent: isDark ? "text-rose-400" : "text-rose-600",
    },
    {
      key: "New",
      label: "New",
      icon: Flame,
      accent: isDark ? "text-cyan-400" : "text-cyan-600",
    },
  ];

  const StatIcon = statConfig[selectedCategory].icon;
  const TitleIcon = statConfig[selectedCategory].titleIcon;

  return (
    <Suspense fallback={<AsideComponentSkeleton isDark={isDark} />}>
      <section
        suppressHydrationWarning
        aria-label="Manga list"
        className="w-full  mb-9"
      >
         <div className="flex  mb-7 sm:mb-8 items-center gap-3">
          <div className={`${isDark ? "bg-white/10" : "bg-gray-200/50"} p-2.5  min-w-fit rounded-lg`}>
            <TitleIcon
              className={`w-6 h-6  xl:w-7 xl:h-7 ${statConfig[selectedCategory].color}  drop-shadow-md`}
            />
          </div>
          <div className="flex-1">
            <h2
              className={`text-base xl:text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"
                }  tracking-wide`}
            >
              {statConfig[selectedCategory].title}
            </h2>
            <div className="flex items-center gap-3">
              <p className={`text-[11px] xl:text-xs ${isDark ? "text-gray-400" : "text-gray-600"} uppercase tracking-wide`}>
                {statConfig[selectedCategory].subtitle}
              </p>

            </div>
          </div>
        </div>

        <nav className="flex justify-center gap-4  px-3 mb-5">
          {categories.map(({ key, label, icon: Icon, accent }) => {
            const active = selectedCategory === key;
            return (
              <button
                key={key}
                aria-label={label}
                onClick={() => setSelectedCategory(key)}
                className={`flex min-w-24 sm:min-w-28 md:min-w-[32%] justify-center items-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500
                 ${
                   active
                     ? `${isDark ? "bg-[rgba(255,255,255,0.08)]" : "bg-gray-200/50"} ${accent}`
                     : `${isDark ? "text-gray-400 bg-[rgba(255,255,255,0.04)] hover:text-gray-200" : "text-gray-600 bg-gray-100/50 hover:text-gray-900"}`
                 }`}
                aria-pressed={active}
                type="button"
              >
                <Icon
                  className={`w-5 h-5 min-w-fit ${active ? accent : isDark ? "text-gray-500" : "text-gray-400"}`}
                  aria-hidden="true"
                />
                <span className=" md:hidden xl:block">{label}</span>
              </button>
            );
          })}
        </nav>

        <ul className="grid grid-cols-3  ml-2 sm:ml-0 md:block gap-x-0 gap-y-3 lg:gap-3 ">
          {mangaToDisplay.slice(0, 9).map((manga, idx) => (
            <Link
              key={manga.id}
              prefetch={true}
              href={`/manga/${manga.id}/chapters`}
              onClick={() => handleMangaClicked(manga)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleMangaClicked(manga);
                }
              }}
              className={`flex  items-center gap-1 lg:gap-4 cursor-pointer rounded-md px-3 md:px-0 py-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500
                ${isDark ? "hover:bg-gray-800/40" : "hover:bg-gray-200/40"}`}
              aria-label={`${manga.title} - ${statConfig[selectedCategory].label}: ${statConfig[selectedCategory].getValue(manga)}`}
            >
              <div className="hidden sm:flex w-6 md:w-7 text-center">
                <span
                  className={`text-3xl md:text-5xl font-extrabold bg-clip-text text-transparent ${
                    isDark
                      ? "bg-gradient-to-b from-gray-600 to-gray-700"
                      : "bg-gradient-to-b from-gray-400 to-gray-600 "
                  }`}
                >
                  {idx + 1}
                </span>
              </div>

              <div className="flex-shrink-0 w-9 h-11 -ml-2 sm:-ml-0 md:w-12 md:h-16 rounded-lg sm:rounded-md overflow-hidden shadow-sm">
                <Image
                  width={300}
                  height={300}
                  src={manga.coverImageUrl ?? "/placeholder.jpg"}
                  alt={manga.title ?? "Manga cover"}
                  className="w-full h-full object-cover transition-transform duration-300"
                  loading="lazy"
                  decoding="async"
                  onError={() => "/placeholder.jpg"}
                />
              </div>

              <div className="flex flex-col ml-1 sm:ml-2 flex-1 min-w-0">
                <h3
                  className={`text-xs md:text-base font-semibold line-clamp-1 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                  title={manga.title}
                >
                  {manga.title ?? "Untitled Manga"}
                </h3>

                <div
                  className={`flex items-center gap-2 mt-1 text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  } ${selectedCategory === "New" ? "hidden" : ""}`}
                >
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
            </Link>
          ))}
        </ul>
      </section>
    </Suspense>
  );
}

export default React.memo(AsideComponent);