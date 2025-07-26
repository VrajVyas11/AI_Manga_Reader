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

const getIconMap = (isDark) => ({
  raw: <Book className={`w-4 h-4 mr-2 ${isDark ? 'text-white' : 'text-gray-700'}`} />,
  bw: <BookOpen className={`w-4 h-4 mr-2 ${isDark ? 'text-white' : 'text-gray-700'}`} />,
  amz: <ShoppingCart className={`w-4 h-4 mr-2 ${isDark ? 'text-white' : 'text-gray-700'}`} />,
  ebj: <Book className={`w-4 h-4 mr-2 ${isDark ? 'text-white' : 'text-gray-700'}`} />,
  cdj: <Library className={`w-4 h-4 mr-2 ${isDark ? 'text-white' : 'text-gray-700'}`} />,
  mu: <BookMarked className={`w-4 h-4 mr-2 ${isDark ? 'text-white' : 'text-gray-700'}`} />,
  ap: <Library className={`w-4 h-4 mr-2 ${isDark ? 'text-white' : 'text-gray-700'}`} />,
  al: <Book className={`w-4 h-4 mr-2 ${isDark ? 'text-white' : 'text-gray-700'}`} />,
  mal: <Library className={`w-4 h-4 mr-2 ${isDark ? 'text-white' : 'text-gray-700'}`} />,
});

const MemoStableFlag = React.memo(StableFlag);

