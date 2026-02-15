/**
 * Insert User dengan Password Hashed (Bcrypt)
 * Jalankan dengan: node insert-user-bcrypt.mjs
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";
import bcrypt from "bcryptjs";
import process from "process";

console.log("=== Insert User dengan Password Hashed (Bcrypt) ===\n");

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

async function insertUserWithBcrypt() {
  try {
    const username = "admin";
    const plainPassword = "admin123";
    const name = "Administrator";

    console.log(`🔐 Hashing password untuk user: ${username}`);

    // Hash password dengan bcrypt (salt rounds: 10)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

    console.log(`✅ Password berhasil di-hash`);
    console.log(`   Plain password: ${plainPassword}`);
    console.log(`   Hashed password: ${hashedPassword}`);
    console.log(`   Salt rounds: ${saltRounds}`);

    // Cek apakah user sudah ada
    console.log("\n🔍 Cek apakah user sudah ada...");
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .maybeSingle();

    if (checkError) {
      console.error("❌ Error saat cek user:", checkError.message);
      return;
    }

    if (existingUser) {
      console.log("⚠️  User sudah ada, menghapus...");

      // Hapus user yang ada
      const { error: deleteError } = await supabase.from("users").delete().eq("username", username);

      if (deleteError) {
        console.error("❌ Gagal menghapus user:", deleteError.message);
        return;
      }

      console.log("✅ User berhasil dihapus");
    }

    // Insert user baru dengan password hashed
    console.log("\n📝 Insert user baru dengan password hashed...");
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert([
        {
          username: username,
          password: hashedPassword,
          name: name,
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error("❌ Gagal insert user:", insertError.message);
      console.error("\nDetail error:", JSON.stringify(insertError, null, 2));
      return;
    }

    console.log("✅ User berhasil dibuat!");
    console.log("\n📋 Data user:");
    console.log(`   ID: ${newUser.id}`);
    console.log(`   Username: ${newUser.username}`);
    console.log(`   Name: ${newUser.name}`);
    console.log(`   Password: [HIDDEN]`);
    console.log(`   created_at: ${newUser.created_at}`);

    console.log("\n=== Login Credentials ===");
    console.log(`Username: ${username}`);
    console.log(`Password: ${plainPassword}`);
    console.log("================================\n");
  } catch (error) {
    console.error("\n❌ ERROR:", error.message);
    console.error("\nDetail error:", error);
    process.exit(1);
  }
}

insertUserWithBcrypt();
