'use client';

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Transaction, PREDEFINED_CATEGORIES } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

interface ChartsProps {
  transactions: Transaction[];
}

export function Charts({ transactions }: ChartsProps) {
  const monthlyExpenses = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const monthlyData = new Map<string, number>();

    expenses.forEach(transaction => {
      const month = new Date(transaction.date).toLocaleString('default', { 
        month: 'short', 
        year: 'numeric' 
      });
      monthlyData.set(month, (monthlyData.get(month) || 0) + transaction.amount);
    });

    return Array.from(monthlyData.entries())
      .map(([month, amount]) => ({ month, amount }))
      .sort((a, b) => {
        const dateA = new Date(a.month + ' 1');
        const dateB = new Date(b.month + ' 1');
        return dateA.getTime() - dateB.getTime();
      })
      .slice(-6); // Last 6 months
  }, [transactions]);

  const categoryExpenses = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const categoryData = new Map<string, number>();

    expenses.forEach(transaction => {
      categoryData.set(
        transaction.category, 
        (categoryData.get(transaction.category) || 0) + transaction.amount
      );
    });

    return Array.from(categoryData.entries())
      .map(([category, amount]) => ({
        category,
        amount,
        color: PREDEFINED_CATEGORIES.find(c => c.name === category)?.color || '#AED6F1'
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  const totalExpenses = categoryExpenses.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Monthly Expenses Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Expenses</CardTitle>
          <CardDescription>Your spending over the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          {monthlyExpenses.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyExpenses}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `₹${value}`} />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Amount']}
                />
                <Bar dataKey="amount" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              No expense data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Category Breakdown Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
          <CardDescription>Expenses by category</CardDescription>
        </CardHeader>
        <CardContent>
          {categoryExpenses.length > 0 ? (
            <div className="space-y-4">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryExpenses}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="amount"
                  >
                    {categoryExpenses.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), 'Amount']}
                  />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Legend */}
              <div className="space-y-2">
                {categoryExpenses.map((item) => (
                  <div key={item.category} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm">{item.category}</span>
                    </div>
                    <div className="text-sm text-right">
                      <div className="font-medium">{formatCurrency(item.amount)}</div>
                      <div className="text-gray-500">
                        {((item.amount / totalExpenses) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              No category data available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
