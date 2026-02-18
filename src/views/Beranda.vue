<template>
  <div class="bg-background-light dark:bg-background-dark min-h-screen pb-24">
    <!-- Header Section -->
    <header
      class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-primary/10 px-4 py-4"
    >
      <div class="flex items-center justify-between max-w-md mx-auto">
        <div class="flex items-center gap-3">
          <div class="bg-primary/10 p-2 rounded-lg text-primary">
            <span class="material-symbols-outlined">mosque</span>
          </div>
          <div>
            <h1 class="text-[#111814] text-lg font-bold leading-tight tracking-tight">
              Masjid Baiturrahim Ramadhan 1447 H
            </h1>
            <p v-if="user" class="text-xs text-gray-500">Halo, {{ user.name }}</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <Logout />
        </div>
      </div>
      <!-- Date Scroller -->
      <DateScroller :dates="dates" :selected-date="selectedDate" @select-date="selectDate" />
    </header>

    <main class="max-w-md mx-auto p-4 space-y-6">
      <!-- Summary Card -->
      <div
        class="islamic-pattern rounded-2xl p-6 text-white shadow-xl shadow-primary/30 relative overflow-hidden"
      >
        <div class="relative z-10">
          <p class="text-white/80 text-sm font-medium mb-1">SALDO PEMASUKAN</p>
          <h2 class="text-3xl font-extrabold tracking-tight mb-6">
            {{ formatCurrency(currentBalance) }}
          </h2>
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20">
              <div class="flex items-center gap-2 mb-1">
                <span class="material-symbols-outlined text-sm">trending_up</span>
                <p class="text-xs font-medium uppercase tracking-wider text-white/90">Pemasukan</p>
              </div>
              <p class="text-lg font-bold">{{ formatCurrency(currentIncome) }}</p>
            </div>
            <div class="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20">
              <div class="flex items-center gap-2 mb-1 text-gold">
                <span class="material-symbols-outlined text-sm">trending_down</span>
                <p class="text-xs font-medium uppercase tracking-wider text-white/90">
                  Pengeluaran
                </p>
              </div>
              <p class="text-lg font-bold">{{ formatCurrency(currentExpense) }}</p>
            </div>
          </div>
        </div>
        <!-- Decorative circle -->
        <div
          class="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"
        ></div>
      </div>

      <!-- Recent Transactions -->
      <section class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-[#111814] text-base font-bold">Transaksi Terbaru</h3>
          <button
            @click="showShareModal = true"
            class="flex items-center gap-2 text-primary text-sm font-bold bg-primary/5 px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors"
          >
            <span class="material-symbols-outlined text-lg">share</span>
            <span>Bagikan</span>
          </button>
        </div>
        <div class="space-y-3">
          <div
            v-for="transaction in recentTransactions"
            :key="transaction.id"
            @click="handleTransactionClick(transaction)"
            class="flex items-center justify-between p-4 bg-white rounded-2xl border border-primary/5 shadow-sm cursor-pointer hover:border-primary/30 transition-colors"
          >
            <div class="flex items-center gap-4">
              <div
                :class="[
                  'w-12 h-12 flex items-center justify-center rounded-full',
                  transaction.type === 'income'
                    ? 'bg-primary/10 text-primary'
                    : 'bg-gold/10 text-gold',
                ]"
              >
                <span class="material-symbols-outlined">{{ transaction.icon }}</span>
              </div>
              <div>
                <p class="text-[#111814] font-bold text-sm">{{ transaction.title }}</p>
                <p class="text-gray-400 text-xs">
                  {{ transaction.time }} • {{ transaction.category }}
                </p>
              </div>
            </div>
            <div class="text-right">
              <p
                :class="[
                  'font-bold text-sm',
                  transaction.type === 'income' ? 'text-primary' : 'text-red-500',
                ]"
              >
                {{ transaction.type === "income" ? "+" : "-"
                }}{{ formatCurrency(transaction.amount) }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Insights Banner -->
      <div class="bg-primary/5 rounded-2xl p-4 border border-primary/20 flex gap-4 items-center">
        <div
          class="w-10 h-10 shrink-0 bg-primary/20 rounded-full flex items-center justify-center text-primary"
        >
          <span class="material-symbols-outlined">info</span>
        </div>
        <p class="text-xs text-[#111814]/70 leading-relaxed">
          Pemasukan malam ini
          <span v-if="incomePercentageChange > 0" class="text-primary font-bold"
            >meningkat {{ incomePercentageChange }}%</span
          >
          <span v-else-if="incomePercentageChange < 0" class="text-red-500 font-bold"
            >menurun {{ Math.abs(incomePercentageChange) }}%</span
          >
          <span v-else class="text-gray-500 font-bold">tetap sama</span>
          dibandingkan malam kemarin. Barakallah.
        </p>
      </div>
    </main>

    <!-- Bottom Menu Component -->
    <BottomMenu current-page="beranda" @open-modal="showAddModal = true" />

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

    <!-- Action Modal for Transaction -->
    <div
      v-if="showActionModal && selectedTransaction"
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-2xl p-6 w-full max-w-sm">
        <h3 class="text-lg font-bold text-center mb-4">Aksi Transaksi</h3>
        <div class="mb-4 p-4 bg-gray-50 rounded-xl">
          <p class="text-sm font-bold text-gray-900">{{ selectedTransaction.title }}</p>
          <p class="text-xs text-gray-500 mt-1">
            {{ selectedTransaction.time }} • {{ selectedTransaction.category }}
          </p>
          <p
            :class="[
              'text-sm font-bold mt-2',
              selectedTransaction.type === 'income' ? 'text-primary' : 'text-red-500',
            ]"
          >
            {{ selectedTransaction.type === "income" ? "+" : "-"
            }}{{ formatCurrency(selectedTransaction.amount) }}
          </p>
        </div>
        <div class="space-y-3">
          <button
            @click="handleEditTransaction"
            class="w-full flex items-center gap-4 p-4 rounded-xl bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors"
          >
            <div
              class="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center"
            >
              <span class="material-symbols-outlined">edit</span>
            </div>
            <span class="font-bold text-blue-500">Ubah Transaksi</span>
          </button>
          <button
            @click="handleDeleteTransaction"
            class="w-full flex items-center gap-4 p-4 rounded-xl bg-red-50 border border-red-200 hover:bg-red-100 transition-colors"
          >
            <div
              class="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center"
            >
              <span class="material-symbols-outlined">delete</span>
            </div>
            <span class="font-bold text-red-500">Hapus Transaksi</span>
          </button>
        </div>
        <button
          @click="
            showActionModal = false;
            selectedTransaction = null;
          "
          class="w-full mt-6 py-3 text-gray-500 font-medium hover:text-gray-700 transition-colors"
        >
          Batal
        </button>
      </div>
    </div>

    <!-- Share Modal -->
    <div
      v-if="showShareModal"
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-2xl p-6 w-full max-w-sm">
        <h3 class="text-lg font-bold text-center mb-4">Bagikan Laporan</h3>
        <div class="mb-4 p-4 bg-gray-50 rounded-xl">
          <p class="text-sm font-bold text-gray-900 mb-2">
            Tanggal: {{ getSelectedDateDisplay() }}
          </p>
          <p class="text-xs text-gray-500">Pilih cara untuk membagikan laporan ini:</p>
        </div>
        <div class="space-y-3">
          <button
            @click="copyLink"
            class="w-full flex items-center gap-4 p-4 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors"
          >
            <div
              class="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center"
            >
              <span class="material-symbols-outlined">link</span>
            </div>
            <div class="text-left">
              <span class="font-bold text-primary block">Copy Link</span>
              <span class="text-xs text-gray-500">Salin link laporan</span>
            </div>
          </button>
          <button
            @click="shareToWhatsapp"
            class="w-full flex items-center gap-4 p-4 rounded-xl bg-green-50 border border-green-200 hover:bg-green-100 transition-colors"
          >
            <div
              class="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
                />
              </svg>
            </div>
            <div class="text-left">
              <span class="font-bold text-green-600 block">Share ke WhatsApp</span>
              <span class="text-xs text-gray-500">Bagikan ke WhatsApp</span>
            </div>
          </button>
        </div>
        <button
          @click="showShareModal = false"
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
import { usePemasukan } from "@/composables/usePemasukan";
import { usePengeluaran } from "@/composables/usePengeluaran";
import BottomMenu from "@/components/BottomMenu.vue";
import Logout from "@/components/Logout.vue";
import DateScroller from "@/components/DateScroller.vue";
import Swal from "sweetalert2";

