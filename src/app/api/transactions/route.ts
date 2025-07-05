import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET() {
  try {
    console.log('Attempting to fetch transactions...');
    const transactions = await db.transactions.findAll();
    console.log('Transactions fetched successfully:', transactions.length);
    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });
    
    // Fallback to empty array if database fails
    console.log('Falling back to empty transactions array');
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('Attempting to create transaction...');
    const body = await request.json();
    console.log('Request body:', JSON.stringify(body, null, 2));
    
    // Basic validation
    if (!body.amount || !body.date || !body.description || !body.category) {
      console.log('Validation failed - missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('Creating transaction with database...');
    const transaction = await db.transactions.create({
      amount: parseFloat(body.amount),
      date: new Date(body.date),
      description: body.description,
      category: body.category,
      type: body.type || 'expense',
    });

    console.log('Transaction created successfully:', transaction._id);
    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error('Error creating transaction:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      mongoUri: process.env.MONGODB_URI ? 'Set' : 'Not set',
      dbName: process.env.DB_NAME || 'personal_finance'
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to create transaction',
        details: error instanceof Error ? error.message : 'Unknown error',
        suggestion: 'Please check your database connection or try again later'
      },
      { status: 500 }
    );
  }
}
