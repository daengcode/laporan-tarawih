import { ref } from "vue";
import { supabase } from "@/supabase/client";
import { useAuth } from "./useAuth";

/**
 * Composable untuk CRUD Pengeluaran
 */
export function usePengeluaran() {
  const { setCurrentUserId, getUserId } = useAuth();
  const loading = ref(false);
  const error = ref(null);

  /**
   * Ambil semua data pengeluaran
   * @param {object} filters - Filter opsional (startDate, endDate)
   * @returns {Promise<{success: boolean, data?: array, error?: string}>}
   */
  const getPengeluaran = async (filters = {}) => {
    loading.value = true;
    error.value = null;

    try {
      let query = supabase
        .from("transactions")
        .select("*")
        .eq("type", "pengeluaran")
        .is("deleted_at", null) // Hanya yang belum dihapus
        .order("date", { ascending: false });

      // Filter berdasarkan tanggal
      if (filters.startDate) {
        query = query.gte("date", filters.startDate);
      }
      if (filters.endDate) {
        query = query.lte("date", filters.endDate);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      return { success: true, data };
    } catch (err) {
      error.value = err.message;
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  };

  /**
   * Ambil data pengeluaran berdasarkan ID
   * @param {string} id - ID transaksi
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  const getPengeluaranById = async (id) => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: fetchError } = await supabase
        .from("transactions")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      return { success: true, data };
    } catch (err) {
      error.value = err.message;
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  };

  /**
   * Tambah pengeluaran baru
   * @param {object} pengeluaran - Data pengeluaran
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  const addPengeluaran = async (pengeluaran) => {
    loading.value = true;
    error.value = null;

    try {
      // Set current user ID untuk RLS
      await setCurrentUserId();

      // Gunakan user ID yang sedang login
      const userId = getUserId();

      // Format waktu ke timezone Asia/Makassar (UTC+8)
      const now = new Date();
      // Ambil waktu dalam format Asia/Makassar
      const makassarDateString = now.toLocaleString("en-US", {
        timeZone: "Asia/Makassar",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      // Parse dan format ke YYYY-MM-DD HH:mm:ss.sss
      const [datePart, timePart] = makassarDateString.split(", ");
      const [month, day, year] = datePart.split("/");
      const formattedDateTime = `${year}-${month}-${day} ${timePart}.${now.getMilliseconds().toString().padStart(3, "0")}`;

      const { data, error: insertError } = await supabase
        .from("transactions")
        .insert([
          {
            date: pengeluaran.date,
            name: pengeluaran.name,
            type: "pengeluaran",
            amount: pengeluaran.amount,
            expense_type: pengeluaran.expense_type || null,
            proof: pengeluaran.proof || null,
            created_by: userId,
            created_at: formattedDateTime,
            updated_at: formattedDateTime,
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      return { success: true, data };
    } catch (err) {
      error.value = err.message;
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  };

  /**
   * Update pengeluaran
   * @param {string} id - ID transaksi
   * @param {object} pengeluaran - Data pengeluaran yang diupdate
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  const updatePengeluaran = async (id, pengeluaran) => {
    loading.value = true;
    error.value = null;

    try {
      // Set current user ID untuk RLS
      await setCurrentUserId();

      // Format waktu ke timezone Asia/Makassar (UTC+8)
      const now = new Date();
      // Ambil waktu dalam format Asia/Makassar
      const makassarDateString = now.toLocaleString("en-US", {
        timeZone: "Asia/Makassar",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      // Parse dan format ke YYYY-MM-DD HH:mm:ss.sss
      const [datePart, timePart] = makassarDateString.split(", ");
      const [month, day, year] = datePart.split("/");
      const formattedDateTime = `${year}-${month}-${day} ${timePart}.${now.getMilliseconds().toString().padStart(3, "0")}`;

      const { data, error: updateError } = await supabase
        .from("transactions")
        .update({
          date: pengeluaran.date,
          name: pengeluaran.name,
          amount: pengeluaran.amount,
          expense_type: pengeluaran.expense_type || null,
          proof: pengeluaran.proof || null,
          updated_at: formattedDateTime,
        })
        .eq("id", id)
        .select()
        .single();

      if (updateError) throw updateError;

      return { success: true, data };
    } catch (err) {
      error.value = err.message;
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  };

  /**
   * Hapus pengeluaran (soft delete)
   * @param {string} id - ID transaksi
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  const deletePengeluaran = async (id) => {
    loading.value = true;
    error.value = null;

    try {
      // Set current user ID untuk RLS
      await setCurrentUserId();

      // Format waktu ke timezone Asia/Makassar (UTC+8)
      const now = new Date();
      // Ambil waktu dalam format Asia/Makassar
      const makassarDateString = now.toLocaleString("en-US", {
        timeZone: "Asia/Makassar",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      // Parse dan format ke YYYY-MM-DD HH:mm:ss.sss
      const [datePart, timePart] = makassarDateString.split(", ");
      const [month, day, year] = datePart.split("/");
      const formattedDateTime = `${year}-${month}-${day} ${timePart}.${now.getMilliseconds().toString().padStart(3, "0")}`;

      const { error: deleteError } = await supabase
        .from("transactions")
        .update({ deleted_at: formattedDateTime })
        .eq("id", id);

      if (deleteError) throw deleteError;

      return { success: true };
    } catch (err) {
      error.value = err.message;
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  };

  /**
   * Hitung total pengeluaran
   * @param {object} filters - Filter opsional (startDate, endDate)
   * @returns {Promise<{success: boolean, total?: number, error?: string}>}
   */
  const getTotalPengeluaran = async (filters = {}) => {
    loading.value = true;
    error.value = null;

    try {
      let query = supabase
        .from("transactions")
        .select("amount")
        .eq("type", "pengeluaran")
        .is("deleted_at", null);

      // Filter berdasarkan tanggal
      if (filters.startDate) {
        query = query.gte("date", filters.startDate);
      }
      if (filters.endDate) {
        query = query.lte("date", filters.endDate);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      const total = data.reduce((sum, item) => sum + item.amount, 0);

      return { success: true, total };
    } catch (err) {
      error.value = err.message;
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    error,
    getPengeluaran,
    getPengeluaranById,
    addPengeluaran,
    updatePengeluaran,
    deletePengeluaran,
    getTotalPengeluaran,
  };
}
