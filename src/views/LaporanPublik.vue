<template>
  <div class="bg-background-light dark:bg-background-dark min-h-screen flex justify-center">
    <div
      class="relative flex h-full min-h-screen w-full max-w-md flex-col bg-white dark:bg-background-dark overflow-x-hidden shadow-xl"
    >
      <!-- Header Section -->
      <div
        class="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-primary/10 px-4 py-4"
      >
        <div class="flex items-center justify-between max-w-md mx-auto">
          <div class="flex items-center gap-3">
            <div class="bg-primary/10 p-2 rounded-lg text-primary">
              <span class="material-symbols-outlined">mosque</span>
            </div>
            <div>
              <h1 class="text-[#111814] text-lg text-center font-bold leading-tight tracking-tight">
                Laporan Amaliyah Ramadhan 1447 H <br />
                Masjid Baiturrahim
              </h1>
            </div>
          </div>
        </div>
      </div>

      <main v-if="loading || !dataReady" class="flex-1 flex items-center justify-center p-4">
        <div class="text-center">
          <div
            class="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"
          ></div>
          <p class="mt-4 text-gray-600">Memuat laporan...</p>
        </div>
      </main>

      <main v-else-if="!dateExists" class="flex-1 flex items-center justify-center p-4">
        <div class="text-center">
          <span class="material-symbols-outlined text-6xl text-red-500">error</span>
          <h2 class="mt-4 text-xl font-bold text-gray-900">Laporan Tidak Ditemukan</h2>
          <p class="mt-2 text-gray-600">
            Laporan untuk tanggal {{ formatDateIndo(dateParam) }} tidak tersedia.
          </p>
          <button
            @click="goToHome"
            class="mt-6 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors"
          >
            Kembali ke Beranda
          </button>
        </div>
      </main>

      <main v-else class="flex-1 p-4 space-y-6 pb-28">
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
                  <p class="text-xs font-medium uppercase tracking-wider text-white/90">
                    Pemasukan
                  </p>
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

        <!-- Saldo Kas Section -->
        <div
          class="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm"
        >
          <h3 class="text-[#111814] dark:text-white text-base font-bold mb-4">
            Saldo Kas {{ formatDateIndo(dateParam) }}
          </h3>
          <div class="space-y-3">
            <div
              class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center"
                >
                  <span class="material-symbols-outlined text-blue-600 dark:text-blue-400 text-lg"
                    >history</span
                  >
                </div>
                <div>
                  <p class="text-sm font-bold text-gray-900 dark:text-white">Saldo Sebelumnya</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    Akumulasi sebelum tanggal ini
                  </p>
                </div>
              </div>
              <p class="font-bold text-sm text-blue-600 dark:text-blue-400">
                {{ formatCurrency(previousBalance) }}
              </p>
            </div>
            <div
              class="flex items-center justify-between p-3 bg-primary/5 rounded-xl border border-primary/20"
            >
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <span class="material-symbols-outlined text-white text-lg"
                    >account_balance_wallet</span
                  >
                </div>
                <div>
                  <p class="text-sm font-bold text-gray-900 dark:text-white">Saldo Sekarang</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Total saldo saat ini</p>
                </div>
              </div>
              <p class="font-bold text-sm text-primary">{{ formatCurrency(totalBalance) }}</p>
            </div>
          </div>
        </div>

        <!-- Pemasukan Section -->
        <section v-if="incomeTransactions.length > 0" class="space-y-4">
          <h3 class="text-[#111814] text-base font-bold">Pemasukan</h3>
          <div class="space-y-3">
            <div
              v-for="transaction in incomeTransactions"
              :key="transaction.id"
              class="flex items-center justify-between p-4 bg-white rounded-2xl border border-primary/5 shadow-sm"
            >
              <div class="flex items-center gap-4">
                <div
                  class="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary"
                >
                  <span class="material-symbols-outlined">trending_up</span>
                </div>
                <div>
                  <p class="text-[#111814] font-bold text-sm">{{ transaction.name }}</p>
                  <p class="text-gray-400 text-xs">
                    {{ transaction.time }} • {{ transaction.category }}
                  </p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-bold text-sm text-primary">
                  +{{ formatCurrency(transaction.amount) }}
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- Pengeluaran Section -->
        <section v-if="expenseTransactions.length > 0" class="space-y-4">
          <h3 class="text-[#111814] text-base font-bold">Pengeluaran</h3>
          <div class="space-y-3">
            <div
              v-for="transaction in expenseTransactions"
              :key="transaction.id"
              class="flex items-center justify-between p-4 bg-white rounded-2xl border border-red-500/5 shadow-sm"
            >
              <div class="flex items-center gap-4">
                <div
                  class="w-12 h-12 flex items-center justify-center rounded-full bg-gold/10 text-gold"
                >
                  <span class="material-symbols-outlined">trending_down</span>
                </div>
                <div>
                  <p class="text-[#111814] font-bold text-sm">{{ transaction.name }}</p>
                  <p class="text-gray-400 text-xs">
                    {{ transaction.time }} • {{ transaction.category }}
                  </p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-bold text-sm text-red-500">
                  -{{ formatCurrency(transaction.amount) }}
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- Infaq Section -->
        <section class="space-y-4">
          <div
            class="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-5 border border-emerald-100 dark:border-gray-700 shadow-sm"
          >
            <div class="flex items-center gap-4">
              <!-- QRIS Barcode - Kiri -->
              <div class="flex-shrink-0">
                <div
                  class="w-28 h-28 bg-white dark:bg-gray-700 rounded-xl border-2 border-emerald-300 dark:border-emerald-600 flex items-center justify-center overflow-hidden"
                >
                  <img src="/qris.jpg" alt="QRIS Baiturrahim" class="w-full h-full object-cover" />
                </div>
                <a
                  href="/qris.jpg"
                  download="qris-baiturrahim.jpg"
                  class="mt-2 flex items-center justify-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                >
                  <span class="material-symbols-outlined text-sm">download</span>
                  <span>Download QRIS</span>
                </a>
              </div>

              <!-- Pesan Ajakan - Kanan -->
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <span class="material-symbols-outlined text-emerald-600 dark:text-emerald-400"
                    >volunteer_activism</span
                  >
                  <h3 class="text-[#111814] dark:text-white text-base font-bold">Mari Berinfaq</h3>
                </div>
                <!-- <p
                  class="text-sm text-justify text-gray-600 dark:text-gray-300 leading-relaxed mb-3"
                >
                  Infaq akan digunakan untuk operasional masjid selama bulan Ramadhan.
                </p> -->
                <div
                  class="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium"
                >
                  <span class="material-symbols-outlined text-sm">info</span>
                  <span>Scan barcode untuk transfer infaq</span>
                </div>
                <div
                  class="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 font-medium mt-2"
                >
                  <span class="material-symbols-outlined text-sm">notifications</span>
                  <span>Setelah melakukan transfer, segera konfirmasi ke nomor 082346126816</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Share Button -->
        <div
          class="fixed bottom-0 left-0 w-full p-4 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-t border-gray-100 dark:border-gray-800"
        >
          <button
            @click="showShareModal = true"
            class="w-full h-14 bg-gradient-to-r from-[#059669] to-[#047857] hover:from-[#047857] hover:to-[#059669] text-white font-extrabold text-base rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/30 active:scale-[0.98] transition-all transform"
          >
            <span class="material-symbols-outlined">share</span>
            <span>Bagikan Kebaikan</span>
          </button>
        </div>
      </main>

      <!-- Share Modal -->
      <div
        v-if="showShareModal"
        class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      >
        <div class="bg-white rounded-2xl p-6 w-full max-w-sm">
          <h3 class="text-lg font-bold text-center mb-4">Bagikan Kebaikan</h3>
          <div class="mb-4 p-4 bg-gray-50 rounded-xl">
            <p class="text-sm font-bold text-gray-900 mb-2">
              Tanggal: {{ formatDateIndo(dateParam) }}
            </p>
            <p class="text-xs text-gray-500">Pilih cara untuk membagikan kebaikan ini:</p>
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
                <span class="text-xs text-gray-500">Salin link kebaikan</span>
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
                <span class="text-xs text-gray-500">Bagikan kebaikan ini ke WhatsApp</span>
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useLaporan } from "@/composables/useLaporan";
import Swal from "sweetalert2";

