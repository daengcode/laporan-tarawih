import { ref } from "vue";
import { supabase } from "@/supabase/client";
import { useAuth } from "./useAuth";

/**
 * Composable untuk Query Laporan Keuangan
 */
export function useLaporan() {
  const { setCurrentUserId } = useAuth();
  const loading = ref(false);
  const error = ref(null);

  /**
   * Ambil semua transaksi (pemasukan & pengeluaran)
   * @param {object} filters - Filter opsional (startDate, endDate, type)
   * @returns {Promise<{success: boolean, data?: array, error?: string}>}
   */
  const getTransaksi = async (filters = {}) => {
    loading.value = true;
    error.value = null;

    try {
      // Set current user ID untuk RLS
      await setCurrentUserId();

      let query = supabase
        .from("transactions")
        .select("*")
        .is("deleted_at", null) // Hanya yang belum dihapus
        .order("date", { ascending: false });

      // Filter berdasarkan tipe transaksi
      if (filters.type) {
        query = query.eq("type", filters.type);
      }

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
   * Ambil ringkasan keuangan (total pemasukan, pengeluaran, saldo)
   * @param {object} filters - Filter opsional (startDate, endDate)
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  const getRingkasanKeuangan = async (filters = {}) => {
    loading.value = true;
    error.value = null;

    try {
      // Set current user ID untuk RLS
      await setCurrentUserId();

      let query = supabase.from("transactions").select("type, amount").is("deleted_at", null);

      // Filter berdasarkan tanggal
      if (filters.startDate) {
        query = query.gte("date", filters.startDate);
      }
      if (filters.endDate) {
        query = query.lte("date", filters.endDate);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      const totalPemasukan = data
        .filter((item) => item.type === "pemasukan")
        .reduce((sum, item) => sum + item.amount, 0);

      const totalPengeluaran = data
        .filter((item) => item.type === "pengeluaran")
        .reduce((sum, item) => sum + item.amount, 0);

      const saldo = totalPemasukan - totalPengeluaran;

      return {
        success: true,
        data: {
          totalPemasukan,
          totalPengeluaran,
          saldo,
        },
      };
    } catch (err) {
      error.value = err.message;
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  };

  /**
   * Ambil transaksi per bulan (untuk grafik/tabel bulanan)
   * @param {number} year - Tahun
   * @returns {Promise<{success: boolean, data?: array, error?: string}>}
   */
  const getTransaksiPerBulan = async (year) => {
    loading.value = true;
    error.value = null;

    try {
      // Set current user ID untuk RLS
      await setCurrentUserId();

      const startDate = `${year}-01-01`;
      const endDate = `${year}-12-31`;

      const { data, error: fetchError } = await supabase
        .from("transactions")
        .select("*")
        .is("deleted_at", null)
        .gte("date", startDate)
        .lte("date", endDate)
        .order("date", { ascending: true });

      if (fetchError) throw fetchError;

      // Group by month
      const monthlyData = Array.from({ length: 12 }, (_, i) => ({
        bulan: i + 1,
        namaBulan: getNamaBulan(i + 1),
        pemasukan: 0,
        pengeluaran: 0,
        saldo: 0,
      }));

      data.forEach((transaksi) => {
        const month = new Date(transaksi.date).getMonth();
        if (transaksi.type === "pemasukan") {
          monthlyData[month].pemasukan += transaksi.amount;
        } else {
          monthlyData[month].pengeluaran += transaksi.amount;
        }
        monthlyData[month].saldo = monthlyData[month].pemasukan - monthlyData[month].pengeluaran;
      });

      return { success: true, data: monthlyData };
    } catch (err) {
      error.value = err.message;
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  };

  /**
   * Ambil transaksi per hari (untuk tabel harian)
   * @param {string} startDate - Tanggal mulai (YYYY-MM-DD)
   * @param {string} endDate - Tanggal akhir (YYYY-MM-DD)
   * @returns {Promise<{success: boolean, data?: array, error?: string}>}
   */
  const getTransaksiPerHari = async (startDate, endDate) => {
    loading.value = true;
    error.value = null;

    try {
      // Set current user ID untuk RLS
      await setCurrentUserId();

      const { data, error: fetchError } = await supabase
        .from("transactions")
        .select("*")
        .is("deleted_at", null)
        .gte("date", startDate)
        .lte("date", endDate)
        .order("date", { ascending: true });

      if (fetchError) throw fetchError;

      // Group by date
      const dailyData = {};
      data.forEach((transaksi) => {
        if (!dailyData[transaksi.date]) {
          dailyData[transaksi.date] = {
            tanggal: transaksi.date,
            pemasukan: 0,
            pengeluaran: 0,
            saldo: 0,
            transaksi: [],
          };
        }

        if (transaksi.type === "pemasukan") {
          dailyData[transaksi.date].pemasukan += transaksi.amount;
        } else {
          dailyData[transaksi.date].pengeluaran += transaksi.amount;
        }

        dailyData[transaksi.date].transaksi.push(transaksi);
        dailyData[transaksi.date].saldo =
          dailyData[transaksi.date].pemasukan - dailyData[transaksi.date].pengeluaran;
      });

      return { success: true, data: Object.values(dailyData) };
    } catch (err) {
      error.value = err.message;
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  };

  /**
   * Ambil transaksi berdasarkan sumber (untuk pemasukan)
   * @param {object} filters - Filter opsional (startDate, endDate)
   * @returns {Promise<{success: boolean, data?: array, error?: string}>}
   */
  const getTransaksiBySource = async (filters = {}) => {
    loading.value = true;
    error.value = null;

    try {
      // Set current user ID untuk RLS
      await setCurrentUserId();

      let query = supabase
        .from("transactions")
        .select("*")
        .eq("type", "pemasukan")
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

      // Group by source
      const sourceData = {};
      data.forEach((transaksi) => {
        const source = transaksi.source || "Lainnya";
        if (!sourceData[source]) {
          sourceData[source] = {
            source,
            total: 0,
            count: 0,
          };
        }
        sourceData[source].total += transaksi.amount;
        sourceData[source].count += 1;
      });

      return { success: true, data: Object.values(sourceData) };
    } catch (err) {
      error.value = err.message;
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  };

  /**
   * Ambil transaksi berdasarkan tipe pengeluaran
   * @param {object} filters - Filter opsional (startDate, endDate)
   * @returns {Promise<{success: boolean, data?: array, error?: string}>}
   */
  const getTransaksiByexpense_type = async (filters = {}) => {
    loading.value = true;
    error.value = null;

    try {
      // Set current user ID untuk RLS
      await setCurrentUserId();

      let query = supabase
        .from("transactions")
        .select("*")
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

      // Group by expense type
      const expense_typeData = {};
      data.forEach((transaksi) => {
        const expense_type = transaksi.expense_type || "Lainnya";
        if (!expense_typeData[expense_type]) {
          expense_typeData[expense_type] = {
            expense_type,
            total: 0,
            count: 0,
          };
        }
        expense_typeData[expense_type].total += transaksi.amount;
        expense_typeData[expense_type].count += 1;
      });

      return { success: true, data: Object.values(expense_typeData) };
    } catch (err) {
      error.value = err.message;
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  };

  /**
   * Export data transaksi ke format tertentu (CSV/JSON)
   * @param {object} filters - Filter opsional (startDate, endDate, type)
   * @param {string} format - Format export ('csv' atau 'json')
   * @returns {Promise<{success: boolean, data?: string, error?: string}>}
   */
  const exportTransaksi = async (filters = {}, format = "json") => {
    loading.value = true;
    error.value = null;

    try {
      const { success, data, error: fetchError } = await getTransaksi(filters);

      if (!success) {
        throw new Error(fetchError);
      }

      if (format === "csv") {
        const headers = [
          "ID",
          "Tanggal",
          "Nama",
          "Tipe",
          "Jumlah",
          "Sumber/Tipe",
          "Dibuat Oleh",
          "Dibuat Pada",
        ];
        const rows = data.map((item) => [
          item.id,
          item.date,
          item.name,
          item.type,
          item.amount,
          item.source || item.expense_type || "-",
          item.created_by,
          item.created_at,
        ]);

        const csvContent = [
          headers.join(","),
          ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
        ].join("\n");

        return { success: true, data: csvContent };
      } else {
        return { success: true, data: JSON.stringify(data, null, 2) };
      }
    } catch (err) {
      error.value = err.message;
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  };

  // Helper function untuk nama bulan
  function getNamaBulan(bulan) {
    const namaBulan = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    return namaBulan[bulan - 1];
  }

  return {
    loading,
    error,
    getTransaksi,
    getRingkasanKeuangan,
    getTransaksiPerBulan,
    getTransaksiPerHari,
    getTransaksiBySource,
    getTransaksiByexpense_type,
    exportTransaksi,
  };
}
