import { NextRequest, NextResponse } from 'next/server';
import { getAllCourses, createCourse } from '@/app/db/courseRepository';

export async function GET() {
  try {
    const courses = getAllCourses();
    return NextResponse.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }
    
    const courseId = createCourse({
      title: body.title,
      description: body.description,
      image_url: body.image_url || null,
      creator_id: body.creator_id || null
    });
    
    return NextResponse.json({ id: courseId }, { status: 201 });
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    );
  }
} 