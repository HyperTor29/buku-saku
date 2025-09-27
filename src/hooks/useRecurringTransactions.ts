import { useState, useEffect, useCallback } from 'react';
import { RecurringTransaction, AppError } from '@/types';
import { globalCache } from '@/lib/cache';

const CACHE_KEY = 'recurring_transactions_data';

export function useRecurringTransactions() {
  const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecurringTransactions = useCallback(async (forceRefresh: boolean = false) => {
    try {
      if (!forceRefresh) {
        // Check if we have cached data
        const cachedData = globalCache.get<RecurringTransaction[]>(CACHE_KEY);
        if (cachedData) {
          setRecurringTransactions(cachedData);
          setLoading(false);
          return;
        }
      }

      setLoading(true);
      // In a real implementation, this would fetch from Supabase
      // For now, we'll use mock data with reduced delay
      await new Promise(resolve => setTimeout(resolve, 150)); // Reduced from 1000ms to 150ms
      
      const mockRecurringTransactions: RecurringTransaction[] = [
        { 
          id: '1', 
          user_id: 'user-123', 
          name: 'Langganan Software', 
          description: 'Langganan software desain bulanan',
          amount: 500000,
          category_id: '2', // Assuming category ID for software
          type: 'expense',
          frequency: 'monthly',
          start_date: '2023-01-01',
          next_due_date: '2023-02-01',
          is_active: true,
          notify_before_days: 3,
          created_at: '2023-01-01'
        },
        { 
          id: '2', 
          user_id: 'user-123', 
          name: 'Sewa Kantor', 
          description: 'Biaya sewa kantor bulanan',
          amount: 3000000,
          category_id: '2', // Assuming category ID for office rent
          type: 'expense',
          frequency: 'monthly',
          start_date: '2023-01-15',
          next_due_date: '2023-02-15',
          is_active: true,
          notify_before_days: 7,
          created_at: '2023-01-01'
        },
        { 
          id: '3', 
          user_id: 'user-123', 
          name: 'Investasi Reksa Dana', 
          description: 'Investasi bulanan di reksa dana',
          amount: 1000000,
          category_id: '3', // Assuming category ID for investment
          type: 'expense', // This goes to investment category
          frequency: 'monthly',
          start_date: '2023-02-01',
          next_due_date: '2023-03-01',
          is_active: true,
          created_at: '2023-01-15'
        }
      ];
      
      setRecurringTransactions(mockRecurringTransactions);
      // Cache the data for 5 minutes
      globalCache.set<RecurringTransaction[]>(CACHE_KEY, mockRecurringTransactions, 5 * 60 * 1000);
    } catch (err: unknown) {
      const appError = err as AppError;
      setError(appError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createRecurringTransaction = async (transactionData: Omit<RecurringTransaction, 'id'>) => {
    try {
      // Simulate API call with reduced delay
      await new Promise(resolve => setTimeout(resolve, 100)); // Reduced from 500ms to 100ms
      
      // Ensure user_id is included in the transaction data
      const newTransaction: RecurringTransaction = {
        ...transactionData,
        id: Date.now().toString(),
        user_id: transactionData.user_id || 'user-123' // Use provided user_id or default
      };
      
      setRecurringTransactions(prev => [newTransaction, ...prev]);
      // Update cache
      globalCache.set<RecurringTransaction[]>(CACHE_KEY, [newTransaction, ...recurringTransactions], 5 * 60 * 1000);
      return newTransaction;
    } catch (err: unknown) {
      const appError = err as AppError;
      setError(appError.message);
      throw err;
    }
  };

  const updateRecurringTransaction = async (id: string, transactionData: Partial<RecurringTransaction>) => {
    try {
      // Simulate API call with reduced delay
      await new Promise(resolve => setTimeout(resolve, 100)); // Reduced from 500ms to 100ms
      
      setRecurringTransactions(prev => {
        const updated = prev.map(transaction => transaction.id === id ? { ...transaction, ...transactionData } : transaction);
        // Update cache
        globalCache.set<RecurringTransaction[]>(CACHE_KEY, updated, 5 * 60 * 1000);
        return updated;
      });
      return { id, ...transactionData };
    } catch (err: unknown) {
      const appError = err as AppError;
      setError(appError.message);
      throw err;
    }
  };

  const deleteRecurringTransaction = async (id: string) => {
    try {
      // Simulate API call with reduced delay
      await new Promise(resolve => setTimeout(resolve, 100)); // Reduced from 500ms to 100ms
      
      setRecurringTransactions(prev => {
        const filtered = prev.filter(transaction => transaction.id !== id);
        // Update cache
        globalCache.set<RecurringTransaction[]>(CACHE_KEY, filtered, 5 * 60 * 1000);
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
    fetchRecurringTransactions();
  }, [fetchRecurringTransactions]);

  return {
    recurringTransactions,
    loading,
    error,
    fetchRecurringTransactions,
    createRecurringTransaction,
    updateRecurringTransaction,
    deleteRecurringTransaction
  };
}