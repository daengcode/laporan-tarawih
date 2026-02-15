-- ============================================
-- RLS Policies untuk Production (Custom Auth)
-- ============================================
-- Script ini membuat RLS policies yang aman
-- untuk custom auth implementation
--
-- Fitur:
-- - User hanya bisa melihat data sendiri
-- - Admin bisa melihat semua data
-- - User hanya bisa mengubah data sendiri
-- - User hanya bisa menghapus data sendiri
-- ============================================

-- ============================================
-- PREPARATION
-- ============================================

-- Hapus semua policies yang ada
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can insert own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Users can delete own data" ON users;
DROP POLICY IF EXISTS "Admin can view all users" ON users;
DROP POLICY IF EXISTS "Admin can update all users" ON users;
DROP POLICY IF EXISTS "Admin can delete all users" ON users;

DROP POLICY IF EXISTS "Users can view own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can insert own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can update own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can delete own transactions" ON transactions;
DROP POLICY IF EXISTS "Admin can view all transactions" ON transactions;
DROP POLICY IF EXISTS "Admin can update all transactions" ON transactions;
DROP POLICY IF EXISTS "Admin can delete all transactions" ON transactions;

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function untuk login user (bypass RLS)
DROP FUNCTION IF EXISTS login_user(TEXT);
CREATE OR REPLACE FUNCTION login_user(p_username TEXT)
RETURNS TABLE (
    id BIGINT,
    username VARCHAR,
    password VARCHAR,
    name VARCHAR,
    created_at TIMESTAMP
)
AS $$
BEGIN
    RETURN QUERY
    SELECT
        u.id,
        u.username,
        u.password,
        u.name,
        u.created_at
    FROM users u
    WHERE u.username = p_username;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- RLS POLICIES: users
-- ============================================

-- Policy: Admin bisa melihat semua users
CREATE POLICY "Admin can view all users"
    ON users
    FOR SELECT
    USING (is_admin());

-- Policy: Admin bisa update semua users
CREATE POLICY "Admin can update all users"
    ON users
    FOR UPDATE
    USING (is_admin());

-- Policy: Admin bisa delete semua users
CREATE POLICY "Admin can delete all users"
    ON users
    FOR DELETE
    USING (is_admin());

-- Policy: User bisa melihat data sendiri
CREATE POLICY "Users can view own data"
    ON users
    FOR SELECT
    USING (id = get_current_user_id());

-- Policy: User bisa insert data sendiri
CREATE POLICY "Users can insert own data"
    ON users
    FOR INSERT
    WITH CHECK (id = get_current_user_id());

-- Policy: User bisa update data sendiri
CREATE POLICY "Users can update own data"
    ON users
    FOR UPDATE
    USING (id = get_current_user_id());

-- Policy: User bisa delete data sendiri
CREATE POLICY "Users can delete own data"
    ON users
    FOR DELETE
    USING (id = get_current_user_id());

-- ============================================
-- RLS POLICIES: transactions
-- ============================================

-- Policy: Admin bisa melihat semua transactions
CREATE POLICY "Admin can view all transactions"
    ON transactions
    FOR SELECT
    USING (is_admin());

-- Policy: Admin bisa update semua transactions
CREATE POLICY "Admin can update all transactions"
    ON transactions
    FOR UPDATE
    USING (is_admin());

-- Policy: User bisa melihat transaksi yang dibuatnya sendiri
CREATE POLICY "Users can view own transactions"
    ON transactions
    FOR SELECT
    USING (created_by = get_current_user_id());

-- Policy: User bisa insert transaksi dengan ID sendiri
CREATE POLICY "Users can insert own transactions"
    ON transactions
    FOR INSERT
    WITH CHECK (created_by = get_current_user_id());

-- Policy: User bisa update transaksi yang dibuatnya sendiri
CREATE POLICY "Users can update own transactions"
    ON transactions
    FOR UPDATE
    USING (created_by = get_current_user_id());

-- Policy: User bisa delete transaksi yang dibuatnya sendiri
CREATE POLICY "Users can delete own transactions"
    ON transactions
    FOR DELETE
    USING (created_by = get_current_user_id());

-- Policy: Admin bisa delete semua transactions
CREATE POLICY "Admin can delete all transactions"
    ON transactions
    FOR DELETE
    USING (is_admin());

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

-- ============================================
-- TESTING INSTRUCTIONS
-- ============================================
--
-- Untuk testing RLS policies:
--
-- 1. Login sebagai user biasa:
--    SELECT set_current_user_id(1);
--    SELECT set_current_username('user1');
--
-- 2. Coba query transactions:
--    SELECT * FROM transactions;
--    -- Hanya akan menampilkan transactions milik user tersebut
--
-- 3. Login sebagai admin:
--    SELECT set_current_user_id(1);
--    SELECT set_current_username('admin');
--
-- 4. Coba query transactions:
--    SELECT * FROM transactions;
--    -- Akan menampilkan SEMUA transactions
--
-- 5. Coba insert sebagai user biasa:
--    INSERT INTO transactions (date, name, type, amount, created_by)
--    VALUES ('2024-01-01', 'Test', 'pemasukan', 100000, 1);
--    -- Berhasil
--
-- 6. Coba insert dengan user ID lain:
--    INSERT INTO transactions (date, name, type, amount, created_by)
--    VALUES ('2024-01-01', 'Test', 'pemasukan', 100000, 2);
--    -- GAGAL (RLS policy akan menolak)
--
-- ============================================
