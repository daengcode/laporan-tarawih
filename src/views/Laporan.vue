<template>
  <div
    class="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen pb-24"
  >
    <!-- Header Section -->
    <header
      class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-primary/10 px-4 py-4"
    >
      <div class="flex items-center justify-between max-w-md mx-auto">
        <button
          @click="router.push('/')"
          class="flex size-10 items-center justify-center rounded-full hover:bg-background-light transition-colors"
        >
          <span class="material-symbols-outlined text-[#111814]">arrow_back</span>
        </button>
        <h1 class="text-[#111814] text-lg text-center font-bold leading-tight tracking-tight">
          Laporan Amaliyah Ramadhan 1447 H <br> Masjid Baiturrahim
        </h1>
        <Logout />
      </div>
      <!-- Date Scroller -->
      <DateScroller :dates="dates" :selected-date="selectedDate" @select-date="selectDate" />
    </header>

    <main class="max-w-md mx-auto p-4 space-y-4">
      <!-- Saldo Sebelumnya Card -->
      <div class="bg-white dark:bg-slate-900 p-5 rounded-xl border border-primary/10 shadow-sm">
        <div class="flex items-center gap-3 mb-1">
          <span class="material-symbols-outlined text-primary">account_balance_wallet</span>
          <p class="text-sm font-medium text-slate-500 dark:text-slate-400">Saldo Kas Sebelumnya</p>
        </div>
        <p class="text-2xl font-extrabold text-slate-900 dark:text-white">
          {{ formatCurrency(saldoSebelumnya) }}
        </p>
      </div>

      <!-- Pemasukan Section -->
      <section
        v-if="getPemasukanByDateGrouped(selectedDateDate).length > 0"
        class="bg-white dark:bg-slate-900 rounded-xl border border-primary/10 shadow-sm overflow-hidden"
      >
        <div class="bg-primary/10 px-5 py-3 flex items-center justify-between">
          <h2 class="font-bold text-primary flex items-center gap-2">
            <span class="material-symbols-outlined text-xl">trending_up</span>
            Pemasukan
          </h2>
        </div>
        <div class="p-5 space-y-4">
          <!-- Kotak Amal Laki-laki & Perempuan (tampilkan source) -->
          <div
            v-for="item in getPemasukanByDateGrouped(selectedDateDate).filter(
              (i) => i.source === 'Kotak Amal Laki-laki' || i.source === 'Kotak Amal Perempuan',
            )"
            :key="item.source"
            class="flex justify-between items-center"
          >
            <div class="flex items-center gap-3">
              <div
                class="size-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center"
              >
                <span class="material-symbols-outlined text-blue-500 text-lg">payments</span>
              </div>
              <span class="text-slate-600 dark:text-slate-300 font-medium">{{ item.source }}</span>
            </div>
            <span class="font-bold text-slate-900 dark:text-white">{{
              formatCurrency(item.total)
            }}</span>
          </div>
          <!-- Donatur lainnya (tampilkan nama donatur) -->
          <div
            v-for="item in getPemasukanByDateGrouped(selectedDateDate).filter(
              (i) => i.source !== 'Kotak Amal Laki-laki' && i.source !== 'Kotak Amal Perempuan',
            )"
            :key="item.source"
            class="space-y-2"
          >
            <div
              v-for="donatur in item.items"
              :key="donatur.id"
              class="flex justify-between items-center"
            >
              <div class="flex items-center gap-3">
                <div
                  class="size-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center"
                >
                  <span class="material-symbols-outlined text-blue-500 text-lg">payments</span>
                </div>
                <span class="text-slate-600 dark:text-slate-300 font-medium">
                  {{ item.source }} dari {{ donatur.name }}
                </span>
              </div>
              <span class="font-bold text-slate-900 dark:text-white">{{
                formatCurrency(donatur.amount)
              }}</span>
            </div>
          </div>
          <div
            class="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center"
          >
            <span class="text-sm font-bold text-slate-400 uppercase tracking-tighter"
              >Total Pemasukan</span
            >
            <span class="text-lg font-extrabold text-primary">{{
              formatCurrency(totalPemasukan)
            }}</span>
          </div>
        </div>
      </section>

      <!-- Pengeluaran Section -->
      <section
        v-if="getPengeluaranByDateGrouped(selectedDateDate).length > 0"
        class="bg-white dark:bg-slate-900 rounded-xl border border-primary/10 shadow-sm overflow-hidden"
      >
        <div class="bg-orange-50 dark:bg-orange-950/20 px-5 py-3 flex items-center justify-between">
          <h2 class="font-bold text-orange-600 dark:text-orange-400 flex items-center gap-2">
            <span class="material-symbols-outlined text-xl">trending_down</span>
            Pengeluaran
          </h2>
        </div>
        <div class="p-5 space-y-4">
          <!-- Rutin (tampilkan expense_type) -->
          <div
            v-for="item in getPengeluaranByDateGrouped(selectedDateDate).filter(
              (i) => i.expense_type === 'Rutin',
            )"
            :key="item.expense_type"
            class="flex justify-between items-center"
          >
            <div class="flex items-center gap-3">
              <div
                class="size-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center"
              >
                <span class="material-symbols-outlined text-slate-500 text-lg">receipt</span>
              </div>
              <span class="text-slate-600 dark:text-slate-300 font-medium">{{
                item.expense_type
              }}</span>
            </div>
            <span class="font-bold text-slate-900 dark:text-white">{{
              formatCurrency(item.total)
            }}</span>
          </div>
          <!-- Pengeluaran lainnya (tampilkan nama pengeluaran) -->
          <div
            v-for="item in getPengeluaranByDateGrouped(selectedDateDate).filter(
              (i) => i.expense_type !== 'Rutin',
            )"
            :key="item.expense_type"
            class="space-y-2"
          >
            <div
              v-for="pengeluaran in item.items"
              :key="pengeluaran.id"
              class="flex justify-between items-center"
            >
              <div class="flex items-center gap-3">
                <div
                  class="size-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center"
                >
                  <span class="material-symbols-outlined text-slate-500 text-lg">receipt</span>
                </div>
                <span class="text-slate-600 dark:text-slate-300 font-medium">{{
                  pengeluaran.name
                }}</span>
              </div>
              <span class="font-bold text-slate-900 dark:text-white">{{
                formatCurrency(pengeluaran.amount)
              }}</span>
            </div>
          </div>
          <div
            class="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center"
          >
            <span class="text-sm font-bold text-slate-400 uppercase tracking-tighter"
              >Total Pengeluaran</span
            >
            <span class="text-lg font-extrabold text-orange-600 dark:text-orange-400">{{
              formatCurrency(totalPengeluaran)
            }}</span>
          </div>
        </div>
      </section>

      <!-- Saldo Sekarang Highlight -->
      <div
        class="bg-background-dark text-white p-6 rounded-2xl shadow-xl relative overflow-hidden group"
      >
        <div
          class="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-2xl"
        ></div>
        <div class="relative z-10 flex flex-col items-center text-center">
          <p class="text-sm font-medium text-primary uppercase tracking-[0.2em] mb-2">
            Saldo Kas Sekarang
          </p>
          <p class="text-3xl font-black">{{ formatCurrency(saldoSekarang) }}</p>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="
          getPemasukanByDate(selectedDateDate).length === 0 &&
          getPengeluaranByDate(selectedDateDate).length === 0
        "
        class="bg-white dark:bg-slate-900 p-8 rounded-xl border border-primary/10 shadow-sm text-center"
      >
        <div class="text-slate-300 dark:text-slate-700 mb-3">
          <span class="material-symbols-outlined text-5xl">receipt_long</span>
        </div>
        <p class="text-sm text-slate-500 dark:text-slate-400">
          Tidak ada transaksi pada tanggal ini
        </p>
      </div>

      <!-- Bendahara Section -->
      <section
        class="bg-white dark:bg-slate-900 p-6 rounded-xl border border-primary/10 shadow-sm text-center"
      >
        <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Bendahara</p>
        <div
          class="w-full h-24 border-b-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center relative mb-4"
        >
          <!-- Placeholder for signature -->
          <div class="text-slate-300 dark:text-slate-700 select-none">
            <span class="material-symbols-outlined text-5xl">draw</span>
          </div>
          <div class="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent"></div>
        </div>
        <p class="text-lg font-bold text-slate-900 dark:text-white">Bendahara Masjid</p>
      </section>
    </main>

    <!-- Bottom Menu Component -->
    <BottomMenu current-page="laporan" @open-modal="showAddModal = true" />

    <!-- Add Modal -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-2xl p-6 w-full max-w-sm">
        <h3 class="text-lg font-bold text-center mb-6">Pilih Jenis Transaksi</h3>
        <div class="space-y-3">
          <button
            @click="goToInputPemasukan"
            class="w-full flex items-center gap-4 p-4 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors"
          >
            <div
              class="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center"
            >
              <span class="material-symbols-outlined">trending_up</span>
            </div>
            <span class="font-bold text-primary">Pemasukan</span>
          </button>
          <button
            @click="goToInputPengeluaran"
            class="w-full flex items-center gap-4 p-4 rounded-xl bg-red-50 border border-red-200 hover:bg-red-100 transition-colors"
          >
            <div
              class="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center"
            >
              <span class="material-symbols-outlined">trending_down</span>
            </div>
            <span class="font-bold text-red-500">Pengeluaran</span>
          </button>
        </div>
        <button
          @click="showAddModal = false"
          class="w-full mt-6 py-3 text-gray-500 font-medium hover:text-gray-700 transition-colors"
        >
          Batal
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import { useLaporan } from "@/composables/useLaporan";
import BottomMenu from "@/components/BottomMenu.vue";
import Logout from "@/components/Logout.vue";
import DateScroller from "@/components/DateScroller.vue";

