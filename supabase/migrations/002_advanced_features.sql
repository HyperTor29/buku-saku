-- Advanced features migration for Kantong Freelance

-- Create categories table for more detailed expense/income categorization
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL, -- Clerk user ID
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense', 'investment', 'asset')), -- income, expense, investment, asset
  description TEXT,
  parent_category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL, -- For hierarchical categories
  color VARCHAR(7) DEFAULT '#6366f1', -- Hex color code for UI
  icon TEXT, -- Icon name or emoji for UI
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL, -- Clerk user ID
  name TEXT NOT NULL,
  description TEXT,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  start_date DATE,
  end_date DATE,
  budget DECIMAL(15,2),
  status TEXT DEFAULT 'active' CHECK (status IN ('planning', 'active', 'completed', 'on-hold', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create time tracking table for projects
CREATE TABLE IF NOT EXISTS public.time_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL, -- Clerk user ID
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  duration INTERVAL GENERATED ALWAYS AS (end_time - start_time) STORED, -- Calculated duration
  is_billable BOOLEAN DEFAULT true,
  hourly_rate DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create assets table for tracking personal/business assets
CREATE TABLE IF NOT EXISTS public.assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL, -- Clerk user ID
  name TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL, -- Reference to categories table
  purchase_date DATE,
  purchase_price DECIMAL(15,2),
  current_value DECIMAL(15,2),
  depreciation_rate DECIMAL(5,4) DEFAULT 0.0000, -- Annual depreciation rate (e.g., 0.2000 for 20%)
  location TEXT, -- Physical location of asset
  serial_number TEXT,
  image_url TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'sold', 'depreciated')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create recurring transactions table for automatic reminders
CREATE TABLE IF NOT EXISTS public.recurring_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL, -- Clerk user ID
  name TEXT NOT NULL,
  description TEXT,
  amount DECIMAL(15,2) NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'custom')),
  start_date DATE NOT NULL,
  end_date DATE, -- Optional end date
  next_due_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  notify_before_days INTEGER DEFAULT 3, -- Notify X days before due
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL, -- Clerk user ID
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('info', 'warning', 'success', 'error', 'reminder')),
  is_read BOOLEAN DEFAULT false,
  related_entity_type TEXT, -- 'invoice', 'expense', 'recurring_transaction', etc.
  related_entity_id UUID, -- ID of related entity
  scheduled_for TIMESTAMP WITH TIME ZONE, -- For scheduled notifications
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tax calculations table
CREATE TABLE IF NOT EXISTS public.tax_calculations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL, -- Clerk user ID
  year INTEGER NOT NULL,
  quarter INTEGER CHECK (quarter IN (1, 2, 3, 4)), -- Optional: for quarterly taxes
  income_total DECIMAL(15,2) NOT NULL DEFAULT 0,
  expense_total DECIMAL(15,2) NOT NULL DEFAULT 0,
  taxable_income DECIMAL(15,2) NOT NULL DEFAULT 0,
  tax_rate DECIMAL(5,4) NOT NULL, -- e.g., 0.05 for 5%
  tax_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
  paid_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
  due_date DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'exempt')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on new tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recurring_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_calculations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for categories table
