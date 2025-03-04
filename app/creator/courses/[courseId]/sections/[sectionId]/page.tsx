'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EditSectionPageProps {
  params: {
    courseId: string;
    sectionId: string;
  };
}

interface Section {
  id: number;
  course_id: number;
  title: string;
  order_num: number;
  created_at: string;
  updated_at: string;
}

export default function EditSectionPage({ params }: EditSectionPageProps) {
  const router = useRouter();
  const courseId = parseInt(params.courseId);
  const sectionId = parseInt(params.sectionId);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [section, setSection] = useState<Section | null>(null);
  
  useEffect(() => {
    if (isNaN(courseId) || isNaN(sectionId)) {
      notFound();
    }
    
    const fetchSection = async () => {
      try {
        const response = await fetch(`/api/courses/${courseId}/sections/${sectionId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            notFound();
          }
          throw new Error('Failed to fetch section');
        }
        
        const data = await response.json();
        setSection(data);
        setTitle(data.title);
      } catch (err) {
        console.error('Error fetching section:', err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSection();
  }, [courseId, sectionId]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/courses/${courseId}/sections/${sectionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update section');
      }
      
      // Redirect back to sections page
      router.push(`/creator/courses/${courseId}/sections`);
      router.refresh();
    } catch (err) {
      console.error('Error updating section:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this section? This will also delete all lessons within this section.')) {
      return;
    }
    
    setIsSaving(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/courses/${courseId}/sections/${sectionId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete section');
      }
      
      // Redirect back to sections page
      router.push(`/creator/courses/${courseId}/sections`);
      router.refresh();
    } catch (err) {
      console.error('Error deleting section:', err);
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
  
  if (!section) {
    return notFound();
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Link 
          href={`/creator/courses/${courseId}/sections`} 
          className="mb-4 inline-flex items-center text-blue-600 hover:underline"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mr-2 h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Sections
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Edit Section</h1>
      </div>
      
      <div className="mx-auto max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          {error && (
            <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="title">Section Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Introduction to the Course"
              required
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isSaving}
            >
              Delete Section
            </Button>
            
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/creator/courses/${courseId}/sections`)}
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