const router = useRouter();
const route = useRoute();
const { getTransaksiByDate, getTransaksiBeforeDate } = useLaporan();

// State
const loading = ref(true);
const dateParam = ref("");
const transactions = ref([]);
const previousTransactions = ref([]);
const dateExists = ref(false);
const showShareModal = ref(false);
const dataReady = ref(false);

// Helper function untuk format tanggal Indonesia
const formatDateIndo = (dateString) => {
  if (!dateString) return "-";
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

// Helper function untuk format mata uang
const formatCurrency = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
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

// Computed
const incomeTransactions = computed(() => {
  return transactions.value
    .filter((t) => t.type === "pemasukan")
    .map((transaction) => ({
      id: transaction.id,
      name: transaction.name,
      time: formatTime(transaction.created_at),
      category: transaction.source,
      amount: transaction.amount,
      type: "income",
      icon: getTransactionIcon(transaction),
      originalTransaction: transaction,
    }))
    .sort((a, b) => {
      // Urutkan: Infaq Laki-laki dulu, baru Infaq Perempuan, baru Pemasukan Lainnya
      const getPriority = (item) => {
        if (item.originalTransaction.source?.toLowerCase().includes("laki-laki")) return 1;
        if (item.originalTransaction.source?.toLowerCase().includes("perempuan")) return 2;
        return 3; // Pemasukan Lainnya
      };

      const priorityA = getPriority(a);
      const priorityB = getPriority(b);

      return priorityA - priorityB;
    });
});

const expenseTransactions = computed(() => {
  return transactions.value
    .filter((t) => t.type === "pengeluaran")
    .map((transaction) => ({
      id: transaction.id,
      name: transaction.name,
      time: formatTime(transaction.created_at),
      category: transaction.expense_type,
      amount: transaction.amount,
      type: "expense",
      icon: getTransactionIcon(transaction),
      originalTransaction: transaction,
    }))
    .sort((a, b) => {
      // Urutkan: Pengeluaran Rutin (Honor) dulu, baru Pengeluaran Lainnya
      const getPriority = (item) => {
        if (item.originalTransaction.expense_type?.toLowerCase().includes("rutin")) return 4;
        return 5; // Pengeluaran Lainnya
      };

      const priorityA = getPriority(a);
      const priorityB = getPriority(b);

      return priorityA - priorityB;
    });
});

const currentIncome = computed(() => {
  if (!transactions.value || transactions.value.length === 0) return 0;
  return incomeTransactions.value.reduce((sum, t) => sum + (t.amount || 0), 0);
});

const currentExpense = computed(() => {
  if (!transactions.value || transactions.value.length === 0) return 0;
  return expenseTransactions.value.reduce((sum, t) => sum + (t.amount || 0), 0);
});

const currentBalance = computed(() => {
  return currentIncome.value - currentExpense.value;
});

const previousIncome = computed(() => {
  if (!previousTransactions.value || previousTransactions.value.length === 0) return 0;
  return previousTransactions.value
    .filter((t) => t.type === "pemasukan")
    .reduce((sum, t) => sum + (t.amount || 0), 0);
});

const previousExpense = computed(() => {
  if (!previousTransactions.value || previousTransactions.value.length === 0) return 0;
  return previousTransactions.value
    .filter((t) => t.type === "pengeluaran")
    .reduce((sum, t) => sum + (t.amount || 0), 0);
});

const previousBalance = computed(() => {
  return previousIncome.value - previousExpense.value;
});

const totalBalance = computed(() => {
  return previousBalance.value + currentBalance.value;
});

// Methods
const goToHome = () => {
  router.push("/");
};

const getShareLink = () => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/laporan-amaliyah-ramadhan/${dateParam.value}`;
};

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

const shareToWhatsapp = () => {
  const link = getShareLink();
  const message = `Laporan Amaliyah Ramadhan 1447 H
  Masjid Baiturrahim tanggal ${formatDateIndo(dateParam.value)}.
  Silakan lihat laporan lengkap di:
  ${link}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, "_blank");
  showShareModal.value = false;
};

