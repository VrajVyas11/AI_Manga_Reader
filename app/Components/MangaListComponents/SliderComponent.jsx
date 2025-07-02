'use client';
import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  Suspense,
} from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import StableFlag from '../StableFlag';
import Image from 'next/image';
import { useMangaFetch } from '../../hooks/useMangaFetch';
import SliderComponentSkeleton from '../Skeletons/MangaList/SliderComponentSkeleton';
import { useRouter } from 'next/navigation';
import { useManga } from '../../providers/MangaContext';
import { useTheme } from '../../providers/ThemeContext';
// Memoized thumbnail component
const MangaThumbnail = React.memo(
  ({ manga, index, activeIndex, handleThumbnailClick }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
      <div
        className={`
          relative cursor-pointer transition-all duration-300
          ${index === activeIndex ? 'ring-2 ring-purple-600' : 'opacity-70 hover:opacity-100'}
        `}
        onClick={() => handleThumbnailClick(index)}
      >
        <div className="w-full aspect-[2/3] overflow-hidden">
          <Image
            width={300}
            height={300}
            src={manga.coverImageUrl}
            alt={manga.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-3">
          <div className="flex items-center mb-1">
            <StableFlag code={manga.originalLanguage || 'UN'} />
            <span className="text-purple-600 text-xs">{manga.originalLanguage}</span>
          </div>
          <h4
            className={`text-sm font-medium truncate ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            {manga.title}
          </h4>
        </div>

        {index === activeIndex && (
          <div className="absolute top-2 right-2 w-4 h-4 bg-purple-600 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          </div>
        )}
      </div>
    );
  }
);

MangaThumbnail.displayName = 'MangaThumbnail';

const SliderComponent = React.memo(() => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const { data, isLoading, isError, error } = useMangaFetch('random', 1);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const showcaseRef = useRef(null);
  const timerRef = useRef(null);
  const progressRef = useRef(null);
  const autoplayDuration = 8000;
  const mangas = useMemo(() => (data && data.data.slice(0, 8)) || [], [data]);
  // Cache the current manga
  const activeManga = useMemo(
    () => (mangas.length > 0 ? mangas[activeIndex] : null),
    [mangas, activeIndex]
  );
  const router = useRouter();
  const { setSelectedManga } = useManga();
  const handleMangaClicked = useCallback(
    (manga) => {
      setSelectedManga(manga);
      router.push(`/manga/${manga.id}/chapters`);
    },
    [router, setSelectedManga]
  );

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Navigation handlers
  const handleNext = useCallback(() => {
    if (isTransitioning || mangas.length === 0) return;
    setIsTransitioning(true);
    clearTimeout(timerRef.current);
    resetProgress();

    setActiveIndex((prev) => (prev + 1) % mangas.length);

    setTimeout(() => {
      setIsTransitioning(false);
      startTimer();
    }, 500);
  }, [isTransitioning, mangas.length]);

  const handlePrev = useCallback(() => {
    if (isTransitioning || mangas.length === 0) return;
    setIsTransitioning(true);
    clearTimeout(timerRef.current);
    resetProgress();

    setActiveIndex((prev) => (prev - 1 + mangas.length) % mangas.length);

    setTimeout(() => {
      setIsTransitioning(false);
      startTimer();
    }, 500);
  }, [isTransitioning, mangas.length]);

  const handleThumbnailClick = useCallback(
    (index) => {
      if (isTransitioning || index === activeIndex || mangas.length === 0) return;
      setIsTransitioning(true);
      clearTimeout(timerRef.current);
      resetProgress();

      setActiveIndex(index);

      setTimeout(() => {
        setIsTransitioning(false);
        startTimer();
      }, 500);
    },
    [isTransitioning, activeIndex, mangas.length]
  );

  // Touch event handlers
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      handleNext();
    } else if (touchEnd - touchStart > 75) {
      handlePrev();
    }
  };

  const startProgressAnimation = useCallback(() => {
    if (!progressRef.current) return;
    progressRef.current.style.transition = 'none';
    progressRef.current.style.width = '0%';
    void progressRef.current.offsetWidth;
    progressRef.current.style.transition = `width ${autoplayDuration}ms linear`;
    progressRef.current.style.width = '100%';
  }, []);

  const startTimer = useCallback(() => {
    startProgressAnimation();
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      handleNext();
    }, autoplayDuration);
  }, [handleNext, startProgressAnimation]);

  useEffect(() => {
    if (mangas.length > 0) {
      startTimer();
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [activeIndex, mangas.length, startTimer]);

  const resetProgress = useCallback(() => {
    if (!progressRef.current) return;
    progressRef.current.style.transition = 'none';
    progressRef.current.style.width = '0%';
  }, []);

  // Early returns for loading and error states
  if (isLoading) {
    return <SliderComponentSkeleton />;
  }

  if (isError) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  // Early return for empty data
  if (mangas.length === 0 || !activeManga) {
    return <div className={isDark ? 'text-white' : 'text-black'}>No mangas available</div>;
  }

  // Define theme-based classes
  const bgMain = isDark ? 'bg-black/60' : 'bg-white/60';
  const borderBottom = isDark ? 'border-black/10' : 'border-white';
  const btnPurpleBg = isDark ? 'bg-purple-600' : 'bg-purple-400';
  const btnPurpleHover = isDark ? 'hover:bg-purple-300' : 'hover:bg-purple-500';
  const btnPurpleText = isDark ? 'text-black' : 'text-white';
  const btnBorderPurple = isDark ? 'border-purple-600/50' : 'border-purple-400/50';

  return (
    <Suspense fallback={<SliderComponentSkeleton />}>
      <div
        ref={showcaseRef}
        className={`relative w-full ${isDark?"shadow-[5px_5px_50px_rgba(0,0,0,1)] shadow-black":""}  min-h-[53vh] sm:h-[60vh] border-b-[16px] ${borderBottom} overflow-hidden ${bgMain}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Background noise texture */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "url('data:image/svg+xml,%3Csvg%20viewBox%3D%270%200%20200%20200%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%3E%3Cfilter%20id%3D%27noiseFilter%27%3E%3CfeTurbulence%20type%3D%27fractalNoise%27%20baseFrequency%3D%270.65%27%20numOctaves%3D%273%27%20stitchTiles%3D%27stitch%27%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%27100%25%27%20height%3D%27100%25%27%20filter%3D%27url%28%23noiseFilter%29%27%2F%3E%3C%2Fsvg%3E')",
          }}
        />

        {/* Progress Timeline */}
        <div className={`absolute top-0 left-0 right-0 h-1 z-50 bg-gray-800`}>
          <div ref={progressRef} className="h-full bg-purple-600" />
        </div>

        {/* Main Content Area */}
        <div className="absolute inset-0 flex flex-col md:flex-row">
          {/* Left Panel - Feature Display */}
          <div className="relative w-full md:w-[73%] h-full overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center filter blur-md opacity-30 transition-opacity duration-500"
              style={{ backgroundImage: `url(${activeManga?.coverImageUrl})` }}
            />
            {isDark&&<div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/60 sm:to-transparent z-10" />}

            {/* Mobile Navigation Controls */}
            <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center z-40 md:hidden">
              <div className="flex space-x-3 items-center bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm">
                <button
                  onClick={handlePrev}
                  className="w-8 h-8 bg-black/50 border border-white/10 rounded-full flex items-center justify-center text-white mr-2"
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="flex space-x-2 items-center">
                  {mangas.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full cursor-pointer ${
                        index === activeIndex ? 'bg-purple-600 w-3' : 'bg-white/40'
                      } transition-all duration-300`}
                      onClick={() => handleThumbnailClick(index)}
                    ></div>
                  ))}
                </div>
                <button
                  onClick={handleNext}
                  className="w-8 h-8 bg-black/50 border border-white/10 rounded-full flex items-center justify-center text-white ml-2"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Content Container */}
            <div className="relative h-full z-20 flex items-center justify-between">
              <div className="w-[75%] md:w-4/5 px-8 pl-6  md:px-16 md:pl-24 pt-12 pb-32 sm:py-12">
                <div
                  className={`inline-flex items-center px-3 py-1 mb-4 md:mb-6 rounded-full border bg-black/30 backdrop-blur-sm ${
                    isDark ? 'border-purple-600/30' : 'border-purple-400/30 bg-purple-100/30'
                  }`}
                >
                  <StableFlag code={activeManga?.originalLanguage || 'UN'} />
                  <span
                    className={`text-xs uppercase tracking-widest ${
                      isDark ? 'text-purple-600' : 'text-purple-700'
                    }`}
                  >
                    {activeManga?.originalLanguage || 'Unknown'}
                  </span>
                </div>
                <h1
                  className={`text-xl sm:text-3xl md:text-5xl font-bold mb-4 md:mb-6 leading-tight transition-all duration-500 ${
                    isDark ? 'text-white' : 'text-black'
                  }`}
                >
                  <span className="block relative">
                    <span className="relative line-clamp-1 md:line-clamp-none z-10">
                      {activeManga?.title.length > 40
                        ? `${activeManga?.title.slice(0, 40)}...`
                        : activeManga?.title}
                    </span>
                    <span className="absolute -bottom-2 md:-bottom-3 left-0 h-2 md:h-3 w-16 md:w-24 bg-purple-600/50 z-0"></span>
                  </span>
                </h1>
                <p
                  className={`text-[11px] line-clamp-3 sm:text-sm md:text-base mb-6 md:mb-8 max-w-xl md:max-w-2xl transition-all duration-500 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  {activeManga?.description}
                </p>
                <div className="flex flex-wrap gap-3 md:gap-4">
                  <button
                    onClick={() => handleMangaClicked(activeManga)}
                    className={`px-3 md:px-6 py-2 md:py-3 font-medium rounded-sm transition-colors text-[11px] sm:text-sm md:text-base ${
                      btnPurpleBg
                    } ${btnPurpleText} hover:${btnPurpleHover}`}
                  >
                    Read Now
                  </button>
                  <button
                    className={`px-3 md:px-6 py-2 md:py-3 bg-transparent border rounded-sm transition-colors text-[11px] sm:text-sm md:text-base ${
                      btnBorderPurple
                    } text-purple-600 hover:bg-purple-600/10`}
                  >
                    Add to Collection
                  </button>
                </div>
              </div>
              <div
                className="absolute top-[60px] right-6 md:right-3 w-[100px] h-40 md:hidden z-30 transition-all duration-500"
                style={{
                  boxShadow: '0 20px 40px rgba(0,0,0,0.5), 0 0 30px rgba(0,0,0,0.3)',
                }}
              >
                <Image
                  width={300}
                  height={300}
                  src={activeManga?.coverImageUrl}
                  alt={activeManga?.title}
                  className="w-full object-cover h-full absolute"
                />
                <div className="absolute z-50 inset-0 bg-gradient-to-r [box-shadow:inset_0_0_20px_10px_rgba(20,20,20,1)]" />
              </div>
              <div className="hidden md:block md:w-2/5 h-full relative">
                <div
                  className="absolute top-1/2 -translate-y-1/2 right-16 w-64 h-[360px] z-30 transition-all duration-500"
                  style={{
                    boxShadow: '0 20px 40px rgba(0,0,0,0.5), 0 0 30px rgba(0,0,0,0.3)',
                  }}
                >
                  <Image
                    width={300}
                    height={300}
                    src={activeManga?.coverImageUrl}
                    alt={activeManga?.title}
                    className="w-full h-full object-cover rounded-sm"
                  />
                  <div className="absolute inset-0 rounded-sm bg-gradient-to-tr from-transparent via-white to-transparent opacity-20" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Navigation & Thumbnails */}
          <div
            className={`relative w-full md:w-[27%] h-full backdrop-blur-sm hidden md:flex flex-col ${
              isDark ? 'bg-black/80' : 'bg-white/80'
            }`}
          >
            <div
              className={`h-24 border-b py-3 px-8 flex items-center justify-between ${
                isDark ? 'border-white/10' : 'border-gray-300'
              }`}
            >
              <button
                onClick={handlePrev}
                className={`flex items-center gap-3 transition-colors group ${
                  isDark ? 'text-white/70 hover:text-purple-600' : 'text-gray-700 hover:text-purple-700'
                }`}
              >
                <span
                  className={`w-8 h-8 flex items-center justify-center rounded-full border transition-colors group-hover:border-purple-600 ${
                    isDark ? 'border-white/30 bg-black/50' : 'border-gray-300 bg-white/50'
                  }`}
                >
                  <ChevronLeft size={18} />
                </span>
                <span className="hidden sm:block uppercase text-[11px] tracking-widest">
                  Prev
                </span>
              </button>
              <div className="text-center flex flex-col">
                <span className={`${isDark ? 'text-white/50' : 'text-gray-500'} text-xs`}>
                  {activeIndex + 1} / {mangas.length}
                </span>
                <span className={`${isDark ? 'text-white/30' : 'text-gray-400'} text-[11px]`}>
                  Swipe to navigate
                </span>
              </div>
              <button
                onClick={handleNext}
                className={`flex items-center gap-3 transition-colors group ${
                  isDark ? 'text-white/70 hover:text-purple-600' : 'text-gray-700 hover:text-purple-700'
                }`}
              >
                <span className="hidden sm:block uppercase text-[11px] tracking-widest">
                  Next
                </span>
                <span
                  className={`w-8 h-8 flex items-center justify-center rounded-full border transition-colors group-hover:border-purple-600 ${
                    isDark ? 'border-white/30 bg-black/50' : 'border-gray-300 bg-white/50'
                  }`}
                >
                  <ChevronRight size={18} />
                </span>
              </button>
            </div>
            <div
              className="flex-grow p-6 pt-3 overflow-y-auto"
              style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(155, 89, 182, 0.6) rgba(0, 0, 0, 0.1)' }}
            >
              <h3
                className={`uppercase text-xs tracking-widest mb-3 ${
                  isDark ? 'text-white/50' : 'text-gray-700'
                }`}
              >
                Discover More
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {mangas.map((manga, index) => (
                  <MangaThumbnail
                    key={manga.id}
                    manga={manga}
                    index={index}
                    activeIndex={activeIndex}
                    handleThumbnailClick={handleThumbnailClick}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Side Indicators */}
        <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-40 hidden md:block">
          <button
            onClick={handlePrev}
            className={`w-12 h-12 mb-3 rounded-full flex items-center justify-center transition-colors hover:bg-purple-600 hover:text-black hover:border-purple-600 border ${
              isDark ? 'bg-black/50 border-white/10 text-white' : 'bg-white/50 border-gray-300 text-gray-700'
            }`}
          >
            <ChevronLeft size={20} />
          </button>
          <div className="relative w-1 h-40 bg-white/20 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 right-0 bg-purple-600 transition-all duration-300"
              style={{ height: `${(activeIndex / (mangas.length - 1)) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </Suspense>
  );
});

export default SliderComponent;