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
 * Extracts oEmbed information from a URL
 * Supports YouTube, Twitter, Vimeo, and other oEmbed providers
 */
export async function getOEmbedData(url: string): Promise<OEmbedResult> {
  try {
    const data = await extract(url);
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
    
    return supportedDomains.some(supportedDomain => 
      domain === supportedDomain || domain.endsWith(`.${supportedDomain}`)
    );
  } catch (error) {
    return false;
  }
} 