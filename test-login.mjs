/**
 * Test Login - Cek User di Database
 * Jalankan dengan: node test-login.mjs
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";

console.log("=== Test Login - Cek User di Database ===\n");

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

async function testLogin() {
  try {
    const testUsername = "admin";
    const testPassword = "admin123";

    console.log(`🔍 Mencari user dengan username: ${testUsername}`);

    // Cek user
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("username", testUsername);

    if (userError) {
      console.error("❌ Error saat mencari user:", userError.message);
      console.error("\nDetail error:", JSON.stringify(userError, null, 2));
      return;
    }

    console.log(
      `✅ Query berhasil, ditemukan ${userData?.length || 0} user(s) dengan username '${testUsername}'`,
    );

    if (!userData || userData.length === 0) {
      console.log("\n⚠️  User tidak ditemukan!");
      console.log("Silakan jalankan: node insert-user.mjs");
      return;
    }

    console.log("\n📋 Data user:");
    userData.forEach((user, index) => {
      console.log(`\nUser ${index + 1}:`);
      console.log(`  ID: ${user.id}`);
      console.log(`  Username: ${user.username}`);
      console.log(`  Name: ${user.name}`);
      console.log(`  Password: ${user.password}`);
      console.log(`  CreatedAt: ${user.createdAt}`);
    });

    // Cek password
    const user = userData[0];
    console.log("\n🔐 Cek password:");
    console.log(`  Input password: "${testPassword}"`);
    console.log(`  Database password: "${user.password}"`);
    console.log(`  Password cocok: ${user.password === testPassword ? "✅ YA" : "❌ TIDAK"}`);

    if (user.password !== testPassword) {
      console.log("\n⚠️  Password tidak cocok!");
      console.log("Pastikan password di database sama dengan yang diinput.");
    } else {
      console.log("\n✅ Password cocok! Login seharusnya berhasil.");
    }

    // Cek RLS
    console.log("\n🔒 Cek RLS:");
    const { data: rlsData, error: rlsError } = await supabase.from("users").select("*").limit(1);

    if (rlsError) {
      console.error("❌ RLS mungkin memblokir akses:", rlsError.message);
    } else {
      console.log("✅ RLS tidak memblokir akses");
    }
  } catch (error) {
    console.error("\n❌ ERROR:", error.message);
    console.error("\nDetail error:", error);
    process.exit(1);
  }
}

testLogin();
