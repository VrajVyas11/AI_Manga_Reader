import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const imageUrl = url.searchParams.get('url');
  const username = url.searchParams.get('username');

  if (!imageUrl || !username) {
    return NextResponse.json({ error: 'Missing url or username parameter' }, { status: 400 });
  }

  try {
    const response = await fetch(decodeURIComponent(imageUrl), {
      // No referrer sent by default in server-side fetch, which should bypass Mangadex's hotlink protection.
      // If needed, you can add: referrer: 'https://forums.mangadex.org/' to mimic an internal request.
    });

    if (!response.ok) {
      throw new Error('Failed to fetch image');
    }

    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get('Content-Type') || 'image/jpeg';

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // Cache for 1 day; adjust as needed.
      },
    });
  } catch (error) {
    // Fallback to ui-avatars
    const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(decodeURIComponent(username))}&background=8b5cf6&color=fff`;
    try {
      const fallbackResponse = await fetch(fallbackUrl);

      if (!fallbackResponse.ok) {
        throw new Error('Failed to fetch fallback image');
      }

      const fallbackBuffer = await fallbackResponse.arrayBuffer();
      const fallbackContentType = fallbackResponse.headers.get('Content-Type') || 'image/svg+xml';

      return new NextResponse(fallbackBuffer, {
        status: 200,
        headers: {
          'Content-Type': fallbackContentType,
          'Cache-Control': 'public, max-age=86400',
        },
      });
    } catch (fallbackError) {
      console.error('Proxy error:', error);
      console.error('Fallback error:', fallbackError);
      return NextResponse.json({ error: 'Failed to proxy image and fallback' }, { status: 500 });
    }
  }
}
