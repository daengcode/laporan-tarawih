/**
 * Cek Struktur Tabel Users dan Semua Data
 * Jalankan dengan: node test-users-table.mjs
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";

console.log("=== Cek Struktur Tabel Users dan Semua Data ===\n");

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

// Buat Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkUsersTable() {
  try {
    console.log("🔍 Cek semua data di tabel users...\n");

    // Coba select semua data tanpa filter
    const { data: allData, error: allError } = await supabase.from("users").select("*");

    if (allError) {
      console.error("❌ Error saat mengambil semua data users:", allError.message);
      console.error("\nDetail error:", JSON.stringify(allError, null, 2));

      // Coba cek apakah tabelnya ada
      console.log("\n🔍 Cek apakah tabel users ada...");
      const { data: tableData, error: tableError } = await supabase
        .from("users")
        .select("*")
        .limit(1);

      if (tableError) {
        console.error("❌ Tabel users tidak ada atau tidak bisa diakses:", tableError.message);
      } else {
        console.log("✅ Tabel users ada");
      }
      return;
    }

    console.log(`✅ Berhasil mengambil data users`);
    console.log(`   Total data: ${allData?.length || 0}\n`);

    if (allData && allData.length > 0) {
      console.log("📋 Data users:");
      allData.forEach((user, index) => {
        console.log(`\nUser ${index + 1}:`);
        console.log(`  ID: ${user.id}`);
        console.log(`  Username: ${user.username}`);
        console.log(`  Name: ${user.name}`);
        console.log(`  Password: ${user.password}`);
        console.log(`  CreatedAt: ${user.createdAt}`);
        console.log(`  Kolom yang tersedia: ${Object.keys(user).join(", ")}`);
      });
    } else {
      console.log("⚠️  Tidak ada data users di tabel");
    }

    // Cek dengan username 'admin'
    console.log("\n🔍 Cek user dengan username 'admin'...");
    const { data: adminData, error: adminError } = await supabase
      .from("users")
      .select("*")
      .eq("username", "admin");

    if (adminError) {
      console.error("❌ Error saat mencari user admin:", adminError.message);
    } else {
      console.log(
        `✅ Query berhasil, ditemukan ${adminData?.length || 0} user(s) dengan username 'admin'`,
      );

      if (adminData && adminData.length > 0) {
        console.log("\n📋 Data user admin:");
        adminData.forEach((user, index) => {
          console.log(`\nUser admin ${index + 1}:`);
          console.log(`  ID: ${user.id}`);
          console.log(`  Username: ${user.username}`);
          console.log(`  Name: ${user.name}`);
          console.log(`  Password: ${user.password}`);
          console.log(`  CreatedAt: ${user.createdAt}`);
        });
      }
    }

    // Cek dengan password 'password'
    console.log("\n🔍 Cek user dengan password 'password'...");
    const { data: passData, error: passError } = await supabase
      .from("users")
      .select("*")
      .eq("password", "password");

    if (passError) {
      console.error("❌ Error saat mencari user dengan password:", passError.message);
    } else {
      console.log(
        `✅ Query berhasil, ditemukan ${passData?.length || 0} user(s) dengan password 'password'`,
      );

      if (passData && passData.length > 0) {
        console.log("\n📋 Data user dengan password 'password':");
        passData.forEach((user, index) => {
          console.log(`\nUser ${index + 1}:`);
          console.log(`  ID: ${user.id}`);
          console.log(`  Username: ${user.username}`);
          console.log(`  Name: ${user.name}`);
          console.log(`  Password: ${user.password}`);
          console.log(`  CreatedAt: ${user.createdAt}`);
        });
      }
    }
  } catch (error) {
    console.error("\n❌ ERROR:", error.message);
    console.error("\nDetail error:", error);
    process.exit(1);
  }
}

checkUsersTable();
