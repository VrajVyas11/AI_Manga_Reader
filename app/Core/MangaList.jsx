"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import MangaCard from "../Components/MangaListComponents/MangaCard";
import AsideComponent from "../Components/MangaListComponents/AsideComponent";
import SliderComponent from "../Components/MangaListComponents/SliderComponent";
import LoadingSpinner from "../Components/LoadingSpinner";

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

// Helper functions outside component
const getFromStorage = (key) => {
  if (typeof window === 'undefined') return null;
  try {
    const item = localStorage.getItem(key);
    const timestamp = localStorage.getItem(`${key}_timestamp`);

    if (!item || !timestamp) return null;
    if (Date.now() - parseInt(timestamp) > CACHE_DURATION) {
      localStorage.removeItem(key);
      localStorage.removeItem(`${key}_timestamp`);
      return null;
    }

    return JSON.parse(item);
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return null;
  }
};

const saveToStorage = (key, data) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
    localStorage.setItem(`${key}_timestamp`, Date.now().toString());
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

const fetchMangaType = async (type, page) => {
  const cacheKey = `manga_${type}_${page}`;
  const cachedData = getFromStorage(cacheKey);
  if (cachedData) return cachedData;

  const response = await fetch(`/api/manga/${type}?page=${page}`);
  if (!response.ok) throw new Error(`Failed to fetch ${type} mangas`);

  const data = await response.json();
  saveToStorage(cacheKey, data);
  return data;
};

const fetchAllMangaTypes = async ({ queryKey }) => {
  const [_, page] = queryKey;
  // const cacheKey = `all_manga_types_${page}`;
  // const cachedData = getFromStorage(cacheKey);
  // if (cachedData) return cachedData;

  try {
    const [rating, favourite, latest, random] = await Promise.all([
      fetchMangaType('rating', page),
      fetchMangaType('favourite', page),
      fetchMangaType('latest', page),
      fetchMangaType('random', page)
    ]);

    const result = {
      mangas: rating,
      favouriteMangas: favourite,
      latestMangas: latest,
      randomMangas: random
    };

    // saveToStorage(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Error fetching manga data:', error);
    throw error;
  }
};

