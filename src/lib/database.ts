import { Collection, ObjectId, WithId } from 'mongodb';
import { getDatabase } from './mongodb';
import { Transaction, Category, Budget, PREDEFINED_CATEGORIES } from '@/types';

// MongoDB document interfaces
interface TransactionDoc {
  amount: number;
  date: Date;
  description: string;
  category: string;
  type: 'expense' | 'income';
  createdAt?: Date;
  updatedAt?: Date;
}

interface CategoryDoc {
  name: string;
  color: string;
  budget?: number;
}

interface BudgetDoc {
  category: string;
  amount: number;
  month: string;
  year: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Database collections
export async function getTransactionsCollection(): Promise<Collection<TransactionDoc>> {
  const db = await getDatabase();
  return db.collection<TransactionDoc>('transactions');
}

export async function getCategoriesCollection(): Promise<Collection<CategoryDoc>> {
  const db = await getDatabase();
  return db.collection<CategoryDoc>('categories');
}

export async function getBudgetsCollection(): Promise<Collection<BudgetDoc>> {
  const db = await getDatabase();
  return db.collection<BudgetDoc>('budgets');
}

// Helper functions to convert between DB documents and app types
function dbTransactionToApp(doc: WithId<TransactionDoc>): Transaction {
  return {
    ...doc,
    _id: doc._id.toString(),
  };
}

function dbCategoryToApp(doc: WithId<CategoryDoc>): Category {
  return {
    ...doc,
    _id: doc._id.toString(),
  };
}

function dbBudgetToApp(doc: WithId<BudgetDoc>): Budget {
  return {
    ...doc,
    _id: doc._id.toString(),
  };
}

// Initialize categories if they don't exist
export async function initializeCategories(): Promise<void> {
  const categoriesCollection = await getCategoriesCollection();
  const existingCategoriesCount = await categoriesCollection.countDocuments();
  
  if (existingCategoriesCount === 0) {
    await categoriesCollection.insertMany(PREDEFINED_CATEGORIES.map(cat => ({
      name: cat.name,
      color: cat.color,
      budget: cat.budget,
    })));
  }
}

// Database operations
export const db = {
  transactions: {
    async findAll(): Promise<Transaction[]> {
      const collection = await getTransactionsCollection();
      const transactions = await collection.find({}).sort({ date: -1 }).toArray();
      return transactions.map(dbTransactionToApp);
    },

    async findById(id: string): Promise<Transaction | null> {
      const collection = await getTransactionsCollection();
      const transaction = await collection.findOne({ _id: new ObjectId(id) });
      return transaction ? dbTransactionToApp(transaction) : null;
    },

    async create(transaction: Omit<Transaction, '_id' | 'createdAt' | 'updatedAt'>): Promise<Transaction> {
      const collection = await getTransactionsCollection();
      const now = new Date();
      const newTransaction: TransactionDoc = {
        ...transaction,
        createdAt: now,
        updatedAt: now,
      };
      
      const result = await collection.insertOne(newTransaction);
      return {
        ...newTransaction,
        _id: result.insertedId.toString(),
      };
    },

    async update(id: string, updates: Partial<Transaction>): Promise<Transaction | null> {
      const collection = await getTransactionsCollection();
      const updateData: Partial<TransactionDoc> = {
        ...updates,
        updatedAt: new Date(),
      };
      // Remove _id from updates if present
      delete (updateData as any)._id;
      
      const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: 'after' }
      );
      
      return result ? dbTransactionToApp(result) : null;
    },

