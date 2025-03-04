'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

interface NewLessonPageProps {
  params: {
    courseId: string;
    sectionId: string;
  };
}

export default function NewLessonPage({ params }: NewLessonPageProps) {
  const router = useRouter();
  const courseId = parseInt(params.courseId);
  const sectionId = parseInt(params.sectionId);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isFree, setIsFree] = useState(false);
  
  if (isNaN(courseId) || isNaN(sectionId)) {
    notFound();
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Get the current highest order number
      const lessonsResponse = await fetch(`/api/courses/${courseId}/sections/${sectionId}/lessons`);
      if (!lessonsResponse.ok) {
        throw new Error('Failed to fetch lessons');
      }
      const lessons = await lessonsResponse.json();
      const maxOrder = lessons.reduce((max: number, lesson: any) => 
        Math.max(max, lesson.order_num), 0);
      
      // Create the new lesson
      const response = await fetch(`/api/courses/${courseId}/sections/${sectionId}/lessons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          is_free: isFree,
          order_num: maxOrder + 1,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create lesson');
      }
      
      // Redirect back to lessons page
      router.push(`/creator/courses/${courseId}/sections/${sectionId}/lessons`);
      router.refresh();
    } catch (err) {
      console.error('Error creating lesson:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Link 
          href={`/creator/courses/${courseId}/sections/${sectionId}/lessons`} 
          className="mb-4 inline-flex items-center text-blue-600 hover:underline"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mr-2 h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Lessons
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Add New Lesson</h1>
      </div>
      
      <div className="mx-auto max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          {error && (
            <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="title">Lesson Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Introduction to React Hooks"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Lesson Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your lesson content here..."
              className="min-h-[200px]"
              required
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="is-free"
              checked={isFree}
              onCheckedChange={setIsFree}
            />
            <Label htmlFor="is-free">Make this lesson free for preview</Label>
          </div>
          
          <div className="flex items-center justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/creator/courses/${courseId}/sections/${sectionId}/lessons`)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Lesson'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 