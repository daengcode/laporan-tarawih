-- ============================================
-- Enable Public Access untuk Laporan Publik
-- ============================================
-- Script ini mengizinkan akses publik ke transactions
-- untuk halaman laporan publik yang tidak memerlukan login
--
-- Catatan: Hanya untuk SELECT (baca data), tidak untuk INSERT/UPDATE/DELETE
-- ============================================

-- ============================================
-- PREPARATION
-- ============================================

-- Hapus policy publik jika ada
DROP POLICY IF EXISTS "Public can view transactions" ON transactions;

-- ============================================
-- RLS POLICY: Public Access
-- ============================================

-- Policy: Publik bisa melihat semua transactions (hanya untuk laporan publik)
CREATE POLICY "Public can view transactions"
    ON transactions
    FOR SELECT
    USING (true);

-- ============================================
-- VERIFIKASI
-- ============================================

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
-- Untuk testing public access:
--
-- 1. Logout dari aplikasi
-- 2. Buka halaman laporan publik: /laporan-amaliyah-ramadhan/2024-01-01
-- 3. Seharusnya bisa melihat data transaksi
--
-- 4. Coba query di Supabase SQL Editor:
--    SELECT * FROM transactions;
--    -- Akan menampilkan SEMUA transactions
--
-- Catatan:
-- - Policy ini mengizinkan SIAPAPUN (termasuk yang tidak login)
--   untuk melihat semua transactions
-- - Ini aman karena hanya untuk SELECT (baca data)
-- - Tidak ada policy untuk INSERT/UPDATE/DELETE publik
-- - Jadi publik tidak bisa mengubah/menghapus data
-- ============================================
