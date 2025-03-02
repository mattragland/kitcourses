import { NextRequest, NextResponse } from 'next/server';
import { uploadImage } from '@/app/lib/imagekit';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    // Check if the file is an image
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }
    
    // Generate a unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/\.[^/.]+$/, ''); // Remove extension
    const sanitizedName = originalName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    const extension = file.name.split('.').pop();
    const fileName = `${sanitizedName}-${timestamp}.${extension}`;
    
    const result = await uploadImage(file, fileName);
    
    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
} 