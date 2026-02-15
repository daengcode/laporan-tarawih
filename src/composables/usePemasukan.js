import { ref } from "vue";
import { supabase } from "@/supabase/client";

/**
 * Composable untuk CRUD Pemasukan
 */
export function usePemasukan() {
  const loading = ref(false);
  const error = ref(null);

  /**
   * Ambil semua data pemasukan
   * @param {object} filters - Filter opsional (startDate, endDate)
   * @returns {Promise<{success: boolean, data?: array, error?: string}>}
   */
  const getPemasukan = async (filters = {}) => {
    loading.value = true;
    error.value = null;

    try {
      let query = supabase
        .from("transactions")
        .select("*")
        .eq("type", "pemasukan")
        .is("deletedAt", null) // Hanya yang belum dihapus
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
   * Ambil data pemasukan berdasarkan ID
   * @param {string} id - ID transaksi
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  const getPemasukanById = async (id) => {
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
   * Tambah pemasukan baru
   * @param {object} pemasukan - Data pemasukan
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  const addPemasukan = async (pemasukan) => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: insertError } = await supabase
        .from("transactions")
        .insert([
          {
            date: pemasukan.date,
            name: pemasukan.name,
            type: "pemasukan",
            amount: pemasukan.amount,
            source: pemasukan.source || null,
            proof: pemasukan.proof || null,
            createdBy: pemasukan.createdBy,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
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
   * Update pemasukan
   * @param {string} id - ID transaksi
   * @param {object} pemasukan - Data pemasukan yang diupdate
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  const updatePemasukan = async (id, pemasukan) => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: updateError } = await supabase
        .from("transactions")
        .update({
          date: pemasukan.date,
          name: pemasukan.name,
          amount: pemasukan.amount,
          source: pemasukan.source || null,
          proof: pemasukan.proof || null,
          updatedAt: new Date().toISOString(),
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
   * Hapus pemasukan (soft delete)
   * @param {string} id - ID transaksi
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  const deletePemasukan = async (id) => {
    loading.value = true;
    error.value = null;

    try {
      const { error: deleteError } = await supabase
        .from("transactions")
        .update({ deletedAt: new Date().toISOString() })
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
   * Hitung total pemasukan
   * @param {object} filters - Filter opsional (startDate, endDate)
   * @returns {Promise<{success: boolean, total?: number, error?: string}>}
   */
  const getTotalPemasukan = async (filters = {}) => {
    loading.value = true;
    error.value = null;

    try {
      let query = supabase
        .from("transactions")
        .select("amount")
        .eq("type", "pemasukan")
        .is("deletedAt", null);

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
    getPemasukan,
    getPemasukanById,
    addPemasukan,
    updatePemasukan,
    deletePemasukan,
    getTotalPemasukan,
  };
}
