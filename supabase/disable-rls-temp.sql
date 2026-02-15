-- ============================================
-- Disable RLS Sementara (Untuk Development/Testing)
-- ============================================
-- Script ini akan menonaktifkan RLS sepenuhnya
-- sehingga Anda bisa melakukan CRUD tanpa login
--
-- CATATAN: Jangan gunakan di production!
-- ============================================

-- Disable RLS untuk tabel users
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Disable RLS untuk tabel transactions
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;

-- ============================================
-- VERIFIKASI
-- ============================================

-- Cek apakah RLS sudah di-disable
SELECT
    schemaname,
    tablename,
    rowsecurity AS rls_enabled
FROM pg_tables
WHERE tablename IN ('users', 'transactions');

-- ============================================
-- CATATAN PENTING
-- ============================================
--
-- Untuk mengaktifkan kembali RLS di production:
--
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
--
-- Dan jalankan script rls-custom-auth.sql
-- ============================================
