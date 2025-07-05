import { NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { PREDEFINED_CATEGORIES } from '@/types';

export async function GET() {
  try {
    console.log('Attempting to fetch categories...');
    const categories = await db.categories.findAll();
    console.log('Categories fetched successfully:', categories.length);
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      mongoUri: process.env.MONGODB_URI ? 'Set' : 'Not set',
      dbName: process.env.DB_NAME || 'personal_finance'
    });
    
    // Fallback to predefined categories if database fails
    console.log('Falling back to predefined categories');
    return NextResponse.json(PREDEFINED_CATEGORIES.map((cat, index) => ({
      ...cat,
      _id: `fallback_${index}`
    })));
  }
}
