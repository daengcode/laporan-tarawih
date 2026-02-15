/**
 * Disable RLS Sementara (Untuk Development/Testing)
 * Jalankan dengan: node disable-rls.mjs
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";
import process from "process";

console.log("=== Disable RLS Sementara ===\n");

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
    process.exit(1);
  }
}

// Load environment variables
const env = loadEnv();
const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

// Buat Supabase client dengan service role key untuk akses admin
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function disableRLS() {
  try {
    console.log("🔓 Menonaktifkan RLS untuk tabel users...");
    const { error: usersError } = await supabase.rpc("exec_sql", {
      sql: "ALTER TABLE users DISABLE ROW LEVEL SECURITY;",
    });

    if (usersError) {
      console.error("❌ Gagal menonaktifkan RLS users:", usersError.message);
      console.log(
        "\n⚠️  CATATAN: Anda mungkin perlu menjalankan SQL secara manual di Supabase Dashboard",
      );
      console.log("SQL yang perlu dijalankan:");
      console.log("  ALTER TABLE users DISABLE ROW LEVEL SECURITY;");
      console.log("  ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;");
      return;
    }

    console.log("✅ RLS users berhasil dinonaktifkan");

    console.log("\n🔓 Menonaktifkan RLS untuk tabel transactions...");
    const { error: transactionsError } = await supabase.rpc("exec_sql", {
      sql: "ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;",
    });

    if (transactionsError) {
      console.error("❌ Gagal menonaktifkan RLS transactions:", transactionsError.message);
      return;
    }

    console.log("✅ RLS transactions berhasil dinonaktifkan");

    console.log("\n✅ RLS berhasil dinonaktifkan untuk kedua tabel");
    console.log("\n⚠️  CATATAN: Jangan lupa mengaktifkan kembali RLS di production!");
  } catch (error) {
    console.error("\n❌ ERROR:", error.message);
    console.log(
      "\n⚠️  CATATAN: Anda mungkin perlu menjalankan SQL secara manual di Supabase Dashboard",
    );
    console.log("SQL yang perlu dijalankan:");
    console.log("  ALTER TABLE users DISABLE ROW LEVEL SECURITY;");
    console.log("  ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;");
    process.exit(1);
  }
}

disableRLS();
