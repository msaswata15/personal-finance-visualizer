import { ObjectId } from 'mongodb';

export interface Transaction {
  _id?: string | ObjectId;
  amount: number;
  date: Date;
  description: string;
  category: string;
  type: 'expense' | 'income';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Category {
  _id?: string | ObjectId;
  name: string;
  color: string;
  budget?: number;
}

export interface MonthlyExpense {
  month: string;
  amount: number;
}

export interface CategoryExpense {
  category: string;
  amount: number;
  color: string;
}

export interface Budget {
  _id?: string | ObjectId;
  category: string;
  amount: number;
  month: string;
  year: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export const PREDEFINED_CATEGORIES: Category[] = [
  { name: 'Food & Dining', color: '#FF6B6B' },
  { name: 'Transportation', color: '#4ECDC4' },
  { name: 'Shopping', color: '#45B7D1' },
  { name: 'Entertainment', color: '#96CEB4' },
  { name: 'Bills & Utilities', color: '#FFEAA7' },
  { name: 'Healthcare', color: '#DDA0DD' },
  { name: 'Education', color: '#98D8C8' },
  { name: 'Travel', color: '#F7DC6F' },
  { name: 'Investment', color: '#BB8FCE' },
  { name: 'Other', color: '#AED6F1' },
];
