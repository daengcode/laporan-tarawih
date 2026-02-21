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
--
-- CATATAN:
-- Script ini menggabungkan helper functions dan RLS policies
-- dalam satu file untuk kemudahan setup
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

-- Function untuk menyimpan user ID di session PostgreSQL
DROP FUNCTION IF EXISTS set_current_user_id(BIGINT) CASCADE;
CREATE OR REPLACE FUNCTION set_current_user_id(user_id BIGINT)
RETURNS VOID
AS $$
BEGIN
    PERFORM set_config('app.current_user_id', user_id::TEXT, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function untuk mengambil user ID dari session PostgreSQL
DROP FUNCTION IF EXISTS get_current_user_id() CASCADE;
CREATE OR REPLACE FUNCTION get_current_user_id()
RETURNS BIGINT
AS $$
BEGIN
    RETURN NULLIF(current_setting('app.current_user_id', true), '')::BIGINT;
EXCEPTION
    WHEN OTHERS THEN
        RETURN NULL;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function untuk menyimpan username di session PostgreSQL
DROP FUNCTION IF EXISTS set_current_username(TEXT) CASCADE;
CREATE OR REPLACE FUNCTION set_current_username(username TEXT)
RETURNS VOID
AS $$
BEGIN
    PERFORM set_config('app.current_username', username, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function untuk mengambil username dari session PostgreSQL
DROP FUNCTION IF EXISTS get_current_username() CASCADE;
CREATE OR REPLACE FUNCTION get_current_username()
RETURNS TEXT
AS $$
BEGIN
    RETURN current_setting('app.current_username', true);
EXCEPTION
    WHEN OTHERS THEN
        RETURN NULL;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function untuk cek apakah user adalah admin
DROP FUNCTION IF EXISTS is_admin() CASCADE;
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
AS $$
BEGIN
    RETURN get_current_username() = 'admin';
END;
$$ LANGUAGE plpgsql STABLE;

-- Function untuk login user (bypass RLS)
DROP FUNCTION IF EXISTS login_user(TEXT) CASCADE;
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

-- Policy: Semua user yang login bisa melihat semua transaksi
CREATE POLICY "Users can view all transactions"
    ON transactions
    FOR SELECT
    USING (get_current_user_id() IS NOT NULL);

-- Policy: User bisa insert transaksi dengan ID sendiri atau NULL
CREATE POLICY "Users can insert own transactions"
    ON transactions
    FOR INSERT
    WITH CHECK (created_by = get_current_user_id() OR created_by IS NULL);

-- Policy: User bisa update transaksi yang dibuatnya sendiri atau NULL
CREATE POLICY "Users can update own transactions"
    ON transactions
    FOR UPDATE
    USING (created_by = get_current_user_id() OR created_by IS NULL);

-- Policy: User bisa delete transaksi yang dibuatnya sendiri atau NULL
CREATE POLICY "Users can delete own transactions"
    ON transactions
    FOR DELETE
    USING (created_by = get_current_user_id() OR created_by IS NULL);

-- Policy: Admin bisa delete semua transactions
CREATE POLICY "Admin can delete all transactions"
    ON transactions
    FOR DELETE
    USING (is_admin());

-- ============================================
-- VERIFIKASI
-- ============================================

-- Cek fungsi helper yang sudah dibuat
SELECT '=== FUNGSI HELPER ===' as info;
SELECT
    routine_name,
    routine_type,
    data_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN (
    'set_current_user_id',
    'get_current_user_id',
    'set_current_username',
    'get_current_username',
    'is_admin',
    'login_user'
)
ORDER BY routine_name;

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
-- 1. Set user ID dan username:
--    SELECT set_current_user_id(1);
--    SELECT set_current_username('user1');
--
-- 2. Cek fungsi helper:
--    SELECT get_current_user_id();
--    -- Output: 1
--
--    SELECT get_current_username();
--    -- Output: 'user1'
--
--    SELECT is_admin();
--    -- Output: false
--
-- 3. Coba query transactions:
--    SELECT * FROM transactions;
--    -- Akan menampilkan SEMUA transactions (semua user yang login bisa melihat semua data)
--
-- 4. Login sebagai admin:
--    SELECT set_current_user_id(1);
--    SELECT set_current_username('admin');
--
-- 5. Cek fungsi helper:
--    SELECT is_admin();
--    -- Output: true
--
-- 6. Coba query transactions:
--    SELECT * FROM transactions;
--    -- Akan menampilkan SEMUA transactions
--
-- 7. Coba insert sebagai user biasa:
--    INSERT INTO transactions (date, name, type, amount, created_by)
--    VALUES ('2024-01-01', 'Test', 'pemasukan', 100000, get_current_user_id());
--    -- Berhasil
--
-- 8. Coba insert dengan user ID lain:
--    INSERT INTO transactions (date, name, type, amount, created_by)
--    VALUES ('2024-01-01', 'Test', 'pemasukan', 100000, 999);
--    -- GAGAL (RLS policy akan menolak)
--
-- ============================================