// Fetch data dengan retry mechanism
const fetchTransactions = async (retryCount = 0) => {
  loading.value = true;
  dataReady.value = false;
  try {
    // Ambil transaksi pada tanggal yang dipilih
    const result = await getTransaksiByDate(dateParam.value);
    console.log("Date param:", dateParam.value);
    console.log("Result:", result);
    console.log("Result data:", result.data);
    console.log("Result data length:", result.data?.length);

    // Ubah logika: jika query berhasil, anggap dateExists = true
    // meskipun tidak ada transaksi pada tanggal tersebut
    if (result.success) {
      transactions.value = result.data || [];
      dateExists.value = true; // Selalu true jika query berhasil
      console.log("Transactions set:", transactions.value);

      // Ambil transaksi sebelum tanggal yang dipilih
      const previousResult = await getTransaksiBeforeDate(dateParam.value);
      if (previousResult.success) {
        previousTransactions.value = previousResult.data || [];
        console.log("Previous transactions set:", previousTransactions.value);
      }

      // Tunggu Vue update reactivity
      await nextTick();
      console.log("Current income:", currentIncome.value);
      console.log("Current expense:", currentExpense.value);
      console.log("Previous income:", previousIncome.value);
      console.log("Previous expense:", previousExpense.value);
      dataReady.value = true;
    } else {
      // Jika gagal dan masih ada retry, coba lagi
      if (retryCount < 2) {
        console.log(`Retry ${retryCount + 1}...`);
        await new Promise((resolve) => setTimeout(resolve, 500)); // Tunggu 500ms
        return fetchTransactions(retryCount + 1);
      } else {
        console.error("Failed after retries:", result.error);
        dateExists.value = false;
        dataReady.value = true;
      }
    }
  } catch (error) {
    console.error("Gagal mengambil transaksi:", error);
    // Jika error dan masih ada retry, coba lagi
    if (retryCount < 2) {
      console.log(`Retry ${retryCount + 1} after error...`);
      await new Promise((resolve) => setTimeout(resolve, 500)); // Tunggu 500ms
      return fetchTransactions(retryCount + 1);
    } else {
      dateExists.value = false;
      dataReady.value = true;
    }
  } finally {
    loading.value = false;
  }
};

// Lifecycle
onMounted(() => {
  dateParam.value = route.params.date;
  if (dateParam.value) {
    fetchTransactions();
  } else {
    dateExists.value = false;
    loading.value = false;
    dataReady.value = true;
  }
});
</script>

<style scoped>
.islamic-pattern {
  background: linear-gradient(135deg, #064e3b 0%, #059669 100%);
  position: relative;
}

.material-symbols-outlined {
  font-variation-settings:
    "FILL" 0,
    "wght" 400,
    "GRAD" 0,
    "opsz" 24;
}
</style>
