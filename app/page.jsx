"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect, useCallback, useMemo, lazy } from "react";
import { useRouter } from "next/navigation";
import TopFavouriteMangas from "./constants/TopFavouriteMangas";
import { MoveRight } from "lucide-react";
import { useManga } from './providers/MangaContext';
import { getNormalizedMangaTitle } from "./hooks/useMangaTitle";
const LandingContent = React.memo(
  lazy(() => import('./Components/HomeComponents/LandingContent'))
);

// Storage helpers (memoized outside component)
const getFromStorage = (key) => {
  try {
    const cachedData = localStorage.getItem(key);
    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData);
      if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
        return { data };
      }
    }
    return null;
  } catch (err) {
    console.warn(`Invalid cached data for ${key}:`, err);
    return null;
  }
};

const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  } catch (err) {
    console.warn(`Failed to save to storage for ${key}:`, err);
  }
};

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [topSearches, setTopSearches] = useState(TopFavouriteMangas);
  const router = useRouter();
  const { setSelectedManga } = useManga();

  // Debounce function memoized
  const debounce = useCallback((func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func.apply(this, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }, []);

  // Scroll handler memoized
  const handleScroll = useMemo(
    () =>
      debounce(() => {
        setIsVisible(window.scrollY <= 500);
      }, 50),
    [debounce]
  );

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Fetch TopManga list on mount with retry logic
  useEffect(() => {
    const fetchTopMangaList = async () => {
      try {
        const cached = getFromStorage("topMangaList");
        if (cached?.data) {
          setTopSearches(cached.data);
          return;
        }

        const resp = await fetch('/api/manga/UsersTop', { method: 'GET' });
        if (!resp.ok) {
          throw new Error(`Failed to fetch top mangas: ${resp.status}`);
        }
        const json = await resp.json();

        if (!json?.data || !Array.isArray(json.data)) {
          throw new Error('Invalid response from server');
        }

        setTopSearches(json.data);
        saveToStorage('topMangaList', json.data);
      } catch (err) {
        console.error('Failed to load TopManga list:', err);
        // Fallback to your default
        setTopSearches(TopFavouriteMangas);
        saveToStorage('topMangaList', TopFavouriteMangas);
      }
    };

    fetchTopMangaList();
  }, []);

  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();
      router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
    },
    [searchQuery, router]
  );
console.log(topSearches)
  const handleMangaClicked = useCallback((manga) => {
    setSelectedManga(manga);
  }, [setSelectedManga]);


  return (
    <div
      style={{
        lineHeight: "1.5",
        WebkitTextSizeAdjust: "100%",
        fontFamily: "system-ui, sans-serif",
        WebkitFontSmoothing: "antialiased",
        textRendering: "optimizeLegibility",
        MozOsxFontSmoothing: "grayscale",
        touchAction: "manipulation",
        backgroundImage:
          "radial-gradient(#2d2d2d 2px, transparent 0), radial-gradient(#373636 2px, transparent 0)",
        backgroundPosition: "0 0, 25px 25px",
        backgroundSize: "50px 50px",
      }}
      className="bg-gray-900 relative z-50 text-gray-100 min-h-screen -mt-20"
    >
      <div
        className={`w-full  ${isVisible ? "opacity-100" : "opacity-0"} transition-opacity flex justify-center items-center h-screen duration-300 bg-gradient-to-b from-purple-900/30 to-gray-900 pt-8 pb-12`}
      >
        <div className="container mt-16 md:mt-0 mx-auto px-4 py-6">
          {/* Logo */}
          <LOGO />

          {/* Search Bar */}
          <div className="mb-8 max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search manga..."
                className="w-full px-4 py-4 bg-gray-800 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 pl-5"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                style={{ background: "linear-gradient(#3b235a, #24143f)" }}
                className="absolute right-2 top-2 brightness-200 bg-purple-600 hover:bg-purple-700 transition duration-200 rounded-lg px-4 py-2"
              >
                Search
              </button>
            </form>
          </div>

          {/* Top Searches */}
          <div className="max-w-4xl mx-auto">
            <div className="flex h-40 sm:h-auto overflow-hidden flex-wrap items-center justify-center">
              <span className="text-gray-400 mr-2 mb-2">Top search:</span>
              {topSearches.map((manga, index) => {
                  const  title  = getNormalizedMangaTitle(manga, {
                  preferEnglish: true,
                  maxLength: 40
                });
                return (
                  <Link
                    key={manga.id ?? index}
                    href={`/manga/${manga?.id}/chapters`}
                    prefetch={true}
                    onClick={() => handleMangaClicked(manga)}
                    className="bg-gray-800 text-[10px] sm:text-sm rounded-md px-3 py-2 m-1 hover:bg-opacity-45 hover:bg-purple-800 transition duration-200"
                  >
                    {title}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Go To Homepage Button */}
          <GOTOHomeButton />
        </div>
      </div>

      <LandingContent />
    </div>
  );
};

export default React.memo(Home);

const GOTOHomeButton = React.memo(() => (
  <div className="mt-16 flex justify-center">
    <Link
      href="/manga-list"
      style={{ background: "linear-gradient(#3b235a, #24143f)" }}
      className="relative brightness-150 shadow-[0_0_7px_rgba(0,0,0,1)] shadow-purple-500 inline-flex items-center justify-start py-3 pl-4 pr-12 overflow-hidden font-semibold text-white transition-all duration-150 ease-in-out rounded hover:pl-10 hover:pr-6 group"
    >
      <span
        style={{ background: "linear-gradient(#3b235a, #24143f)" }}
        className="absolute bottom-0 left-0 w-full h-1 transition-all duration-150 ease-in-out brightness-150 group-hover:h-full"
      ></span>
      <span className="absolute right-0 pr-4 duration-200 ease-out group-hover:translate-x-12">
        <MoveRight className=" w-5 h-5 -mt-0.5" />
      </span>
      <span className="absolute left-0 pl-2.5 -translate-x-12 group-hover:translate-x-0 ease-out duration-200">
        <MoveRight className=" w-5 h-5 -mt-0.5 group-hover:-mt-0" />
      </span>
      <span className="relative w-full transform -translate-y-1 group-hover:-translate-y-0  text-left transition-colors duration-200 ease-in-out group-hover:text-white">
        Go To Homepage
      </span>
    </Link>
  </div>
));
GOTOHomeButton.displayName = "GOTOHomeButton";

const LOGO = React.memo(() => (
  <div className="flex justify-center mb-10">
    <Link href="/" className="inline-block">
      <Image
        src="/logo.svg"
        width={260}
        height={260}
        alt="AI_Manga_Reader"
        className="h-40 w-auto"
        priority
      />
    </Link>
  </div>
));
LOGO.displayName = "LOGO";