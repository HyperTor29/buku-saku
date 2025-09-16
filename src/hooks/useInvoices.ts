import { useState, useEffect } from 'react';
import { Invoice, AppError } from '@/types';

export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // In a real implementation, this would fetch from Supabase
  // For now, we'll use mock data
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
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
      } catch (err: unknown) {
        const appError = err as AppError;
        setError(appError.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const createInvoice = async (invoiceData: Omit<Invoice, 'id'>) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newInvoice: Invoice = {
        id: Date.now().toString(),
        ...invoiceData
      };
      
      setInvoices(prev => [newInvoice, ...prev]);
      return newInvoice;
    } catch (err: unknown) {
      const appError = err as AppError;
      setError(appError.message);
      throw err;
    }
  };

  const updateInvoice = async (id: string, invoiceData: Partial<Invoice>) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setInvoices(prev => prev.map(invoice => invoice.id === id ? { ...invoice, ...invoiceData } : invoice));
      return { id, ...invoiceData };
    } catch (err: unknown) {
      const appError = err as AppError;
      setError(appError.message);
      throw err;
    }
  };

  const deleteInvoice = async (id: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setInvoices(prev => prev.filter(invoice => invoice.id !== id));
    } catch (err: unknown) {
      const appError = err as AppError;
      setError(appError.message);
      throw err;
    }
  };

  return {
    invoices,
    loading,
    error,
    fetchInvoices: () => {},
    createInvoice,
    updateInvoice,
    deleteInvoice
  };
}