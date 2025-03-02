import { Metadata } from 'next';
import CourseCard from '@/app/components/CourseCard';
import { getAllCourses } from '@/app/db/courseRepository';

export const metadata: Metadata = {
  title: 'Courses - Kit Course',
  description: 'Browse our collection of courses on Kit Course.',
};

export default function CoursesPage() {
  // Fetch all courses
  const courses = getAllCourses();
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">All Courses</h1>
      
      {courses.length === 0 ? (
        <div className="rounded-lg border border-gray-200 p-8 text-center">
          <h2 className="mb-2 text-xl font-semibold">No courses available yet</h2>
          <p className="text-gray-600">
            Check back soon for new courses or contact us to suggest a topic.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
} 