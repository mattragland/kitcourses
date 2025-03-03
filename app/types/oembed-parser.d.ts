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

  export interface ExtractOptions {
    params?: Record<string, string>;
  }

  export function extract(url: string, options?: ExtractOptions): Promise<OEmbedData>;
} 