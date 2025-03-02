import { NextRequest, NextResponse } from 'next/server';
import { getOEmbedData, isOEmbedSupported } from '@/app/lib/oembed';

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get('url');
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      );
    }
    
    // Check if the URL is likely to be supported
    if (!isOEmbedSupported(url)) {
      return NextResponse.json(
        { error: 'URL is not supported by oEmbed' },
        { status: 400 }
      );
    }
    
    const oembedData = await getOEmbedData(url);
    
    if (oembedData.error) {
      return NextResponse.json(
        { error: oembedData.error },
        { status: 400 }
      );
    }
    
    return NextResponse.json(oembedData);
  } catch (error) {
    console.error('Error fetching oEmbed data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch oEmbed data' },
      { status: 500 }
    );
  }
} 