const router = useRouter();
const { user, logout, checkAuth } = useAuth();
const { getTransaksi } = useLaporan();
const { deletePemasukan } = usePemasukan();
const { deletePengeluaran } = usePengeluaran();

// State
const loading = ref(false);
const transactions = ref([]);
const dates = ref([]);
const selectedDate = ref(null);
const recentTransactions = ref([]);
const showAddModal = ref(false);
const selectedTransaction = ref(null);
const showActionModal = ref(false);
const showShareModal = ref(false);
const isDeleting = ref(false);

// Helper function untuk format tanggal Indonesia
const formatDateIndo = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

// Helper function untuk format waktu
const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("id-ID", {
    timeZone: "Asia/Makassar",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

// Helper function untuk mendapatkan icon berdasarkan tipe transaksi
const getTransactionIcon = (transaction) => {
  if (transaction.type === "pemasukan") {
    if (transaction.source?.toLowerCase().includes("infaq")) return "payments";
    if (transaction.source?.toLowerCase().includes("zakat")) return "volunteer_activism";
    return "trending_up";
  } else {
    if (transaction.expense_type?.toLowerCase().includes("imam")) return "person";
    if (
      transaction.expense_type?.toLowerCase().includes("konsumsi") ||
      transaction.expense_type?.toLowerCase().includes("takjil")
    ) {
      return "restaurant";
    }
    return "trending_down";
  }
};

// Ambil data transaksi dari database
const fetchTransactions = async (preserveSelectedDate = false) => {
  loading.value = true;
  try {
    const result = await getTransaksi();
    if (result.success) {
      transactions.value = result.data;
      groupTransactionsByDate(preserveSelectedDate);
    } else {
      console.error("Gagal mengambil transaksi:", result.error);
      await Swal.fire({
        icon: "error",
        title: "Gagal Memuat Data",
        text:
          result.error || "Terjadi kesalahan saat memuat data transaksi. Silakan refresh halaman.",
        confirmButtonColor: "#059669",
      });
    }
  } catch (error) {
    console.error("Gagal mengambil transaksi:", error);
    await Swal.fire({
      icon: "error",
      title: "Gagal Memuat Data",
      text:
        error.message || "Terjadi kesalahan saat memuat data transaksi. Silakan refresh halaman.",
      confirmButtonColor: "#059669",
    });
  } finally {
    loading.value = false;
  }
};

// Kelompokkan transaksi berdasarkan tanggal
const groupTransactionsByDate = (preserveSelectedDate = false) => {
  // Simpan tanggal yang sedang dipilih jika ingin dipertahankan
  let preservedDate = null;
  if (preserveSelectedDate && selectedDate.value !== null) {
    const currentSelected = dates.value.find((d) => d.id === selectedDate.value);
    if (currentSelected) {
      preservedDate = currentSelected.date;
    }
  }

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

  // Set tanggal yang dipilih
  if (dates.value.length > 0) {
    if (preserveSelectedDate && preservedDate) {
      // Coba kembalikan ke tanggal yang sebelumnya dipilih
      const preservedIndex = dates.value.findIndex((d) => d.date === preservedDate);
      if (preservedIndex !== -1) {
        selectedDate.value = dates.value[preservedIndex].id;
        updateRecentTransactions(dates.value[preservedIndex].date);
      } else {
        // Jika tanggal yang dipilih sudah tidak ada, pindah ke tanggal terbaru
        selectedDate.value = dates.value[0].id;
        updateRecentTransactions(dates.value[0].date);
      }
    } else {
      // Set ke tanggal terbaru
      selectedDate.value = dates.value[0].id;
      updateRecentTransactions(dates.value[0].date);
    }
  } else {
    selectedDate.value = null;
    recentTransactions.value = [];
  }
};

// Update recent transactions berdasarkan tanggal yang dipilih
const updateRecentTransactions = (date) => {
  const selectedDateData = dates.value.find((d) => d.date === date);
  if (selectedDateData) {
    recentTransactions.value = selectedDateData.transactions
      .map((transaction) => ({
        id: transaction.id,
        title: transaction.name,
        time: formatTime(transaction.created_at),
        category: transaction.type === "pemasukan" ? transaction.source : transaction.expense_type,
        amount: transaction.amount,
        type: transaction.type === "pemasukan" ? "income" : "expense",
        icon: getTransactionIcon(transaction),
        originalTransaction: transaction, // Simpan transaksi asli untuk sorting
      }))
      .sort((a, b) => {
        // Urutkan: Pemasukan Rutin (Laki-laki), Pemasukan Rutin (Perempuan), Pemasukan Lainnya, Pengeluaran Rutin, Pengeluaran Lainnya
        const getPriority = (item) => {
          if (item.type === "income") {
            // Pemasukan Rutin: Kotak Amal Laki-laki dulu, baru Kotak Amal Perempuan, baru Pemasukan Lainnya
            if (item.originalTransaction.source?.toLowerCase().includes("laki-laki")) return 1;
            if (item.originalTransaction.source?.toLowerCase().includes("perempuan")) return 2;
            return 3; // Pemasukan Lainnya
          } else {
            // Pengeluaran Rutin (Honor) dulu, baru Pengeluaran Lainnya
            if (item.originalTransaction.expense_type?.toLowerCase().includes("rutin")) return 4;
            return 5; // Pengeluaran Lainnya
          }
        };

        const priorityA = getPriority(a);
        const priorityB = getPriority(b);

        return priorityA - priorityB;
      });
  }
};

// Computed
const currentBalance = computed(() => {
  const selectedDateData = dates.value.find((d) => d.id === selectedDate.value);
  if (!selectedDateData) return 0;

  const income = selectedDateData.transactions
    .filter((t) => t.type === "pemasukan")
    .reduce((sum, t) => sum + t.amount, 0);
  const expense = selectedDateData.transactions
    .filter((t) => t.type === "pengeluaran")
    .reduce((sum, t) => sum + t.amount, 0);

  return income - expense;
});

const currentIncome = computed(() => {
  const selectedDateData = dates.value.find((d) => d.id === selectedDate.value);
  if (!selectedDateData) return 0;

  return selectedDateData.transactions
    .filter((t) => t.type === "pemasukan")
    .reduce((sum, t) => sum + t.amount, 0);
});

const currentExpense = computed(() => {
  const selectedDateData = dates.value.find((d) => d.id === selectedDate.value);
  if (!selectedDateData) return 0;

  return selectedDateData.transactions
    .filter((t) => t.type === "pengeluaran")
    .reduce((sum, t) => sum + t.amount, 0);
});

// Get pemasukan dari tanggal sebelumnya
const previousDateIncome = computed(() => {
  const selectedDateData = dates.value.find((d) => d.id === selectedDate.value);
  if (!selectedDateData || dates.value.length <= 1) return 0;

  const selectedIndex = dates.value.findIndex((d) => d.id === selectedDate.value);
  const previousDateData = dates.value[selectedIndex + 1];

  if (!previousDateData) return 0;

  return previousDateData.transactions
    .filter((t) => t.type === "pemasukan")
    .reduce((sum, t) => sum + t.amount, 0);
});

// Hitung persentase perubahan pemasukan
const incomePercentageChange = computed(() => {
  const current = currentIncome.value;
  const previous = previousDateIncome.value;

  if (previous === 0) return 0;

  const change = ((current - previous) / previous) * 100;
  return Math.round(change);
});

// Methods
const selectDate = (date) => {
  selectedDate.value = date.id;
  updateRecentTransactions(date.date);
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

const goToInputPemasukan = () => {
  showAddModal.value = false;
  router.push("/input-pemasukan");
};

const goToInputPengeluaran = () => {
  showAddModal.value = false;
  router.push("/input-pengeluaran");
};

const goToLaporan = () => {
  router.push("/laporan");
};

// Handle klik pada transaksi
const handleTransactionClick = (transaction) => {
  selectedTransaction.value = transaction;
  showActionModal.value = true;
};

// Hapus transaksi
const handleDeleteTransaction = async () => {
  if (!selectedTransaction.value) return;

  // Cegah multiple delete operations
  if (isDeleting.value) {
    return;
  }

  const result = await Swal.fire({
    icon: "warning",
    title: "Hapus Transaksi",
    text: `Apakah Anda yakin ingin menghapus transaksi "${selectedTransaction.value.title}"?`,
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Ya, Hapus",
    cancelButtonText: "Batal",
  });

  if (result.isConfirmed) {
    isDeleting.value = true;

    // Tampilkan loading
    Swal.fire({
      title: "Menghapus...",
      text: "Mohon tunggu sebentar",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      let deleteResult;
      if (selectedTransaction.value.type === "income") {
        deleteResult = await deletePemasukan(selectedTransaction.value.id);
      } else {
        deleteResult = await deletePengeluaran(selectedTransaction.value.id);
      }

      if (deleteResult.success) {
        // Hapus transaksi dari local state secara langsung untuk update UI yang lebih cepat
        const transactionDate = selectedTransaction.value.originalTransaction?.date;
        const transactionId = selectedTransaction.value.id;

        // Hapus dari recentTransactions
        recentTransactions.value = recentTransactions.value.filter((t) => t.id !== transactionId);

        // Hapus dari transactions array
        transactions.value = transactions.value.filter((t) => t.id !== transactionId);

        // Refresh data dari database untuk memastikan konsistensi
        await fetchTransactions(true);

        await Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Transaksi berhasil dihapus!",
          confirmButtonColor: "#059669",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        await Swal.fire({
          icon: "error",
          title: "Gagal",
          text: deleteResult.error || "Gagal menghapus transaksi!",
          confirmButtonColor: "#059669",
        });
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
      await Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error.message || "Terjadi kesalahan!",
        confirmButtonColor: "#059669",
      });
    } finally {
      isDeleting.value = false;
    }
  }

  showActionModal.value = false;
  selectedTransaction.value = null;
};

// Ubah transaksi
const handleEditTransaction = () => {
  if (!selectedTransaction.value) return;

  // Navigasi ke halaman edit berdasarkan tipe transaksi
  if (selectedTransaction.value.type === "income") {
    router.push(`/edit-pemasukan/${selectedTransaction.value.id}`);
  } else {
    router.push(`/edit-pengeluaran/${selectedTransaction.value.id}`);
  }

  showActionModal.value = false;
  selectedTransaction.value = null;
};

// Get selected date display
const getSelectedDateDisplay = () => {
  const selectedDateData = dates.value.find((d) => d.id === selectedDate.value);
  return selectedDateData ? selectedDateData.display : "-";
};

// Get share link
const getShareLink = () => {
  const selectedDateData = dates.value.find((d) => d.id === selectedDate.value);
  if (!selectedDateData) return "";

  const baseUrl = window.location.origin;
  const formattedDate = selectedDateData.date; // Format: YYYY-MM-DD
  return `${baseUrl}/laporan-amaliyah-ramadhan/${formattedDate}`;
};

// Copy link to clipboard
const copyLink = async () => {
  const link = getShareLink();
  try {
    await navigator.clipboard.writeText(link);
    await Swal.fire({
      icon: "success",
      title: "Berhasil",
      text: "Link berhasil disalin!",
      confirmButtonColor: "#059669",
      timer: 2000,
      showConfirmButton: false,
    });
    showShareModal.value = false;
  } catch (error) {
    await Swal.fire({
      icon: "error",
      title: "Gagal",
      text: "Gagal menyalin link!",
      confirmButtonColor: "#059669",
    });
  }
};

// Share to WhatsApp
const shareToWhatsapp = () => {
  const selectedDateData = dates.value.find((d) => d.id === selectedDate.value);
  if (!selectedDateData) return;

  const link = getShareLink();
  const message = `Laporan Amaliyah Ramadhan 1447 H
  Masjid Baiturrahim tanggal ${selectedDateData.display}.
  Silakan lihat laporan lengkap di:
  ${link}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, "_blank");
  showShareModal.value = false;
};

// Lifecycle
onMounted(async () => {
  await checkAuth();
  fetchTransactions();
});
</script>

<style scoped>
.islamic-pattern {
  background: linear-gradient(135deg, #064e3b 0%, #059669 100%);
  position: relative;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
