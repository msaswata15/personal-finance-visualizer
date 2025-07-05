'use client';

import { useMemo } from 'react';
import { Transaction, Budget } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Calendar, DollarSign } from 'lucide-react';

interface SpendingInsightsProps {
  transactions: Transaction[];
  budgets: Budget[];
}

export function SpendingInsights({ transactions, budgets }: SpendingInsightsProps) {
  const insights = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = new Date(currentYear, currentMonth - 1);
    
    // Current month transactions
    const currentMonthTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });
    
    // Last month transactions
    const lastMonthTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === lastMonth.getMonth() && date.getFullYear() === lastMonth.getFullYear();
    });
    
    // Calculate spending by category for current month
    const currentMonthSpending = currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);
    
    // Calculate spending by category for last month
    const lastMonthSpending = lastMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);
    
    // Total spending comparison
    const currentTotal = Object.values(currentMonthSpending).reduce((sum, amount) => sum + amount, 0);
    const lastTotal = Object.values(lastMonthSpending).reduce((sum, amount) => sum + amount, 0);
    const spendingChange = lastTotal > 0 ? ((currentTotal - lastTotal) / lastTotal) * 100 : 0;
    
    // Budget analysis
    const currentMonthBudgets = budgets.filter(b => 
      b.month === (currentMonth + 1).toString().padStart(2, '0') && 
      b.year === currentYear
    );
    
    const budgetAnalysis = currentMonthBudgets.map(budget => {
      const spent = currentMonthSpending[budget.category] || 0;
      const remaining = budget.amount - spent;
      const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
      
      return {
        category: budget.category,
        budget: budget.amount,
        spent,
        remaining,
        percentage,
        status: percentage > 100 ? 'over' : percentage > 80 ? 'warning' : 'good'
      };
    });
    
    // Top spending categories
    const topCategories = Object.entries(currentMonthSpending)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([category, amount]) => ({ category, amount }));
    
    // Category trends
    const categoryTrends = Object.keys(currentMonthSpending).map(category => {
      const current = currentMonthSpending[category] || 0;
      const last = lastMonthSpending[category] || 0;
      const change = last > 0 ? ((current - last) / last) * 100 : 0;
      
      return {
        category,
        current,
        change,
        trend: change > 10 ? 'up' : change < -10 ? 'down' : 'stable'
      };
    }).sort((a, b) => Math.abs(b.change) - Math.abs(a.change)).slice(0, 5);
    
    return {
      spendingChange,
      currentTotal,
      lastTotal,
      budgetAnalysis,
      topCategories,
      categoryTrends,
      overBudgetCount: budgetAnalysis.filter(b => b.status === 'over').length,
      warningCount: budgetAnalysis.filter(b => b.status === 'warning').length,
    };
  }, [transactions, budgets]);

  const currentMonthName = new Date().toLocaleString('default', { month: 'long' });
  const lastMonthName = new Date(new Date().getFullYear(), new Date().getMonth() - 1).toLocaleString('default', { month: 'long' });

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold">{formatCurrency(insights.currentTotal)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">vs Last Month</p>
                <div className="flex items-center gap-2">
                  <p className={`text-2xl font-bold ${insights.spendingChange > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {insights.spendingChange > 0 ? '+' : ''}{insights.spendingChange.toFixed(1)}%
                  </p>
                  {insights.spendingChange > 0 ? (
                    <TrendingUp className="h-5 w-5 text-red-500" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-green-500" />
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Over Budget</p>
                <p className="text-2xl font-bold text-red-600">{insights.overBudgetCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">On Track</p>
                <p className="text-2xl font-bold text-green-600">
                  {insights.budgetAnalysis.filter(b => b.status === 'good').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Status */}
      {insights.budgetAnalysis.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Budget Status</CardTitle>
            <CardDescription>How you're doing against your {currentMonthName} budgets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.budgetAnalysis.map((budget) => (
                <div key={budget.category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      budget.status === 'over' ? 'bg-red-500' : 
                      budget.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                    }`} />
                    <div>
                      <span className="font-medium">{budget.category}</span>
                      <div className="text-sm text-gray-600">
                        {formatCurrency(budget.spent)} of {formatCurrency(budget.budget)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${
                      budget.status === 'over' ? 'text-red-600' : 
                      budget.status === 'warning' ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {budget.percentage.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-500">
                      {budget.remaining >= 0 ? `${formatCurrency(budget.remaining)} left` : `${formatCurrency(Math.abs(budget.remaining))} over`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Spending Categories */}
      {insights.topCategories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Spending Categories</CardTitle>
            <CardDescription>Your biggest expenses this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.topCategories.map((category, index) => (
                <div key={category.category} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                    </div>
                    <span className="font-medium">{category.category}</span>
                  </div>
                  <span className="font-bold">{formatCurrency(category.amount)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category Trends */}
      {insights.categoryTrends.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Spending Trends</CardTitle>
            <CardDescription>How your spending has changed from {lastMonthName} to {currentMonthName}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.categoryTrends.map((trend) => (
                <div key={trend.category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      trend.trend === 'up' ? 'bg-red-500' : 
                      trend.trend === 'down' ? 'bg-green-500' : 'bg-gray-500'
                    }`} />
                    <div>
                      <span className="font-medium">{trend.category}</span>
                      <div className="text-sm text-gray-600">
                        {formatCurrency(trend.current)} this month
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${
                      trend.change > 0 ? 'text-red-600' : trend.change < 0 ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      {trend.change > 0 ? '+' : ''}{trend.change.toFixed(1)}%
                    </span>
                    {trend.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-red-500" />
                    ) : trend.trend === 'down' ? (
                      <TrendingDown className="h-4 w-4 text-green-500" />
                    ) : (
                      <div className="w-4 h-4" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
