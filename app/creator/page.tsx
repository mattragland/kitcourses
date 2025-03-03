import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getCoursesByCreatorId } from '@/app/db/courseRepository';
import { getMockCreator } from '@/app/db/userRepository';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Creator Dashboard - Kit Course',
  description: 'Manage your courses and create new content.',
};

export default function CreatorDashboard() {
  // Get the mock creator for development (will be replaced with auth)
  const creator = getMockCreator();
  
  // Get courses created by this user
  const courses = getCoursesByCreatorId(creator.id);
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Creator Dashboard</h1>
        <Button asChild>
          <Link href="/creator/courses/new">Create New Course</Link>
        </Button>
      </div>
      
      <div className="mb-8 rounded-lg border border-gray-200 bg-gray-50 p-6">
        <h2 className="mb-2 text-xl font-semibold">Welcome, {creator.name}!</h2>
        <p className="text-gray-600">
          This is your creator dashboard where you can manage your courses and create new content.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          <strong>Note:</strong> You are currently using a mock creator account for development.
          Authentication will be implemented later.
        </p>
      </div>
      
      <h2 className="mb-4 text-2xl font-semibold text-gray-900">Your Courses</h2>
      
      {courses.length === 0 ? (
        <div className="rounded-lg border border-gray-200 p-8 text-center">
          <h3 className="mb-2 text-xl font-semibold">You haven't created any courses yet</h3>
          <p className="mb-6 text-gray-600">
            Get started by creating your first course.
          </p>
          <Button asChild>
            <Link href="/creator/courses/new">Create Your First Course</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <div key={course.id} className="flex flex-col rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="relative h-48 w-full overflow-hidden rounded-t-lg bg-gray-200">
                {course.image_url ? (
                  <img 
                    src={course.image_url} 
                    alt={course.title} 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
                    No Image
                  </div>
                )}
              </div>
              
              <div className="flex flex-1 flex-col p-6">
                <h3 className="mb-2 text-xl font-semibold text-gray-900">{course.title}</h3>
                <p className="mb-4 flex-1 text-gray-600 line-clamp-2">{course.description}</p>
                
                <div className="mt-auto flex flex-wrap gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/creator/courses/${course.id}`}>
                      Edit Course
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/creator/courses/${course.id}/sections`}>
                      Manage Sections
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/courses/${course.id}`} target="_blank">
                      View
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 