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
import { useManga } from '../../providers/MangaContext';
import { useTheme } from '../../providers/ThemeContext';
import Link from 'next/link';
import { useMangaFilters } from '../../hooks/useMangaFilters';
import { getNormalizedMangaTitle } from '@/app/hooks/useMangaTitle';
import { getBlurDataURL } from "../../util/imageOptimization"

const MangaThumbnail = React.memo(function MangaThumbnail({
  manga,
  index,
  activeIndex,
  handleThumbnailClick,
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      className={`relative cursor-pointer transition-all duration-150 ${index === activeIndex ? 'ring-2 ring-black' : isDark ? 'opacity-70 hover:opacity-100' : ''
        }`}
      onClick={() => handleThumbnailClick(index)}
      role="button"
      aria-label={`Show ${manga.normalizedTitle}`}
    >
      <div className="w-full aspect-[2/3] overflow-hidden rounded-sm">
        <div
          className={`relative w-full h-full overflow-hidden rounded-sm will-change-transform ${manga?.isCoverImageBlurred
              ? "before:content-[''] before:absolute before:inset-0 before:bg-black/20 before:backdrop-blur-lg before:transition-opacity before:duration-300 hover:before:opacity-0 before:z-10"
              : ''
            }`}
        >
          <Image
            src={manga.coverImageUrl}
            alt={manga.normalizedTitle ?? 'Manga cover'}
            width={300}
            height={450}
            sizes="(max-width: 640px) 120px, (max-width: 1024px) 150px, 200px"
            loading="lazy"
            decoding="async"
            blurDataURL={getBlurDataURL()}
            className="w-full h-full object-cover block"
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent pointer-events-none" />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-3">
        <div className="flex items-center mb-1">
          <StableFlag code={manga.originalLanguage ?? 'UN'} />
          <span className="text-black text-xs">{manga.originalLanguage ?? 'UN'}</span>
        </div>
        <h4 className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-black'}`}>
          {manga.normalizedTitle}
        </h4>
      </div>

      {index === activeIndex && (
        <div className="absolute top-2 right-2 w-4 h-4 bg-black rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full" />
        </div>
      )}
    </div>
  );
});

MangaThumbnail.displayName = 'MangaThumbnail';

