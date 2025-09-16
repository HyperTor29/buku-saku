export interface Client {
  id: string;
  name: string;
  email?: string;
  phone_number?: string;
  address?: string;
  created_at?: string;
}

export interface InvoiceItem {
  item: string;
  qty: number;
  price: number;
}

export interface Invoice {
  id: string;
  client_id: string;
  clients?: {
    name: string;
  };
  invoice_number: string;
  issue_date: string;
  due_date: string;
  total_amount: number;
  status: 'draft' | 'sent' | 'paid';
  items: InvoiceItem[];
  notes?: string;
  created_at?: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category?: string;
  expense_date: string;
  receipt_url?: string;
  created_at?: string;
}

export interface AppError extends Error {
  message: string;
}