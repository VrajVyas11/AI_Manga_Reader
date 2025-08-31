/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ mangaId: string }> }
) {
  const { mangaId } = await params
  const baseUrl = 'https://api.mangadex.org';

  // Handle comma-separated IDs
  const mangaIds = mangaId.split(',').filter(id => id.trim());

  if (mangaIds.length === 0) {
    return NextResponse.json(
      { error: 'Manga ID(s) are required' },
      { status: 400 }
    );
  }

  try {
    // Fetch manga data in bulk
    const [mangaResponse, statsResponse] = await Promise.all([
      axios.get(`${baseUrl}/manga`, {
        params: {
          includes: ['cover_art', 'author', 'artist', 'creator'],
          ids: mangaIds.slice(0, 100) // Mangadex has a limit of 100 IDs per request
        },
      }),
      axios.get(`${baseUrl}/statistics/manga`, {
        params: {
          'manga[]': mangaIds.slice(0, 100)
        }
      }),
    ]);

    if (mangaResponse.status !== 200 || statsResponse.status !== 200) {
      return NextResponse.json(
        { error: 'Failed to fetch manga data' },
        { status: mangaResponse.status || statsResponse.status }
      );
    }

    const mangaList = mangaResponse.data.data || [];
    const stats = statsResponse.data.statistics || {};

    if (!mangaList.length) {
      return NextResponse.json(
        { error: 'No manga found with provided IDs' },
        { status: 404 }
      );
    }

    // Process each manga item
    const processedManga = mangaList.map((manga: { type?: any; id?: any; attributes?: any; relationships?: any; }) => {
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

      // Process relationships
      const groupedRelationships = relationships.reduce((acc: Record<string, any[]>, rel: { type: string | number; }) => {
        (acc[rel.type] = acc[rel.type] || []).push(rel);
        return acc;
      }, {});

      // Process cover art
      const coverArt = groupedRelationships.cover_art?.[0]?.attributes?.fileName;
      const coverImageUrl = coverArt ? `https://mangadex.org/covers/${id}/${coverArt}.256.jpg` : '';

      // Process tags
      const { groupedTags, flatTags } = tags.reduce((acc: { groupedTags: { [x: string]: any[]; }; flatTags: any[]; }, tag: { attributes: { group: string; name: { en: string; }; }; }) => {
        const group = tag.attributes?.group || 'Unknown Group';
        const tagName = tag.attributes?.name?.en || 'Unknown Tag';
        acc.groupedTags[group] = acc.groupedTags[group] || [];
        acc.groupedTags[group].push(tagName);
        acc.flatTags.push(tagName);
        return acc;
      }, { groupedTags: {} as Record<string, string[]>, flatTags: [] as string[] });

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
        rating: stats[id] || {}
      };
    });

    return NextResponse.json({ data: processedManga });
  } catch (error: any) {
    const status = error?.response?.status || 500;
    const errorMessage =
      error?.response?.data?.errors?.[0]?.detail || error?.message || 'An unknown error occurred';
    console.error(`Error fetching manga:`, errorMessage);

    return NextResponse.json(
      { error: 'Failed to fetch manga', details: errorMessage },
      { status }
    );
  }
}