export default function MangaList() {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDataProcessed, setIsDataProcessed] = useState(false);
  const showcaseRef = useRef(null);

  const processMangaData = async (mangaList) => {
    const cacheKey = `processed_manga_${mangaList?.length || 0}_${page}`;
    const cachedData = getFromStorage(cacheKey);
    if (cachedData) return cachedData;

    const result = await Promise.all(
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
            tags,
          },
          relationships,
        } = manga;

        const grouped = relationships.reduce((acc, rel) => {
          if (!acc[rel.type]) acc[rel.type] = [];
          acc[rel.type].push(rel);
          return acc;
        }, {});

        const coverArt = grouped.cover_art?.[0]?.attributes?.fileName;
        const coverImageUrl = `https://mangadex.org/covers/${id}/${coverArt}.256.jpg`;
        const authorName = grouped.author;
        const artistName = grouped.artist;
        const creatorName = grouped.creator ?? "N/A";
        const MangaStoryType = grouped.manga ?? "N/A";
        let rating = 0;

        const ratingCacheKey = `manga_rating_${id}`;
        const cachedRating = getFromStorage(ratingCacheKey);
        if (cachedRating) {
          rating = cachedRating;
        } else {
          try {
            const ratingResponse = await fetch(`https://api.mangadex.org/statistics/manga/${id}`);
            if (ratingResponse.ok) {
              const ratingData = await ratingResponse.json();
              rating = ratingData.statistics[id] || 0;
              saveToStorage(ratingCacheKey, rating);
            }
          } catch (err) {
            console.error(`Error fetching rating for manga ID ${id}:`, err);
          }
        }

        const groupedTags = tags?.reduce((acc, tag) => {
          const group = tag.attributes?.group || 'Unknown Group';
          const tagName = tag.attributes?.name?.en || 'Unknown Tag';
          if (!acc[group]) acc[group] = [];
          acc[group].push(tagName);
          return acc;
        }, {});

        const groupedTagsArray = Object.keys(groupedTags).map((group) => ({
          group,
          tags: groupedTags[group],
        }));

        return {
          id,
          title: title?.en || Object?.values(altTitles?.[0] || {})[0] || 'Untitled',
          description: description?.en || 'No description available for this manga.',
          altTitle: Object.values(altTitles?.[0] || { none: "N/A" })[0] || 'N/A',
          contentRating: contentRating || 'N/A',
          status: status || 'Unknown',
          altTitles: altTitles || [],
          year: year || 'N/A',
          updatedAt: updatedAt ? new Date(updatedAt) : 'N/A',
          tags: groupedTagsArray,
          flatTags: tags?.map((tag) => tag.attributes?.name?.en || 'Unknown Tag') || [],
          coverImageUrl,
          authorName,
          artistName,
          rating,
          links,
          creatorName,
          MangaStoryType,
          availableTranslatedLanguages: availableTranslatedLanguages || [],
          latestUploadedChapter,
          originalLanguage,
        };
      })
    );

    // saveToStorage(cacheKey, result);
    return result;
  };

  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["mangas", page],
    queryFn: fetchAllMangaTypes,
    staleTime: CACHE_DURATION,
    cacheTime: CACHE_DURATION * 2,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 2,
    onError: (error) => {
      console.error('Error in manga query:', error);
    }
  });

  const processMutation = useMutation({
    mutationFn: async (data) => {
      const { mangas, favouriteMangas, latestMangas, randomMangas } = data || {};
      if (!mangas || !favouriteMangas || !latestMangas || !randomMangas) return {};

      const cacheKeys = {
        mangas: `processedmanga_rating_${page}`,
        favourite: `processedmanga_favourite_${page}`,
        latest: `processedmanga_latest_${page}`,
        random: `processedmanga_random_${page}`
      };

      const [processedMangas, processedFavouriteMangas, processedLatestMangas, processedRandomMangas] = await Promise.all([
        getFromStorage(cacheKeys.mangas) || processMangaData(mangas.data || []),
        getFromStorage(cacheKeys.favourite) || processMangaData(favouriteMangas.data || []),
        getFromStorage(cacheKeys.latest) || processMangaData(latestMangas.data || []),
        getFromStorage(cacheKeys.random) || processMangaData(randomMangas.data || []),
      ]);

      return { processedMangas, processedFavouriteMangas, processedLatestMangas, processedRandomMangas };
    },
    onSuccess: ({ processedMangas, processedFavouriteMangas, processedLatestMangas, processedRandomMangas }) => {
      if (processedMangas) queryClient.setQueryData(["processedMangas"], processedMangas);
      if (processedFavouriteMangas) queryClient.setQueryData(["processedFavouriteMangas"], processedFavouriteMangas);
      if (processedLatestMangas) queryClient.setQueryData(["processedLatestMangas"], processedLatestMangas);
      if (processedRandomMangas) queryClient.setQueryData(["processedRandomMangas"], processedRandomMangas);
      
      // Cache each type separately with page number
      saveToStorage(`processedmanga_rating_${page}`, processedMangas);
      saveToStorage(`processedmanga_favourite_${page}`, processedFavouriteMangas);
      saveToStorage(`processedmanga_latest_${page}`, processedLatestMangas);
      saveToStorage(`processedmanga_random_${page}`, processedRandomMangas);
      
      setIsDataProcessed(true);
    },
    onError: (error) => {
      console.error('Error processing manga data:', error);
    }
  });

  useEffect(() => {
    if (data && !isDataProcessed) {
      processMutation.mutate(data);
    }
  }, [data, isDataProcessed]);

  const handleMangaClicked = (manga) => {
    navigate(`/manga/${manga.id}/chapters`, { state: { manga } });
  };

  const loadMoreMangas = () => {
    setPage((prevPage) => {
      const newPage = prevPage + 1;
      setIsDataProcessed(false); // Reset processing state for new fetch
      return newPage;
    });
  };

  const processedMangas = useMemo(() =>queryClient.getQueryData(["processedMangas"]) || []);
  const processedFavouriteMangas = useMemo(() =>queryClient.getQueryData(["processedFavouriteMangas"]) || []);
  const processedLatestMangas = useMemo(() =>queryClient.getQueryData(["processedLatestMangas"]) || []);
  const processedRandomMangas = useMemo(() =>queryClient.getQueryData(["processedRandomMangas"]) || []);

  const isLoadingState = isLoading || !isDataProcessed || processedLatestMangas.length === 0;

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div ref={showcaseRef} className="min-h-screen w-full text-white">
      {isLoadingState ? (
        <LoadingSpinner text="Loading Mangas..." />
      ) : (
        <>
          <div className="w-full shadow-[5px_5px_50px_rgba(0,0,0,1)] shadow-black  h-fit">
            <SliderComponent 
              handleMangaClicked={handleMangaClicked} 
              processedRandomMangas={processedRandomMangas} 
            />
          </div>

          <div className="flex mt-10 bg-gradient-to-t from-transparent via-black/30 to-black/10 flex-row justify-between items-start">
            <MangaCard
              handleMangaClicked={handleMangaClicked}
              processedLatestMangas={processedLatestMangas}
            />
            <AsideComponent
              handleMangaClicked={handleMangaClicked}
              processedMangas={processedMangas}
              processedLatestMangas={processedLatestMangas}
              processedFavouriteMangas={processedFavouriteMangas}
            />
          </div>
          <div className="text-center mt-10">
            <button
              onClick={loadMoreMangas}
              className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Load More
            </button>
          </div>
        </>
      )}
    </div>
  );
};