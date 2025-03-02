'use client';

import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { isOEmbedSupported } from '@/app/lib/oembed';

interface OEmbedInputProps {
  onEmbed: (embedHtml: string) => void;
}

export default function OEmbedInput({ onEmbed }: OEmbedInputProps) {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    setError(null);
  };

  const handleEmbed = async () => {
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (!isOEmbedSupported(url)) {
      setError('This URL is not supported for embedding');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/oembed?url=${encodeURIComponent(url)}`);
      const data = await response.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      onEmbed(data.html);
      setUrl('');
    } catch (err) {
      setError('Failed to embed content. Please try again.');
      console.error('Error embedding content:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border rounded-md p-4">
      <h3 className="text-lg font-medium mb-2">Embed Media</h3>
      <p className="text-sm text-gray-500 mb-4">
        Enter a YouTube, Vimeo, or other supported URL to embed media in your lesson.
      </p>
      
      <div className="flex gap-2">
        <input
          type="url"
          value={url}
          onChange={handleUrlChange}
          placeholder="https://www.youtube.com/watch?v=..."
          className="flex-1 px-3 py-2 border rounded-md"
        />
        <Button 
          onClick={handleEmbed} 
          disabled={isLoading}
        >
          {isLoading ? 'Embedding...' : 'Embed'}
        </Button>
      </div>
      
      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
      
      <div className="mt-4 text-sm text-gray-500">
        <p>Supported platforms include:</p>
        <ul className="list-disc pl-5 mt-1">
          <li>YouTube</li>
          <li>Vimeo</li>
          <li>Twitter/X</li>
          <li>SoundCloud</li>
          <li>And more...</li>
        </ul>
      </div>
    </div>
  );
} 