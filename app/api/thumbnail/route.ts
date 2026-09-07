import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get('videoId');

  if (!videoId) {
    return new NextResponse('Missing videoId', { status: 400 });
  }

  try {
    // Fetch the high quality thumbnail from YouTube
    const ytUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    const res = await fetch(ytUrl);
    
    if (!res.ok) {
      return new NextResponse('Failed to fetch image', { status: res.status });
    }
    
    const buffer = await res.arrayBuffer();
    
    // Return the image with permissive CORS headers so canvas can read it
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (error) {
    return new NextResponse('Internal error', { status: 500 });
  }
}
