import { Transaction, Category, PREDEFINED_CATEGORIES } from '@/types';

// Mock data store - In production, this would be replaced with MongoDB
const transactionsStore: Transaction[] = [
  {
    _id: '1',
    amount: 25.99,
    date: new Date('2024-12-15'),
    description: 'Lunch at restaurant',
    category: 'Food & Dining',
    type: 'expense',
    createdAt: new Date('2024-12-15'),
    updatedAt: new Date('2024-12-15'),
  },
  {
    _id: '2',
    amount: 89.50,
    date: new Date('2024-12-10'),
    description: 'Grocery shopping',
    category: 'Food & Dining',
    type: 'expense',
    createdAt: new Date('2024-12-10'),
    updatedAt: new Date('2024-12-10'),
  },
  {
    _id: '3',
    amount: 3000,
    date: new Date('2024-12-01'),
    description: 'Monthly salary',
    category: 'Income',
    type: 'income',
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    _id: '4',
    amount: 45.00,
    date: new Date('2024-12-08'),
    description: 'Gas for car',
    category: 'Transportation',
    type: 'expense',
    createdAt: new Date('2024-12-08'),
    updatedAt: new Date('2024-12-08'),
  },
  {
    _id: '5',
    amount: 120.00,
    date: new Date('2024-11-25'),
    description: 'Electricity bill',
    category: 'Bills & Utilities',
    type: 'expense',
    createdAt: new Date('2024-11-25'),
    updatedAt: new Date('2024-11-25'),
  },
];

const categories: Category[] = [...PREDEFINED_CATEGORIES];

// Simulate async operations
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockDB = {
  transactions: {
    async findAll(): Promise<Transaction[]> {
      await delay(100);
      return [...transactionsStore].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    },

    async findById(id: string): Promise<Transaction | null> {
      await delay(50);
      return transactionsStore.find((t: Transaction) => t._id === id) || null;
    },

    async create(transaction: Omit<Transaction, '_id' | 'createdAt' | 'updatedAt'>): Promise<Transaction> {
      await delay(100);
      const newTransaction: Transaction = {
        ...transaction,
        _id: (transactionsStore.length + 1).toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      transactionsStore.push(newTransaction);
      return newTransaction;
    },

    async update(id: string, updates: Partial<Transaction>): Promise<Transaction | null> {
      await delay(100);
      const index = transactionsStore.findIndex((t: Transaction) => t._id === id);
      if (index === -1) return null;
      
      transactionsStore[index] = {
        ...transactionsStore[index],
        ...updates,
        updatedAt: new Date(),
      };
      return transactionsStore[index];
    },

    async delete(id: string): Promise<boolean> {
      await delay(100);
      const index = transactionsStore.findIndex((t: Transaction) => t._id === id);
      if (index === -1) return false;
      
      transactionsStore.splice(index, 1);
      return true;
    },
  },

  categories: {
    async findAll(): Promise<Category[]> {
      await delay(50);
      return [...categories];
    },
  },
};
