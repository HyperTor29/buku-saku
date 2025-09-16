# Kantong Freelance

Aplikasi manajemen keuangan sederhana untuk freelancer dan UMKM Indonesia.

## Fitur Utama

1. **Dashboard Keuangan** - Overview keadaan finansial bisnis
2. **Manajemen Klien** - Simpan dan kelola data klien
3. **Manajemen Invoice** - Buat, kirim, dan lacak tagihan
4. **Pencatatan Pengeluaran** - Catat semua biaya operasional

## Tech Stack

- **Frontend**: Next.js 14 dengan App Router
- **Backend**: Supabase (Database, Authentication, Storage)
- **Styling**: Tailwind CSS dengan shadcn/ui components
- **Deployment**: Vercel
- **Authentication**: Clerk

## Struktur Direktori

```
src/
├── app/                 # Next.js app router pages
│   ├── dashboard/       # Dashboard utama
│   │   ├── clients/     # Halaman manajemen klien
│   │   ├── invoices/    # Halaman manajemen invoice
│   │   └── expenses/    # Halaman pencatatan pengeluaran
├── components/          # React components
├── hooks/               # Custom hooks untuk data fetching
├── lib/                 # Utility functions
└── types/               # TypeScript types
```

## Setup Development

1. Clone repository
2. Install dependencies: `npm install`
3. Salin `.env.example` ke `.env.local` dan isi dengan kredensial:
   - Clerk keys
   - Supabase URL dan anon key
4. Jalankan development server: `npm run dev`

## Database Schema

Aplikasi ini menggunakan 3 tabel utama:

1. `clients` - Menyimpan data klien
2. `invoices` - Menyimpan data invoice
3. `expenses` - Menyimpan data pengeluaran

Lihat `src/lib/schema.sql` untuk definisi lengkap skema database.