const router = useRouter();
const { logout, checkAuth } = useAuth();
const { getTransaksi } = useLaporan();

// State
const loading = ref(false);
const transactions = ref([]);
const dates = ref([]);
const selectedDate = ref(null);
const saldoSebelumnya = ref(0);
const showAddModal = ref(false);

// Helper function untuk format tanggal Indonesia
const formatDateIndo = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

// Ambil data transaksi dari database
const fetchTransactions = async () => {
  loading.value = true;
  try {
    const result = await getTransaksi();
    if (result.success) {
      transactions.value = result.data;
      groupTransactionsByDate();
    } else {
      console.error("Gagal mengambil transaksi:", result.error);
      alert("Gagal memuat data: " + (result.error || "Terjadi kesalahan"));
    }
  } catch (error) {
    console.error("Gagal mengambil transaksi:", error);
    alert("Gagal memuat data: " + (error.message || "Terjadi kesalahan"));
  } finally {
    loading.value = false;
  }
};

// Kelompokkan transaksi berdasarkan tanggal
const groupTransactionsByDate = () => {
  // Group transaksi berdasarkan tanggal
  const grouped = {};
  transactions.value.forEach((transaction) => {
    if (!grouped[transaction.date]) {
      grouped[transaction.date] = [];
    }
    grouped[transaction.date].push(transaction);
  });

  // Buat array tanggal unik dan urutkan descending
  const uniqueDates = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));

  // Buat array dates untuk Date Scroller
  dates.value = uniqueDates.map((date, index) => ({
    id: index,
    display: formatDateIndo(date),
    date: date,
    transactions: grouped[date],
  }));

  // Set tanggal yang dipilih ke tanggal terbaru
  if (dates.value.length > 0) {
    selectedDate.value = dates.value[0].id;
    updateFinancialData(dates.value[0].date);
  }
};

