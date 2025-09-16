import { useState, useEffect } from 'react';
import { Expense, AppError } from '@/types';

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // In a real implementation, this would fetch from Supabase
  // For now, we'll use mock data
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
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
      } catch (err: unknown) {
        const appError = err as AppError;
        setError(appError.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  const createExpense = async (expenseData: Omit<Expense, 'id'>) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newExpense: Expense = {
        id: Date.now().toString(),
        ...expenseData
      };
      
      setExpenses(prev => [newExpense, ...prev]);
      return newExpense;
    } catch (err: unknown) {
      const appError = err as AppError;
      setError(appError.message);
      throw err;
    }
  };

  const updateExpense = async (id: string, expenseData: Partial<Expense>) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setExpenses(prev => prev.map(expense => expense.id === id ? { ...expense, ...expenseData } : expense));
      return { id, ...expenseData };
    } catch (err: unknown) {
      const appError = err as AppError;
      setError(appError.message);
      throw err;
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setExpenses(prev => prev.filter(expense => expense.id !== id));
    } catch (err: unknown) {
      const appError = err as AppError;
      setError(appError.message);
      throw err;
    }
  };

  return {
    expenses,
    loading,
    error,
    fetchExpenses: () => {},
    createExpense,
    updateExpense,
    deleteExpense
  };
}