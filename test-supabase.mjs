/**
 * Test Koneksi Supabase
 * Jalankan dengan: node test-supabase.mjs
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";

console.log("=== Test Koneksi Supabase ===\n");

// Baca file .env
function loadEnv() {
  try {
    const envPath = resolve(".env");
    const envContent = readFileSync(envPath, "utf-8");

    const env = {};
    envContent.split("\n").forEach((line) => {
      const [key, ...valueParts] = line.split("=");
      if (key && !key.startsWith("#")) {
        env[key.trim()] = valueParts.join("=").trim();
      }
    });

    return env;
  } catch (error) {
    console.error("❌ ERROR: File .env tidak ditemukan");
    console.log("\nLangkah-langkah:");
    console.log("1. Copy .env.example ke .env");
    console.log("2. Isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY");
    console.log("3. Jalankan test ini lagi");
    process.exit(1);
  }
}

// Load environment variables
const env = loadEnv();
const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

// Cek environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ ERROR: Supabase URL dan Anon Key harus di-set di file .env");
  console.log("\nLangkah-langkah:");
  console.log("1. Buka file .env");
  console.log("2. Isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY");
  console.log("3. Simpan file dan jalankan test ini lagi");
  process.exit(1);
}

console.log("✅ Environment variables terdeteksi");
console.log(`   URL: ${supabaseUrl}`);
console.log(`   Key: ${supabaseAnonKey.substring(0, 20)}...`);
console.log();

// Buat Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test koneksi dengan query sederhana
async function testConnection() {
  try {
    console.log("🔄 Menguji koneksi ke Supabase...");

    // Test 1: Cek tabel users
    console.log("\n📊 Test 1: Cek tabel users");
    const { data: usersData, error: usersError } = await supabase
      .from("users")
      .select("count", { count: "exact", head: true });

    if (usersError) {
      console.error("❌ Gagal mengakses tabel users:", usersError.message);
      console.log("   Pastikan tabel users sudah dibuat dengan menjalankan supabase/schema.sql");
    } else {
      console.log("✅ Tabel users dapat diakses");
      console.log(`   Total users: ${usersData || 0}`);
    }

    // Test 2: Cek tabel transactions
    console.log("\n📊 Test 2: Cek tabel transactions");
    const { data: transactionsData, error: transactionsError } = await supabase
      .from("transactions")
      .select("count", { count: "exact", head: true });

    if (transactionsError) {
      console.error("❌ Gagal mengakses tabel transactions:", transactionsError.message);
      console.log(
        "   Pastikan tabel transactions sudah dibuat dengan menjalankan supabase/schema.sql",
      );
    } else {
      console.log("✅ Tabel transactions dapat diakses");
      console.log(`   Total transactions: ${transactionsData || 0}`);
    }

    // Test 3: Ambil sample data users (jika ada)
    console.log("\n📊 Test 3: Ambil sample data users");
    const { data: sampleUsers, error: sampleUsersError } = await supabase
      .from("users")
      .select("id, username, name, created_at")
      .limit(5);

    if (sampleUsersError) {
      console.error("❌ Gagal mengambil sample users:", sampleUsersError.message);
    } else {
      console.log("✅ Sample users berhasil diambil");
      if (sampleUsers && sampleUsers.length > 0) {
        console.log(`   Jumlah: ${sampleUsers.length}`);
        sampleUsers.forEach((user) => {
          console.log(`   - ${user.username} (${user.name})`);
        });
      } else {
        console.log("   Belum ada data users");
        console.log("   Tips: Insert user pertama dengan query:");
        console.log(
          `   INSERT INTO users (username, password, name) VALUES ('admin', 'admin123', 'Administrator');`,
        );
      }
    }

    // Test 4: Ambil sample data transactions (jika ada)
    console.log("\n📊 Test 4: Ambil sample data transactions");
    const { data: sampleTransactions, error: sampleTransactionsError } = await supabase
      .from("transactions")
      .select("id, date, name, type, amount")
      .is("deleted_at", null)
      .limit(5);

    if (sampleTransactionsError) {
      console.error("❌ Gagal mengambil sample transactions:", sampleTransactionsError.message);
    } else {
      console.log("✅ Sample transactions berhasil diambil");
      if (sampleTransactions && sampleTransactions.length > 0) {
        console.log(`   Jumlah: ${sampleTransactions.length}`);
        sampleTransactions.forEach((tx) => {
          console.log(
            `   - ${tx.date} | ${tx.name} | ${tx.type} | Rp ${Number(tx.amount).toLocaleString("id-ID")}`,
          );
        });
      } else {
        console.log("   Belum ada data transactions");
      }
    }

    console.log("\n=== Test Selesai ===");
    console.log("✅ Koneksi Supabase berhasil!");
  } catch (error) {
    console.error("\n❌ ERROR:", error.message);
    console.error("\nDetail error:", error);
    process.exit(1);
  }
}

// Jalankan test
testConnection();
