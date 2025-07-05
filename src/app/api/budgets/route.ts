import { NextRequest, NextResponse } from 'next/server';
import { getBudgets, createBudget } from '@/lib/database';

export async function GET() {
  try {
    console.log('Attempting to fetch budgets...');
    const budgets = await getBudgets();
    console.log('Budgets fetched successfully:', budgets.length);
    return NextResponse.json(budgets);
  } catch (error) {
    console.error('Error fetching budgets:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });
    
    // Fallback to empty array if database fails
    console.log('Falling back to empty budgets array');
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { category, amount, month, year } = body;

    if (!category || !amount || !month || !year) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const budget = await createBudget({
      category,
      amount: parseFloat(amount),
      month,
      year: parseInt(year),
    });

    return NextResponse.json(budget, { status: 201 });
  } catch (error) {
    console.error('Error creating budget:', error);
    return NextResponse.json({ error: 'Failed to create budget' }, { status: 500 });
  }
}
