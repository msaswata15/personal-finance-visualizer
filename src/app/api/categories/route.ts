import { NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { PREDEFINED_CATEGORIES } from '@/types';

export async function GET() {
  try {
    console.log('=== Categories API called ===');
    console.log('Environment:', process.env.NODE_ENV);
    console.log('MongoDB URI exists:', !!process.env.MONGODB_URI);
    console.log('Vercel ENV:', process.env.VERCEL_ENV);
    
    // Add timeout to prevent infinite hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Categories API timeout')), 25000);
    });
    
    const categoriesPromise = db.categories.findAll();
    
    const categories = await Promise.race([categoriesPromise, timeoutPromise]);
    
    console.log('Categories fetched successfully:', Array.isArray(categories) ? categories.length : 'Invalid response');
    
    // If no categories found, return predefined categories
    if (!Array.isArray(categories) || categories.length === 0) {
      console.log('No categories found, returning predefined categories');
      return NextResponse.json(PREDEFINED_CATEGORIES);
    }
    
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      name: error instanceof Error ? error.name : 'Unknown error type'
    });
    
    // Return predefined categories as fallback
    console.log('Returning predefined categories as fallback');
    return NextResponse.json(PREDEFINED_CATEGORIES);
  }
}

export async function POST(request: Request) {
  try {
    const { name, color } = await request.json();
    
    if (!name || !color) {
      return NextResponse.json(
        { error: 'Name and color are required' },
        { status: 400 }
      );
    }
    
    const category = await db.categories.create({ name, color });
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
