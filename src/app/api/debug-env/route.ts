import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const envInfo = {
      NODE_ENV: process.env.NODE_ENV,
      MONGODB_URI_EXISTS: !!process.env.MONGODB_URI,
      MONGODB_URI_LENGTH: process.env.MONGODB_URI?.length || 0,
      DB_NAME: process.env.DB_NAME,
      GEMINI_API_KEY_EXISTS: !!process.env.GEMINI_API_KEY,
      VERCEL: process.env.VERCEL,
      VERCEL_ENV: process.env.VERCEL_ENV,
      VERCEL_URL: process.env.VERCEL_URL,
    };
    
    console.log('Environment debug info:', envInfo);
    
    return NextResponse.json(envInfo);
  } catch (error) {
    console.error('Error in debug endpoint:', error);
    return NextResponse.json(
      { error: 'Failed to get environment info' },
      { status: 500 }
    );
  }
}