function TabsAndSections({ manga, chapters, handleChapterClick, isDark }) {
  if (chapters.length == 0 || !manga) return <TabsAndSectionsSkeleton />
  const [sortOrder, setSortOrder] = useState('descending');
  const [activeTab, setActiveTab] = useState(0);


  // Memoize iconMap based on theme
  const iconMap = useMemo(() => getIconMap(isDark), [isDark]);

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
            isDark={isDark}
            manga={memoManga}
            uniqueVolumes={uniqueVolumes}
            chapters={chapters}
            handleChapterClick={handleChapterClick}
          />
        ),
      },
      {
        label: `Comments (${memoManga?.rating?.comments?.repliesCount || 0})`,
        content: <CommentsOnManga manga={memoManga} isDark={isDark} />,
      },
    ],
    [chapters.length, memoManga, uniqueVolumes, handleChapterClick,isDark]
  );

  return (
    <div className="px-4 sm:px-[70px] transition-colors duration-0">
      <div className="mb-6 sm:mb-8 w-fit">
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={handleTabClick} isDark={isDark} />
      </div>
      <div className="flex flex-col sm:flex-row w-full gap-4 sm:gap-2">
        <div className="w-full hidden md:flex sm:w-5/12 flex-wrap gap-y-6 sm:gap-y-9 gap-x-6 h-fit">
          <div className="flex flex-row gap-4 w-full">
            <div className="min-w-1/3">
              <h3 className={`font-bold text-lg mb-2 transition-colors duration-0 ${isDark ? 'text-white' : 'text-gray-900'
                }`}>
                Author
              </h3>
              <div className={`backdrop-blur-md min-w-fit px-3 py-2 text-sm inline-flex items-center Capitalize rounded transition-all duration-0 ${isDark
                  ? 'bg-white/10 text-white'
                  : 'bg-gray-100 shadow-md font-semibold text-gray-800 border border-gray-200'
                }`}>
                {memoManga.authorName[0].attributes.name}
              </div>
            </div>
            <div>
              <h3 className={`font-bold text-lg mb-2 transition-colors duration-0 ${isDark ? 'text-white' : 'text-gray-900'
                }`}>
                Artist
              </h3>
              <div className={`backdrop-blur-md min-w-fit px-3 py-2 text-sm inline-flex items-center Capitalize rounded transition-all duration-0 ${isDark
                  ? 'bg-white/10 text-white'
                  : 'bg-gray-100 shadow-md font-semibold text-gray-800 border border-gray-200'
                }`}>
                {memoManga.artistName[0].attributes.name}
              </div>
            </div>
          </div>

          <div className="h-fit">
            <h3 className={`font-bold text-lg mb-2 transition-colors duration-0 ${isDark ? 'text-white' : 'text-gray-900'
              }`}>
              Genres
            </h3>
            <div className="flex flex-wrap gap-2">
              {memoManga.tags
                .find((group) => group.group === 'genre')
                ?.tags.map((genre, index) => (
                  <div
                    key={index}
                    className={`backdrop-blur-md min-w-fit px-3 py-2 text-xs inline-flex items-center Capitalize rounded transition-all duration-0 ${isDark
                        ? 'bg-white/10 text-white hover:bg-white/20'
                        : 'bg-gray-100 shadow-md font-semibold text-gray-800 border border-gray-200 hover:bg-gray-900/20'
                      }`}
                  >
                    {genre}
                  </div>
                ))}
            </div>
          </div>

          <div className="h-fit">
            <h3 className={`font-bold text-lg mb-2 transition-colors duration-0 ${isDark ? 'text-white' : 'text-gray-900'
              }`}>
              Themes
            </h3>
            <div className="flex flex-wrap gap-2">
              {memoManga.tags
                .find((group) => group.group === 'theme')
                ?.tags.map((theme, index) => (
                  <div
                    key={index}
                    className={`backdrop-blur-md min-w-fit px-3 py-2 text-xs inline-flex items-center Capitalize rounded transition-all duration-0 ${isDark
                        ? 'bg-white/10 text-white hover:bg-white/20'
                        : 'bg-gray-100 shadow-md font-semibold text-gray-800 border border-gray-200 hover:bg-gray-900/20'
                      }`}
                  >
                    {theme}
                  </div>
                ))}
            </div>
          </div>

          <div className="h-fit">
            {memoManga.tags.find((group) => group.group === 'format')?.tags.length > 0 && (
              <h3 className={`font-bold text-lg mb-2 transition-colors duration-0 ${isDark ? 'text-white' : 'text-gray-900'
                }`}>
                Format
              </h3>
            )}
            <div className="flex flex-wrap gap-2">
              {memoManga.tags
                .find((group) => group.group === 'format')
                ?.tags.map((format, index) => (
                  <div
                    key={index}
                    className={`backdrop-blur-md min-w-fit px-3 py-2 text-xs inline-flex items-center Capitalize rounded transition-all duration-0 ${isDark
                        ? 'bg-white/10 text-white hover:bg-white/20'
                        : 'bg-gray-100 shadow-md font-semibold text-gray-800 border border-gray-200 hover:bg-gray-900/20'
                      }`}
                  >
                    {format}
                  </div>
                ))}
            </div>
          </div>

          <div className="relative h-fit">
            <h3 className={`font-bold text-lg mb-2 transition-colors duration-0 ${isDark ? 'text-white' : 'text-gray-900'
              }`}>
              Demographic
            </h3>
            <div className={`backdrop-blur-md min-w-fit px-3 py-2 text-xs inline-flex items-center Capitalize rounded transition-all duration-0 ${isDark
                ? 'bg-white/10 text-white'
                : 'bg-gray-100 shadow-md font-semibold text-gray-800 border border-gray-200'
              }`}>
              {memoManga.MangaStoryType || "None"}
            </div>
          </div>

          <div className="">
            <h3 className={`font-bold text-lg mb-4 transition-colors duration-0 ${isDark ? 'text-white' : 'text-gray-900'
              }`}>
              Read or Buy
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {Object.entries(memoManga.links).map(([key, link], index) => (
                key !== 'kt' && (
                  <a
                    key={index}
                    href={getFullLink(key, link)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`backdrop-blur-md rounded px-3 py-2 flex items-center transition-all duration-0 ${isDark
                        ? 'bg-white/10 hover:bg-white/20'
                        : 'bg-gray-100 shadow-md font-semibold border border-gray-200 hover:bg-gray-900/20 hover:border-gray-300'
                      }`}
                  >
                    {iconMap[key] || <Book className={`w-4 h-4 mr-2 ${isDark ? 'text-white' : 'text-gray-700'}`} />}
                    <span className={`text-xs transition-colors duration-0 ${isDark ? 'text-white' : 'text-gray-800'
                      }`}>
                      {websiteNames[key] || "Unknown"}
                    </span>
                  </a>
                )
              ))}
            </div>
          </div>

          <div className="">
            <h3 className={`font-bold text-lg mb-4 transition-colors duration-0 ${isDark ? 'text-white' : 'text-gray-900'
              }`}>
              Track
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {['mu', 'ap', 'al', 'mal'].map((key, index) => (
                memoManga.links[key] && (
                  <a
                    key={index}
                    href={getFullLink(key, memoManga.links[key])}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`backdrop-blur-md rounded px-3 py-2 flex items-center transition-all duration-0 ${isDark
                        ? 'bg-white/10 hover:bg-white/20'
                        : 'bg-gray-100 shadow-md font-semibold border border-gray-200 hover:bg-gray-900/20 hover:border-gray-300'
                      }`}
                  >
                    {iconMap[key] || <Book className={`w-4 h-4 mr-2 ${isDark ? 'text-white' : 'text-gray-700'}`} />}
                    <span className={`text-xs transition-colors duration-0 ${isDark ? 'text-white' : 'text-gray-800'
                      }`}>
                      {websiteNames[key]}
                    </span>
                  </a>
                )
              ))}
            </div>
          </div>

          <div className="">
            <h3 className={`font-bold text-lg mb-4 transition-colors duration-0 ${isDark ? 'text-white' : 'text-gray-900'
              }`}>
              Alternative Titles
            </h3>
            <div className="space-y-2">
              {memoManga.altTitles.map((title, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-2 py-1 px-2 rounded-md transition-all duration-0 ${isDark
                      ? 'hover:bg-gray-800'
                      : 'hover:bg-gray-100'
                    }`}
                >
                  <MemoStableFlag
                    code={Object.keys(title)[0] || "en"}
                    className="w-6 sm:w-8 h-6 sm:h-8 rounded-md shadow-sm"
                    alt="flag"
                  />
                  <span className={`text-xs sm:text-sm line-clamp-1 font-medium transition-colors duration-0 ${isDark ? 'text-gray-200' : 'text-gray-700'
                    }`}>
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
const Tabs = React.memo(({ tabs, activeTab, onTabChange, isDark }) => {
  return (
    <div className={`backdrop-blur-md rounded overflow-x-auto flex-nowrap transition-all duration-0 ${isDark
        ? 'bg-gray-600/30'
        : 'bg-white/70 border border-gray-200 shadow-sm'
      }`}>
      <div className="flex">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => onTabChange(index)}
            className={`px-4 py-2 text-sm md:text-base font-bold transition-all duration-0 whitespace-nowrap ${activeTab === index
                ? isDark
                  ? 'bg-gray-600/30 text-white shadow-md rounded'
                  : 'bg-white/90 text-gray-900 shadow-md rounded border border-gray-300'
                : isDark
                  ? 'text-[#808080] hover:text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
});