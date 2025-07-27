// app/page/manga/[mangaId]/page/manga/chapters/loading.tsx
import AboutMangaSkeleton from './AboutMangaSkeleton';
import TabsAndSectionsSkeleton from './TabsAndSectionsSkeleton';

export default function Loading({ isDark = true }) {
  return (
    <div className="w-full min-h-screen -mt-7 md:-mt-20 overflow-hidden bg-transparent flex flex-col gap-12 text-white">
      <AboutMangaSkeleton isDark={isDark} />
      <TabsAndSectionsSkeleton isDark={isDark} />
    </div>
  );
}