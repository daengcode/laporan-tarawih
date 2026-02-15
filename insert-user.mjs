/**
 * Script untuk Insert User Pertama
 * Jalankan dengan: node insert-user.mjs
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";

console.log("=== Insert User Pertama ===\n");

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

async function insertUser() {
  try {
    // Cek apakah user sudah ada
    console.log("🔍 Cek apakah user 'admin' sudah ada...");
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("*")
      .eq("username", "admin")
      .single();

    if (existingUser) {
      console.log("⚠️  User 'admin' sudah ada:");
      console.log(JSON.stringify(existingUser, null, 2));
      console.log("\nJika ingin membuat user baru dengan username lain, edit file ini.");
      return;
    }

    // Insert user baru
    console.log("📝 Insert user baru...");
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert([
        {
          username: "admin",
          password: "admin123", // Catatan: Di production, gunakan password hashing!
          name: "Administrator",
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error("❌ Gagal insert user:", insertError.message);
      console.error("\nDetail error:", JSON.stringify(insertError, null, 2));
      process.exit(1);
    }

    console.log("✅ User berhasil dibuat!");
    console.log("\nData user:");
    console.log(JSON.stringify(newUser, null, 2));
    console.log("\nLogin credentials:");
    console.log("   Username: admin");
    console.log("   Password: admin123");
    console.log("\n⚠️  CATATAN: Di production, gunakan password hashing (bcrypt, argon2)!");
    console.log("⚠️  CATATAN: Jangan gunakan password plain text di production!");

    // Cek total users setelah insert
    console.log("\n🔍 Cek total users...");
    const { data: allUsers, error: countError } = await supabase.from("users").select("*");

    if (countError) {
      console.error("❌ Error:", countError.message);
    } else {
      console.log(`✅ Total users: ${allUsers?.length || 0}`);
    }
  } catch (error) {
    console.error("\n❌ ERROR:", error.message);
    console.error("\nDetail error:", error);
    process.exit(1);
  }
}

insertUser();
