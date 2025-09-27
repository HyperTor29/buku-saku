import { useState, useEffect, useCallback } from 'react';
import { Invoice, AppError } from '@/types';
import { globalCache } from '@/lib/cache';

const CACHE_KEY = 'invoices_data';

export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoices = useCallback(async (forceRefresh: boolean = false) => {
    try {
      if (!forceRefresh) {
        // Check if we have cached data
        const cachedData = globalCache.get<Invoice[]>(CACHE_KEY);
        if (cachedData) {
          setInvoices(cachedData);
          setLoading(false);
          return;
        }
      }

      setLoading(true);
      // In a real implementation, this would fetch from Supabase
      // For now, we'll use mock data with reduced delay
      await new Promise(resolve => setTimeout(resolve, 200)); // Reduced from 1000ms to 200ms
      
      const mockInvoices: Invoice[] = [
        { 
          id: '1', 
          client_id: '1',
          clients: { name: 'PT Maju Jaya' }, 
          invoice_number: 'INV-001', 
          issue_date: '2023-01-15', 
          due_date: '2023-02-15', 
          total_amount: 5000000, 
          status: 'paid',
          items: [{ item: 'Desain Logo', qty: 1, price: 5000000 }]
        },
        { 
          id: '2', 
          client_id: '2',
          clients: { name: 'CV Kreatif Abadi' }, 
          invoice_number: 'INV-002', 
          issue_date: '2023-01-20', 
          due_date: '2023-02-20', 
          total_amount: 3500000, 
          status: 'sent',
          items: [{ item: 'Website Development', qty: 1, price: 3500000 }]
        },
        { 
          id: '3', 
          client_id: '3',
          clients: { name: 'Toko Sejahtera' }, 
          invoice_number: 'INV-003', 
          issue_date: '2023-01-25', 
          due_date: '2023-02-25', 
          total_amount: 2000000, 
          status: 'draft',
          items: [{ item: 'Social Media Management', qty: 1, price: 2000000 }]
        }
      ];
      
      setInvoices(mockInvoices);
      // Cache the data for 5 minutes
      globalCache.set<Invoice[]>(CACHE_KEY, mockInvoices, 5 * 60 * 1000);
    } catch (err: unknown) {
      const appError = err as AppError;
      setError(appError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createInvoice = async (invoiceData: Omit<Invoice, 'id'>) => {
    try {
      // Simulate API call with reduced delay
      await new Promise(resolve => setTimeout(resolve, 150)); // Reduced from 500ms to 150ms
      
      const newInvoice: Invoice = {
        id: Date.now().toString(),
        ...invoiceData
      };
      
      setInvoices(prev => [newInvoice, ...prev]);
      // Update cache
      globalCache.set<Invoice[]>(CACHE_KEY, [newInvoice, ...invoices], 5 * 60 * 1000);
      return newInvoice;
    } catch (err: unknown) {
      const appError = err as AppError;
      setError(appError.message);
      throw err;
    }
  };

  const updateInvoice = async (id: string, invoiceData: Partial<Invoice>) => {
    try {
      // Simulate API call with reduced delay
      await new Promise(resolve => setTimeout(resolve, 150)); // Reduced from 500ms to 150ms
      
      setInvoices(prev => {
        const updated = prev.map(invoice => invoice.id === id ? { ...invoice, ...invoiceData } : invoice);
        // Update cache
        globalCache.set<Invoice[]>(CACHE_KEY, updated, 5 * 60 * 1000);
        return updated;
      });
      return { id, ...invoiceData };
    } catch (err: unknown) {
      const appError = err as AppError;
      setError(appError.message);
      throw err;
    }
  };

  const deleteInvoice = async (id: string) => {
    try {
      // Simulate API call with reduced delay
      await new Promise(resolve => setTimeout(resolve, 150)); // Reduced from 500ms to 150ms
      
      setInvoices(prev => {
        const filtered = prev.filter(invoice => invoice.id !== id);
        // Update cache
        globalCache.set<Invoice[]>(CACHE_KEY, filtered, 5 * 60 * 1000);
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
    fetchInvoices();
  }, [fetchInvoices]);

  return {
    invoices,
    loading,
    error,
    fetchInvoices,
    createInvoice,
    updateInvoice,
    deleteInvoice
  };
}