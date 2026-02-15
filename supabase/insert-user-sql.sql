-- ============================================
-- Insert User Admin (Bypass RLS)
-- ============================================
-- Script ini akan menonaktifkan RLS sementara,
-- insert user admin, lalu mengaktifkan kembali RLS

-- Disable RLS sementara
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Cek apakah user admin sudah ada
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM users WHERE username = 'admin') THEN
        RAISE NOTICE 'User admin sudah ada';
    ELSE
        -- Insert user admin
        INSERT INTO users (username, password, name, createdAt, updatedAt)
        VALUES ('admin', 'admin123', 'Administrator', NOW(), NOW());
        RAISE NOTICE 'User admin berhasil dibuat';
    END IF;
END $$;

-- Tampilkan semua users
SELECT * FROM users;

-- Enable RLS kembali
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CATATAN
-- ============================================
-- Username: admin
-- Password: admin123
-- ============================================
