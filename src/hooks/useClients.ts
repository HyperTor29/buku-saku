import { useState, useEffect, useCallback } from 'react';
import { Client, AppError } from '@/types';
import { globalCache } from '@/lib/cache';

const CACHE_KEY = 'clients_data';

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = useCallback(async (forceRefresh: boolean = false) => {
    try {
      if (!forceRefresh) {
        // Check if we have cached data
        const cachedData = globalCache.get<Client[]>(CACHE_KEY);
        if (cachedData) {
          setClients(cachedData);
          setLoading(false);
          return;
        }
      }

      setLoading(true);
      // In a real implementation, this would fetch from Supabase
      // For now, we'll use mock data with reduced delay
      await new Promise(resolve => setTimeout(resolve, 150)); // Reduced from 1000ms to 150ms
      
      const mockClients: Client[] = [
        { id: '1', name: 'PT Maju Jaya', email: 'kontak@majujaya.com', phone_number: '021-1234567', address: 'Jl. Merdeka No. 123, Jakarta' },
        { id: '2', name: 'CV Kreatif Abadi', email: 'info@kreatifabadhi.com', phone_number: '022-9876543', address: 'Jl. Asia Afrika No. 45, Bandung' },
        { id: '3', name: 'Toko Sejahtera', email: 'sejahtera@gmail.com', phone_number: '031-5556667', address: 'Jl. Tunjungan No. 78, Surabaya' }
      ];
      
      setClients(mockClients);
      // Cache the data for 5 minutes
      globalCache.set<Client[]>(CACHE_KEY, mockClients, 5 * 60 * 1000);
    } catch (err: unknown) {
      const appError = err as AppError;
      setError(appError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createClient = async (clientData: Omit<Client, 'id'>) => {
    try {
      // Simulate API call with reduced delay
      await new Promise(resolve => setTimeout(resolve, 100)); // Reduced from 500ms to 100ms
      
      // Note: Client interface doesn't require user_id based on the type definition
      const newClient: Client = {
        id: Date.now().toString(),
        ...clientData
      };
      
      setClients(prev => [newClient, ...prev]);
      // Update cache
      globalCache.set<Client[]>(CACHE_KEY, [newClient, ...clients], 5 * 60 * 1000);
      return newClient;
    } catch (err: unknown) {
      const appError = err as AppError;
      setError(appError.message);
      throw err;
    }
  };

  const updateClient = async (id: string, clientData: Partial<Client>) => {
    try {
      // Simulate API call with reduced delay
      await new Promise(resolve => setTimeout(resolve, 100)); // Reduced from 500ms to 100ms
      
      setClients(prev => {
        const updated = prev.map(client => client.id === id ? { ...client, ...clientData } : client);
        // Update cache
        globalCache.set<Client[]>(CACHE_KEY, updated, 5 * 60 * 1000);
        return updated;
      });
      return { id, ...clientData };
    } catch (err: unknown) {
      const appError = err as AppError;
      setError(appError.message);
      throw err;
    }
  };

  const deleteClient = async (id: string) => {
    try {
      // Simulate API call with reduced delay
      await new Promise(resolve => setTimeout(resolve, 100)); // Reduced from 500ms to 100ms
      
      setClients(prev => {
        const filtered = prev.filter(client => client.id !== id);
        // Update cache
        globalCache.set<Client[]>(CACHE_KEY, filtered, 5 * 60 * 1000);
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
    fetchClients();
  }, [fetchClients]);

  return {
    clients,
    loading,
    error,
    fetchClients,
    createClient,
    updateClient,
    deleteClient
  };
}