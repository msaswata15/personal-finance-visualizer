'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BudgetForm } from './BudgetForm';
import { Budget } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Plus, Edit, Trash2, Target } from 'lucide-react';

interface BudgetManagementProps {
  budgets: Budget[];
  onCreateBudget: (budget: Omit<Budget, '_id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onUpdateBudget: (id: string, updates: Partial<Budget>) => Promise<void>;
  onDeleteBudget: (id: string) => Promise<void>;
  loading?: boolean;
}

export function BudgetManagement({ 
  budgets, 
  onCreateBudget, 
  onUpdateBudget, 
  onDeleteBudget, 
  loading 
}: BudgetManagementProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setFormOpen(true);
  };

  const handleFormSubmit = async (data: Omit<Budget, '_id' | 'createdAt' | 'updatedAt'>) => {
    if (editingBudget) {
      await onUpdateBudget(editingBudget._id?.toString() || '', data);
    } else {
      await onCreateBudget(data);
    }
    setEditingBudget(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      await onDeleteBudget(id);
    }
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditingBudget(null);
  };

  // Group budgets by month-year
  const groupedBudgets = budgets.reduce((acc, budget) => {
    const key = `${budget.month}-${budget.year}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(budget);
    return acc;
  }, {} as Record<string, Budget[]>);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Budget Management
            </CardTitle>
            <CardDescription>Set and manage your monthly budgets</CardDescription>
          </div>
          <Button onClick={() => setFormOpen(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Budget
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : Object.keys(groupedBudgets).length === 0 ? (
          <div className="text-center py-8">
            <Target className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No budgets set</h3>
            <p className="text-gray-600 mb-4">Start by setting budgets for your expense categories</p>
            <Button onClick={() => setFormOpen(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Set Your First Budget
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedBudgets)
              .sort(([a], [b]) => {
                const [monthA, yearA] = a.split('-');
                const [monthB, yearB] = b.split('-');
                return parseInt(yearB) - parseInt(yearA) || parseInt(monthB) - parseInt(monthA);
              })
              .map(([monthYear, monthBudgets]) => {
                const [month, year] = monthYear.split('-');
                const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleString('default', { month: 'long' });
                const totalBudget = monthBudgets.reduce((sum, b) => sum + b.amount, 0);

                return (
                  <div key={monthYear} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {monthName} {year}
                      </h3>
                      <div className="text-sm text-gray-600">
                        Total: {formatCurrency(totalBudget)}
                      </div>
                    </div>
                    
                    <div className="grid gap-3">
                      {monthBudgets.map((budget) => (
                        <div key={budget._id?.toString()} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-blue-500" />
                            <div>
                              <span className="font-medium">{budget.category}</span>
                              <div className="text-sm text-gray-600">
                                {formatCurrency(budget.amount)}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(budget)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => budget._id && handleDelete(budget._id.toString())}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </CardContent>

      {/* Budget Form Modal */}
      <BudgetForm
        open={formOpen}
        onOpenChange={handleFormClose}
        onSubmit={handleFormSubmit}
        budget={editingBudget}
        title={editingBudget ? 'Edit Budget' : 'Add Budget'}
      />
    </Card>
  );
}
