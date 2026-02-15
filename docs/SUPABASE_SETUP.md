# Integrasi Supabase - Laporan Keuangan Masjid

## 📋 Daftar Isi

1. [Prasyarat](#prasyarat)
2. [Setup Database](#setup-database)
3. [Konfigurasi Environment](#konfigurasi-environment)
4. [Install Dependencies](#install-dependencies)
5. [Struktur File](#struktur-file)
6. [Penggunaan Composables](#penggunaan-composables)
7. [RLS Policies](#rls-policies)
8. [Troubleshooting](#troubleshooting)

---

## Prasyarat

- Node.js (v16 atau lebih tinggi)
- Akun Supabase
- Project Supabase yang sudah dibuat

---

## Setup Database

### 1. Buka Supabase Dashboard

1. Login ke [Supabase Dashboard](https://supabase.com/dashboard)
2. Pilih project yang sudah dibuat

### 2. Jalankan SQL Schema

1. Buka menu **SQL Editor** di sidebar kiri
2. Klik **New Query**
3. Copy seluruh isi file [`supabase/schema.sql`](../supabase/schema.sql)
4. Paste ke SQL Editor
5. Klik **Run** untuk mengeksekusi

### 3. Verifikasi Tabel

1. Buka menu **Table Editor** di sidebar kiri
2. Pastikan tabel berikut sudah dibuat:
   - `users`
   - `transactions`

### 4. Insert Data Awal (Opsional)

Untuk testing, insert user pertama:

```sql
-- Insert user admin (password: admin123)
-- Catatan: Di production, gunakan password hashing!
INSERT INTO users (username, password, name) VALUES
('admin', 'admin123', 'Administrator');
```

---

## Konfigurasi Environment

### 1. Dapatkan Kredensial Supabase

1. Buka **Settings** → **API** di Supabase Dashboard
2. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public key** → `VITE_SUPABASE_ANON_KEY`

### 2. Buat File `.env`

File `.env` sudah dibuat secara otomatis. Isi dengan kredensial Anda:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Restart Development Server

Setelah mengubah file `.env`, restart development server:

```bash
npm run dev
```

---

## Install Dependencies

Install package Supabase:

```bash
npm install @supabase/supabase-js
```

---

## Struktur File

```
src/
├── supabase/
│   └── client.js              # Konfigurasi Supabase client
├── composables/
│   ├── useAuth.js             # Auth logic (login, logout)
│   ├── usePemasukan.js        # CRUD pemasukan
│   ├── usePengeluaran.js      # CRUD pengeluaran
│   └── useLaporan.js          # Query laporan
└── views/
    ├── Login.vue              # Halaman login
    ├── Beranda.vue            # Dashboard
    ├── InputPemasukan.vue     # Form input pemasukan
    ├── InputPengeluaran.vue   # Form input pengeluaran
    └── Laporan.vue            # Halaman laporan
```

---

## Penggunaan Composables

### useAuth.js - Autentikasi

```javascript
import { useAuth } from "@/composables/useAuth";

const { user, loading, error, isAuthenticated, login, logout, checkAuth } =
  useAuth();

// Login
const result = await login("username", "password");
if (result.success) {
  console.log("Login berhasil", result.user);
}

// Logout
logout();

// Cek auth saat app load
checkAuth();
```

### usePemasukan.js - CRUD Pemasukan

```javascript
import { usePemasukan } from "@/composables/usePemasukan";

const {
  loading,
  error,
  getPemasukan,
  addPemasukan,
  updatePemasukan,
  deletePemasukan,
  getTotalPemasukan,
} = usePemasukan();

// Ambil semua pemasukan
const { success, data } = await getPemasukan();

// Tambah pemasukan
const { success, data } = await addPemasukan({
  date: "2024-01-01",
  name: "Donasi Rutin",
  amount: 1000000,
  source: "Jemaah",
  created_by: user.id,
});

// Update pemasukan
await updatePemasukan(id, { amount: 2000000 });

// Hapus pemasukan (soft delete)
await deletePemasukan(id);

// Hitung total pemasukan
const { success, total } = await getTotalPemasukan({ startDate, endDate });
```

### usePengeluaran.js - CRUD Pengeluaran

```javascript
import { usePengeluaran } from "@/composables/usePengeluaran";

const {
  loading,
  error,
  getPengeluaran,
  addPengeluaran,
  updatePengeluaran,
  deletePengeluaran,
  getTotalPengeluaran,
} = usePengeluaran();

// Ambil semua pengeluaran
const { success, data } = await getPengeluaran();

// Tambah pengeluaran
const { success, data } = await addPengeluaran({
  date: "2024-01-02",
  name: "Pembayaran Listrik",
  amount: 500000,
  expense_type: "Operasional",
  created_by: user.id,
});

// Update pengeluaran
await updatePengeluaran(id, { amount: 600000 });

// Hapus pengeluaran (soft delete)
await deletePengeluaran(id);

// Hitung total pengeluaran
const { success, total } = await getTotalPengeluaran({ startDate, endDate });
```

### useLaporan.js - Query Laporan

```javascript
import { useLaporan } from "@/composables/useLaporan";

const {
  loading,
  error,
  getTransaksi,
  getRingkasanKeuangan,
  getTransaksiPerBulan,
  getTransaksiPerHari,
  getTransaksiBySource,
  getTransaksiByExpenseType,
  exportTransaksi,
} = useLaporan();

// Ambil semua transaksi
const { success, data } = await getTransaksi({ startDate, endDate });

// Ringkasan keuangan
const { success, data } = await getRingkasanKeuangan({ startDate, endDate });
// data: { totalPemasukan, totalPengeluaran, saldo }

// Transaksi per bulan
const { success, data } = await getTransaksiPerBulan(2024);

// Transaksi per hari
const { success, data } = await getTransaksiPerHari("2024-01-01", "2024-01-31");

// Transaksi berdasarkan sumber (pemasukan)
const { success, data } = await getTransaksiBySource({ startDate, endDate });

// Transaksi berdasarkan tipe pengeluaran
const { success, data } = await getTransaksiByExpenseType({
  startDate,
  endDate,
});

// Export ke CSV
const { success, data } = await exportTransaksi({ startDate, endDate }, "csv");
```

---

## RLS Policies

Row Level Security (RLS) sudah di-setup di [`supabase/schema.sql`](../supabase/schema.sql).

### Policies yang Diterapkan:

**Tabel `users`:**

- User hanya bisa melihat data sendiri
- User hanya bisa insert/update/delete data sendiri

**Tabel `transactions`:**

- Semua user yang login bisa melihat semua transaksi
- User hanya bisa insert/update/delete transaksi yang dibuatnya sendiri

### Catatan Penting:

1. **Custom Auth vs Supabase Auth**
   - Schema ini menggunakan `auth.uid()` yang merujuk ke Supabase Auth
   - Jika menggunakan custom auth (seperti di [`useAuth.js`](../src/composables/useAuth.js)), hapus referensi `auth.uid()` dan ganti dengan logika custom

2. **Untuk Custom Auth:**

   ```sql
   -- Hapus policies yang menggunakan auth.uid()
   DROP POLICY IF EXISTS "Users can view own data" ON users;

   -- Buat policy baru tanpa auth.uid()
   CREATE POLICY "Allow all operations on users"
       ON users
       FOR ALL
       USING (true);
   ```

---

## Troubleshooting

### Error: "Supabase URL dan Anon Key harus di-set di file .env"

**Solusi:**

1. Pastikan file `.env` sudah dibuat
2. Isi `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` dengan kredensial yang benar
3. Restart development server

### Error: "relation \"users\" does not exist"

**Solusi:**

1. Pastikan SQL schema sudah dijalankan di Supabase Dashboard
2. Cek di Table Editor apakah tabel sudah dibuat

### Error: "new row violates row-level security policy"

**Solusi:**

1. Pastikan RLS policies sudah di-setup dengan benar
2. Jika menggunakan custom auth, sesuaikan policies (lihat bagian RLS Policies)

### Data tidak muncul di aplikasi

**Solusi:**

1. Cek console browser untuk error
2. Pastikan user sudah login
3. Cek apakah data sudah ada di database via Supabase Dashboard

---

## Security Notes

1. **Password Hashing**
   - Di production, gunakan password hashing (bcrypt, argon2)
   - Jangan simpan password dalam plain text

2. **Environment Variables**
   - Jangan commit file `.env` ke repository
   - File `.env` sudah ada di `.gitignore`

3. **RLS Policies**
   - Pastikan policies sudah di-setup dengan benar
   - Test policies dengan user berbeda

4. **File Upload**
   - Untuk upload bukti transaksi (proof), pertimbangkan menggunakan Supabase Storage
   - Jangan simpan file besar sebagai base64 di database

---

## Next Steps

1. Update view components untuk menggunakan composables Supabase
2. Implementasi password hashing untuk auth
3. Setup Supabase Storage untuk file upload
4. Tambah error handling yang lebih baik
5. Implementasi loading states di UI

---

## Referensi

- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Storage](https://supabase.com/docs/guides/storage)
