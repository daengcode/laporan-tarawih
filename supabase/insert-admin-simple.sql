-- ============================================
-- Insert User Admin (Simple)
-- ============================================
-- Script ini akan menonaktifkan RLS, insert user, lalu mengaktifkan kembali

-- Disable RLS
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Tampilkan users sebelum insert
SELECT 'Users sebelum insert:' as status;
SELECT * FROM users;

-- Insert user admin (hapus dulu jika sudah ada)
DELETE FROM users WHERE username = 'admin';

INSERT INTO users (id, username, password, name, createdAt, updatedAt)
VALUES (
    gen_random_uuid(),
    'admin',
    'admin123',
    'Administrator',
    NOW(),
    NOW()
);

-- Tampilkan users setelah insert
SELECT 'Users setelah insert:' as status;
SELECT * FROM users;

-- Enable RLS kembali
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CATATAN
-- ============================================
-- Username: admin
-- Password: admin123
-- ============================================
