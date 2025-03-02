import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { getLessonById, getCourseById, getSectionsByCourseId, getLessonsBySectionId } from '@/app/db/courseRepository';

interface LessonPageProps {
  params: {
    courseId: string;
    sectionId: string;
    lessonId: string;
  };
}

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const lessonId = parseInt(params.lessonId);
  
  if (isNaN(lessonId)) {
    return {
      title: 'Lesson Not Found - Kit Course',
    };
  }
  
  const lesson = getLessonById(lessonId);
  
  if (!lesson) {
    return {
      title: 'Lesson Not Found - Kit Course',
    };
  }
  
  return {
    title: `${lesson.title} - Kit Course`,
    description: `Learn about ${lesson.title} in this lesson from Kit Course.`,
  };
}

export default function LessonPage({ params }: LessonPageProps) {
  const courseId = parseInt(params.courseId);
  const sectionId = parseInt(params.sectionId);
  const lessonId = parseInt(params.lessonId);
  
  if (isNaN(courseId) || isNaN(sectionId) || isNaN(lessonId)) {
    notFound();
  }
  
  const course = getCourseById(courseId);
  const lesson = getLessonById(lessonId);
  
  if (!course || !lesson) {
    notFound();
  }
  
  // Mock user authentication status (replace with actual auth check)
  const isLoggedIn = false;
  
  // Check if user has access to this lesson
  const hasAccess = lesson.is_free || isLoggedIn;
  
  if (!hasAccess) {
    // Redirect to login or show access denied
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href={`/courses/${courseId}`} className="mb-4 inline-flex items-center text-blue-600 hover:underline">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mr-2 h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Course
          </Link>
        </div>
        
        <div className="rounded-lg border border-gray-200 p-8 text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">Access Restricted</h1>
          <p className="mb-6 text-gray-600">
            You need to be logged in to access this lesson. Sign up or log in to continue.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/login">Log In</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  // Get all lessons in this section for navigation
  const lessons = getLessonsBySectionId(sectionId);
  
  // Find current lesson index
  const currentIndex = lessons.findIndex(l => l.id === lessonId);
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href={`/courses/${courseId}`} className="mb-4 inline-flex items-center text-blue-600 hover:underline">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mr-2 h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Course
        </Link>
        
        <h1 className="mb-6 text-3xl font-bold text-gray-900">{lesson.title}</h1>
      </div>
      
      <div className="mb-12 rounded-lg border border-gray-200 p-6">
        {/* Render lesson content - this would be rich text in a real app */}
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: lesson.content }} />
      </div>
      
      <div className="flex justify-between">
        {prevLesson ? (
          <Button variant="outline" asChild>
            <Link href={`/courses/${courseId}/sections/${sectionId}/lessons/${prevLesson.id}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mr-2 h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Previous Lesson
            </Link>
          </Button>
        ) : (
          <div></div>
        )}
        
        {nextLesson ? (
          <Button asChild>
            <Link href={`/courses/${courseId}/sections/${sectionId}/lessons/${nextLesson.id}`}>
              Next Lesson
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="ml-2 h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </Button>
        ) : (
          <Button asChild>
            <Link href={`/courses/${courseId}`}>
              Complete Course
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="ml-2 h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
} 