import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { optimizeImage } from '@/app/lib/imagekit';
import { Course } from '@/app/db/schema';

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  // Default image if none is provided
  const imageUrl = course.image_url 
    ? optimizeImage(course.image_url, 400, 80)
    : '/placeholder-course.jpg';
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative h-48 w-full">
        <Image
          src={imageUrl}
          alt={course.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      
      <CardHeader className="p-4">
        <CardTitle className="line-clamp-2 text-lg">{course.title}</CardTitle>
      </CardHeader>
      
      <CardContent className="p-4 pt-0">
        <p className="line-clamp-3 text-sm text-gray-600">
          {course.description}
        </p>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/courses/${course.id}`}>
            View Course
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
} 