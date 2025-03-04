'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Button } from '@/components/ui/button';

interface LessonsPageProps {
  params: {
    courseId: string;
    sectionId: string;
  };
}

interface Lesson {
  id: number;
  section_id: number;
  title: string;
  content: string;
  order_num: number;
  created_at: string;
  updated_at: string;
}

export default function LessonsPage({ params }: LessonsPageProps) {
  const courseId = parseInt(params.courseId);
  const sectionId = parseInt(params.sectionId);
  const [section, setSection] = useState<any>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (isNaN(courseId) || isNaN(sectionId)) {
      notFound();
    }
    
    const fetchData = async () => {
      try {
        // Fetch section
        const sectionResponse = await fetch(`/api/courses/${courseId}/sections/${sectionId}`);
        
        if (!sectionResponse.ok) {
          if (sectionResponse.status === 404) {
            notFound();
          }
          throw new Error('Failed to fetch section');
        }
        
        const sectionData = await sectionResponse.json();
        setSection(sectionData);
        
        // Fetch lessons
        const lessonsResponse = await fetch(`/api/courses/${courseId}/sections/${sectionId}/lessons`);
        
        if (!lessonsResponse.ok) {
          throw new Error('Failed to fetch lessons');
        }
        
        const lessonsData = await lessonsResponse.json();
        // Sort lessons by order_num
        setLessons(lessonsData.sort((a: Lesson, b: Lesson) => a.order_num - b.order_num));
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [courseId, sectionId]);
  
  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(lessons);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update order numbers
    const updatedItems = items.map((item, index) => ({
      ...item,
      order_num: index + 1,
    }));
    
    setLessons(updatedItems);
    
    try {
      // Update order numbers in the database
      const response = await fetch(`/api/courses/${courseId}/sections/${sectionId}/lessons/reorder`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessons: updatedItems.map(item => ({
            id: item.id,
            order_num: item.order_num,
          })),
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update lesson order');
      }
    } catch (err) {
      console.error('Error updating lesson order:', err);
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
            <Link href={`/creator/courses/${courseId}/sections`}>Back to Sections</Link>
          </Button>
        </div>
      </div>
    );
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
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Manage Lessons: {section.title}</h1>
          <Button asChild>
            <Link href={`/creator/courses/${courseId}/sections/${sectionId}/lessons/new`}>Add Lesson</Link>
          </Button>
        </div>
      </div>
      
      {lessons.length === 0 ? (
        <div className="rounded-lg border border-gray-200 p-8 text-center">
          <h3 className="mb-2 text-xl font-semibold">No lessons yet</h3>
          <p className="mb-6 text-gray-600">
            Start creating content by adding lessons to this section.
          </p>
          <Button asChild>
            <Link href={`/creator/courses/${courseId}/sections/${sectionId}/lessons/new`}>Add Your First Lesson</Link>
          </Button>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="lessons">
            {(provided) => (
              <div 
                {...provided.droppableProps} 
                ref={provided.innerRef}
                className="space-y-4"
              >
                {lessons.map((lesson, index) => (
                  <Draggable 
                    key={lesson.id} 
                    draggableId={lesson.id.toString()} 
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                      >
                        <div className="flex items-center gap-4">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-gray-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
                          </svg>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{lesson.title}</h3>
                            <p className="text-sm text-gray-500">Lesson {index + 1}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/creator/courses/${courseId}/sections/${sectionId}/lessons/${lesson.id}`}>
                              Edit
                            </Link>
                          </Button>
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/creator/courses/${courseId}/sections/${sectionId}/lessons/${lesson.id}/preview`}>
                              Preview
                            </Link>
                          </Button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
} 