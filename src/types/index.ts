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

export interface Category {
  id: string;
  user_id: string;
  name: string;
  type: 'income' | 'expense' | 'investment' | 'asset';
  description?: string;
  parent_category_id?: string;
  color?: string;
  icon?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  client_id?: string;
  start_date: string;
  end_date?: string;
  budget?: number;
  status: 'planning' | 'active' | 'completed' | 'on-hold' | 'cancelled';
  created_at?: string;
  updated_at?: string;
}

export interface TimeEntry {
  id: string;
  user_id: string;
  project_id: string;
  description?: string;
  start_time: string;
  end_time?: string;
  duration?: string; // This will be computed from start_time and end_time
  is_billable: boolean;
  hourly_rate?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Asset {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  category_id?: string;
  purchase_date: string;
  purchase_price: number;
  current_value: number;
  depreciation_rate?: number;
  location?: string;
  serial_number?: string;
  image_url?: string;
  status: 'active' | 'inactive' | 'sold' | 'depreciated';
  created_at?: string;
  updated_at?: string;
}

export interface RecurringTransaction {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  amount: number;
  category_id?: string;
  type: 'income' | 'expense';
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';
  start_date: string;
  end_date?: string;
  next_due_date: string;
  is_active: boolean;
  notify_before_days?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error' | 'reminder';
  is_read: boolean;
  related_entity_type?: string;
  related_entity_id?: string;
  scheduled_for?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TaxCalculation {
  id: string;
  user_id: string;
  year: number;
  quarter?: number; // Optional: for quarterly taxes
  income_total: number;
  expense_total: number;
  taxable_income: number;
  tax_rate: number;
  tax_amount: number;
  paid_amount: number;
  due_date?: string;
  status: 'pending' | 'paid' | 'overdue' | 'exempt';
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AppError extends Error {
  message: string;
}