CREATE POLICY "Users can read own categories" ON public.categories
  FOR SELECT USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can insert own categories" ON public.categories
  FOR INSERT WITH CHECK (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can update own categories" ON public.categories
  FOR UPDATE USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can delete own categories" ON public.categories
  FOR DELETE USING (auth.jwt() ->> 'sub' = user_id);

-- RLS Policies for projects table
CREATE POLICY "Users can read own projects" ON public.projects
  FOR SELECT USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can insert own projects" ON public.projects
  FOR INSERT WITH CHECK (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can update own projects" ON public.projects
  FOR UPDATE USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can delete own projects" ON public.projects
  FOR DELETE USING (auth.jwt() ->> 'sub' = user_id);

-- RLS Policies for time_entries table
CREATE POLICY "Users can read own time entries" ON public.time_entries
  FOR SELECT USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can insert own time entries" ON public.time_entries
  FOR INSERT WITH CHECK (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can update own time entries" ON public.time_entries
  FOR UPDATE USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can delete own time entries" ON public.time_entries
  FOR DELETE USING (auth.jwt() ->> 'sub' = user_id);

-- RLS Policies for assets table
CREATE POLICY "Users can read own assets" ON public.assets
  FOR SELECT USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can insert own assets" ON public.assets
  FOR INSERT WITH CHECK (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can update own assets" ON public.assets
  FOR UPDATE USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can delete own assets" ON public.assets
  FOR DELETE USING (auth.jwt() ->> 'sub' = user_id);

-- RLS Policies for recurring_transactions table
CREATE POLICY "Users can read own recurring transactions" ON public.recurring_transactions
  FOR SELECT USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can insert own recurring transactions" ON public.recurring_transactions
  FOR INSERT WITH CHECK (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can update own recurring transactions" ON public.recurring_transactions
  FOR UPDATE USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can delete own recurring transactions" ON public.recurring_transactions
  FOR DELETE USING (auth.jwt() ->> 'sub' = user_id);

-- RLS Policies for notifications table
CREATE POLICY "Users can read own notifications" ON public.notifications
  FOR SELECT USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can insert own notifications" ON public.notifications
  FOR INSERT WITH CHECK (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can delete own notifications" ON public.notifications
  FOR DELETE USING (auth.jwt() ->> 'sub' = user_id);

-- RLS Policies for tax_calculations table
CREATE POLICY "Users can read own tax calculations" ON public.tax_calculations
  FOR SELECT USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can insert own tax calculations" ON public.tax_calculations
  FOR INSERT WITH CHECK (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can update own tax calculations" ON public.tax_calculations
  FOR UPDATE USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can delete own tax calculations" ON public.tax_calculations
  FOR DELETE USING (auth.jwt() ->> 'sub' = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON public.categories(user_id);
CREATE INDEX IF NOT EXISTS idx_categories_parent_category_id ON public.categories(parent_category_id);
CREATE INDEX IF NOT EXISTS idx_categories_type ON public.categories(type);

CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON public.projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);

CREATE INDEX IF NOT EXISTS idx_time_entries_user_id ON public.time_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_project_id ON public.time_entries(project_id);

CREATE INDEX IF NOT EXISTS idx_assets_user_id ON public.assets(user_id);
CREATE INDEX IF NOT EXISTS idx_assets_category_id ON public.assets(category_id);

CREATE INDEX IF NOT EXISTS idx_recurring_transactions_user_id ON public.recurring_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_recurring_transactions_next_due_date ON public.recurring_transactions(next_due_date);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_scheduled_for ON public.notifications(scheduled_for);

CREATE INDEX IF NOT EXISTS idx_tax_calculations_user_id ON public.tax_calculations(user_id);
CREATE INDEX IF NOT EXISTS idx_tax_calculations_year ON public.tax_calculations(year);

-- Create updated_at triggers for new tables
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_time_entries_updated_at
  BEFORE UPDATE ON public.time_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assets_updated_at
  BEFORE UPDATE ON public.assets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recurring_transactions_updated_at
  BEFORE UPDATE ON public.recurring_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notifications_updated_at
  BEFORE UPDATE ON public.notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tax_calculations_updated_at
  BEFORE UPDATE ON public.tax_calculations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default categories for new users
CREATE OR REPLACE FUNCTION create_default_categories_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Expense categories
  INSERT INTO public.categories (user_id, name, type, description, color, icon) VALUES
    (NEW.user_id, 'Makanan & Minuman', 'expense', 'Biaya makanan dan minuman', '#ef4444', '🍽️'),
    (NEW.user_id, 'Transportasi', 'expense', 'Biaya transportasi', '#f97316', '🚗'),
    (NEW.user_id, 'Peralatan Kerja', 'expense', 'Biaya peralatan kerja', '#8b5cf6', '💻'),
    (NEW.user_id, 'Sewa Tempat', 'expense', 'Biaya sewa tempat kerja', '#06b6d4', '🏢'),
    (NEW.user_id, 'Langganan Software', 'expense', 'Biaya langganan software', '#10b981', '📱'),
    (NEW.user_id, 'Pendidikan & Pelatihan', 'expense', 'Biaya pendidikan dan pelatihan', '#84cc16', '🎓'),
    (NEW.user_id, 'Kesehatan', 'expense', 'Biaya kesehatan', '#ec4899', '🏥'),
    (NEW.user_id, 'Pajak', 'expense', 'Biaya pajak', '#f43f5e', '💰');
  
  -- Income categories
  INSERT INTO public.categories (user_id, name, type, description, color, icon) VALUES
    (NEW.user_id, 'Pendapatan Proyek', 'income', 'Pendapatan dari proyek klien', '#22c55e', '💼'),
    (NEW.user_id, 'Investasi', 'income', 'Pendapatan dari investasi', '#a855f7', '📈'),
    (NEW.user_id, 'Lainnya', 'income', 'Pendapatan lain-lain', '#6366f1', '💵');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create default categories when a new profile is created
CREATE TRIGGER create_default_categories_trigger
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_default_categories_for_new_user();