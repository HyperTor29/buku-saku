import { useState, useEffect, useCallback } from 'react';
import { Category, AppError } from '@/types';
import { globalCache } from '@/lib/cache';

const CACHE_KEY = 'categories_data';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async (forceRefresh: boolean = false) => {
    try {
      if (!forceRefresh) {
        // Check if we have cached data
        const cachedData = globalCache.get<Category[]>(CACHE_KEY);
        if (cachedData) {
          setCategories(cachedData);
          setLoading(false);
          return;
        }
      }

      setLoading(true);
      // In a real implementation, this would fetch from Supabase
      // For now, we'll use mock data with reduced delay
      await new Promise(resolve => setTimeout(resolve, 150)); // Reduced from 1000ms to 150ms
      
      const mockCategories: Category[] = [
        { 
          id: '1', 
          user_id: 'user-123', 
          name: 'Makanan & Minuman', 
          type: 'expense',
          description: 'Biaya makanan dan minuman',
          color: '#ef4444',
          icon: '🍽️',
          is_active: true,
          created_at: '2023-01-01'
        },
        { 
          id: '2', 
          user_id: 'user-123', 
          name: 'Transportasi', 
          type: 'expense',
          description: 'Biaya transportasi',
          color: '#f97316',
          icon: '🚗',
          is_active: true,
          created_at: '2023-01-01'
        },
        { 
          id: '3', 
          user_id: 'user-123', 
          name: 'Pendapatan Proyek', 
          type: 'income',
          description: 'Pendapatan dari proyek klien',
          color: '#22c55e',
          icon: '💼',
          is_active: true,
          created_at: '2023-01-01'
        }
      ];
      
      setCategories(mockCategories);
      // Cache the data for 5 minutes
      globalCache.set<Category[]>(CACHE_KEY, mockCategories, 5 * 60 * 1000);
    } catch (err: unknown) {
      const appError = err as AppError;
      setError(appError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCategory = async (categoryData: Omit<Category, 'id'>) => {
    try {
      // Simulate API call with reduced delay
      await new Promise(resolve => setTimeout(resolve, 100)); // Reduced from 500ms to 100ms
      
      // Ensure user_id is included in the category data
      const newCategory: Category = {
        ...categoryData,
        id: Date.now().toString(),
        user_id: categoryData.user_id || 'user-123' // Use provided user_id or default
      };
      
      setCategories(prev => [newCategory, ...prev]);
      // Update cache
      globalCache.set<Category[]>(CACHE_KEY, [newCategory, ...categories], 5 * 60 * 1000);
      return newCategory;
    } catch (err: unknown) {
      const appError = err as AppError;
      setError(appError.message);
      throw err;
    }
  };

  const updateCategory = async (id: string, categoryData: Partial<Category>) => {
    try {
      // Simulate API call with reduced delay
      await new Promise(resolve => setTimeout(resolve, 100)); // Reduced from 500ms to 100ms
      
      setCategories(prev => {
        const updated = prev.map(category => category.id === id ? { ...category, ...categoryData } : category);
        // Update cache
        globalCache.set<Category[]>(CACHE_KEY, updated, 5 * 60 * 1000);
        return updated;
      });
      return { id, ...categoryData };
    } catch (err: unknown) {
      const appError = err as AppError;
      setError(appError.message);
      throw err;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      // Simulate API call with reduced delay
      await new Promise(resolve => setTimeout(resolve, 100)); // Reduced from 500ms to 100ms
      
      setCategories(prev => {
        const filtered = prev.filter(category => category.id !== id);
        // Update cache
        globalCache.set<Category[]>(CACHE_KEY, filtered, 5 * 60 * 1000);
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
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory
  };
}