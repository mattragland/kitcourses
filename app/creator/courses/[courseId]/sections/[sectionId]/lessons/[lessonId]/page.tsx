'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

interface EditLessonPageProps {
  params: {
    courseId: string;
    sectionId: string;
    lessonId: string;
  };
}

interface Lesson {
  id: number;
  section_id: number;
  title: string;
  content: string;
  is_free: boolean;
  order_num: number;
  created_at: string;
  updated_at: string;
}

export default function EditLessonPage({ params }: EditLessonPageProps) {
  const router = useRouter();
  const courseId = parseInt(params.courseId);
  const sectionId = parseInt(params.sectionId);
  const lessonId = parseInt(params.lessonId);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isFree, setIsFree] = useState(false);
  
  useEffect(() => {
    if (isNaN(courseId) || isNaN(sectionId) || isNaN(lessonId)) {
      notFound();
    }
    
    const fetchLesson = async () => {
      try {
        const response = await fetch(`/api/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            notFound();
          }
          throw new Error('Failed to fetch lesson');
        }
        
        const lesson: Lesson = await response.json();
        setTitle(lesson.title);
        setContent(lesson.content);
        setIsFree(lesson.is_free);
      } catch (err) {
        console.error('Error fetching lesson:', err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLesson();
  }, [courseId, sectionId, lessonId]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          is_free: isFree,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update lesson');
      }
      
      // Redirect back to lessons page
      router.push(`/creator/courses/${courseId}/sections/${sectionId}/lessons`);
      router.refresh();
    } catch (err) {
      console.error('Error updating lesson:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this lesson?')) {
      return;
    }
    
    setIsSaving(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete lesson');
      }
      
      // Redirect back to lessons page
      router.push(`/creator/courses/${courseId}/sections/${sectionId}/lessons`);
      router.refresh();
    } catch (err) {
      console.error('Error deleting lesson:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }
  
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
        <h1 className="text-3xl font-bold text-gray-900">Edit Lesson</h1>
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
          
          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isSaving}
            >
              Delete Lesson
            </Button>
            
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/creator/courses/${courseId}/sections/${sectionId}/lessons`)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 