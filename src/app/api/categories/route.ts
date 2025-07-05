import { NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { memoryDB } from '@/lib/memory-db';

let useMemoryFallback = false;

export async function GET() {
  try {
    console.log('Attempting to fetch categories...');
    
    if (useMemoryFallback) {
      console.log('Using memory fallback for categories');
      const categories = await memoryDB.categories.findAll();
      return NextResponse.json(categories);
    }
    
    const categories = await db.categories.findAll();
    console.log('Categories fetched successfully from MongoDB:', categories.length);
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories from MongoDB:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      mongoUri: process.env.MONGODB_URI ? 'Set' : 'Not set',
      dbName: process.env.DB_NAME || 'personal_finance'
    });
    
    // Switch to memory fallback
    console.log('Switching to memory fallback for categories');
    useMemoryFallback = true;
    const categories = await memoryDB.categories.findAll();
    return NextResponse.json(categories);
  }
}
