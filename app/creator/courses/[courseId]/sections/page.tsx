'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

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
        setSections(sectionsData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [courseId]);
  
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
        <Link href={`/creator/courses/${courseId}`} className="mb-4 inline-flex items-center text-blue-600 hover:underline">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mr-2 h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Course
        </Link>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Manage Sections: {course.title}</h1>
          <Button asChild>
            <Link href={`/creator/courses/${courseId}/sections/new`}>Add Section</Link>
          </Button>
        </div>
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
          {sections.map((section) => (
            <div key={section.id} className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                <p className="text-sm text-gray-500">Order: {section.order_num}</p>
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