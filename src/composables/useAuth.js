import { ref, computed } from "vue";
import { supabase } from "@/supabase/client";
import bcrypt from "bcryptjs";

// State global untuk auth
const user = ref(null);
const loading = ref(false);
const error = ref(null);

/**
 * Composable untuk autentikasi user
 * Menggunakan tabel custom 'users' bukan Supabase Auth
 */
export function useAuth() {
  // Cek apakah user sudah login
  const isAuthenticated = computed(() => !!user.value);

  // Dapatkan user yang sedang login dari localStorage
  const getCurrentUser = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      user.value = JSON.parse(storedUser);
    }
    return user.value;
  };

  /**
   * Login user dengan username dan password
   * @param {string} username - Username user
   * @param {string} password - Password user
   * @returns {Promise<{success: boolean, user?: object, error?: string}>}
   */
  const login = async (username, password) => {
    loading.value = true;
    error.value = null;

    try {
      // Gunakan maybeSingle() untuk menghindari error jika tidak ada data
      const { data, error: fetchError } = await supabase
        .from("users")
        .select("*")
        .eq("username", username)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (!data) {
        throw new Error("Username atau password salah");
      }

      // Verifikasi password dengan bcrypt
      const passwordMatch = await bcrypt.compare(password, data.password);

      if (!passwordMatch) {
        throw new Error("Username atau password salah");
      }

      // Simpan user ke state dan localStorage (tanpa password)
      const { password: _, ...userWithoutPassword } = data;
      user.value = userWithoutPassword;
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));

      return { success: true, user: userWithoutPassword };
    } catch (err) {
      error.value = err.message;
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  };

  /**
   * Logout user
   */
  const logout = () => {
    user.value = null;
    localStorage.removeItem("user");
  };

  /**
   * Cek apakah user sudah login saat aplikasi dimuat
   */
  const checkAuth = () => {
    getCurrentUser();
  };

  return {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    checkAuth,
    getCurrentUser,
  };
}
