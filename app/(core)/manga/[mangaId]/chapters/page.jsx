'use client';

import { useParams, useRouter } from 'next/navigation';
import { Suspense, useCallback, useMemo,useState,useEffect } from 'react';
import { useManga } from '../../../../providers/MangaContext';
import AboutManga from '../../../../Components/MangaChaptersComponents/AboutManga';
import TabsAndSections from '../../../../Components/MangaChaptersComponents/TabsAndSections';
import AboutMangaSkeleton from '../../../../Components/Skeletons/MangaChapters/AboutMangaSkeleton';
import TabsAndSectionsSkeleton from '../../../../Components/Skeletons/MangaChapters/TabsAndSectionsSkeleton';
import { useChaptersFetch } from '../../../../hooks/useChaptersFetch';

export default function MangaChapters() {
  const { mangaId } = useParams();
  const router = useRouter();
  const { selectedManga, setChapterListForManga, addToReadHistory } = useManga();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  const manga = useMemo(
    () => (selectedManga && selectedManga.id === mangaId ? selectedManga : null),
    [selectedManga, mangaId]
  );

  const {
    data: chapters = [],
    isLoading: chaptersLoading,
    error: chaptersError,
  } = useChaptersFetch(mangaId);

  const handleChapterClick = useCallback(
    (chapter) => {
      if (!chapter?.id) {
        console.error('Invalid chapter ID:', chapter);
        return;
      }
      setChapterListForManga(mangaId, chapters);
      addToReadHistory(manga, chapter, chapters);
      router.push(`/manga/${mangaId}/chapter/${chapter.id}/read`);
    },
    [mangaId, router, chapters, manga, setChapterListForManga, addToReadHistory]
  );

  if (chaptersError) {
    return (
      <div className="flex justify-center items-center w-full h-screen bg-[#070920] backdrop-blur-md text-white">
        <div className="text-center">
          <p className="text-lg text-red-500">{chaptersError.message || 'Failed to load chapters.'}</p>
          <p className="text-sm text-gray-400">
            Please{' '}
            <button
              onClick={() => router.push('/')}
              className="text-blue-400 underline hover:text-blue-600"
            >
              go back
            </button>{' '}
            or try again later.
          </p>
        </div>
      </div>
    );
  }
   if (!isClient || !manga) {
    return (
      <div className="w-full min-h-screen -mt-7 md:-mt-20 overflow-hidden bg-transparent flex flex-col gap-12 text-white">
        <AboutMangaSkeleton />
        <TabsAndSectionsSkeleton />
      </div>
    );
  }

  return (
      <div className="w-full relative z-20 min-h-screen -mt-7 md:-mt-20 overflow-hidden bg-transparent flex flex-col gap-12 text-white">
        <AboutManga chapters={chapters} manga={manga} handleChapterClick={handleChapterClick} />
        {chaptersLoading ? (
          <TabsAndSectionsSkeleton />
        ) : chapters.length === 0 ? (
          <div className="text-center flex justify-center items-center font-bold text-red-500 text-lg bg-[#070920] backdrop-blur-md w-full h-[88vh]">
            No chapters found for this manga.
          </div>
        ) : (
          <TabsAndSections chapters={chapters} manga={manga} handleChapterClick={handleChapterClick} />
        )}
      </div>
  );
}