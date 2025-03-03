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
  const isInitialMount = useRef(true);

  // Initialize the editor with initial content
  useEffect(() => {
    if (editorRef.current) {
      if (isInitialMount.current) {
        editorRef.current.innerHTML = initialContent;
        // Ensure there's always a paragraph for cursor position
        if (!editorRef.current.querySelector('p')) {
          editorRef.current.innerHTML = '<p><br></p>';
        }
        isInitialMount.current = false;
      }
    }
  }, [initialContent]);

  const formatText = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    updateContent();
  };

  const updateContent = () => {
    if (editorRef.current) {
      // Store current selection
      const selection = window.getSelection();
      const range = selection?.rangeCount ? selection.getRangeAt(0).cloneRange() : null;
      
      // Ensure there's always a paragraph at the end for cursor position
      if (!editorRef.current.querySelector('p:last-child')) {
        const p = document.createElement('p');
        p.innerHTML = '<br>';
        editorRef.current.appendChild(p);
      }
      
      // Preserve contentEditable=false on embedded content
      const embeds = editorRef.current.querySelectorAll('.embedded-content');
      embeds.forEach(embed => {
        if (embed instanceof HTMLElement) {
          embed.contentEditable = 'false';
        }
      });
      
      // Update content
      onChange(editorRef.current.innerHTML);
      
      // Restore selection if it was within the editor
      if (range && editorRef.current.contains(range.commonAncestorContainer)) {
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
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
        const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
        
        // Create a wrapper for the embed
        const wrapper = document.createElement('div');
        wrapper.className = 'embedded-content';
        wrapper.contentEditable = 'false';
        wrapper.innerHTML = data.html;
        
        // Create a paragraph for the cursor
        const paragraph = document.createElement('p');
        paragraph.innerHTML = '<br>';
        
        if (range && editorRef.current.contains(range.commonAncestorContainer)) {
          // Get the current block element
          let currentBlock = range.commonAncestorContainer;
          while (currentBlock && currentBlock.nodeType === Node.TEXT_NODE) {
            currentBlock = currentBlock.parentNode as Node;
          }
          
          // Insert the embed and paragraph
          if (currentBlock && currentBlock.parentNode) {
            currentBlock.parentNode.insertBefore(wrapper, currentBlock.nextSibling);
            currentBlock.parentNode.insertBefore(paragraph, wrapper.nextSibling);
            
            // Set cursor to the new paragraph
            const newRange = document.createRange();
            newRange.selectNodeContents(paragraph);
            newRange.collapse(true);
            selection?.removeAllRanges();
            selection?.addRange(newRange);
          }
        } else {
          // If no valid selection, append to the end
          editorRef.current.appendChild(wrapper);
          editorRef.current.appendChild(paragraph);
          
          // Set cursor to the new paragraph
          const newRange = document.createRange();
          newRange.selectNodeContents(paragraph);
          newRange.collapse(true);
          selection?.removeAllRanges();
          selection?.addRange(newRange);
          
          // Scroll the new content into view
          paragraph.scrollIntoView({ behavior: 'smooth', block: 'end' });
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

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    // Store selection before updating content
    const selection = window.getSelection();
    const range = selection?.rangeCount ? selection.getRangeAt(0).cloneRange() : null;
    
    // Update content
    updateContent();
    
    // Restore selection
    if (range && editorRef.current?.contains(range.commonAncestorContainer)) {
      requestAnimationFrame(() => {
        selection?.removeAllRanges();
        selection?.addRange(range);
      });
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

      <style jsx global>{`
        .embedded-content {
          position: relative;
          margin: 1rem 0;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 0.5rem;
        }
        .embedded-content iframe {
          display: block;
          margin: 0 auto;
          max-width: 100%;
          border: none;
        }
        .editor-content {
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .editor-content h2 {
          font-size: 1.5em;
          font-weight: 600;
          margin: 1em 0 0.5em;
          line-height: 1.3333333;
        }
        .editor-content h3 {
          font-size: 1.25em;
          font-weight: 600;
          margin: 1em 0 0.5em;
          line-height: 1.6;
        }
        .editor-content p {
          min-height: 1.5em;
          margin: 0.5em 0;
          line-height: 1.5;
        }
        .editor-content ul {
          list-style-type: disc;
          margin: 0.5em 0;
          padding-left: 1.625em;
        }
        .editor-content ol {
          list-style-type: decimal;
          margin: 0.5em 0;
          padding-left: 1.625em;
        }
        .editor-content pre {
          background-color: #f8f9fa;
          border-radius: 0.375rem;
          padding: 1em;
          margin: 0.5em 0;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 0.875em;
          line-height: 1.7142857;
          overflow-x: auto;
        }
        .editor-content p:first-child {
          margin-top: 0;
        }
        .editor-content p:last-child {
          margin-bottom: 0;
        }
      `}</style>

      <div
        ref={editorRef}
        className="editor-content border rounded-md p-4 h-64 overflow-auto"
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
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
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleEmbed();
                }
              }}
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