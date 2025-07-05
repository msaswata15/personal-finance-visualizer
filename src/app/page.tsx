'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TransactionForm } from '@/components/TransactionForm';
import { TransactionList } from '@/components/TransactionList';
import { Charts } from '@/components/Charts';
import { SummaryCards } from '@/components/SummaryCards';
import { BudgetManagement } from '@/components/BudgetManagement';
import { BudgetVsActual } from '@/components/BudgetVsActual';
import { SpendingInsights } from '@/components/SpendingInsights';
import { AIFinancialAnalyzer } from '@/components/AIFinancialAnalyzer';
import { useTransactions, useBudgets } from '@/hooks/useApi';
import { Plus, Target, TrendingUp, BarChart3, Brain } from 'lucide-react';

export default function Home() {
  const [formOpen, setFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'budgets' | 'insights' | 'ai-analyzer'>('dashboard');
  const { 
    transactions, 
    loading: transactionsLoading, 
    error: transactionsError, 
    createTransaction, 
    updateTransaction, 
    deleteTransaction 
  } = useTransactions();
  
  const {
    budgets,
    loading: budgetsLoading,
    error: budgetsError,
    createBudget,
    updateBudget,
    deleteBudget
  } = useBudgets();

  if (transactionsError || budgetsError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
            <CardDescription>Failed to load data</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">{transactionsError || budgetsError}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Personal Finance Tracker</h1>
              <p className="text-gray-600 mt-1">Track your expenses and manage your budget</p>
            </div>
            <Button onClick={() => setFormOpen(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Transaction
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'dashboard' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('budgets')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'budgets' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Target className="h-4 w-4" />
              Budgets
            </button>
            <button
              onClick={() => setActiveTab('insights')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'insights' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <TrendingUp className="h-4 w-4" />
              Insights
            </button>
            <button
              onClick={() => setActiveTab('ai-analyzer')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'ai-analyzer' 
                  ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50'
              }`}
            >
              <Brain className="h-4 w-4" />
              AI Analyzer
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Summary Cards */}
            <SummaryCards transactions={transactions} />

            {/* Budget vs Actual */}
            <BudgetVsActual transactions={transactions} budgets={budgets} />

            {/* Charts */}
            <Charts transactions={transactions} />

            {/* Transaction List */}
            <TransactionList
              transactions={transactions}
              onEdit={updateTransaction}
              onDelete={deleteTransaction}
              loading={transactionsLoading}
            />
          </div>
        )}

        {activeTab === 'budgets' && (
          <BudgetManagement
            budgets={budgets}
            onCreateBudget={createBudget}
            onUpdateBudget={updateBudget}
            onDeleteBudget={deleteBudget}
            loading={budgetsLoading}
          />
        )}

        {activeTab === 'insights' && (
          <SpendingInsights transactions={transactions} budgets={budgets} />
        )}

        {activeTab === 'ai-analyzer' && (
          <AIFinancialAnalyzer />
        )}

        {/* Transaction Form Modal */}
        <TransactionForm
          open={formOpen}
          onOpenChange={setFormOpen}
          onSubmit={createTransaction}
          transaction={null}
          title="Add New Transaction"
        />
      </div>
    </div>
  );
}
