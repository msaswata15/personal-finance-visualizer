import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    console.log('Testing MongoDB connection...');
    
    // Check environment variables
    const hasMongoUri = !!process.env.MONGODB_URI;
    const hasDbName = !!process.env.DB_NAME;
    
    console.log('Environment check:', {
      hasMongoUri,
      hasDbName,
      dbName: process.env.DB_NAME || 'personal_finance',
      nodeEnv: process.env.NODE_ENV
    });
    
    if (!hasMongoUri) {
      return NextResponse.json(
        { error: 'MongoDB URI not found in environment variables' },
        { status: 500 }
      );
    }
    
    // Test database connection
    const db = await getDatabase();
    console.log('Database connection successful');
    
    // Test a simple operation
    const collections = await db.listCollections().toArray();
    console.log('Collections found:', collections.length);
    
    return NextResponse.json({
      success: true,
      message: 'MongoDB connection successful',
      collectionsCount: collections.length,
      collections: collections.map(c => c.name)
    });
    
  } catch (error) {
    console.error('Connection test failed:', error);
    return NextResponse.json(
      { 
        error: 'Connection test failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        hasMongoUri: !!process.env.MONGODB_URI,
        hasDbName: !!process.env.DB_NAME
      },
      { status: 500 }
    );
  }
}
