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
  const lessonId = parseInt(await params.lessonId);
  
  if (isNaN(lessonId)) {
    return {
      title: 'Lesson Not Found - Kit Course',
    };
  }
  
  const lesson = await getLessonById(lessonId);
  
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

export default async function LessonPage({ params }: LessonPageProps) {
  // Parse and validate IDs
  const courseId = parseInt(await params.courseId);
  const sectionId = parseInt(await params.sectionId);
  const lessonId = parseInt(await params.lessonId);
  
  if (isNaN(courseId) || isNaN(sectionId) || isNaN(lessonId)) {
    notFound();
  }
  
  // Fetch required data
  const [course, lesson] = await Promise.all([
    getCourseById(courseId),
    getLessonById(lessonId)
  ]);
  
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
  const lessons = await getLessonsBySectionId(sectionId);
  
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
      
      {/* Navigation between lessons */}
      <div className="flex justify-between">
        {prevLesson ? (
          <Button variant="outline" asChild>
            <Link href={`/courses/${courseId}/sections/${sectionId}/lessons/${prevLesson.id}`}>
              ← Previous Lesson
            </Link>
          </Button>
        ) : (
          <div /> /* Empty div for spacing */
        )}
        
        {nextLesson ? (
          <Button asChild>
            <Link href={`/courses/${courseId}/sections/${sectionId}/lessons/${nextLesson.id}`}>
              Next Lesson →
            </Link>
          </Button>
        ) : (
          <Button asChild>
            <Link href={`/courses/${courseId}`}>
              Complete Section →
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
} 