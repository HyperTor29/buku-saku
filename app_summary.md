Tentu, mari kita kembangkan ide aplikasi **"Alat Manajemen Keuangan Mikro untuk Freelancer & UMKM"** dengan tech stack yang Anda tentukan.

-----

### \#\# Ringkasan Aplikasi: "Kantong Freelance"

**Nama Aplikasi:** Kantong Freelance

**Elevator Pitch:** "Kantong Freelance" adalah aplikasi web SaaS yang dirancang khusus untuk freelancer dan pemilik usaha mikro di Indonesia. Aplikasi ini menghilangkan kerumitan software akuntansi tradisional, fokus pada tiga hal terpenting: membuat tagihan (invoice) profesional, mencatat pengeluaran, dan memantau kesehatan finansial bisnis secara *real-time* melalui dashboard yang intuitif.

**Tujuan Utama:** Membantu para pekerja mandiri agar lebih disiplin secara finansial, terlihat lebih profesional di mata klien, dan menghemat waktu dalam urusan administrasi sehingga mereka bisa fokus pada pekerjaan utama mereka.

**Tech Stack:**

  * **Framework:** **Next.js** (Sebuah framework React yang powerful untuk membangun aplikasi full-stack JavaScript dengan cepat).
  * **Database & Backend:** **Supabase** (Menyediakan database PostgreSQL, otentikasi pengguna, API instan, dan penyimpanan file, semuanya dalam satu platform).
  * **Styling:** **Tailwind CSS** (Untuk membangun antarmuka yang modern dan responsif dengan cepat).
  * **Deployment:** **Vercel** (Platform hosting yang dioptimalkan untuk Next.js).

-----

### \#\# Skema Database (Supabase)

Berikut adalah desain skema database dasar untuk aplikasi "Kantong Freelance". Supabase menggunakan PostgreSQL, jadi tipe datanya akan mengikutinya.

Relasi utamanya adalah setiap **pengguna (user)** memiliki banyak **klien (clients)**, banyak **invoice (invoices)**, dan banyak **pengeluaran (expenses)**.

```sql
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
```

**Catatan Penting:**

  * Tabel `auth.users` sudah disediakan secara otomatis oleh **Supabase Authentication**. Kita hanya perlu membuat relasi ke sana menggunakan `user_id`.
  * Penggunaan `ON DELETE CASCADE` pada `user_id` berarti jika seorang pengguna menghapus akunnya, semua data (klien, invoice, pengeluaran) miliknya akan ikut terhapus.
  * Menggunakan tipe data `JSONB` pada kolom `items` di tabel `invoices` adalah cara efisien untuk memulai, tanpa perlu membuat tabel terpisah untuk `invoice_items` di versi awal (MVP).

-----

### \#\# Fitur-Fitur Utama & Fungsi CRUD-nya

Berikut adalah detail bagaimana setiap fitur akan berinteraksi dengan database Supabase menggunakan operasi **CRUD (Create, Read, Update, Delete)**.

#### \#\#\# 1. Manajemen Klien

Ini adalah fitur untuk mengelola daftar klien Anda.

  * **Create (Membuat Klien Baru):**

      * **Alur:** Pengguna mengisi formulir dengan nama, email, no. telepon, dan alamat klien.
      * **Proses:** Saat tombol "Simpan" diklik, aplikasi mengirim permintaan `INSERT` ke tabel `clients`. Data `user_id` diambil dari sesi pengguna yang sedang login.
      * **Contoh Kode (Supabase JS Client):**
        ```javascript
        const { data, error } = await supabase
          .from('clients')
          .insert([{ name: 'PT Maju Jaya', email: 'kontak@majujaya.com', user_id: user.id }]);
        ```

  * **Read (Melihat Daftar Klien):**

      * **Alur:** Pengguna membuka halaman "Klien" dan melihat seluruh daftar klien miliknya.
      * **Proses:** Aplikasi melakukan query `SELECT` ke tabel `clients` dengan filter `WHERE user_id` sama dengan ID pengguna yang login.
      * **Contoh Kode:**
        ```javascript
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .eq('user_id', user.id);
        ```

  * **Update (Mengubah Data Klien):**

      * **Alur:** Pengguna mengklik tombol "Edit" pada salah satu klien, mengubah datanya di formulir, lalu menyimpan.
      * **Proses:** Aplikasi mengirim permintaan `UPDATE` ke tabel `clients` untuk baris data dengan `id` yang sesuai.
      * **Contoh Kode:**
        ```javascript
        const { data, error } = await supabase
          .from('clients')
          .update({ phone_number: '08123456789' })
          .eq('id', clientId);
        ```

  * **Delete (Menghapus Klien):**

      * **Alur:** Pengguna mengklik tombol "Hapus" pada salah satu klien.
      * **Proses:** Aplikasi mengirim permintaan `DELETE` dari tabel `clients` untuk `id` yang dipilih.
      * **Contoh Kode:**
        ```javascript
        const { data, error } = await supabase
          .from('clients')
          .delete()
          .eq('id', clientId);
        ```