// Update data keuangan berdasarkan tanggal yang dipilih
const updateFinancialData = (date) => {
  // Hitung saldo sebelumnya (total semua transaksi sebelum tanggal yang dipilih)
  const selectedDateObj = new Date(date);
  saldoSebelumnya.value = transactions.value
    .filter((t) => new Date(t.date) < selectedDateObj)
    .reduce((sum, t) => {
      if (t.type === "pemasukan") {
        return sum + t.amount;
      } else {
        return sum - t.amount;
      }
    }, 0);
};

// Get tanggal yang dipilih
const selectedDateDate = computed(() => {
  const selectedDateData = dates.value.find((d) => d.id === selectedDate.value);
  return selectedDateData ? selectedDateData.date : null;
});

// Get pemasukan berdasarkan tanggal dan groupby source dengan detail
const getPemasukanByDateGrouped = (date) => {
  const pemasukan = transactions.value.filter((t) => t.date === date && t.type === "pemasukan");
  const grouped = {};
  pemasukan.forEach((p) => {
    const source = p.source || "Lainnya";
    if (!grouped[source]) {
      grouped[source] = {
        source,
        total: 0,
        items: [],
      };
    }
    grouped[source].total += p.amount;
    grouped[source].items.push({
      id: p.id,
      name: p.name,
      amount: p.amount,
    });
  });
  return Object.values(grouped);
};

// Get pengeluaran berdasarkan tanggal dan groupby expense_type dengan detail
const getPengeluaranByDateGrouped = (date) => {
  const pengeluaran = transactions.value.filter((t) => t.date === date && t.type === "pengeluaran");
  const grouped = {};
  pengeluaran.forEach((p) => {
    const expense_type = p.expense_type || "Lainnya";
    if (!grouped[expense_type]) {
      grouped[expense_type] = {
        expense_type,
        total: 0,
        items: [],
      };
    }
    grouped[expense_type].total += p.amount;
    grouped[expense_type].items.push({
      id: p.id,
      name: p.name,
      amount: p.amount,
    });
  });
  return Object.values(grouped);
};

// Get pemasukan berdasarkan tanggal
const getPemasukanByDate = (date) => {
  return transactions.value.filter((t) => t.date === date && t.type === "pemasukan");
};

// Get pengeluaran berdasarkan tanggal
const getPengeluaranByDate = (date) => {
  return transactions.value.filter((t) => t.date === date && t.type === "pengeluaran");
};

// Computed
const totalPemasukan = computed(() => {
  const grouped = getPemasukanByDateGrouped(selectedDateDate.value);
  return grouped.reduce((sum, item) => sum + item.total, 0);
});

const totalPengeluaran = computed(() => {
  const grouped = getPengeluaranByDateGrouped(selectedDateDate.value);
  return grouped.reduce((sum, item) => sum + item.total, 0);
});

const saldoSekarang = computed(
  () => saldoSebelumnya.value + totalPemasukan.value - totalPengeluaran.value,
);

// Methods
const selectDate = (date) => {
  selectedDate.value = date.id;
  updateFinancialData(date.date);
};

const goToInputPemasukan = () => {
  showAddModal.value = false;
  router.push("/input-pemasukan");
};

const goToInputPengeluaran = () => {
  showAddModal.value = false;
  router.push("/input-pengeluaran");
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

// Load data saat component di-mount
onMounted(async () => {
  await checkAuth();
  fetchTransactions();
});
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
