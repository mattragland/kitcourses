'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/app/components/ui/button';
import { isOEmbedSupported } from '@/app/lib/oembed';

interface RichTextEditorProps {
  initialContent: string;
  onChange: (content: string) => void;
}

export default function RichTextEditor({ initialContent = '', onChange }: RichTextEditorProps) {
  const [showEmbedModal, setShowEmbedModal] = useState(false);
  const [embedUrl, setEmbedUrl] = useState('');
  const [embedError, setEmbedError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  // Initialize the editor with initial content
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = initialContent;
    }
  }, []);

  const formatText = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    updateContent();
  };

  const updateContent = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleEmbedUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmbedUrl(e.target.value);
    setEmbedError(null);
  };

  const handleEmbed = async () => {
    if (!embedUrl.trim()) {
      setEmbedError('Please enter a URL');
      return;
    }

    if (!isOEmbedSupported(embedUrl)) {
      setEmbedError('This URL is not supported for embedding');
      return;
    }

    setIsLoading(true);
    setEmbedError(null);

    try {
      const response = await fetch(`/api/oembed?url=${encodeURIComponent(embedUrl)}`);
      const data = await response.json();

      if (data.error) {
        setEmbedError(data.error);
        return;
      }

      // Insert the embed HTML at the current cursor position
      if (editorRef.current) {
        // Get current selection
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          
          // Create a container for the embed HTML
          const embedContainer = document.createElement('div');
          embedContainer.innerHTML = data.html;
          
          // Insert at cursor position
          range.insertNode(embedContainer);
          
          // Move cursor after the inserted content
          range.setStartAfter(embedContainer);
          range.setEndAfter(embedContainer);
          selection.removeAllRanges();
          selection.addRange(range);
        } else {
          // If no selection, append to the end
          editorRef.current.innerHTML += data.html;
        }
        
        // Update content
        updateContent();
      }
      
      // Close the modal and reset the URL
      setShowEmbedModal(false);
      setEmbedUrl('');
    } catch (err) {
      setEmbedError('Failed to embed content. Please try again.');
      console.error('Error embedding content:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border rounded-md p-4">
      <div className="flex flex-wrap gap-2 mb-4 border-b pb-4">
        <Button type="button" variant="outline" size="sm" onClick={() => formatText('formatBlock', '<h2>')}>H2</Button>
        <Button type="button" variant="outline" size="sm" onClick={() => formatText('formatBlock', '<h3>')}>H3</Button>
        <Button type="button" variant="outline" size="sm" onClick={() => formatText('formatBlock', '<p>')}>Paragraph</Button>
        <Button type="button" variant="outline" size="sm" onClick={() => formatText('insertUnorderedList')}>Bullet List</Button>
        <Button type="button" variant="outline" size="sm" onClick={() => formatText('insertOrderedList')}>Numbered List</Button>
        <Button type="button" variant="outline" size="sm" onClick={() => formatText('formatBlock', '<pre>')}>Code</Button>
        <Button type="button" variant="outline" size="sm" onClick={() => setShowEmbedModal(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
          Embed
        </Button>
      </div>

      <div
        ref={editorRef}
        className="border rounded-md p-4 h-64 overflow-auto prose max-w-none"
        contentEditable
        suppressContentEditableWarning
        onInput={updateContent}
        dir="ltr"
      />

      {showEmbedModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-2">Insert embed</h3>
            <p className="text-sm text-gray-500 mb-4">
              Paste the share link from one of our 1,900+ supported sources. Embed codes are not supported.
            </p>
            
            <input
              type="url"
              value={embedUrl}
              onChange={handleEmbedUrlChange}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-3 py-2 border rounded-md mb-4"
            />
            
            {embedError && (
              <p className="text-red-500 text-sm mb-4">{embedError}</p>
            )}
            
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowEmbedModal(false)}
              >
                Discard
              </Button>
              <Button 
                onClick={handleEmbed} 
                disabled={isLoading}
              >
                {isLoading ? 'Inserting...' : 'Insert'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 