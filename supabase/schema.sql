-- ============================================
-- Laporan Keuangan Masjid - Database Schema
-- ============================================

-- Drop tables if exists (untuk fresh install)
-- DROP TABLE IF EXISTS transactions CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- TABLE: users
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Hashed password
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: transactions
-- ============================================
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    name VARCHAR(255) NOT NULL, -- nama donatur / nama keperluan
    type VARCHAR(20) NOT NULL CHECK (type IN ('pemasukan', 'pengeluaran')),
    amount DECIMAL(15, 2) NOT NULL,
    source VARCHAR(100), -- untuk pemasukan (sumber dana)
    expense_type VARCHAR(100), -- untuk pengeluaran (tipe pengeluaran)
    proof TEXT, -- base64 image atau URL file
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- ============================================
-- INDEXES
-- ============================================

-- Index untuk users
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Index untuk transactions
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_created_by ON transactions(created_by);
CREATE INDEX IF NOT EXISTS idx_transactions_deleted_at ON transactions(deleted_at);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS untuk tabel users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Enable RLS untuk tabel transactions
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES: users
-- ============================================

-- Policy: User bisa melihat data sendiri
CREATE POLICY "Users can view own data"
    ON users
    FOR SELECT
    USING (id = auth.uid());

-- Policy: User bisa insert data sendiri
CREATE POLICY "Users can insert own data"
    ON users
    FOR INSERT
    WITH CHECK (id = auth.uid());

-- Policy: User bisa update data sendiri
CREATE POLICY "Users can update own data"
    ON users
    FOR UPDATE
    USING (id = auth.uid());

-- Policy: User bisa delete data sendiri
CREATE POLICY "Users can delete own data"
    ON users
    FOR DELETE
    USING (id = auth.uid());

-- ============================================
-- RLS POLICIES: transactions
-- ============================================

-- Policy: User bisa melihat transaksi yang dibuatnya sendiri
CREATE POLICY "Users can view own transactions"
    ON transactions
    FOR SELECT
    USING (created_by = auth.uid());

-- Policy: User bisa insert transaksi
CREATE POLICY "Users can insert transactions"
    ON transactions
    FOR INSERT
    WITH CHECK (created_by = auth.uid());

-- Policy: User bisa update transaksi yang dibuatnya sendiri
CREATE POLICY "Users can update own transactions"
    ON transactions
    FOR UPDATE
    USING (created_by = auth.uid());

-- Policy: User bisa delete transaksi yang dibuatnya sendiri
CREATE POLICY "Users can delete own transactions"
    ON transactions
    FOR DELETE
    USING (created_by = auth.uid());

-- ============================================
-- TRIGGERS: Auto update updated_at
-- ============================================

-- Function untuk auto update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger untuk tabel users
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger untuk tabel transactions
CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SAMPLE DATA (Opsional - untuk testing)
-- ============================================

-- Insert sample user (password: admin123 - ganti dengan hashed password di production)
-- INSERT INTO users (username, password, name) VALUES
-- ('admin', 'admin123', 'Administrator');

-- Insert sample transactions
-- INSERT INTO transactions (date, name, type, amount, source, created_by) VALUES
-- ('2024-01-01', 'Donasi Rutin', 'pemasukan', 1000000, 'Jemaah', (SELECT id FROM users WHERE username = 'admin' LIMIT 1)),
-- ('2024-01-02', 'Pembayaran Listrik', 'pengeluaran', 500000, null, (SELECT id FROM users WHERE username = 'admin' LIMIT 1));

-- ============================================
-- VIEWS (Optional - untuk query yang sering digunakan)
-- ============================================

-- View untuk ringkasan keuangan
CREATE OR REPLACE VIEW v_ringkasan_keuangan AS
SELECT
    DATE_TRUNC('month', date) AS bulan,
    SUM(CASE WHEN type = 'pemasukan' THEN amount ELSE 0 END) AS total_pemasukan,
    SUM(CASE WHEN type = 'pengeluaran' THEN amount ELSE 0 END) AS total_pengeluaran,
    SUM(CASE WHEN type = 'pemasukan' THEN amount ELSE 0 END) -
    SUM(CASE WHEN type = 'pengeluaran' THEN amount ELSE 0 END) AS saldo
FROM transactions
WHERE deleted_at IS NULL
GROUP BY DATE_TRUNC('month', date)
ORDER BY bulan DESC;

-- View untuk transaksi aktif
CREATE OR REPLACE VIEW v_transaksi_aktif AS
SELECT
    t.*,
    u.name AS created_by_name,
    u.username AS created_by_username
FROM transactions t
JOIN users u ON t.created_by = u.id
WHERE t.deleted_at IS NULL
ORDER BY t.date DESC, t.created_at DESC;

-- ============================================
-- CATATAN PENTING
-- ============================================
-- 1. Di production, gunakan password hashing (bcrypt, argon2, dll)
-- 2. Untuk RLS policies, jika ingin menggunakan custom auth (bukan Supabase Auth),
--    hapus referensi ke auth.uid() dan ganti dengan logika custom
-- 3. Pastikan untuk menghapus atau mengubah sample data sebelum production
-- 4. Untuk file upload (proof), pertimbangkan menggunakan Supabase Storage
-- ============================================
