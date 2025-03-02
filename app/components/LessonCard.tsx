import Link from 'next/link';
import { Lesson } from '@/app/db/schema';
import { Button } from '@/components/ui/button';
import { LockClosedIcon, LockOpen1Icon } from '@radix-ui/react-icons';

interface LessonCardProps {
  lesson: Lesson;
  courseId: number;
  sectionId: number;
  isLoggedIn?: boolean;
}

export default function LessonCard({ 
  lesson, 
  courseId, 
  sectionId, 
  isLoggedIn = false 
}: LessonCardProps) {
  const isAccessible = lesson.is_free || isLoggedIn;
  
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-all hover:bg-gray-50">
      <div className="flex items-center gap-3">
        {isAccessible ? (
          <LockOpen1Icon className="h-5 w-5 text-green-500" />
        ) : (
          <LockClosedIcon className="h-5 w-5 text-gray-400" />
        )}
        
        <div>
          <h3 className="font-medium text-gray-900">{lesson.title}</h3>
          {!isAccessible && (
            <p className="text-sm text-gray-500">
              Login to access this lesson
            </p>
          )}
        </div>
      </div>
      
      <Button 
        variant={isAccessible ? "default" : "outline"} 
        asChild
        disabled={!isAccessible}
      >
        {isAccessible ? (
          <Link href={`/courses/${courseId}/sections/${sectionId}/lessons/${lesson.id}`}>
            View Lesson
          </Link>
        ) : (
          <Link href="/login">
            Login to Access
          </Link>
        )}
      </Button>
    </div>
  );
} 