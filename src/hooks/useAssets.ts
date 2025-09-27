import { useState, useEffect, useCallback } from 'react';
import { Asset, AppError } from '@/types';
import { globalCache } from '@/lib/cache';

const CACHE_KEY = 'assets_data';

export function useAssets() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssets = useCallback(async (forceRefresh: boolean = false) => {
    try {
      if (!forceRefresh) {
        // Check if we have cached data
        const cachedData = globalCache.get<Asset[]>(CACHE_KEY);
        if (cachedData) {
          setAssets(cachedData);
          setLoading(false);
          return;
        }
      }

      setLoading(true);
      // In a real implementation, this would fetch from Supabase
      // For now, we'll use mock data with reduced delay
      await new Promise(resolve => setTimeout(resolve, 150)); // Reduced from 1000ms to 150ms
      
      const mockAssets: Asset[] = [
        { 
          id: '1', 
          user_id: 'user-123', 
          name: 'Laptop MacBook Pro', 
          description: 'Laptop kerja utama',
          category_id: '3', // Assuming category ID for work equipment
          purchase_date: '2022-06-15',
          purchase_price: 25000000,
          current_value: 20000000,
          depreciation_rate: 0.2000,
          location: 'Rumah',
          serial_number: 'ABC123456',
          status: 'active',
          created_at: '2022-06-15'
        },
        { 
          id: '2', 
          user_id: 'user-123', 
          name: 'Kamera Mirrorless', 
          description: 'Kamera untuk dokumentasi',
          category_id: '3', // Assuming category ID for work equipment
          purchase_date: '2023-01-10',
          purchase_price: 12000000,
          current_value: 11000000,
          depreciation_rate: 0.1000,
          location: 'Rumah',
          serial_number: 'XYZ789012',
          status: 'active',
          created_at: '2023-01-10'
        },
        { 
          id: '3', 
          user_id: 'user-123', 
          name: 'Investasi Saham', 
          description: 'Portofolio saham teknologi',
          category_id: '4', // Assuming category ID for investment
          purchase_date: '2023-02-01',
          purchase_price: 50000000,
          current_value: 55000000,
          status: 'active',
          created_at: '2023-02-01'
        }
      ];
      
      setAssets(mockAssets);
      // Cache the data for 5 minutes
      globalCache.set<Asset[]>(CACHE_KEY, mockAssets, 5 * 60 * 1000);
    } catch (err: unknown) {
      const appError = err as AppError;
      setError(appError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createAsset = async (assetData: Omit<Asset, 'id'>) => {
    try {
      // Simulate API call with reduced delay
      await new Promise(resolve => setTimeout(resolve, 100)); // Reduced from 500ms to 100ms
      
      // Ensure user_id is included in the asset data
      const newAsset: Asset = {
        ...assetData,
        id: Date.now().toString(),
        user_id: assetData.user_id || 'user-123' // Use provided user_id or default
      };
      
      setAssets(prev => [newAsset, ...prev]);
      // Update cache
      globalCache.set<Asset[]>(CACHE_KEY, [newAsset, ...assets], 5 * 60 * 1000);
      return newAsset;
    } catch (err: unknown) {
      const appError = err as AppError;
      setError(appError.message);
      throw err;
    }
  };

  const updateAsset = async (id: string, assetData: Partial<Asset>) => {
    try {
      // Simulate API call with reduced delay
      await new Promise(resolve => setTimeout(resolve, 100)); // Reduced from 500ms to 100ms
      
      setAssets(prev => {
        const updated = prev.map(asset => asset.id === id ? { ...asset, ...assetData } : asset);
        // Update cache
        globalCache.set<Asset[]>(CACHE_KEY, updated, 5 * 60 * 1000);
        return updated;
      });
      return { id, ...assetData };
    } catch (err: unknown) {
      const appError = err as AppError;
      setError(appError.message);
      throw err;
    }
  };

  const deleteAsset = async (id: string) => {
    try {
      // Simulate API call with reduced delay
      await new Promise(resolve => setTimeout(resolve, 100)); // Reduced from 500ms to 100ms
      
      setAssets(prev => {
        const filtered = prev.filter(asset => asset.id !== id);
        // Update cache
        globalCache.set<Asset[]>(CACHE_KEY, filtered, 5 * 60 * 1000);
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
    fetchAssets();
  }, [fetchAssets]);

  return {
    assets,
    loading,
    error,
    fetchAssets,
    createAsset,
    updateAsset,
    deleteAsset
  };
}