import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { memoryDB } from '@/lib/memory-db';

let useMemoryFallback = false;

export async function GET() {
  try {
    console.log('Attempting to fetch transactions...');
    
    if (useMemoryFallback) {
      console.log('Using memory fallback for transactions');
      const transactions = await memoryDB.transactions.findAll();
      return NextResponse.json(transactions);
    }
    
    const transactions = await db.transactions.findAll();
    console.log('Transactions fetched successfully from MongoDB:', transactions.length);
    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions from MongoDB:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });
    
    // Switch to memory fallback
    console.log('Switching to memory fallback for transactions');
    useMemoryFallback = true;
    const transactions = await memoryDB.transactions.findAll();
    return NextResponse.json(transactions);
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

    const transactionData = {
      amount: parseFloat(body.amount),
      date: new Date(body.date),
      description: body.description,
      category: body.category,
      type: body.type || 'expense',
    };

    if (useMemoryFallback) {
      console.log('Using memory fallback to create transaction');
      const transaction = await memoryDB.transactions.create(transactionData);
      console.log('Transaction created in memory:', transaction._id);
      return NextResponse.json(transaction, { status: 201 });
    }

    console.log('Creating transaction with MongoDB...');
    try {
      const transaction = await db.transactions.create(transactionData);
      console.log('Transaction created successfully in MongoDB:', transaction._id);
      return NextResponse.json(transaction, { status: 201 });
    } catch (dbError) {
      console.log('MongoDB failed, switching to memory fallback:', dbError instanceof Error ? dbError.message : 'Unknown error');
      useMemoryFallback = true;
      const transaction = await memoryDB.transactions.create(transactionData);
      console.log('Transaction created in memory fallback:', transaction._id);
      return NextResponse.json(transaction, { status: 201 });
    }
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