const SliderComponent = React.memo(function SliderComponent() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { addToBookMarks, getAllBookMarks, setSelectedManga } = useManga();
  const { data, isLoading, isError, error } = useMangaFetch('random', 1);

  const originalMangas = useMemo(() => data?.data ?? [], [data?.data]);
  const filteredMangas = useMangaFilters(originalMangas);
  const mangas = useMemo(() => (filteredMangas ? filteredMangas.slice(0, 8) : []), [filteredMangas]);
const normalizedMangas=mangas.map(item => ({
            ...item,
            normalizedTitle: getNormalizedMangaTitle(item, {
                preferEnglish: true,
                maxLength: 40
            })
        }))
  const bookMarks = useMemo(() => getAllBookMarks() ?? [], [getAllBookMarks]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const showcaseRef = useRef(null);
  const timerRef = useRef(null);
  const progressRef = useRef(null);
  const autoplayDuration = 8000;

  const activeManga = useMemo(() => (normalizedMangas.length > 0 ? normalizedMangas[activeIndex] : null), [
    normalizedMangas,
    activeIndex,
  ]);

  const handleMangaClicked = useCallback(
    (manga) => {
      if (manga) setSelectedManga(manga);
    },
    [setSelectedManga]
  );

  const startProgressAnimation = useCallback(() => {
    const el = progressRef.current;
    if (!el) return;
    el.style.transition = 'none';
    el.style.width = '0%';
    // force reflow
    void el.offsetWidth;
    el.style.transition = `width ${autoplayDuration}ms linear`;
    el.style.width = '100%';
  }, [autoplayDuration]);

  const resetProgress = useCallback(() => {
    const el = progressRef.current;
    if (!el) return;
    el.style.transition = 'none';
    el.style.width = '0%';
  }, []);

  const handleNext = useCallback(() => {
    if (isTransitioning || normalizedMangas.length === 0) return;
    setIsTransitioning(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    resetProgress();
    setActiveIndex((prev) => (prev + 1) % normalizedMangas.length);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, normalizedMangas.length, resetProgress]);

  const handlePrev = useCallback(() => {
    if (isTransitioning || normalizedMangas.length === 0) return;
    setIsTransitioning(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    resetProgress();
    setActiveIndex((prev) => (prev - 1 + normalizedMangas.length) % normalizedMangas.length);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, normalizedMangas.length, resetProgress]);

  const handleThumbnailClick = useCallback(
    (index) => {
      if (isTransitioning || index === activeIndex || normalizedMangas.length === 0) return;
      setIsTransitioning(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      resetProgress();
      setActiveIndex(index);
      setTimeout(() => setIsTransitioning(false), 500);
    },
    [isTransitioning, activeIndex, normalizedMangas.length, resetProgress]
  );

  const startTimer = useCallback(() => {
    startProgressAnimation();
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      handleNext();
    }, autoplayDuration);
  }, [startProgressAnimation, autoplayDuration, handleNext]);

  const handleTouchStart = useCallback((e) => {
    const x = e.touches[0]?.clientX ?? 0;
    setTouchStart(x);
    setTouchEnd(x);
  }, []);

  const handleTouchMove = useCallback((e) => {
    setTouchEnd(e.touches[0]?.clientX ?? 0);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (touchStart - touchEnd > 75) {
      handleNext();
    } else if (touchEnd - touchStart > 75) {
      handlePrev();
    }
  }, [touchStart, touchEnd, handleNext, handlePrev]);

  const handleAddToCollectionClicked = useCallback(
    (manga) => {
      if (manga) addToBookMarks(manga);
    },
    [addToBookMarks]
  );

  useEffect(() => {
    if (normalizedMangas.length > 0 && !isTransitioning) startTimer();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [activeIndex, normalizedMangas.length, isTransitioning, startTimer]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isTransitioning && normalizedMangas.length > 0) {
      const timeoutId = setTimeout(() => startTimer(), 50);
      return () => clearTimeout(timeoutId);
    }
  }, [isTransitioning, normalizedMangas.length, startTimer]);

  if (isLoading) return <SliderComponentSkeleton isDark={isDark} />;

  if (isError)
    return <div className="text-red-500">Error: {(error)?.message ?? 'Unknown'}</div>;

  if (normalizedMangas.length === 0 || !activeManga) {
    return <div className={isDark ? 'text-white' : 'text-black'}>No mangas available</div>;
  }

  return (
    <Suspense fallback={<SliderComponentSkeleton isDark={isDark} />}>
      <div
        ref={showcaseRef}
        className={`relative w-full ${isDark ? 'shadow-[5px_5px_50px_rgba(0,0,0,1)] shadow-black' : ''} min-h-[50vh] sm:h-[60vh] border-b-[16px] ${isDark ? 'border-black bg-black/60' : 'border-white bg-white/60'
          } overflow-hidden`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="absolute top-0 left-0 right-0 h-1 z-50 bg-gray-800"
          aria-hidden
        >
          <div ref={progressRef} className="h-full bg-purple-700" />
        </div>

        <div className="absolute inset-0 flex flex-col lg:flex-row">
          <div className="relative w-full lg:w-[73%] h-full overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center filter blur-lg opacity-30 transition-opacity duration-500"
              style={{ backgroundImage: `url(${activeManga.coverImageUrl})` }}
              role="img"
              aria-label={`${activeManga.normalizedTitle} background`}
            />

            {isDark && (
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/60 sm:to-transparent z-10" />
            )}

            <div className="absolute bottom-1 left-0 right-0 flex items-center justify-center z-40 lg:hidden">
              <div className="flex space-x-3 items-center px-4 py-2 rounded-full">
                <button
                  type="button"
                  onClick={handlePrev}
                  className={`w-8 h-8 ${isDark ? 'bg-white/10' : 'bg-black/10'} border ${isDark ? 'border-white/10' : 'border-black/10'
                    } rounded-full flex items-center justify-center ${isDark ? 'text-white' : 'text-black'} mr-2`}
                  aria-label="Previous"
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="flex space-x-2 items-center">
                  {normalizedMangas.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full cursor-pointer ${index === activeIndex ? 'bg-white w-3' : isDark ? 'bg-white/40' : 'bg-black/40'
                        } transition-all duration-300`}
                      onClick={() => handleThumbnailClick(index)}
                      role="button"
                      aria-label={`Go to ${index + 1}`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleNext}
                  className={`w-8 h-8 ${isDark ? 'bg-white/10' : 'bg-black/10'} border ${isDark ? 'border-white/10' : 'border-black/10'
                    } rounded-full flex items-center justify-center ${isDark ? 'text-white' : 'text-black'} ml-2`}
                  aria-label="Next"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <div className="relative h-full mt-3 md:-mt-5 z-20 md:px-7 lg:px-0 flex items-center justify-between">
              <div className="w-[75%] lg:w-4/5 px-8 pl-6 lg:px-16 lg:pl-24 pt-12 pb-32 sm:py-12">
                <div
                  className={`inline-flex items-center px-3 py-1 mb-4 lg:mb-6 rounded-full border bg-black/5 backdrop-blur-sm ${isDark ? 'border-white/30' : 'border-black/30'
                    }`}
                >
                  <StableFlag code={activeManga.originalLanguage ?? 'UN'} />
                  <span className={`text-xs uppercase tracking-widest ${isDark ? 'text-white' : 'text-black'}`}>
                    {activeManga.originalLanguage ?? 'Unknown'}
                  </span>
                </div>
                <h1
                  className={`text-xl sm:text-3xl lg:text-5xl font-bold mb-4 lg:mb-6 leading-tight transition-all duration-0 ${isDark ? 'text-white' : 'text-black'
                    }`}
                >
                  <span className="block relative">
                    <span className="relative line-clamp-1 xl:line-clamp-none z-10">
                      {activeManga.normalizedTitle}
                    </span>
                    <span className="absolute -bottom-2 lg:-bottom-3 left-0 h-2 lg:h-3 w-16 lg:w-24 bg-purple-800 z-0" />
                  </span>
                </h1>
                <p className={`text-[11px] line-clamp-3 sm:text-sm lg:text-base mb-6 lg:mb-8 max-w-xl lg:max-w-2xl transition-all duration-0 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {activeManga.description}
                </p>
                <div className="flex flex-wrap gap-3 lg:gap-4">
                  <Link
                    href={`/manga/${activeManga.id}/chapters`}
                    prefetch={true}
                    onClick={() => handleMangaClicked(activeManga)}
                    className={`px-3 lg:px-6 py-2 lg:py-3 font-medium rounded-sm transition-colors duration-0 text-[11px] sm:text-sm lg:text-base inline-block ${isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'
                      }`}
                  >
                    Read Now
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleAddToCollectionClicked(activeManga)}
                    className={`px-3 lg:px-6 py-2 lg:py-3 border rounded-sm transition-colors duration-0 text-[11px] sm:text-sm lg:text-base ${bookMarks.some((m) => m.manga.id === activeManga.id)
                        ? isDark
                          ? 'border-white/50 text-white shadow-[inset_0_0_13px_rgba(200,200,200,0.5)] hover:bg-white/10'
                          : 'border-black text-black shadow-[inset_0_0_13px_rgba(0,0,0,0.5)] hover:bg-black/10'
                        : isDark
                          ? 'border-white text-white hover:bg-white/10'
                          : 'border-black text-black hover:bg-black/10'
                      }`}
                  >
                    {bookMarks.some((m) => m.manga.id === activeManga.id) ? '✓ Added To Collection' : ' Add to Collection'}
                  </button>
                </div>
              </div>
              {/* Mobile Image and stuff */}
              <Link
                href={`/manga/${activeManga.id}/chapters`}
                prefetch={true}
                onClick={() => handleMangaClicked(activeManga)}
                className="absolute top-[55px] right-6 md:top-[85px] md:right-10 lg:right-3 w-[100px] h-40 md:h-60 md:w-[170px] lg:hidden z-30 transition-all duration-500 block"
                style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.5), 0 0 30px rgba(0,0,0,0.3)' }}
              >
                <div className={`relative w-full h-full overflow-hidden rounded-sm will-change-transform ${activeManga.isCoverImageBlurred ? "before:content-[''] before:absolute before:inset-0 before:bg-black/20 before:backdrop-blur-lg before:transition-opacity before:duration-300 hover:before:opacity-0 before:z-10" : ""}`}>
                  <Image
                    src={activeManga.coverImageUrl}
                    alt={activeManga.normalizedTitle}
                    width={300}
                    height={450}
                    priority
                    blurDataURL={getBlurDataURL()}
                    loading="eager"
                    sizes="100px"
                    decoding="async"
                    className="w-full object-fill h-full block"
                  />
                  <div className="absolute z-50 inset-0 bg-gradient-to-r [box-shadow:inset_0_0_20px_10px_rgba(20,20,20,1)] pointer-events-none" />
                </div>
              </Link>
{/* Laptop view Image  */}
              <div className="hidden lg:block lg:w-2/5 h-full relative">
                <Link
                  href={`/manga/${activeManga.id}/chapters`}
                  prefetch={true}
                  onClick={() => handleMangaClicked(activeManga)}
                  className="absolute top-1/2 -translate-y-[44%] right-10 w-48  h-[280px] xl:right-16 xl:w-64 xl:h-[360px] z-30 transition-all duration-500 block"
                  style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.5), 0 0 30px rgba(0,0,0,0.3)' }}
                >
                  <div className={`relative w-full h-full overflow-hidden rounded-sm will-change-transform ${activeManga.isCoverImageBlurred ? "before:content-[''] before:absolute before:inset-0 before:bg-black/20 before:backdrop-blur-lg before:transition-opacity before:duration-300 hover:before:opacity-0 before:z-10" : ""}`}>
                    <Image
                      src={activeManga.coverImageUrl}
                      alt={activeManga.normalizedTitle}
                      width={300}
                      height={450}
                      priority
                      blurDataURL={getBlurDataURL()}
                      loading="eager"
                      sizes="256px"
                      decoding="async"
                      className="w-full h-full object-cover rounded-sm block"
                    />
                    <div className="absolute inset-0 rounded-sm bg-gradient-to-tr from-transparent via-white to-transparent opacity-20 pointer-events-none" />
                  </div>
                </Link>
              </div>
            </div>
          </div>

          <div className={`relative w-full lg:w-[27%] h-full backdrop-blur-sm hidden lg:flex flex-col ${isDark ? 'bg-black/80' : 'bg-white/80'}`}>
            <div className={`h-24 border-b py-3 px-8 flex items-center justify-between ${isDark ? 'border-white/10' : 'border-black/10'}`}>
              <button
                type="button"
                onClick={handlePrev}
                className={`flex items-center gap-3 transition-colors duration-0 group ${isDark ? 'text-white/70 hover:text-white' : 'text-black/70 hover:text-black'}`}
              >
                <span className={`w-8 h-8 flex items-center justify-center rounded-full border transition-colors duration-0 group-hover:border-black ${isDark ? 'border-white/30 bg-black/50' : 'border-black/30 bg-white/50'}`}>
                  <ChevronLeft size={18} />
                </span>
                <span className="hidden sm:block uppercase text-[11px] tracking-widest">Prev</span>
              </button>
              <div className="text-center flex flex-col">
                <span className={`${isDark ? 'text-white/50' : 'text-black/50'} text-xs`}>{activeIndex + 1} / {normalizedMangas.length}</span>
                <span className={`${isDark ? 'text-white/30' : 'text-black/30'} text-[11px]`}>Swipe to navigate</span>
              </div>
              <button
                type="button"
                onClick={handleNext}
                className={`flex items-center gap-3 transition-colors duration-0 group ${isDark ? 'text-white/70 hover:text-white' : 'text-black/70 hover:text-black'}`}
              >
                <span className="hidden sm:block uppercase text-[11px] tracking-widest">Next</span>
                <span className={`w-8 h-8 flex items-center justify-center rounded-full border transition-colors duration-0 group-hover:border-black ${isDark ? 'border-white/30 bg-black/50' : 'border-black/30 bg-white/50'}`}>
                  <ChevronRight size={18} />
                </span>
              </button>
            </div>

            <div className="flex-grow p-6 pt-3 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(0,0,0,0.6) rgba(0,0,0,0.1)' }}>
              <h3 className={`uppercase text-xs tracking-widest mb-3 ${isDark ? 'text-white/50' : 'text-black/50'}`}>Discover More</h3>
              <div className="grid grid-cols-2 gap-4">
                {normalizedMangas.map((manga, index) => (
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

        <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-40 hidden lg:block">
          <button
            type="button"
            onClick={handlePrev}
            className={`w-12 h-12 mb-3 rounded-full flex items-center justify-center transition-colors duration-0 hover:bg-white hover:text-black hover:border-white border ${isDark ? 'bg-black/50 border-white/10 text-white' : 'bg-white/50 border-black/10 text-black'}`}
            aria-label="Previous"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="relative w-1 h-40 bg-white/20 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 right-0 bg-black transition-all duration-300"
              style={{ height: `${(activeIndex / Math.max(1, normalizedMangas.length - 1)) * 100}%` }}
              aria-hidden
            />
          </div>
        </div>
      </div>
    </Suspense>
  );
});

SliderComponent.displayName = 'SliderComponent';
export default SliderComponent;