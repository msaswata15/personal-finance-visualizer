import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    hasMongoUri: !!process.env.MONGODB_URI,
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    dbName: process.env.DB_NAME || 'personal_finance'
  });
}
