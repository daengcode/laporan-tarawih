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

  // Dapatkan user ID dari localStorage
  const getUserId = () => {
    return localStorage.getItem("userId");
  };

  // Set current user ID untuk RLS
  const setCurrentUserId = async () => {
    const userId = getUserId();
    if (userId) {
      await supabase.rpc("set_current_user_id", { user_id: userId });
    }
  };

  // Set current username untuk RLS
  const setCurrentUsername = async (username) => {
    if (username) {
      await supabase.rpc("set_current_username", { username });
    }
  };

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
      // Gunakan function login_user untuk bypass RLS
      const { data, error: fetchError } = await supabase.rpc("login_user", {
        p_username: username,
      });

      if (fetchError) throw fetchError;

      if (!data || data.length === 0) {
        throw new Error("Username atau password salah");
      }

      const userData = data[0];

      // Verifikasi password dengan bcrypt
      const passwordMatch = await bcrypt.compare(password, userData.password);

      if (!passwordMatch) {
        throw new Error("Username atau password salah");
      }

      // Simpan user ke state dan localStorage (tanpa password)
      const { password: _, ...userWithoutPassword } = userData;
      user.value = userWithoutPassword;
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));

      // Simpan user ID untuk RLS
      localStorage.setItem("userId", userData.id);

      // Set current user ID dan username untuk RLS
      await setCurrentUserId();
      await setCurrentUsername(userData.username);

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
    localStorage.removeItem("userId");
  };

  /**
   * Cek apakah user sudah login saat aplikasi dimuat
   */
  const checkAuth = async () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      user.value = JSON.parse(storedUser);
      // Set current user ID dan username untuk RLS
      await setCurrentUserId();
      await setCurrentUsername(user.value.username);
    }
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
    getUserId,
    setCurrentUserId,
    setCurrentUsername,
  };
}
