import { Metadata } from 'next';
import Link from 'next/link';
import CourseForm from '@/app/creator/components/CourseForm';

export const metadata: Metadata = {
  title: 'Create New Course - Kit Course',
  description: 'Create a new course on Kit Course.',
};

export default function NewCoursePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/creator" className="mb-4 inline-flex items-center text-blue-600 hover:underline">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mr-2 h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Create New Course</h1>
      </div>
      
      <div className="mx-auto max-w-3xl">
        <CourseForm />
      </div>
    </div>
  );
} 