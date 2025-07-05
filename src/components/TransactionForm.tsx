'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Transaction } from '@/types';
import { useCategories } from '@/hooks/useApi';
import { DollarSign, Calendar, Tag, FileText } from 'lucide-react';

const transactionSchema = z.object({
  amount: z.string().min(1, 'Amount is required').refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, 'Amount must be a positive number'),
  date: z.string().min(1, 'Date is required'),
  description: z.string().min(1, 'Description is required').max(200, 'Description must be less than 200 characters'),
  category: z.string().min(1, 'Category is required'),
  type: z.enum(['expense', 'income']),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<Transaction, '_id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  transaction?: Transaction | null;
  title: string;
}

export function TransactionForm({ open, onOpenChange, onSubmit, transaction, title }: TransactionFormProps) {
  const [loading, setLoading] = useState(false);
  const { categories } = useCategories();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      category: '',
      type: 'expense',
    },
  });

  const selectedType = watch('type');

  // Reset form when dialog opens/closes or transaction changes
  useEffect(() => {
    if (open) {
      reset({
        amount: transaction?.amount?.toString() || '',
        date: transaction?.date ? new Date(transaction.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        description: transaction?.description || '',
        category: transaction?.category || '',
        type: transaction?.type || 'expense',
      });
    }
  }, [open, transaction, reset]);

  const handleFormSubmit = async (data: TransactionFormData) => {
    try {
      setLoading(true);
      await onSubmit({
        amount: parseFloat(data.amount),
        date: new Date(data.date),
        description: data.description,
        category: data.category,
        type: data.type,
      });
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to submit transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  const availableCategories = selectedType === 'income' 
    ? [{ name: 'Income', color: '#4CAF50' }]
    : categories.filter(c => c.name !== 'Income');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {transaction ? 'Update the transaction details below.' : 'Fill in the details to add a new transaction to your finance tracker.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Transaction Type Toggle */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Transaction Type</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={selectedType === 'expense' ? 'default' : 'outline'}
                onClick={() => setValue('type', 'expense')}
                className={`w-full transition-all duration-200 ${
                  selectedType === 'expense' 
                    ? 'bg-red-500 hover:bg-red-600 text-white border-red-500' 
                    : 'bg-white hover:bg-red-50 text-red-600 border-red-200 hover:border-red-300'
                }`}
              >
                <span className="mr-2">💸</span>
                Expense
              </Button>
              <Button
                type="button"
                variant={selectedType === 'income' ? 'default' : 'outline'}
                onClick={() => setValue('type', 'income')}
                className={`w-full transition-all duration-200 ${
                  selectedType === 'income' 
                    ? 'bg-green-500 hover:bg-green-600 text-white border-green-500' 
                    : 'bg-white hover:bg-green-50 text-green-600 border-green-200 hover:border-green-300'
                }`}
              >
                <span className="mr-2">💰</span>
                Income
              </Button>
            </div>
            {errors.type && <p className="text-sm text-red-500">{errors.type.message}</p>}
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Amount
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                className="pl-8"
                {...register('amount')}
              />
            </div>
            {errors.amount && <p className="text-sm text-red-500">{errors.amount.message}</p>}
          </div>

          {/* Date Input */}
          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Date
            </Label>
            <Input
              id="date"
              type="date"
              {...register('date')}
            />
            {errors.date && <p className="text-sm text-red-500">{errors.date.message}</p>}
          </div>

          {/* Category Select */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Category
            </Label>
            <Select value={watch('category')} onValueChange={(value) => setValue('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a category" />
              </SelectTrigger>
              <SelectContent>
                {availableCategories.map((category) => (
                  <SelectItem key={category.name} value={category.name}>
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      />
                      <span>{category.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Description
            </Label>
            <Input
              id="description"
              placeholder="Enter a description (e.g., Coffee at Starbucks)"
              {...register('description')}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
          </div>

          {/* Form Actions */}
          <DialogFooter className="gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="min-w-[100px]"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </div>
              ) : (
                transaction ? 'Update Transaction' : 'Add Transaction'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
