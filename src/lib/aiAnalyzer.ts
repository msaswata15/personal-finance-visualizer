import { GoogleGenerativeAI } from '@google/generative-ai';
import { Transaction, Budget } from '@/types';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface FinancialAnalysis {
    overallScore: number; // 0-100
    summary: string;
    strengths: string[];
    concerns: string[];
    recommendations: string[];
    budgetingAdvice: string;
    savingsGoals: string[];
    spendingPatterns: {
        insight: string;
        suggestion: string;
    }[];
}

interface FinancialSummary {
  currentMonthIncome: number;
  currentMonthExpenses: number;
  savingsRate: number;
  totalBudget: number;
  categoryExpenses: Record<string, number>;
  budgetVsActual: Array<{ category: string; budgeted: number; spent: number; overBudget: boolean; }>;
  monthlyTrends: Array<{ month: string; income: number; expenses: number; }>;
  transactionCount: number;
  avgTransactionAmount: number;
}

export class FinancialAIAnalyzer {
    private model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    async analyzeFinances(
        transactions: Transaction[],
        budgets: Budget[]
    ): Promise<FinancialAnalysis> {
        try {
            // Prepare financial data summary
            const financialSummary = this.prepareSummary(transactions, budgets);

            // Create detailed prompt for Gemini
            const prompt = this.createAnalysisPrompt(financialSummary);

            // Get AI analysis
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const analysisText = response.text();

            // Parse the structured response
            return this.parseAnalysis(analysisText);
        } catch (error) {
            console.error('AI Analysis Error:', error);
            return this.getFallbackAnalysis(transactions);
        }
    }

    private prepareSummary(transactions: Transaction[], budgets: Budget[]): FinancialSummary {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        // Current month transactions
        const currentMonthTransactions = transactions.filter(t => {
            const date = new Date(t.date);
            return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        });

        // Calculate metrics
        const currentMonthIncome = currentMonthTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const currentMonthExpenses = currentMonthTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const categoryExpenses = currentMonthTransactions
            .filter(t => t.type === 'expense')
            .reduce((acc, t) => {
                acc[t.category] = (acc[t.category] || 0) + t.amount;
                return acc;
            }, {} as Record<string, number>);

        // Budget analysis
        const currentBudgets = budgets.filter(b =>
            b.month === (currentMonth + 1).toString().padStart(2, '0') &&
            b.year === currentYear
        );

        const budgetVsActual = currentBudgets.map(budget => ({
            category: budget.category,
            budgeted: budget.amount,
            spent: categoryExpenses[budget.category] || 0,
            overBudget: (categoryExpenses[budget.category] || 0) > budget.amount
        }));

        // Monthly trends
        const monthlyTrends = [];
        for (let i = 0; i < 3; i++) {
            const targetDate = new Date(currentYear, currentMonth - i, 1);
            const monthTransactions = transactions.filter(t => {
                const date = new Date(t.date);
                return date.getMonth() === targetDate.getMonth() &&
                    date.getFullYear() === targetDate.getFullYear();
            });

            monthlyTrends.push({
                month: targetDate.toLocaleString('default', { month: 'long', year: 'numeric' }),
                income: monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
                expenses: monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
            });
        }

        return {
            currentMonthIncome,
            currentMonthExpenses,
            savingsRate: currentMonthIncome > 0 ? ((currentMonthIncome - currentMonthExpenses) / currentMonthIncome) * 100 : 0,
            categoryExpenses,
            budgetVsActual,
            monthlyTrends,
            totalBudget: currentBudgets.reduce((sum, b) => sum + b.amount, 0),
            transactionCount: transactions.length,
            avgTransactionAmount: transactions.length > 0 ? transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length : 0
        };
    }

    private createAnalysisPrompt(summary: FinancialSummary): string {
        return `
You are a professional financial advisor analyzing someone's personal finances. Based on the following financial data, provide a comprehensive analysis in JSON format.

FINANCIAL DATA:
- Current Month Income: ₹${summary.currentMonthIncome}
- Current Month Expenses: ₹${summary.currentMonthExpenses}
- Savings Rate: ${summary.savingsRate.toFixed(1)}%
- Total Budget Set: ₹${summary.totalBudget}
- Category Expenses: ${JSON.stringify(summary.categoryExpenses)}
- Budget vs Actual: ${JSON.stringify(summary.budgetVsActual)}
- Monthly Trends: ${JSON.stringify(summary.monthlyTrends)}

Please analyze this data and respond with a JSON object containing exactly these fields:
{
  "overallScore": [number 0-100 based on financial health],
  "summary": "[2-3 sentence overall assessment]",
  "strengths": ["[strength 1]", "[strength 2]", "[strength 3]"],
  "concerns": ["[concern 1]", "[concern 2]", "[concern 3]"],
  "recommendations": ["[recommendation 1]", "[recommendation 2]", "[recommendation 3]", "[recommendation 4]"],
  "budgetingAdvice": "[specific budgeting advice paragraph]",
  "savingsGoals": ["[goal 1]", "[goal 2]", "[goal 3]"],
  "spendingPatterns": [
    {"insight": "[pattern insight]", "suggestion": "[actionable suggestion]"},
    {"insight": "[pattern insight]", "suggestion": "[actionable suggestion]"}
  ]
}

Focus on:
1. Savings rate analysis (ideal: 20%+)
2. Budget adherence
3. Spending patterns and trends
4. Income vs expenses balance
5. Category-wise spending efficiency
6. Practical, actionable advice
7. Indian financial context and rupee amounts

Be encouraging but honest. Provide specific, actionable recommendations.
`;
    }

    private parseAnalysis(responseText: string): FinancialAnalysis {
        try {
            // Clean the response text
            const cleanText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            const parsed = JSON.parse(cleanText);

            return {
                overallScore: Math.min(100, Math.max(0, parsed.overallScore || 0)),
                summary: parsed.summary || 'Analysis completed successfully.',
                strengths: parsed.strengths || [],
                concerns: parsed.concerns || [],
                recommendations: parsed.recommendations || [],
                budgetingAdvice: parsed.budgetingAdvice || 'Continue monitoring your spending patterns.',
                savingsGoals: parsed.savingsGoals || [],
                spendingPatterns: parsed.spendingPatterns || []
            };
        } catch (error) {
            console.error('Failed to parse AI response:', error);
            throw new Error('Failed to parse AI analysis');
        }
    }

    private getFallbackAnalysis(transactions: Transaction[]): FinancialAnalysis {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const currentMonthTransactions = transactions.filter(t => {
            const date = new Date(t.date);
            return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        });

        const income = currentMonthTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const expenses = currentMonthTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;

        return {
            overallScore: savingsRate > 20 ? 85 : savingsRate > 10 ? 70 : 55,
            summary: 'Your financial data has been analyzed. Consider setting up budgets and tracking your expenses more closely.',
            strengths: ['Regular transaction tracking', 'Organized expense categories'],
            concerns: ['Review spending patterns', 'Consider budget optimization'],
            recommendations: [
                'Set monthly budgets for all expense categories',
                'Aim for 20% savings rate',
                'Review and categorize all transactions',
                'Track monthly spending trends'
            ],
            budgetingAdvice: 'Start with the 50/30/20 rule: 50% needs, 30% wants, 20% savings.',
            savingsGoals: ['Build emergency fund', 'Increase monthly savings', 'Reduce unnecessary expenses'],
            spendingPatterns: [
                {
                    insight: 'Monitor your largest expense categories',
                    suggestion: 'Focus on reducing your top 2-3 spending categories'
                }
            ]
        };
    }
}
