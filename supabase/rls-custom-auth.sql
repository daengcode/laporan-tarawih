-- ============================================
-- RLS Policies untuk Custom Auth
-- ============================================
-- Script ini membuat RLS policies yang kompatibel
-- dengan custom auth (bukan Supabase Auth)
--
-- Catatan: Untuk implementasi yang lebih aman,
-- Anda perlu menyimpan user ID yang sedang login
-- di session/localStorage dan mengirimnya ke server
-- ============================================

-- ============================================
-- Opsi 1: RLS Policies dengan createdBy
-- (Rekomendasi untuk custom auth)
-- ============================================

-- Hapus policies yang lama
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can insert own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Users can delete own data" ON users;

DROP POLICY IF EXISTS "Users can view own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can insert transactions" ON transactions;
DROP POLICY IF EXISTS "Users can update own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can delete own transactions" ON transactions;

-- ============================================
-- TABLE: users
-- ============================================

-- Untuk tabel users, kita perlu cara untuk mengidentifikasi
-- user yang sedang login. Karena custom auth tidak menyediakan
-- auth.uid(), kita bisa menggunakan beberapa opsi:

-- Opsi 1a: Mengizinkan semua operasi (paling sederhana)
CREATE POLICY "Allow all operations on users"
    ON users
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Opsi 1b: Menggunakan header atau session (lebih aman)
-- Catatan: Ini membutuhkan implementasi di aplikasi
-- untuk mengirim user ID melalui header atau parameter

-- ============================================
-- TABLE: transactions
-- ============================================

-- Opsi 2a: Mengizinkan semua operasi (paling sederhana)
CREATE POLICY "Allow all operations on transactions"
    ON transactions
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Opsi 2b: Menggunakan createdBy untuk filtering
-- Catatan: Ini membutuhkan user ID yang sedang login
-- untuk dikirim ke setiap query

-- Contoh policy dengan createdBy (perlu implementasi di app):
-- CREATE POLICY "Users can view own transactions"
--     ON transactions
--     FOR SELECT
--     USING (createdBy = current_setting('app.current_user_id', true)::uuid);

-- ============================================
-- CATATAN PENTING
-- ============================================
--
-- Untuk implementasi RLS yang aman dengan custom auth:
--
-- 1. Simpan user ID yang sedang login di localStorage/sessionStorage
-- 2. Kirim user ID ke setiap query Supabase
-- 3. Gunakan user ID tersebut untuk filtering di RLS policies
--
-- Contoh implementasi di aplikasi:
--
-- // Di composables
-- const userId = localStorage.getItem('userId')
-- const { data } = await supabase
--   .from('transactions')
--   .select('*')
--   .eq('createdBy', userId)
--
-- Atau gunakan Supabase Auth untuk RLS yang lebih aman
-- ============================================

-- ============================================
-- VERIFIKASI
-- ============================================

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
WHERE tablename = 'users';

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
WHERE tablename = 'transactions';
