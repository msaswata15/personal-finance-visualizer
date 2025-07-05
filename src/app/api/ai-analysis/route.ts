import { NextResponse } from 'next/server';
import { FinancialAIAnalyzer } from '@/lib/aiAnalyzer';
import { getAllTransactions, getBudgets } from '@/lib/database';

export async function POST() {
  try {
    // Get all transactions and budgets
    const [transactions, budgets] = await Promise.all([
      getAllTransactions(),
      getBudgets()
    ]);

    // Initialize AI analyzer
    const analyzer = new FinancialAIAnalyzer();
    
    // Get AI analysis
    const analysis = await analyzer.analyzeFinances(transactions, budgets);
    
    return NextResponse.json(analysis);
  } catch (error) {
    console.error('AI Analysis API Error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze finances. Please try again.' },
      { status: 500 }
    );
  }
}
