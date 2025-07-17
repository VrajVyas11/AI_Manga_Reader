/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ authorId: string }> }
) {
  const { authorId } = await params
  try {
    console.log(`Fetching author information for authorId: ${authorId}`);

    const response = await axios.get(`https://api.mangadex.org/author/${authorId}`);
    const authorData = response.data.data;

    if (!authorData) {
      return NextResponse.json({ error: 'Author not found' }, { status: 404 });
    }

    const authorInfo = {
      id: authorData.id,
      name: authorData.attributes.name,
      imageUrl: authorData.attributes.imageUrl || 'No image available',
      biography: authorData.attributes.biography || 'No biography available',
    };

    return NextResponse.json({ author: authorInfo });
  } catch (error: any) {
    console.error('Error fetching author info:', error.response?.data || error.message || error);
    return NextResponse.json(
      { error: 'Failed to fetch author information', details: error.response?.data || error.message },
      { status: 500 }
    );
  }
}
