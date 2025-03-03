'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import RichTextEditor from '@/app/components/RichTextEditor';

export default function SampleLessonPage() {
  const [lessonContent, setLessonContent] = useState<string>(`
    <h2>Welcome to the Sample Lesson</h2>
    <p>This is a demonstration of the lesson editor. You can use the toolbar above to add different elements to your lesson content.</p>
    <p>Try adding:</p>
    <ul>
      <li>Headings</li>
      <li>Paragraphs</li>
      <li>Lists</li>
      <li>Code blocks</li>
    </ul>
    <p>You can also embed YouTube videos and other media using the embed button in the toolbar.</p>
  `);

  const handleContentChange = (content: string) => {
    setLessonContent(content);
  };

  const handleSave = () => {
    // In a real app, this would save to the database
    alert('Lesson content saved successfully!');
    console.log('Lesson content:', lessonContent);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/courses" className="mb-4 inline-flex items-center text-blue-600 hover:underline">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mr-2 h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Courses
        </Link>
        
        <h1 className="mb-6 text-3xl font-bold text-gray-900">Sample Lesson Editor</h1>
        <p className="text-gray-600 mb-6">
          This page demonstrates how to create and edit lesson content using a rich text editor with embedded media support.
        </p>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Lesson Content</h2>
        <RichTextEditor 
          initialContent={lessonContent} 
          onChange={handleContentChange} 
        />
      </div>
      
      <div className="flex justify-end">
        <Button onClick={handleSave}>
          Save Lesson
        </Button>
      </div>
    </div>
  );
} 