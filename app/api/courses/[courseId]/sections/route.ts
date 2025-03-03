import { NextRequest, NextResponse } from 'next/server';
import { getSectionsByCourseId, createSection } from '@/app/db/courseRepository';
import { getCourseById } from '@/app/db/courseRepository';

interface RouteParams {
  params: {
    courseId: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const courseId = parseInt(params.courseId);
    
    if (isNaN(courseId)) {
      return NextResponse.json(
        { error: 'Invalid course ID' },
        { status: 400 }
      );
    }
    
    // Check if course exists
    const course = getCourseById(courseId);
    
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }
    
    const sections = getSectionsByCourseId(courseId);
    
    return NextResponse.json(sections);
  } catch (error) {
    console.error('Error fetching sections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sections' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const courseId = parseInt(params.courseId);
    
    if (isNaN(courseId)) {
      return NextResponse.json(
        { error: 'Invalid course ID' },
        { status: 400 }
      );
    }
    
    // Check if course exists
    const course = getCourseById(courseId);
    
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }
    
    // Get existing sections to determine order
    const existingSections = getSectionsByCourseId(courseId);
    const order = body.order || existingSections.length + 1;
    
    const sectionId = createSection({
      course_id: courseId,
      title: body.title,
      order: order
    });
    
    return NextResponse.json({ id: sectionId }, { status: 201 });
  } catch (error) {
    console.error('Error creating section:', error);
    return NextResponse.json(
      { error: 'Failed to create section' },
      { status: 500 }
    );
  }
} 