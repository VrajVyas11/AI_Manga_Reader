/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import axios from 'axios';
import { allAvailableLanguages } from '../../../../constants/Flags';

const chaptersPerPage = 90; // Adjust the number of chapters per request
const totalChaptersToFetch = 500; // Total chapters you want to fetch

export async function GET(
  request: Request,
  { params }: { params: Promise<{ mangaId: string }> }
) {
  const { mangaId } = await params
    let allChapters: any[] = [];

    const maxBatches = Math.ceil(totalChaptersToFetch / chaptersPerPage);

    try {
        console.log(`Fetching chapters for mangaId: ${mangaId}`);

        for (let i = 0; i < maxBatches; i++) {
            const response = await axios.get(
                `https://api.mangadex.org/manga/${mangaId}/feed`,
                {
                    params: {
                        translatedLanguage: allAvailableLanguages,
                        includes: [
                            'manga',
                            'scanlation_group',
                            'user',
                            'cover_art',
                            'author',
                            'artist',
                            'tag',
                        ],
                        limit: chaptersPerPage,
                        offset: i * chaptersPerPage,
                    },
                }
            );

            const fetchedChapters = response.data.data;
            // const included = response.data.included || [];

            console.log(
                `Fetched ${fetchedChapters.length} chapters for languages: ${allAvailableLanguages.join(
                    ', '
                )}`
            );

            // Helper to find included data by id and type
            // const findIncluded = (id: string, type: string) =>
            //     included.find(
            //         (item: any) => item.id === id && item.type === type
            //     ) || null;

            // Map chapters with detailed info
            const chapters = fetchedChapters.map((chapter: any) => ({
                id: chapter.id,
                title: chapter.attributes.title || `Chapter ${chapter.attributes.chapter || 'N/A'}`,
                pageCount: chapter.attributes.pages || 'Unknown',
                chapter: chapter.attributes.chapter || 'N/A',
                volume: chapter.attributes.volume || null,
                translatedLanguage: chapter.attributes.translatedLanguage || 'Unknown Language',
                publishAt: chapter.attributes.publishAt || 'Unknown Date',
                readableAt: chapter.attributes.readableAt || 'Unknown Date',
                createdAt: chapter.attributes.createdAt || null,
                updatedAt: chapter.attributes.updatedAt || null,
                externalUrl: chapter.attributes.externalUrl || 'No external URL',
                isUnavailable: chapter.attributes.isUnavailable || false,
                version: chapter.attributes.version || null,
                relationships: {
                    scanlationGroupIds: chapter.relationships
                        .filter((rel: any) => rel.type === 'scanlation_group')
                        .map((rel: any) => rel.id),
                    mangaIds: chapter.relationships
                        .filter((rel: any) => rel.type === 'manga')
                        .map((rel: any) => rel.id),
                    userIds: chapter.relationships
                        .filter((rel: any) => rel.type === 'user')
                        .map((rel: any) => rel.id),
                },
                url: `https://og.mangadex.org/og-image/chapter/${chapter.id}`,
            }));

            allChapters = [...allChapters, ...chapters];

            if (fetchedChapters.length === 0 || fetchedChapters.length < chaptersPerPage) {
                console.log('No more chapters available, stopping fetch.');
                break;
            }

            if (allChapters.length >= totalChaptersToFetch) {
                break;
            }
        }

        // Remove duplicates by chapter id
        const uniqueChapters = allChapters.reduce((acc, chapter) => {
            if (!acc.find((c: any) => c.id === chapter.id)) {
                acc.push(chapter);
            }
            return acc;
        }, []);

        console.log(`Total chapters fetched: ${uniqueChapters.length}`);

        return NextResponse.json({
            chapters: uniqueChapters.slice(0, totalChaptersToFetch),
        });
    } catch (error: any) {
        console.error('Error fetching chapters:', error.response?.data || error.message || error);
        return NextResponse.json(
            { error: 'Failed to fetch chapters', details: error.response?.data || error.message },
            { status: 500 }
        );
    }
}