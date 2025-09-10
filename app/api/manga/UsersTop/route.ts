/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { NextResponse } from 'next/server';

// Configuration constants
const CONFIG = {
  baseUrl: 'https://api.mangadex.org',
  fetchLimit: 100,
  includes: ['cover_art', 'author', 'artist', 'creator'],
  // ID of the list to read top manga from
  topListId: '864f1275-0048-4ffd-b6ee-bde52f3bc80b',
  userListUrl:
    '/user/0dd9b63a-f561-4632-b739-84397cb60ca7/list?limit=10' // original endpoint path
};

export async function GET() {
  try {
    // 1) Fetch user lists
    const listResp = await axios.get(`${CONFIG.baseUrl}${CONFIG.userListUrl}`, {
      params: {},
      timeout: 10000,
    });

    if (listResp.status !== 200) {
      console.error('Failed to fetch user lists:', listResp.statusText);
      return NextResponse.json(
        { error: 'Failed to fetch user lists' },
        { status: listResp.status }
      );
    }

    const lists = listResp.data?.data || [];
    const topList = lists.find((l: any) => l.id === CONFIG.topListId);
    if (!topList) {
      console.error('TopManga list not found in user lists');
      return NextResponse.json(
        { error: 'TopManga list not found' },
        { status: 404 }
      );
    }

    // 2) Extract manga IDs (type === 'manga') and limit to 10
    const mangaIds = (topList.relationships || [])
      .filter((rel: any) => rel.type === 'manga' && rel.id)
      .map((rel: any) => rel.id)
      .slice(0, 10);

    if (mangaIds.length === 0) {
      return NextResponse.json({ data: [] });
    }

    // 3) Fetch manga details for these IDs using the /manga endpoint
    // Use multiple ids in params: manga[]=<id1>&manga[]=<id2> ...
    const mangaResp = await axios.get(`${CONFIG.baseUrl}/manga`, {
      params: {
        limit: mangaIds.length,
        includes: CONFIG.includes,
        'ids[]': mangaIds, // axios converts array into repeated params
      },
      timeout: 15000,
    });

    if (mangaResp.status !== 200) {
      console.error('Failed to fetch manga details:', mangaResp.statusText);
      return NextResponse.json(
        { error: 'Failed to fetch manga details' },
        { status: mangaResp.status }
      );
    }

    const mangaList = mangaResp.data?.data || [];

    // 4) Process items (reuse your processMangaItem function)
    const validManga = mangaList
      .filter(
        (m: any) =>
          m.attributes?.latestUploadedChapter !== null &&
          m.relationships?.some((rel: any) => rel.type === 'cover_art')
      )
      .map(processMangaItem);

    if (validManga.length === 0) {
      return NextResponse.json({ data: [] });
    }

    // 5) Fetch statistics (ratings) for these manga ids
    const statsResp = await axios.get(`${CONFIG.baseUrl}/statistics/manga`, {
      params: { 'manga[]': validManga.map((m: { id: any; }) => m.id) },
      timeout: 10000,
    });

    const stats = statsResp.data?.statistics || {};

    const mangaWithRatings = validManga.map((m: { id: string | number; }) => ({
      ...m,
      rating: stats[m.id] || {},
    }));

    // Optional: set caching headers for responses (Edge / CDN friendly)
    const response = NextResponse.json({ data: mangaWithRatings });
    response.headers.set('Cache-Control', 's-maxage=3600, stale-while-revalidate=59');
    return response;
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.errors?.[0]?.detail || error?.message || 'Unknown error';
    console.error('UsersTop route error:', errorMessage);
    return NextResponse.json(
      { error: 'Failed to fetch top mangas', details: errorMessage },
      { status: 500 }
    );
  }
}

// Reuse the provided processMangaItem function (copy/paste from your existing file)
function processMangaItem(manga: any) {
  const { id, attributes, relationships } = manga;
  const {
    title,
    altTitles = [],
    description,
    contentRating,
    status,
    year,
    updatedAt,
    tags = [],
    publicationDemographic,
    links,
    availableTranslatedLanguages,
    latestUploadedChapter,
    originalLanguage,
  } = attributes;

  const groupedRelationships = (relationships || []).reduce(
    (acc: Record<string, any[]>, rel: { type: string | number }) => {
      (acc[rel.type] = acc[rel.type] || []).push(rel);
      return acc;
    },
    {}
  );

  const coverArt = groupedRelationships.cover_art?.[0]?.attributes?.fileName;
  const coverImageUrl = coverArt ? `https://mangadex.org/covers/${id}/${coverArt}.256.jpg` : '';

  const { groupedTags, flatTags } = (tags || []).reduce(
    (
      acc: { groupedTags: { [x: string]: any[] }; flatTags: any[] },
      tag: { attributes: { group: string; name: { en: string } } }
    ) => {
      const group = tag.attributes?.group || 'Unknown Group';
      const tagName = tag.attributes?.name?.en || 'Unknown Tag';
      acc.groupedTags[group] = acc.groupedTags[group] || [];
      acc.groupedTags[group].push(tagName);
      acc.flatTags.push(tagName);
      return acc;
    },
    { groupedTags: {} as Record<string, string[]>, flatTags: [] as string[] }
  );

  return {
    id,
    title: title?.en || Object.values(altTitles[0] || {})[0] || 'Untitled',
    description: description?.en || 'No description available.',
    altTitle: Object.values(altTitles[0] || { none: 'N/A' })[0] || 'N/A',
    contentRating: contentRating || 'N/A',
    status: status || 'Unknown',
    altTitles,
    year: year || 'N/A',
    updatedAt: updatedAt ? new Date(updatedAt) : 'N/A',
    tags: Object.entries(groupedTags).map(([group, tags]) => ({ group, tags })),
    flatTags,
    coverImageUrl,
    authorName: groupedRelationships.author,
    artistName: groupedRelationships.artist,
    creatorName: groupedRelationships.creator || 'N/A',
    MangaStoryType: publicationDemographic,
    availableTranslatedLanguages: availableTranslatedLanguages || [],
    latestUploadedChapter,
    originalLanguage,
    type: manga.type,
    links,
  };
}