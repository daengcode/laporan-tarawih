import { createClient } from "@supabase/supabase-js";

// Konfigurasi Supabase Client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validasi environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase URL dan Anon Key harus di-set di file .env. " +
      "Copy .env.example ke .env dan isi dengan kredensial Supabase Anda.",
  );
}

// Buat Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Export default untuk kemudahan penggunaan
export default supabase;
