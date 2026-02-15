-- ============================================
-- Disable RLS untuk Custom Auth
-- ============================================
-- Catatan: Script ini akan menghapus RLS policies
-- yang menggunakan auth.uid() dan menggantinya
-- dengan policies yang mengizinkan semua operasi
-- untuk custom auth implementation

-- ============================================
-- TABLE: users
-- ============================================

-- Hapus semua policies yang ada
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can insert own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Users can delete own data" ON users;

-- Buat policies baru untuk custom auth
-- Mengizinkan semua operasi (untuk custom auth)
CREATE POLICY "Allow all operations on users"
    ON users
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- ============================================
-- TABLE: transactions
-- ============================================

-- Hapus semua policies yang ada
DROP POLICY IF EXISTS "Users can view own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can insert transactions" ON transactions;
DROP POLICY IF EXISTS "Users can update own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can delete own transactions" ON transactions;

-- Buat policies baru untuk custom auth
-- Mengizinkan semua operasi (untuk custom auth)
CREATE POLICY "Allow all operations on transactions"
    ON transactions
    FOR ALL
    USING (true)
    WITH CHECK (true);

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
