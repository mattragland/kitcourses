'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface NewSectionPageProps {
  params: {
    courseId: string;
  };
}

export default function NewSectionPage({ params }: NewSectionPageProps) {
  const router = useRouter();
  const courseId = parseInt(params.courseId);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  
  if (isNaN(courseId)) {
    notFound();
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Get the current highest order number
      const sectionsResponse = await fetch(`/api/courses/${courseId}/sections`);
      if (!sectionsResponse.ok) {
        throw new Error('Failed to fetch sections');
      }
      const sections = await sectionsResponse.json();
      const maxOrder = sections.reduce((max: number, section: any) => 
        Math.max(max, section.order_num), 0);
      
      // Create the new section
      const response = await fetch(`/api/courses/${courseId}/sections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          course_id: courseId,
          order_num: maxOrder + 1,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create section');
      }
      
      // Redirect back to sections page
      router.push(`/creator/courses/${courseId}/sections`);
      router.refresh();
    } catch (err) {
      console.error('Error creating section:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
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
        <h1 className="text-3xl font-bold text-gray-900">Add New Section</h1>
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
          
          <div className="flex items-center justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/creator/courses/${courseId}/sections`)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Section'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 