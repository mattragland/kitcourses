import { extract } from 'oembed-parser';

export interface OEmbedResult {
  html: string;
  provider_name: string;
  provider_url: string;
  type: string;
  title?: string;
  thumbnail_url?: string;
  width?: number;
  height?: number;
  error?: string;
}

/**
 * Extracts video ID from YouTube URL
 */
function getYouTubeVideoId(url: string): string | null {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
}

/**
 * Extracts oEmbed information from a URL
 * Supports YouTube, Twitter, Vimeo, and other oEmbed providers
 */
export async function getOEmbedData(url: string): Promise<OEmbedResult> {
  try {
    console.log('Fetching oEmbed data for URL:', url);
    
    // Special handling for YouTube URLs
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = getYouTubeVideoId(url);
      if (videoId) {
        console.log('YouTube video ID:', videoId);
        const embedHtml = `<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
          <iframe 
            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
            width="720"
            height="540"
            src="https://www.youtube.com/embed/${videoId}"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>`;
        
        return {
          html: embedHtml,
          provider_name: 'YouTube',
          provider_url: 'https://www.youtube.com',
          type: 'video',
          title: 'YouTube Video'
        };
      }
    }
    
    // For other providers, use oEmbed
    const params = new URLSearchParams();
    params.append('url', url);
    params.append('maxwidth', '720');
    params.append('maxheight', '540');
    
    console.log('Using params:', Object.fromEntries(params));
    
    const data = await extract(url, { params: Object.fromEntries(params) });
    console.log('Raw oEmbed response:', data);
    
    if (!data.html) {
      throw new Error('No HTML content in oEmbed response');
    }
    
    // For video embeds, ensure the iframe has the correct dimensions
    if (data.type === 'video' && data.html) {
      console.log('Original iframe HTML:', data.html);
      
      // Add responsive wrapper
      data.html = `<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
        <iframe 
          style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
          width="720"
          height="540"
          src="${data.html.match(/src="([^"]+)"/)?.[1] || ''}"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>`;
      
      console.log('Modified iframe HTML:', data.html);
    }
    
    return data as OEmbedResult;
  } catch (error) {
    console.error('Error fetching oEmbed data:', error);
    return {
      html: '',
      provider_name: '',
      provider_url: '',
      type: 'error',
      error: 'Failed to fetch oEmbed data'
    };
  }
}

/**
 * Checks if a URL is likely to be supported by oEmbed
 */
export function isOEmbedSupported(url: string): boolean {
  const supportedDomains = [
    'youtube.com',
    'youtu.be',
    'vimeo.com',
    'twitter.com',
    'x.com',
    'instagram.com',
    'flickr.com',
    'soundcloud.com',
    'spotify.com',
    'codepen.io',
    'slideshare.net',
    'ted.com',
    'giphy.com'
  ];
  
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.replace('www.', '');
    const isSupported = supportedDomains.some(supportedDomain => 
      domain === supportedDomain || domain.endsWith(`.${supportedDomain}`)
    );
    console.log('URL support check:', { url, domain, isSupported });
    return isSupported;
  } catch (error) {
    console.error('Error checking URL support:', error);
    return false;
  }
} 