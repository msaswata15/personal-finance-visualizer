import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    console.log('Testing MongoDB connection...');
    
    // Check environment variables
    const hasMongoUri = !!process.env.MONGODB_URI;
    const hasDbName = !!process.env.DB_NAME;
    const mongoUriStart = process.env.MONGODB_URI?.substring(0, 20) || 'Not set';
    
    console.log('Environment check:', {
      hasMongoUri,
      hasDbName,
      mongoUriStart: mongoUriStart + '...',
      dbName: process.env.DB_NAME || 'personal_finance',
      nodeEnv: process.env.NODE_ENV
    });
    
    if (!hasMongoUri) {
      return NextResponse.json(
        { error: 'MongoDB URI not found in environment variables' },
        { status: 500 }
      );
    }
    
    // Test database connection with timeout
    console.log('Attempting database connection...');
    const dbPromise = getDatabase();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Connection timeout after 10 seconds')), 10000)
    );
    
    const db = await Promise.race([dbPromise, timeoutPromise]) as Awaited<ReturnType<typeof getDatabase>>;
    console.log('Database connection successful');
    
    // Test a simple operation
    const collections = await db.listCollections().toArray();
    console.log('Collections found:', collections.length);
    
    return NextResponse.json({
      success: true,
      message: 'MongoDB connection successful',
      collectionsCount: collections.length,
      collections: collections.map((c: { name: string }) => c.name),
      environment: {
        hasMongoUri,
        hasDbName,
        mongoUriStart: mongoUriStart + '...',
        dbName: process.env.DB_NAME || 'personal_finance'
      }
    });
    
  } catch (error) {
    console.error('Connection test failed:', error);
    return NextResponse.json(
      { 
        error: 'Connection test failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        environment: {
          hasMongoUri: !!process.env.MONGODB_URI,
          hasDbName: !!process.env.DB_NAME,
          mongoUriStart: process.env.MONGODB_URI?.substring(0, 20) + '...' || 'Not set',
          dbName: process.env.DB_NAME || 'personal_finance'
        }
      },
      { status: 500 }
    );
  }
}
