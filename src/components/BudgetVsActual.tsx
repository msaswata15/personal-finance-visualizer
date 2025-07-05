'use client';

import { useMemo } from 'react';
import { ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Transaction, Budget, PREDEFINED_CATEGORIES } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

interface BudgetVsActualProps {
  transactions: Transaction[];
  budgets: Budget[];
}

export function BudgetVsActual({ transactions, budgets }: BudgetVsActualProps) {
  const currentMonth = new Date().toLocaleString('default', { month: '2-digit' });
  const currentYear = new Date().getFullYear();
  const currentMonthName = new Date().toLocaleString('default', { month: 'long' });

  const budgetData = useMemo(() => {
    // Filter current month's budgets
    const currentBudgets = budgets.filter(b => 
      b.month === currentMonth && b.year === currentYear
    );

    // Calculate actual expenses for current month
    const currentMonthExpenses = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return (
        t.type === 'expense' &&
        transactionDate.getMonth() === new Date().getMonth() &&
        transactionDate.getFullYear() === currentYear
      );
    });

    // Group expenses by category
    const actualByCategory = currentMonthExpenses.reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    }, {} as Record<string, number>);

    // Combine budget and actual data
    const categories = Array.from(new Set([
      ...currentBudgets.map(b => b.category),
      ...Object.keys(actualByCategory)
    ]));

    return categories.map(category => {
      const budget = currentBudgets.find(b => b.category === category);
      const actual = actualByCategory[category] || 0;
      const budgetAmount = budget?.amount || 0;
      const categoryColor = PREDEFINED_CATEGORIES.find(c => c.name === category)?.color || '#AED6F1';

      return {
        category,
        budget: budgetAmount,
        actual: actual,
        remaining: Math.max(0, budgetAmount - actual),
        overbudget: Math.max(0, actual - budgetAmount),
        color: categoryColor,
      };
    }).filter(item => item.budget > 0 || item.actual > 0);
  }, [transactions, budgets, currentMonth, currentYear]);

  const totalBudget = budgetData.reduce((sum, item) => sum + item.budget, 0);
  const totalActual = budgetData.reduce((sum, item) => sum + item.actual, 0);
  const totalRemaining = totalBudget - totalActual;

  if (budgetData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Budget vs Actual</CardTitle>
          <CardDescription>No budget data available for {currentMonthName} {currentYear}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-gray-500">
            Set budgets to see spending comparison
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget vs Actual</CardTitle>
        <CardDescription>
          {currentMonthName} {currentYear} - {totalRemaining >= 0 ? `${formatCurrency(totalRemaining)} remaining` : `${formatCurrency(Math.abs(totalRemaining))} over budget`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-blue-600 font-medium">Total Budget</div>
              <div className="text-2xl font-bold text-blue-700">{formatCurrency(totalBudget)}</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-sm text-orange-600 font-medium">Total Spent</div>
              <div className="text-2xl font-bold text-orange-700">{formatCurrency(totalActual)}</div>
            </div>
            <div className={`p-4 rounded-lg ${totalRemaining >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className={`text-sm font-medium ${totalRemaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalRemaining >= 0 ? 'Remaining' : 'Over Budget'}
              </div>
              <div className={`text-2xl font-bold ${totalRemaining >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                {formatCurrency(Math.abs(totalRemaining))}
              </div>
            </div>
          </div>

          {/* Chart */}
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={budgetData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="category" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tickFormatter={(value) => `₹${value}`} />
              <Tooltip 
                formatter={(value: number, name: string) => {
                  const displayName = name === 'budget' ? 'Budget' : 
                                   name === 'actual' ? 'Actual' : name;
                  return [formatCurrency(value), displayName];
                }}
              />
              <Legend />
              <Bar dataKey="budget" fill="#3B82F6" name="Budget" />
              <Bar dataKey="actual" fill="#F59E0B" name="Actual" />
              <Bar dataKey="overbudget" fill="#EF4444" name="Over Budget" stackId="over" />
            </ComposedChart>
          </ResponsiveContainer>

          {/* Category Details */}
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900">Category Breakdown</h4>
            {budgetData.map((item) => (
              <div key={item.category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-medium">{item.category}</span>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-gray-600">
                    Budget: {formatCurrency(item.budget)}
                  </div>
                  <div className="text-gray-600">
                    Spent: {formatCurrency(item.actual)}
                  </div>
                  <div className={`font-medium ${
                    item.actual <= item.budget ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {item.actual <= item.budget 
                      ? `${formatCurrency(item.remaining)} left`
                      : `${formatCurrency(item.overbudget)} over`
                    }
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
