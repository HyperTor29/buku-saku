import { useState, useEffect, useCallback } from 'react';
import { Expense, AppError } from '@/types';
import { globalCache } from '@/lib/cache';

const CACHE_KEY = 'expenses_data';

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = useCallback(async (forceRefresh: boolean = false) => {
    try {
      if (!forceRefresh) {
        // Check if we have cached data
        const cachedData = globalCache.get<Expense[]>(CACHE_KEY);
        if (cachedData) {
          setExpenses(cachedData);
          setLoading(false);
          return;
        }
      }

      setLoading(true);
      // In a real implementation, this would fetch from Supabase
      // For now, we'll use mock data with reduced delay
      await new Promise(resolve => setTimeout(resolve, 200)); // Reduced from 1000ms to 200ms
      
      const mockExpenses: Expense[] = [
        { 
          id: '1', 
          description: 'Beli laptop baru', 
          amount: 12000000, 
          category: 'Peralatan', 
          expense_date: '2023-01-10',
          receipt_url: '' 
        },
        { 
          id: '2', 
          description: 'Langganan software desain', 
          amount: 500000, 
          category: 'Software', 
          expense_date: '2023-01-15',
          receipt_url: '' 
        },
        { 
          id: '3', 
          description: 'Transport ke client', 
          amount: 150000, 
          category: 'Transportasi', 
          expense_date: '2023-01-20',
          receipt_url: '' 
        }
      ];
      
      setExpenses(mockExpenses);
      // Cache the data for 5 minutes
      globalCache.set<Expense[]>(CACHE_KEY, mockExpenses, 5 * 60 * 1000);
    } catch (err: unknown) {
      const appError = err as AppError;
      setError(appError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createExpense = async (expenseData: Omit<Expense, 'id'>) => {
    try {
      // Simulate API call with reduced delay
      await new Promise(resolve => setTimeout(resolve, 150)); // Reduced from 500ms to 150ms
      
      const newExpense: Expense = {
        id: Date.now().toString(),
        ...expenseData
      };
      
      setExpenses(prev => [newExpense, ...prev]);
      // Update cache
      globalCache.set<Expense[]>(CACHE_KEY, [newExpense, ...expenses], 5 * 60 * 1000);
      return newExpense;
    } catch (err: unknown) {
      const appError = err as AppError;
      setError(appError.message);
      throw err;
    }
  };

  const updateExpense = async (id: string, expenseData: Partial<Expense>) => {
    try {
      // Simulate API call with reduced delay
      await new Promise(resolve => setTimeout(resolve, 150)); // Reduced from 500ms to 150ms
      
      setExpenses(prev => {
        const updated = prev.map(expense => expense.id === id ? { ...expense, ...expenseData } : expense);
        // Update cache
        globalCache.set<Expense[]>(CACHE_KEY, updated, 5 * 60 * 1000);
        return updated;
      });
      return { id, ...expenseData };
    } catch (err: unknown) {
      const appError = err as AppError;
      setError(appError.message);
      throw err;
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      // Simulate API call with reduced delay
      await new Promise(resolve => setTimeout(resolve, 150)); // Reduced from 500ms to 150ms
      
      setExpenses(prev => {
        const filtered = prev.filter(expense => expense.id !== id);
        // Update cache
        globalCache.set<Expense[]>(CACHE_KEY, filtered, 5 * 60 * 1000);
        return filtered;
      });
    } catch (err: unknown) {
      const appError = err as AppError;
      setError(appError.message);
      throw err;
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  return {
    expenses,
    loading,
    error,
    fetchExpenses,
    createExpense,
    updateExpense,
    deleteExpense
  };
}