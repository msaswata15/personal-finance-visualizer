import { db } from './database';

// Wrapper with better error handling for production
export const safeDatabase = {
  transactions: {
    async findAll() {
      try {
        return await db.transactions.findAll();
      } catch (error) {
        console.error('Database error in transactions.findAll:', error);
        throw new Error('Failed to fetch transactions from database');
      }
    },

    async findById(id: string) {
      try {
        return await db.transactions.findById(id);
      } catch (error) {
        console.error('Database error in transactions.findById:', error);
        throw new Error(`Failed to fetch transaction with id ${id}`);
      }
    },

    async create(data: any) {
      try {
        return await db.transactions.create(data);
      } catch (error) {
        console.error('Database error in transactions.create:', error);
        throw new Error('Failed to create transaction');
      }
    },

    async update(id: string, data: any) {
      try {
        return await db.transactions.update(id, data);
      } catch (error) {
        console.error('Database error in transactions.update:', error);
        throw new Error(`Failed to update transaction with id ${id}`);
      }
    },

    async delete(id: string) {
      try {
        return await db.transactions.delete(id);
      } catch (error) {
        console.error('Database error in transactions.delete:', error);
        throw new Error(`Failed to delete transaction with id ${id}`);
      }
    },
  },

  categories: {
    async findAll() {
      try {
        return await db.categories.findAll();
      } catch (error) {
        console.error('Database error in categories.findAll:', error);
        throw new Error('Failed to fetch categories from database');
      }
    },

    async create(data: any) {
      try {
        return await db.categories.create(data);
      } catch (error) {
        console.error('Database error in categories.create:', error);
        throw new Error('Failed to create category');
      }
    },

    async findById(id: string) {
      try {
        return await db.categories.findById(id);
      } catch (error) {
        console.error('Database error in categories.findById:', error);
        throw new Error(`Failed to fetch category with id ${id}`);
      }
    },

    async update(id: string, data: any) {
      try {
        return await db.categories.update(id, data);
      } catch (error) {
        console.error('Database error in categories.update:', error);
        throw new Error(`Failed to update category with id ${id}`);
      }
    },

    async delete(id: string) {
      try {
        return await db.categories.delete(id);
      } catch (error) {
        console.error('Database error in categories.delete:', error);
        throw new Error(`Failed to delete category with id ${id}`);
      }
    },
  },

  budgets: {
    async findAll() {
      try {
        return await db.budgets.findAll();
      } catch (error) {
        console.error('Database error in budgets.findAll:', error);
        throw new Error('Failed to fetch budgets from database');
      }
    },

    async create(data: any) {
      try {
        return await db.budgets.create(data);
      } catch (error) {
        console.error('Database error in budgets.create:', error);
        throw new Error('Failed to create budget');
      }
    },

    async findById(id: string) {
      try {
        return await db.budgets.findById(id);
      } catch (error) {
        console.error('Database error in budgets.findById:', error);
        throw new Error(`Failed to fetch budget with id ${id}`);
      }
    },

    async findByMonthYear(month: string, year: number) {
      try {
        return await db.budgets.findByMonthYear(month, year);
      } catch (error) {
        console.error('Database error in budgets.findByMonthYear:', error);
        throw new Error(`Failed to fetch budgets for ${month} ${year}`);
      }
    },

    async update(id: string, data: any) {
      try {
        return await db.budgets.update(id, data);
      } catch (error) {
        console.error('Database error in budgets.update:', error);
        throw new Error(`Failed to update budget with id ${id}`);
      }
    },

    async delete(id: string) {
      try {
        return await db.budgets.delete(id);
      } catch (error) {
        console.error('Database error in budgets.delete:', error);
        throw new Error(`Failed to delete budget with id ${id}`);
      }
    },
  },
};

export default safeDatabase;
