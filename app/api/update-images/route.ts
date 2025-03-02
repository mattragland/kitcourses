import { NextRequest, NextResponse } from 'next/server';
import { updateCoursesWithUnsplashImages } from '@/app/db/courseRepository';

export async function GET(request: NextRequest) {
  try {
    const success = updateCoursesWithUnsplashImages();
    
    if (success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Course images updated to use Unsplash URLs' 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to update course images' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error updating course images:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'An error occurred while updating course images' 
    }, { status: 500 });
  }
} 