declare module 'oembed-parser' {
  export interface OEmbedData {
    html: string;
    provider_name: string;
    provider_url: string;
    type: string;
    title?: string;
    thumbnail_url?: string;
    width?: number;
    height?: number;
    [key: string]: any;
  }

  export function extract(url: string): Promise<OEmbedData>;
} 