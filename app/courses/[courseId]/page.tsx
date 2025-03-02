import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import LessonCard from '@/app/components/LessonCard';
import { getCourseById, getSectionsByCourseId, getLessonsBySectionId } from '@/app/db/courseRepository';
import { optimizeImage } from '@/app/lib/imagekit';

interface CoursePageProps {
  params: {
    courseId: string;
  };
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const courseId = parseInt(params.courseId);
  
  if (isNaN(courseId)) {
    return {
      title: 'Course Not Found - Kit Course',
    };
  }
  
  const course = getCourseById(courseId);
  
  if (!course) {
    return {
      title: 'Course Not Found - Kit Course',
    };
  }
  
  return {
    title: `${course.title} - Kit Course`,
    description: course.description,
  };
}

export default function CoursePage({ params }: CoursePageProps) {
  const courseId = parseInt(params.courseId);
  
  if (isNaN(courseId)) {
    notFound();
  }
  
  const course = getCourseById(courseId);
  
  if (!course) {
    notFound();
  }
  
  const sections = getSectionsByCourseId(courseId);
  
  // Get lessons for each section
  const sectionsWithLessons = sections.map(section => {
    const lessons = getLessonsBySectionId(section.id);
    return {
      ...section,
      lessons
    };
  });
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <Link href="/courses" className="text-blue-500 hover:underline mb-4 inline-block">
          ← Back to Courses
        </Link>
        
        <div className="flex flex-col md:flex-row gap-8 mt-4">
          {course.image_url && (
            <div className="md:w-1/3">
              <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                <Image
                  src={optimizeImage(course.image_url, 600)}
                  alt={course.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          )}
          
          <div className="md:w-2/3">
            <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
            <p className="text-gray-700 mb-6">{course.description}</p>
            
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {sections.length} {sections.length === 1 ? 'Section' : 'Sections'}
              </div>
              <div className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                Free
              </div>
            </div>
            
            <Button size="lg">
              Start Learning
            </Button>
          </div>
        </div>
      </div>
      
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Course Content</h2>
        
        {sectionsWithLessons.length > 0 ? (
          <div className="space-y-8">
            {sectionsWithLessons.map((section) => (
              <div key={section.id} className="border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">{section.title}</h3>
                
                <div className="space-y-4">
                  {section.lessons.map((lesson) => (
                    <LessonCard 
                      key={lesson.id}
                      lesson={lesson}
                      courseId={courseId}
                      sectionId={section.id}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No content available for this course yet.</p>
        )}
      </div>
    </div>
  );
} 