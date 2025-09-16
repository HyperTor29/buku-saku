import { useState, useEffect } from 'react';
import { Client, AppError } from '@/types';

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // In a real implementation, this would fetch from Supabase
  // For now, we'll use mock data
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockClients: Client[] = [
          { id: '1', name: 'PT Maju Jaya', email: 'kontak@majujaya.com', phone_number: '021-1234567', address: 'Jl. Merdeka No. 123, Jakarta' },
          { id: '2', name: 'CV Kreatif Abadi', email: 'info@kreatifabadhi.com', phone_number: '022-9876543', address: 'Jl. Asia Afrika No. 45, Bandung' },
          { id: '3', name: 'Toko Sejahtera', email: 'sejahtera@gmail.com', phone_number: '031-5556667', address: 'Jl. Tunjungan No. 78, Surabaya' }
        ];
        
        setClients(mockClients);
      } catch (err: unknown) {
        const appError = err as AppError;
        setError(appError.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const createClient = async (clientData: Omit<Client, 'id'>) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newClient: Client = {
        id: Date.now().toString(),
        ...clientData
      };
      
      setClients(prev => [newClient, ...prev]);
      return newClient;
    } catch (err: unknown) {
      const appError = err as AppError;
      setError(appError.message);
      throw err;
    }
  };

  const updateClient = async (id: string, clientData: Partial<Client>) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setClients(prev => prev.map(client => client.id === id ? { ...client, ...clientData } : client));
      return { id, ...clientData };
    } catch (err: unknown) {
      const appError = err as AppError;
      setError(appError.message);
      throw err;
    }
  };

  const deleteClient = async (id: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setClients(prev => prev.filter(client => client.id !== id));
    } catch (err: unknown) {
      const appError = err as AppError;
      setError(appError.message);
      throw err;
    }
  };

  return {
    clients,
    loading,
    error,
    fetchClients: () => {},
    createClient,
    updateClient,
    deleteClient
  };
}