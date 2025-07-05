// Simple in-memory storage fallback when MongoDB is unavailable
import { Transaction, Category, Budget, PREDEFINED_CATEGORIES } from '@/types';

interface InMemoryData {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
}

let memoryStorage: InMemoryData = {
  transactions: [],
  categories: PREDEFINED_CATEGORIES.map((cat, index) => ({
    ...cat,
    _id: `memory_cat_${index}`
  })),
  budgets: []
};

let nextId = 1;

export const memoryDB = {
  transactions: {
    async findAll(): Promise<Transaction[]> {
      return [...memoryStorage.transactions];
    },

    async findById(id: string): Promise<Transaction | null> {
      return memoryStorage.transactions.find(t => t._id === id) || null;
    },

    async create(transaction: Omit<Transaction, '_id' | 'createdAt' | 'updatedAt'>): Promise<Transaction> {
      const now = new Date();
      const newTransaction: Transaction = {
        ...transaction,
        _id: `memory_txn_${nextId++}`,
        createdAt: now,
        updatedAt: now,
      };
      memoryStorage.transactions.push(newTransaction);
      return newTransaction;
    },

    async update(id: string, updates: Partial<Transaction>): Promise<Transaction | null> {
      const index = memoryStorage.transactions.findIndex(t => t._id === id);
      if (index === -1) return null;
      
      const updated = {
        ...memoryStorage.transactions[index],
        ...updates,
        updatedAt: new Date(),
      };
      memoryStorage.transactions[index] = updated;
      return updated;
    },

    async delete(id: string): Promise<boolean> {
      const index = memoryStorage.transactions.findIndex(t => t._id === id);
      if (index === -1) return false;
      
      memoryStorage.transactions.splice(index, 1);
      return true;
    },
  },

  categories: {
    async findAll(): Promise<Category[]> {
      return [...memoryStorage.categories];
    },

    async create(category: Omit<Category, '_id'>): Promise<Category> {
      const newCategory: Category = {
        ...category,
        _id: `memory_cat_${nextId++}`,
      };
      memoryStorage.categories.push(newCategory);
      return newCategory;
    },

    async findById(id: string): Promise<Category | null> {
      return memoryStorage.categories.find(c => c._id === id) || null;
    },

    async update(id: string, updates: Partial<Category>): Promise<Category | null> {
      const index = memoryStorage.categories.findIndex(c => c._id === id);
      if (index === -1) return null;
      
      const updated = { ...memoryStorage.categories[index], ...updates };
      memoryStorage.categories[index] = updated;
      return updated;
    },

    async delete(id: string): Promise<boolean> {
      const index = memoryStorage.categories.findIndex(c => c._id === id);
      if (index === -1) return false;
      
      memoryStorage.categories.splice(index, 1);
      return true;
    },
  },

  budgets: {
    async findAll(): Promise<Budget[]> {
      return [...memoryStorage.budgets];
    },

    async create(budgetData: Omit<Budget, '_id' | 'createdAt' | 'updatedAt'>): Promise<Budget> {
      const now = new Date();
      const newBudget: Budget = {
        ...budgetData,
        _id: `memory_budget_${nextId++}`,
        createdAt: now,
        updatedAt: now,
      };
      memoryStorage.budgets.push(newBudget);
      return newBudget;
    },

    async findById(id: string): Promise<Budget | null> {
      return memoryStorage.budgets.find(b => b._id === id) || null;
    },

    async findByMonthYear(month: string, year: number): Promise<Budget[]> {
      return memoryStorage.budgets.filter(b => b.month === month && b.year === year);
    },

    async update(id: string, updates: Partial<Budget>): Promise<Budget | null> {
      const index = memoryStorage.budgets.findIndex(b => b._id === id);
      if (index === -1) return null;
      
      const updated = {
        ...memoryStorage.budgets[index],
        ...updates,
        updatedAt: new Date(),
      };
      memoryStorage.budgets[index] = updated;
      return updated;
    },

    async delete(id: string): Promise<boolean> {
      const index = memoryStorage.budgets.findIndex(b => b._id === id);
      if (index === -1) return false;
      
      memoryStorage.budgets.splice(index, 1);
      return true;
    },
  },
};

// Reset function for testing
export function resetMemoryStorage() {
  memoryStorage = {
    transactions: [],
    categories: PREDEFINED_CATEGORIES.map((cat, index) => ({
      ...cat,
      _id: `memory_cat_${index}`
    })),
    budgets: []
  };
  nextId = 1;
}
