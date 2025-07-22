import React, { useState, useMemo, useCallback } from 'react';
import {
  Book,
  BookOpen,
  ShoppingCart,
  BookMarked,
  Library,
} from 'lucide-react';
import StableFlag from "../StableFlag";
import ChapterList from './ChapterList';
import CommentsOnManga from './CommentsOnManga';
import TabsAndSectionsSkeleton from '../Skeletons/MangaChapters/TabsAndSectionsSkeleton';
// import CoverArts from './CoverArts';

// Move static data outside component to prevent recreation
const websiteNames = {
  al: "AniList",
  amz: "Amazon",
  bw: "BookWalker",
  ebj: "eBookJapan",
  mal: "MyAnimeList",
  mu: "MangaUpdates",
  ap: "Anime Planet",
  nu: "Novel Updates",
  kt: "MangaDex",
  raw: "Raw",
  cdj: "CDJapan",
  yen: "YEN Press",
};

const iconMap = {
  raw: <Book className="w-4 h-4 mr-2 text-white" />,
  bw: <BookOpen className="w-4 h-4 mr-2 text-white" />,
  amz: <ShoppingCart className="w-4 h-4 mr-2 text-white" />,
  ebj: <Book className="w-4 h-4 mr-2 text-white" />,
  cdj: <Library className="w-4 h-4 mr-2 text-white" />,
  mu: <BookMarked className="w-4 h-4 mr-2 text-white" />,
  ap: <Library className="w-4 h-4 mr-2 text-white" />,
  al: <Book className="w-4 h-4 mr-2 text-white" />,
  mal: <Library className="w-4 h-4 mr-2 text-white" />,
};

const MemoStableFlag = React.memo(StableFlag);

