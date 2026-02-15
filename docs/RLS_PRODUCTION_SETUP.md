# Setup RLS untuk Production

Panduan lengkap untuk setup Row Level Security (RLS) yang aman untuk production dengan custom auth.

## 📋 Prasyarat

Sebelum memulai, pastikan Anda memiliki:

- [x] Supabase project sudah dibuat
- [x] Tabel `users` dan `transactions` sudah ada
- [x] User admin sudah dibuat (username: `admin`)
- [x] Frontend sudah menggunakan custom auth

## 🚀 Langkah 1: Jalankan SQL Script Production

### 1.1 Buka SQL Editor di Supabase

1. Login ke [supabase.com](https://supabase.com/)
2. Pilih project Anda
3. Buka **SQL Editor** dari menu sidebar
4. Klik **"New query"**

### 1.2 Jalankan Script RLS Production

Copy dan paste seluruh isi file [`supabase/rls-production.sql`](../supabase/rls-production.sql:1) ke SQL Editor:

```sql
-- ============================================
-- RLS Policies untuk Production (Custom Auth)
-- ============================================
-- Script ini membuat RLS policies yang aman
-- untuk custom auth implementation
--
-- Fitur:
-- - Semua user yang login bisa melihat semua transaksi
-- - Admin bisa melihat semua data
-- - User hanya bisa mengubah data sendiri
-- - User hanya bisa menghapus data sendiri
-- ============================================

-- ... (rest of the script)
```

Klik **"Run"** untuk mengeksekusi script.

### 1.3 Verifikasi Setup

Pastikan script berhasil dijalankan dengan memeriksa output:

- ✅ Function `set_current_user_id` dibuat
- ✅ Function `get_current_user_id` dibuat
- ✅ Function `is_admin` dibuat
- ✅ Policies untuk tabel `users` dibuat
- ✅ Policies untuk tabel `transactions` dibuat

## 🔧 Langkah 2: Setup Frontend

### 2.1 Pastikan Frontend Terupdate

Pastikan file-file berikut sudah terupdate dengan perubahan RLS:

- [`src/composables/useAuth.js`](../src/composables/useAuth.js:1) - Menyimpan dan mengirim user ID
- [`src/composables/useLaporan.js`](../src/composables/useLaporan.js:1) - Mengirim user ID ke setiap query
- [`src/composables/usePemasukan.js`](../src/composables/usePemasukan.js:1) - Mengirim user ID ke setiap query
- [`src/composables/usePengeluaran.js`](../src/composables/usePengeluaran.js:1) - Mengirim user ID ke setiap query

### 2.2 Test Login

1. Jalankan aplikasi lokal:

   ```bash
   npm run dev
   ```

2. Login dengan user admin:
   - Username: `admin`
   - Password: (sesuai yang Anda set)

3. Buka browser dev tools dan cek localStorage:
   ```javascript
   localStorage.getItem("userId"); // Harus ada UUID user admin
   localStorage.getItem("user"); // Harus ada data user (tanpa password)
   ```

## 🧪 Langkah 3: Testing RLS

### 3.1 Test sebagai User Biasa

#### 3.1.1 Buat User Baru

Gunakan script [`supabase/insert-user-sql.sql`](../supabase/insert-user-sql.sql:1) atau gunakan API:

```javascript
// Di browser console
const { data } = await supabase
  .from("users")
  .insert({
    username: "user1",
    password: "$2a$10$...", // Hash password
    name: "User Test 1",
  })
  .select()
  .single();
```

#### 3.1.2 Login sebagai User Biasa

1. Logout dari admin
2. Login dengan user baru (`user1`)
3. Cek localStorage:
   ```javascript
   localStorage.getItem("userId"); // Harus UUID user1
   ```

#### 3.1.3 Test Query Data

Coba query data transaksi:

```javascript
// Di browser console
const { data } = await supabase.from("transactions").select("*");

console.log(data);
// Akan menampilkan SEMUA transaksi (semua user yang login bisa melihat semua data)
```

#### 3.1.4 Test Insert Data

Coba insert transaksi baru:

```javascript
const userId = localStorage.getItem("userId");

const { data, error } = await supabase
  .from("transactions")
  .insert({
    date: "2024-01-01",
    name: "Test Pemasukan",
    type: "pemasukan",
    amount: 100000,
    source: "Test",
    created_by: userId,
  })
  .select()
  .single();

console.log(data); // Berhasil
```

#### 3.1.5 Test Insert dengan User ID Lain

Coba insert dengan user ID lain (harus gagal):

```javascript
const { data, error } = await supabase
  .from("transactions")
  .insert({
    date: "2024-01-01",
    name: "Test Pemasukan",
    type: "pemasukan",
    amount: 100000,
    source: "Test",
    created_by: "00000000-0000-0000-0000-000000000000", // UUID lain
  })
  .select()
  .single();

console.log(error);
// Error: new row violates row-level security policy
```

### 3.2 Test sebagai Admin

#### 3.2.1 Login sebagai Admin

1. Logout dari user biasa
2. Login dengan admin
3. Cek localStorage:
   ```javascript
   localStorage.getItem("userId"); // Harus UUID admin
   ```

#### 3.2.2 Test Query Semua Data

Coba query semua transaksi:

```javascript
const { data } = await supabase.from("transactions").select("*");

console.log(data);
// Akan menampilkan SEMUA transaksi (dari semua user)
```

#### 3.2.3 Test Update Data User Lain

Coba update transaksi milik user lain:

```javascript
const { data, error } = await supabase
  .from("transactions")
  .update({ amount: 200000 })
  .eq("id", "transaction-id-user-lain");

console.log(data); // Berhasil (admin bisa update semua)
```

## 📊 Langkah 4: Monitoring RLS

### 4.1 Cek Policies Aktif

Di SQL Editor Supabase:

```sql
-- Cek policies pada tabel users
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'users'
ORDER BY policyname;

-- Cek policies pada tabel transactions
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'transactions'
ORDER BY policyname;
```

### 4.2 Monitor Query Logs

1. Buka **Logs** → **Query Logs** di dashboard Supabase
2. Filter berdasarkan tabel `transactions`
3. Perhatikan query yang gagal karena RLS

## 🚨 Troubleshooting

### Masalah 1: Query Mengembalikan Data Kosong

**Gejala:**

```javascript
const { data } = await supabase.from("transactions").select("*");
console.log(data); // []
```

**Solusi:**

1. Pastikan user ID di-set sebelum query:
   ```javascript
   await supabase.rpc("set_current_user_id", { user_id: userId });
   ```
2. Cek localStorage:
   ```javascript
   console.log(localStorage.getItem("userId"));
   ```
3. Pastikan RLS policies aktif:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'transactions';
   ```

### Masalah 2: Error "new row violates row-level security policy"

**Gejala:**

```javascript
const { error } = await supabase.from('transactions').insert({...});
console.log(error);
// Error: new row violates row-level security policy
```

**Solusi:**

1. Pastikan `created_by` menggunakan user ID yang sedang login:
   ```javascript
   const userId = localStorage.getItem('userId');
   await supabase.from('transactions').insert({
     ...,
     created_by: userId  // Gunakan userId dari localStorage
   });
   ```
2. Pastikan `set_current_user_id` dipanggil sebelum insert:
   ```javascript
   await setCurrentUserId();
   ```

### Masalah 3: Admin Tidak Bisa Melihat Semua Data

**Gejala:**

```javascript
// Login sebagai admin
const { data } = await supabase.from("transactions").select("*");
console.log(data); // Hanya data admin sendiri
```

**Solusi:**

1. Pastikan username admin adalah `admin`:
   ```sql
   SELECT username FROM users WHERE id = 'admin-uuid';
   ```
2. Pastikan function `is_admin()` berfungsi:
   ```sql
   SELECT is_admin();
   ```
3. Cek policy admin:
   ```sql
   SELECT * FROM pg_policies
   WHERE policyname LIKE '%Admin%';
   ```

### Masalah 4: User Biasa Tidak Bisa Melihat Data Apapun

**Gejala:**

```javascript
// Login sebagai user1
const { data } = await supabase.from("transactions").select("*");
console.log(data); // [] (kosong)
```

**Solusi:**

1. Pastikan user ID di-set sebelum query:
   ```javascript
   await supabase.rpc("set_current_user_id", { user_id: userId });
   ```
2. Pastikan RLS enabled:
   ```sql
   SELECT relname, relrowsecurity
   FROM pg_class
   WHERE relname IN ('users', 'transactions');
   ```
3. Pastikan policy "Users can view all transactions" aktif:
   ```sql
   SELECT * FROM pg_policies
   WHERE policyname = 'Users can view all transactions';
   ```
4. Jalankan ulang script RLS production

## 📝 Checklist Production

Sebelum deploy ke production, pastikan:

- [ ] SQL script RLS production sudah dijalankan
- [ ] Function `set_current_user_id` sudah dibuat
- [ ] Function `get_current_user_id` sudah dibuat
- [ ] Function `is_admin` sudah dibuat
- [ ] Policies untuk tabel `users` sudah dibuat
- [ ] Policies untuk tabel `transactions` sudah dibuat
- [ ] Frontend sudah terupdate dengan RLS logic
- [ ] Login admin berhasil
- [ ] Login user biasa berhasil
- [ ] Semua user yang login bisa melihat semua transaksi
- [ ] Admin bisa melihat semua data
- [ ] User biasa tidak bisa insert dengan user ID lain
- [ ] User biasa tidak bisa update data user lain
- [ ] User biasa tidak bisa delete data user lain
- [ ] Admin bisa update data user lain
- [ ] Admin bisa delete data user lain

## 🔒 Best Practices RLS

### 1. Selalu Set User ID Sebelum Query

```javascript
// ✅ Benar
await setCurrentUserId();
const { data } = await supabase.from("transactions").select("*");

// ❌ Salah
const { data } = await supabase.from("transactions").select("*");
```

### 2. Gunakan User ID dari localStorage

```javascript
// ✅ Benar
const userId = getUserId();
await supabase.from('transactions').insert({
  ...,
  created_by: userId
});

// ❌ Salah
await supabase.from('transactions').insert({
  ...,
  created_by: 'hardcoded-uuid'
});
```

### 3. Test dengan Multiple User

Selalu test RLS dengan:

- Admin user
- User biasa 1
- User biasa 2

Pastikan setiap user hanya bisa mengakses data mereka sendiri.

### 4. Monitor Logs Secara Rutin

Cek query logs di Supabase dashboard untuk:

- Query yang gagal karena RLS
- Query yang mencoba akses data user lain
- Pattern query yang mencurigakan

## 📚 Referensi

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL RLS Documentation](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Supabase Custom Auth Guide](https://supabase.com/docs/guides/auth/server-side-rendering)

## 🎉 Selesai!

RLS untuk production sudah berhasil di-setup! Aplikasi Anda sekarang aman dengan:

- ✅ Semua user yang login bisa melihat semua transaksi
- ✅ Admin bisa melihat semua data
- ✅ User hanya bisa mengubah data sendiri
- ✅ User hanya bisa menghapus data sendiri
- ✅ Proteksi dari unauthorized access

---

**Catatan Penting:**

- Selalu test RLS sebelum deploy ke production
- Monitor logs secara rutin
- Backup database sebelum menjalankan SQL script
- Jangan pernah hardcode user ID di frontend
