import { NextResponse } from 'next/server';
import { getMockCreator } from '@/app/db/userRepository';

export async function GET() {
  try {
    // Get the mock creator for development (will be replaced with auth)
    const creator = getMockCreator();
    
    return NextResponse.json(creator);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
} 