    async delete(id: string): Promise<boolean> {
      const collection = await getTransactionsCollection();
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount === 1;
    },
  },

  categories: {
    async findAll(): Promise<Category[]> {
      // Initialize categories if needed
      await initializeCategories();
      
      const collection = await getCategoriesCollection();
      const categories = await collection.find({}).toArray();
      return categories.map(dbCategoryToApp);
    },

    async create(category: Omit<Category, '_id'>): Promise<Category> {
      const collection = await getCategoriesCollection();
      const categoryDoc: CategoryDoc = {
        name: category.name,
        color: category.color,
        budget: category.budget,
      };
      const result = await collection.insertOne(categoryDoc);
      return {
        ...categoryDoc,
        _id: result.insertedId.toString(),
      };
    },

    async update(id: string, updates: Partial<Category>): Promise<Category | null> {
      const collection = await getCategoriesCollection();
      const updateData: Partial<CategoryDoc> = {
        name: updates.name,
        color: updates.color,
        budget: updates.budget,
      };
      
      const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: 'after' }
      );
      
      return result ? dbCategoryToApp(result) : null;
    },

    async delete(id: string): Promise<boolean> {
      const collection = await getCategoriesCollection();
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount === 1;
    },

    async findById(id: string): Promise<Category | null> {
      const collection = await getCategoriesCollection();
      const category = await collection.findOne({ _id: new ObjectId(id) });
      return category ? dbCategoryToApp(category) : null;
    },
  },

  budgets: {
    async create(budgetData: Omit<Budget, '_id' | 'createdAt' | 'updatedAt'>): Promise<Budget> {
      const collection = await getBudgetsCollection();
      const now = new Date();
      
      const doc: BudgetDoc = {
        ...budgetData,
        createdAt: now,
        updatedAt: now,
      };
      
      const result = await collection.insertOne(doc);
      const budget = await collection.findOne({ _id: result.insertedId });
      
      if (!budget) {
        throw new Error('Failed to create budget');
      }
      
      return dbBudgetToApp(budget);
    },

    async findAll(): Promise<Budget[]> {
      const collection = await getBudgetsCollection();
      const budgets = await collection.find({}).toArray();
      return budgets.map(dbBudgetToApp);
    },

    async findById(id: string): Promise<Budget | null> {
      const collection = await getBudgetsCollection();
      const budget = await collection.findOne({ _id: new ObjectId(id) });
      return budget ? dbBudgetToApp(budget) : null;
    },

    async findByMonthYear(month: string, year: number): Promise<Budget[]> {
      const collection = await getBudgetsCollection();
      const budgets = await collection.find({ month, year }).toArray();
      return budgets.map(dbBudgetToApp);
    },

    async update(id: string, updates: Partial<Budget>): Promise<Budget | null> {
      const collection = await getBudgetsCollection();
      const updateData = { ...updates, updatedAt: new Date() };
      delete updateData._id;
      
      const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: 'after' }
      );
      
      return result ? dbBudgetToApp(result) : null;
    },

    async delete(id: string): Promise<boolean> {
      const collection = await getBudgetsCollection();
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount === 1;
    },
  },
};

// Transaction functions
export async function getAllTransactions(): Promise<Transaction[]> {
  return db.transactions.findAll();
}

export async function createTransaction(transactionData: Omit<Transaction, '_id' | 'createdAt' | 'updatedAt'>): Promise<Transaction> {
  return db.transactions.create(transactionData);
}

export async function getTransactionById(id: string): Promise<Transaction | null> {
  return db.transactions.findById(id);
}

export async function updateTransaction(id: string, updates: Partial<Transaction>): Promise<Transaction | null> {
  return db.transactions.update(id, updates);
}

export async function deleteTransaction(id: string): Promise<boolean> {
  return db.transactions.delete(id);
}

// Category functions
export async function getAllCategories(): Promise<Category[]> {
  return db.categories.findAll();
}

export async function createCategory(categoryData: Omit<Category, '_id'>): Promise<Category> {
  return db.categories.create(categoryData);
}

export async function getCategoryById(id: string): Promise<Category | null> {
  return db.categories.findById(id);
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<Category | null> {
  return db.categories.update(id, updates);
}

export async function deleteCategory(id: string): Promise<boolean> {
  return db.categories.delete(id);
}

// Budget functions
export async function getBudgets(): Promise<Budget[]> {
  return db.budgets.findAll();
}

export async function createBudget(budgetData: Omit<Budget, '_id' | 'createdAt' | 'updatedAt'>): Promise<Budget> {
  return db.budgets.create(budgetData);
}

export async function getBudgetById(id: string): Promise<Budget | null> {
  return db.budgets.findById(id);
}

export async function getBudgetsByMonthYear(month: string, year: number): Promise<Budget[]> {
  return db.budgets.findByMonthYear(month, year);
}

export async function updateBudget(id: string, updates: Partial<Budget>): Promise<Budget | null> {
  return db.budgets.update(id, updates);
}

export async function deleteBudget(id: string): Promise<boolean> {
  return db.budgets.delete(id);
}
