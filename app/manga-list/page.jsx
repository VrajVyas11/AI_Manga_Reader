'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MangaCard from "../Components/MangaListComponents/MangaCard";
import AsideComponent from "../Components/MangaListComponents/AsideComponent";
import SliderComponent from "../Components/MangaListComponents/SliderComponent";
export default function MangaList() {
  const [mangas, setMangas] = useState([]);
  const [latestMangas, setLatestMangas] = useState([]);
  const [randomMangas, setRandomMangas] = useState([]);
  const [processedMangas, setProcessedMangas] = useState([]);
  const [processedLatestMangas, setProcessedLatestMangas] = useState([]);
  const [processedRandomMangas, setProcessedRandomMangas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const router = useRouter();

  const saveToLocalStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const fetchMangas = async () => {
    try {
      setLoading(true);
      setError(null);

      const [mangaResponse, latestMangaResponse, randomMangaResponse] = await Promise.all([
        fetch(`/api/manga?page=${page}`),
        fetch(`/api/manga/latest?page=${page}`),
        fetch(`/api/manga/random?page=${page}`),
      ]);

      if (!mangaResponse.ok || !latestMangaResponse.ok || !randomMangaResponse.ok) {
        throw new Error('Failed to fetch mangas');
      }

      const mangaData = await mangaResponse.json();
      const latestMangaData = await latestMangaResponse.json();
      const randomMangaData = await randomMangaResponse.json();

      const newMangas = mangaData.data || [];
      const newLatestMangas = latestMangaData.data || [];
      const newRandomMangas = randomMangaData.data || [];

      // Merge and remove duplicates
      const uniqueMangas = [...new Map([...mangas, ...newMangas].map((m) => [m.id, m])).values()];
      const uniqueLatestMangas = [...new Map([...latestMangas, ...newLatestMangas].map((m) => [m.id, m])).values()];

      setMangas(uniqueMangas);
      setLatestMangas(uniqueLatestMangas);
      setRandomMangas(newRandomMangas)
      saveToLocalStorage('mangas', uniqueMangas);
      saveToLocalStorage('latestMangas', uniqueLatestMangas);
      saveToLocalStorage('randomMangas', newRandomMangas);
      localStorage.setItem('lastRefreshed', Date.now().toString());
    } catch (error) {
      setError(error.message || 'An unknown error occurred');
      console.error('Error fetching mangas:', error);
    } finally {
      setLoading(false);
    }
  };

  const processMangaData = async (mangaList) => {
    return await Promise.all(
      mangaList.map(async (manga) => {
        const {
          id,
          attributes: {
            title,
            links,
            availableTranslatedLanguages,
            latestUploadedChapter,
            originalLanguage,
            description,
            altTitles,
            contentRating,
            status,
            year,
            updatedAt,
            tags
          },
          relationships,
        } = manga;

        const grouped = relationships.reduce((acc, rel) => {
          if (!acc[rel.type]) acc[rel.type] = [];
          acc[rel.type].push(rel);
          return acc;
        }, {});

        // Extract specific data
        const coverArt = grouped.cover_art?.[0]?.attributes?.fileName;
        // const images = coverArt ? `https://og.mangadex.org/og-image/manga/${id}` : '';
        const coverImageUrl = `https://mangadex.org/covers/${id}/${coverArt}.256.jpg`
        const authorName = grouped.author;
        const artistName = grouped.artist;
        const creatorName = grouped.creator ?? "N/A";
        const MangaStoryType = grouped.manga ?? "N/A";
        let rating = 0;
        try {
          const ratingResponse = await fetch(`https://api.mangadex.org/statistics/manga/${id}`);
          if (ratingResponse.ok) {
            const ratingData = await ratingResponse.json();
            rating = ratingData.statistics[id] || 0;
          }
        } catch (err) {
          console.error(`Error fetching rating for manga ID ${id}:`, err);
        }

        const groupedTags = tags?.reduce((acc, tag) => {
          const group = tag.attributes?.group || 'Unknown Group';
          const tagName = tag.attributes?.name?.en || 'Unknown Tag';
          
          // Initialize the group if it doesn't exist
          if (!acc[group]) {
            acc[group] = new Set();
          }
          
          // Add the tag to the appropriate group, using a Set to ensure uniqueness
          acc[group].add(tagName);
          
          return acc;
        }, {});
        
        // Convert grouped tags (Sets) to arrays
        const groupedTagsArray = Object.keys(groupedTags).map((group) => ({
          group,
          tags: Array.from(groupedTags[group]),
        }));
        
        
        return {
          id,
          title: title?.en || Object?.values(altTitles[0])[0] || 'Untitled',
          description: description?.en || 'No description available for this manga.',
          altTitle: Object.values(altTitles[0] ?? { none: "N/A" })[0] || 'N/A',
          altTitles,
          contentRating: contentRating || 'N/A',
          status: status || 'Unknown',
          year: year || 'N/A',
          updatedAt: updatedAt ? new Date(updatedAt) : 'N/A',
          tags: groupedTagsArray,
          flatTags:tags.map((tag) => tag.attributes?.name?.en || 'Unknown Tag'),
          coverImageUrl,
          authorName,
          artistName,
          rating,
          links,
          creatorName,
          MangaStoryType,
          availableTranslatedLanguages,
          latestUploadedChapter,
          originalLanguage,
        };
      })
    );
  };

  useEffect(() => {
    const initializeData = async () => {
      const lastRefreshed = parseInt(localStorage.getItem('lastRefreshed') || '0', 10);
      const currentTime = Date.now();

      if (!lastRefreshed || currentTime - lastRefreshed > 15 * 60 * 1000) {
        await fetchMangas();
      } else {
        const storedMangas = JSON.parse(localStorage.getItem('mangas') || '[]');
        const storedLatestMangas = JSON.parse(localStorage.getItem('latestMangas') || '[]');
        const storedRandomMangas = JSON.parse(localStorage.getItem('randomMangas') || '[]');
        setMangas(storedMangas);
        setLatestMangas(storedLatestMangas);
        setRandomMangas(storedRandomMangas)
      }
    };

    initializeData();
  }, []);

  useEffect(() => {
    (async () => {
      setProcessedMangas(await processMangaData(mangas));
      setProcessedLatestMangas(await processMangaData(latestMangas));
      setProcessedRandomMangas(await processMangaData(randomMangas) )
    })();
  }, [mangas, latestMangas]);

  const loadMoreMangas = () => setPage((prevPage) => prevPage + 1);

  return (
    <div className="min-h-screen w-full bg-gray-900 text-white p-6">    
  {error &&
    <div className="flex justify-center items-center w-full h-screen bg-gray-900 text-white">
      <div className="text-center">
        <p className="text-lg text-red-500">{error}</p>
        <p className="text-sm text-gray-400">Please refresh or try again later.</p>
      </div>
    </div>
  }
  <SliderComponent processedRandomMangas={processedRandomMangas}/>
      <div className="flex flex-row justify-between items-start gap-3">
        <div className="grid w-8/12 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 space-y-4 lg:grid-cols-5 gap-1">
          {processedLatestMangas.map((manga, index) => (
            <div
              key={manga.id}
              onClick={() =>
                router.push(
                  `/manga/${manga.id}/chapters?manga=${encodeURIComponent(
                    JSON.stringify(manga)
                  )}`
                )
              }
              className={`group cursor-pointer ${index == 0 ? "mt-4" : ""}`}
            >
              <MangaCard id={manga.id} manga={manga} />
            </div>
          ))}
        </div>
       {processedMangas.length>0 && <div className='w-4/12'>
          <div className="bg-gray-900 text-white px-4 rounded-lg shadow-lg w-full">

            {/* Section Header */}
            <div className="mb-6 flex items-center justify-between gap-3">
              <h2 className="flex items-center gap-2.5 w-full justify-center text-2xl font-bold text-yellow-300 tracking-wide">
                <img src="/trophy.svg" alt="Trophy" className="w-6 h-6" />
                <span>This Month's Rankings</span>
              </h2>
            </div>

            
            <div className="w-full bg-gradient-to-r from-gray-700 to-gray-800 p-2.5 rounded-lg mb-6">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { 'Top': 'star.svg' },
                  { 'Favourite': 'heart.svg' },
                  { 'New': 'clock.svg' },
                ].map((category, index) => {
                  const categoryName = Object.keys(category)[0];
                  const icon = category[categoryName];

                  return (
                    <button
                      key={index}
                      className="flex items-center justify-center gap-1.5 text-sm font-semibold text-gray-300 hover:text-white py-2.5 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    >
                      <img
                        src={`/${icon}`}
                        alt={categoryName}
                        className="w-4 h-4"
                      />
                      {categoryName}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <ul className="flex flex-col">
                {processedMangas.slice(0, 10).map((manga, index) => (
                  <li
                  onClick={() =>
                    router.push(
                      `/manga/${manga.id}/chapters?manga=${encodeURIComponent(
                        JSON.stringify(manga)
                      )}`
                    )
                  }
                    key={manga.id}
                  >
                    <AsideComponent manga={manga} index={index} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>}
      </div>
      {loading ? (
          <div className="flex justify-center items-center w-full h-screen bg-gray-900 text-white">
            <div className="text-center">
              <div className="spinner-border animate-spin h-8 w-8 border-t-4 border-indigo-500 border-solid rounded-full mb-4" />
              <p className="text-lg">Loading Mangas...</p>
            </div>
          </div>
      ) : (
        <div className="text-center mt-6">
          <button
            onClick={loadMoreMangas}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
