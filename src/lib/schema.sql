-- Tabel untuk menyimpan data klien dari setiap pengguna
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Link ke pengguna yang membuat
  name TEXT NOT NULL,
  email TEXT,
  phone_number TEXT,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabel untuk menyimpan semua invoice
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL, -- Jika klien dihapus, invoice tetap ada
  invoice_number TEXT NOT NULL,
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  total_amount NUMERIC(12, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'sent', 'paid', 'overdue'
  items JSONB, -- Menyimpan detail item invoice dalam format JSON, e.g., [{"item": "Desain Logo", "price": 500000}]
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabel untuk mencatat semua pengeluaran
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  category TEXT, -- e.g., 'Transportasi', 'Software', 'Internet'
  expense_date DATE NOT NULL,
  receipt_url TEXT, -- Link ke file struk yang di-upload ke Supabase Storage
  created_at TIMESTAMPTZ DEFAULT now()
);