import { useState, useEffect, useCallback } from 'react';
import { AppError } from '@/types';
import { globalCache } from '@/lib/cache';

interface FinancialData {
  totalIncome: number;
  totalUnpaidInvoices: number;
  totalExpenses: number;
  netProfit: number;
}

const CACHE_KEY = 'financial_data';

export function useFinancialData() {
  const [financialData, setFinancialData] = useState<FinancialData>({
    totalIncome: 0,
    totalUnpaidInvoices: 0,
    totalExpenses: 0,
    netProfit: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFinancialData = useCallback(async (forceRefresh: boolean = false) => {
    try {
      if (!forceRefresh) {
        // Check if we have cached data
        const cachedData = globalCache.get<FinancialData>(CACHE_KEY);
        if (cachedData) {
          setFinancialData(cachedData);
          setLoading(false);
          return;
        }
      }

      setLoading(true);
      // In a real implementation, this would fetch from Supabase
      // For now, we'll use mock data with reduced delay
      await new Promise(resolve => setTimeout(resolve, 300)); // Reduced from 1000ms to 300ms
      
      const mockData: FinancialData = {
        totalIncome: 15000000,
        totalUnpaidInvoices: 3500000,
        totalExpenses: 8000000,
        netProfit: 7000000
      };
      
      setFinancialData(mockData);
      // Cache the data for 5 minutes
      globalCache.set(CACHE_KEY, mockData, 5 * 60 * 1000);
    } catch (err: unknown) {
      const appError = err as AppError;
      setError(appError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchFinancialData();
  }, [fetchFinancialData]);

  return {
    financialData,
    loading,
    error,
    fetchFinancialData
  };
}