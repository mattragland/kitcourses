'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronUpIcon, ChevronDownIcon } from '@radix-ui/react-icons';

interface SectionsPageProps {
  params: {
    courseId: string;
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

export default function SectionsPage({ params }: SectionsPageProps) {
  const courseId = parseInt(params.courseId);
  const [course, setCourse] = useState<any>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (isNaN(courseId)) {
      notFound();
    }
    
    const fetchData = async () => {
      try {
        // Fetch course
        const courseResponse = await fetch(`/api/courses/${courseId}`);
        
        if (!courseResponse.ok) {
          if (courseResponse.status === 404) {
            notFound();
          }
          throw new Error('Failed to fetch course');
        }
        
        const courseData = await courseResponse.json();
        setCourse(courseData);
        
        // Fetch sections
        const sectionsResponse = await fetch(`/api/courses/${courseId}/sections`);
        
        if (!sectionsResponse.ok) {
          throw new Error('Failed to fetch sections');
        }
        
        const sectionsData = await sectionsResponse.json();
        // Sort sections by order_num
        setSections(sectionsData.sort((a: Section, b: Section) => a.order_num - b.order_num));
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [courseId]);
  
  const handleMove = async (sectionId: number, direction: 'up' | 'down') => {
    try {
      const response = await fetch(`/api/courses/${courseId}/sections/reorder`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sectionId,
          direction,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update section order');
      }
      
      // Refetch sections to get updated order
      const sectionsResponse = await fetch(`/api/courses/${courseId}/sections`);
      if (!sectionsResponse.ok) {
        throw new Error('Failed to fetch updated sections');
      }
      
      const sectionsData = await sectionsResponse.json();
      setSections(sectionsData.sort((a: Section, b: Section) => a.order_num - b.order_num));
    } catch (err) {
      console.error('Error updating section order:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
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
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
        <div className="mt-4">
          <Button asChild variant="outline">
            <Link href="/creator">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Button asChild variant="outline">
          <Link href="/creator">← Back to Dashboard</Link>
        </Button>
        <h1 className="mt-4 text-3xl font-bold text-gray-900">{course?.title}</h1>
        <p className="mt-2 text-gray-600">Manage your course sections</p>
      </div>
      
      <div className="mb-6 flex justify-end">
        <Button asChild>
          <Link href={`/creator/courses/${courseId}/sections/new`}>Add New Section</Link>
        </Button>
      </div>
      
      {sections.length === 0 ? (
        <div className="rounded-lg border border-gray-200 p-8 text-center">
          <h3 className="mb-2 text-xl font-semibold">No sections yet</h3>
          <p className="mb-6 text-gray-600">
            Start organizing your course by adding sections.
          </p>
          <Button asChild>
            <Link href={`/creator/courses/${courseId}/sections/new`}>Add Your First Section</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {sections.map((section, index) => (
            <div
              key={section.id}
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="flex flex-col space-y-1">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    disabled={index === 0}
                    onClick={() => handleMove(section.id, 'up')}
                  >
                    <ChevronUpIcon className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    disabled={index === sections.length - 1}
                    onClick={() => handleMove(section.id, 'down')}
                  >
                    <ChevronDownIcon className="h-4 w-4" />
                  </Button>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                  <p className="text-sm text-gray-500">Section {index + 1}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/creator/courses/${courseId}/sections/${section.id}/lessons`}>
                    Manage Lessons
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/creator/courses/${courseId}/sections/${section.id}`}>
                    Edit
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 