#### \#\#\# 2. Manajemen Invoice

Fitur inti untuk membuat dan melacak tagihan.

  * **Create (Membuat Invoice Baru):**

      * **Alur:** Pengguna mengisi formulir invoice, memilih klien dari daftar yang sudah ada, menambahkan item pekerjaan, menentukan tanggal, dan menyimpannya sebagai draf.
      * **Proses:** Aplikasi melakukan `INSERT` ke tabel `invoices`. Data `items` akan disimpan sebagai array JSON.
      * **Contoh Kode:**
        ```javascript
        const invoiceItems = [{ item: "Jasa Konsultasi", qty: 1, price: 1500000 }];
        const { data, error } = await supabase
          .from('invoices')
          .insert([{ 
            client_id: selectedClientId, 
            total_amount: 1500000, 
            status: 'draft',
            items: invoiceItems,
            /* ...data lainnya... */
          }]);
        ```

  * **Read (Melihat Daftar Invoice):**

      * **Alur:** Pengguna melihat semua invoice dengan statusnya (draf, terkirim, lunas). Ada filter untuk menyortir berdasarkan status atau klien.
      * **Proses:** Mirip seperti membaca data klien, ini adalah query `SELECT` ke tabel `invoices` dengan join ke tabel `clients` untuk menampilkan nama klien.
      * **Contoh Kode:**
        ```javascript
        // Mengambil invoice beserta data kliennya
        const { data, error } = await supabase
          .from('invoices')
          .select('*, clients (name, email)') // Ini adalah join di Supabase
          .eq('user_id', user.id);
        ```

  * **Update (Mengubah Status Invoice):**

      * **Alur:** Pengguna mengubah status invoice dari "Terkirim" menjadi "Lunas" setelah menerima pembayaran.
      * **Proses:** Ini adalah operasi `UPDATE` sederhana pada kolom `status` di tabel `invoices`.
      * **Contoh Kode:**
        ```javascript
        const { data, error } = await supabase
          .from('invoices')
          .update({ status: 'paid' })
          .eq('id', invoiceId);
        ```

  * **Delete (Menghapus Invoice):**

      * **Alur:** Pengguna dapat menghapus invoice yang masih berstatus "Draf".
      * **Proses:** Operasi `DELETE` pada baris invoice yang dipilih.

#### \#\#\# 3. Pencatatan Pengeluaran

Fitur simpel untuk mencatat semua biaya operasional.

  * **Create (Mencatat Pengeluaran):**
      * **Alur:** Pengguna mengisi formulir singkat: deskripsi, jumlah, kategori, dan tanggal. Mereka juga bisa mengunggah foto struk.
      * **Proses:** Jika ada file struk, aplikasi akan mengunggahnya terlebih dahulu ke **Supabase Storage**. URL file tersebut kemudian disimpan bersama data lainnya dalam satu perintah `INSERT` ke tabel `expenses`.
  * **Read (Melihat Riwayat Pengeluaran):**
      * **Alur:** Menampilkan daftar semua pengeluaran dalam periode tertentu, bisa diurutkan berdasarkan tanggal atau kategori.
      * **Proses:** Query `SELECT` ke tabel `expenses`.
  * **Update & Delete:** Serupa dengan fitur lainnya, pengguna dapat mengedit atau menghapus catatan pengeluaran yang salah.

#### \#\#\# 4. Dashboard Utama

Halaman ini tidak memiliki fungsi `Create`, `Update`, atau `Delete` secara langsung, melainkan hanya fungsi **Read** yang kompleks untuk menyajikan rangkuman data dari tabel lain. Ini adalah inti dari nilai jual aplikasi ini.

  * **Proses di Balik Layar:**
    1.  **Hitung Total Pemasukan:** Menjalankan query `SELECT SUM(total_amount)` dari tabel `invoices` dengan `status = 'paid'`.
    2.  **Hitung Total Tagihan Belum Dibayar:** Menjalankan query `SELECT SUM(total_amount)` dari tabel `invoices` dengan `status = 'sent'`.
    3.  **Hitung Total Pengeluaran:** Menjalankan query `SELECT SUM(amount)` dari tabel `expenses`.
    4.  **Hitung Laba/Rugi Bersih:** (Total Pemasukan - Total Pengeluaran).
    5.  Semua data ini dihitung untuk periode waktu tertentu (misal: "Bulan Ini") dan ditampilkan dalam bentuk angka besar atau grafik sederhana.