function TabsAndSections({ manga, chapters, handleChapterClick }) {
  if(chapters.length==0 || !manga) return <TabsAndSectionsSkeleton/>
  const [sortOrder, setSortOrder] = useState('descending');
  const [activeTab, setActiveTab] = useState(0);

  // Memoize manga to prevent re-renders if manga object reference changes unnecessarily
  const memoManga = useMemo(() => manga, [manga]);

  // Memoize handleTabClick to stabilize function reference
  const handleTabClick = useCallback((index) => {
    setActiveTab(index);
  }, []);

  // Memoize getFullLink to stabilize function reference
  const getFullLink = useCallback(
    (key, link) => ({
      mu: `https://www.mangaupdates.com/${link}`,
      mal: `https://myanimelist.net/manga/${link}`,
      bw: `https://bookwalker.jp/${link}`,
      ap: `https://www.anime-planet.com/${link}`,
      nu: `https://www.novelupdates.com/${link}`,
      kt: `https://mangadex.org/title/${memoManga.id}/${link}`,
      al: `https://anilist.co/manga/${link}`,
    }[key] || link),
    [memoManga]
  );

  // Memoize uniqueVolumes to compute only when chapters or sortOrder change
  const uniqueVolumes = useMemo(
    () =>
      [...new Set(chapters.map((ch) => parseInt(ch.chapter.split('.')[0])))]
        .sort((a, b) => (sortOrder === 'descending' ? b - a : a - b)),
    [chapters, sortOrder]
  );

  // Memoize tabs to prevent recreation on every render
  const tabs = useMemo(
    () => [
      {
        label: `Chapters (${chapters.length})`,
        content: (
          <ChapterList
            manga={memoManga}
            uniqueVolumes={uniqueVolumes}
            chapters={chapters}
            handleChapterClick={handleChapterClick}
          />
        ),
      },
      {
        label: `Comments (${memoManga?.rating?.comments?.repliesCount || 0})`,
        content: <CommentsOnManga manga={memoManga} />,
      },
    //   {
    //     label: 'Art',
    //     content: <CoverArts chapters={chapters}/>,
    //   },
    ],
    [chapters.length, memoManga, uniqueVolumes, handleChapterClick]
  );

  return (
    <div className="px-4 sm:px-[70px]">
      <div className="mb-6 sm:mb-8 w-fit">
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={handleTabClick} />
      </div>
      <div className="flex flex-col sm:flex-row w-full gap-4 sm:gap-2">
        <div className="w-full hidden md:flex sm:w-5/12 flex-wrap gap-y-6 sm:gap-y-9 gap-x-6 h-fit">
          <div className="flex flex-row gap-4 w-full">
            <div className="min-w-1/3">
              <h3 className="text-white font-bold text-lg mb-2">Author</h3>
              <div className="bg-white/10 backdrop-blur-md min-w-fit px-3 py-2 text-sm inline-flex items-center Capitalize rounded transition-colors duration-200">
                {memoManga.authorName[0].attributes.name}
              </div>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg mb-2">Artist</h3>
              <div className="bg-white/10 backdrop-blur-md min-w-fit px-3 py-2 text-sm inline-flex items-center Capitalize rounded transition-colors duration-200">
                {memoManga.artistName[0].attributes.name}
              </div>
            </div>
          </div>
          <div className="h-fit">
            <h3 className="text-white font-bold text-lg mb-2">Genres</h3>
            <div className="flex flex-wrap gap-2">
              {memoManga.tags
                .find((group) => group.group === 'genre')
                ?.tags.map((genre, index) => (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-md min-w-fit px-3 py-2 text-xs inline-flex items-center Capitalize rounded transition-colors duration-200"
                  >
                    {genre}
                  </div>
                ))}
            </div>
          </div>
          <div className="h-fit">
            <h3 className="text-white font-bold text-lg mb-2">Themes</h3>
            <div className="flex flex-wrap gap-2">
              {memoManga.tags
                .find((group) => group.group === 'theme')
                ?.tags.map((theme, index) => (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-md min-w-fit px-3 py-2 text-xs inline-flex items-center Capitalize rounded transition-colors duration-200"
                  >
                    {theme}
                  </div>
                ))}
            </div>
          </div>
          <div className="h-fit">
            {memoManga.tags.find((group) => group.group === 'format')?.tags.length > 0 && (
              <h3 className="text-white font-bold text-lg mb-2">Format</h3>
            )}
            <div className="flex flex-wrap gap-2">
              {memoManga.tags
                .find((group) => group.group === 'format')
                ?.tags.map((format, index) => (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-md min-w-fit px-3 py-2 text-xs inline-flex items-center Capitalize rounded transition-colors duration-200"
                  >
                    {format}
                  </div>
                ))}
            </div>
          </div>
          <div className="relative h-fit">
            <h3 className="text-white font-bold text-lg mb-2">Demographic</h3>
            <div className="bg-white/10 backdrop-blur-md min-w-fit px-3 py-2 text-xs inline-flex items-center Capitalize rounded transition-colors duration-200">
              {memoManga.MangaStoryType || "None"}
            </div>
          </div>
          <div className="">
            <h3 className="text-white font-bold text-lg mb-4">Read or Buy</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {Object.entries(memoManga.links).map(([key, link], index) => (
                key !== 'kt' && (
                  <a
                    key={index}
                    href={getFullLink(key, link)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/10 backdrop-blur-md rounded px-3 py-2 flex items-center"
                  >
                    {iconMap[key] || <Book className="w-4 h-4 mr-2 text-white" />}
                    <span className="text-white text-xs">{websiteNames[key] || "Unknown" }</span>
                  </a>
                )
              ))}
            </div>
          </div>
          <div className="">
            <h3 className="text-white font-bold text-lg mb-4">Track</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {['mu', 'ap', 'al', 'mal'].map((key, index) => (
                memoManga.links[key] && (
                  <a
                    key={index}
                    href={getFullLink(key, memoManga.links[key])}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/10 backdrop-blur-md rounded px-3 py-2 flex items-center"
                  >
                    {iconMap[key] || <Book className="w-4 h-4 mr-2 text-white" />}
                    <span className="text-white text-xs">{websiteNames[key]}</span>
                  </a>
                )
              ))}
            </div>
          </div>
          <div className="">
            <h3 className="text-white font-bold text-lg mb-4">Alternative Titles</h3>
            <div className="space-y-2">
              {memoManga.altTitles.map((title, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 py-1 px-2 rounded-md hover:bg-gray-800 transition-all duration-150"
                >
                  <MemoStableFlag
                    code={Object.keys(title)[0] || "en"}
                    className="w-6 sm:w-8 h-6 sm:h-8 rounded-md shadow-sm"
                    alt="flag"
                  />
                  <span className="text-xs sm:text-sm line-clamp-1 font-medium text-gray-200">
                    {Object.values(title)[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full sm:-mt-6 sm:ml-5">
          {tabs[activeTab] && tabs[activeTab].content}
        </div>
      </div>
    </div>
  );
}

export default TabsAndSections;

// Memoize Tabs to prevent re-renders when props are unchanged
const Tabs = React.memo(({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="bg-gray-600/30 backdrop-blur-md rounded overflow-x-auto flex-nowrap">
      <div className="flex">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => onTabChange(index)}
            className={`px-4 py-2 text-sm md:text-base font-bold transition-colors duration-200 whitespace-nowrap ${
              activeTab === index
                ? 'bg-gray-600/30 text-white shadow-md rounded'
                : 'text-[#808080] hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
});