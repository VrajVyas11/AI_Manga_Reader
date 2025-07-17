/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import axios from 'axios';
export async function GET(
  request: Request,
  { params }: { params: Promise<{ chapterId: string }> }
) {
  const { chapterId } = await params
  try {
    console.log('Fetching pages for chapterId:', chapterId);
    const response = await axios.get(
      `https://api.mangadex.org/at-home/server/${chapterId}`
    );

    const { baseUrl, chapter } = response.data;
    const hash = chapter.hash;

    // Map data and dataSaver arrays to full URLs
    const data = chapter.data.map(
      (filename: string) => `${baseUrl}/data/${hash}/${filename}`
    );
    const dataSaver = chapter.dataSaver.map(
      (filename: string) => `${baseUrl}/data-saver/${hash}/${filename}`
    );

    // Return the full response but with updated URLs
    return NextResponse.json({
      ...response.data,
      chapter: {
        ...chapter,
        data,
        dataSaver,
      },
    });
  } catch (error: any) {
    console.error(
      'Error fetching chapter pages:',
      error.response?.data || error.message || error
    );
    return NextResponse.json(
      {
        error: 'Failed to fetch chapter pages',
        details: error.response?.data || error.message,
      },
      { status: 500 }
    );
  }
}
