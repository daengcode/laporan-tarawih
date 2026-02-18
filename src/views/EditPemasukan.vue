<template>
  <div class="bg-background-light dark:bg-background-dark min-h-screen flex justify-center">
    <div
      class="relative flex h-full min-h-screen w-full max-w-md flex-col bg-white dark:bg-background-dark overflow-x-hidden shadow-xl"
    >
      <!-- Top Navigation Bar -->
      <div
        class="flex items-center bg-white dark:bg-background-dark p-4 pb-2 justify-between sticky top-0 z-10 border-b border-gray-100 dark:border-gray-800"
      >
        <button
          @click="router.back()"
          class="text-gray-900 dark:text-white flex size-10 shrink-0 items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          <span class="material-symbols-outlined">arrow_back</span>
        </button>
        <h2
          class="text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-tight flex-1 ml-4"
        >
          Edit Pemasukan
        </h2>
        <Logout />
      </div>

      <div class="flex-1 overflow-y-auto pb-24">
        <div class="p-4 space-y-6">
          <!-- Date Section -->
          <section class="mb-2 p-4 rounded-xl bg-primary/5 border border-dashed border-primary/30">
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600 dark:text-gray-400 font-medium">Tanggal Laporan</span>
            </div>
            <div class="mt-3">
              <input
                v-model="form.tanggal"
                type="date"
                class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div class="mt-2 text-center">
              <span
                class="font-bold text-gray-900 dark:text-white flex items-center justify-center gap-1"
              >
                {{ formatTanggalHijriah(form.tanggal) }}
                <span class="material-symbols-outlined text-base text-primary">calendar_month</span>
              </span>
            </div>
          </section>

          <!-- Section: Pemasukan Kotak Amal -->
          <section v-if="jenisPemasukan === 'rutin'">
            <h3
              class="text-gray-900 dark:text-white text-base font-bold leading-tight tracking-tight mb-3 flex items-center gap-2"
            >
              Pemasukan Rutin
            </h3>
            <div class="grid grid-cols-1 gap-4">
              <label v-if="jenisInfaq === 'laki'" class="flex flex-col gap-2">
                <p class="text-gray-600 dark:text-gray-400 text-sm font-semibold ml-1">
                  Infaq Laki-laki
                </p>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span class="text-gray-400 font-bold text-sm">Rp</span>
                  </div>
                  <input
                    v-model="form.infaqLaki"
                    @input="formatNumberInput($event, 'infaqLaki')"
                    class="form-input flex w-full rounded-xl text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary h-14 pl-10 pr-4 text-base font-bold placeholder:text-gray-300"
                    inputmode="numeric"
                    placeholder="0"
                    type="text"
                  />
                </div>
              </label>
              <label v-if="jenisInfaq === 'perempuan'" class="flex flex-col gap-2">
                <p class="text-gray-600 dark:text-gray-400 text-sm font-semibold ml-1">
                  Infaq Perempuan
                </p>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span class="text-gray-400 font-bold text-sm">Rp</span>
                  </div>
                  <input
                    v-model="form.infaqPerempuan"
                    @input="formatNumberInput($event, 'infaqPerempuan')"
                    class="form-input flex w-full rounded-xl text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary h-14 pl-10 pr-4 text-base font-bold placeholder:text-gray-300"
                    inputmode="numeric"
                    placeholder="0"
                    type="text"
                  />
                </div>
              </label>
            </div>
          </section>

          <!-- Section: Pemasukan Lainnya -->
          <section v-if="jenisPemasukan === 'lainnya'" class="space-y-4">
            <h3
              class="text-gray-900 dark:text-white text-base font-bold leading-tight tracking-tight mb-3 flex items-center gap-2"
            >
              Pemasukan Lainnya
            </h3>
            <!-- List Pemasukan Lainnya -->
            <div v-if="form.pemasukanLainnya.length > 0" class="space-y-3">
              <div
                v-for="(item, index) in form.pemasukanLainnya"
                :key="index"
                class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4"
              >
                <div class="grid grid-cols-1 gap-4">
                  <label class="flex flex-col gap-2">
                    <p class="text-gray-600 dark:text-gray-400 text-sm font-semibold ml-1">Nama</p>
                    <div class="relative">
                      <input
                        v-model="item.nama"
                        class="form-input flex w-full rounded-xl text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary h-14 px-4 text-base font-bold placeholder:text-gray-300"
                        placeholder="Masukkan nama donatur"
                        type="text"
                      />
                    </div>
                  </label>
                  <label class="flex flex-col gap-2">
                    <p class="text-gray-600 dark:text-gray-400 text-sm font-semibold ml-1">
                      Jumlah Pemasukan
                    </p>
                    <div class="relative">
                      <div
                        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                      >
                        <span class="text-gray-400 font-bold text-sm">Rp</span>
                      </div>
                      <input
                        v-model="item.jumlah"
                        @input="formatNumberInput($event, 'jumlah', index)"
                        class="form-input flex w-full rounded-xl text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary h-14 pl-10 pr-4 text-base font-bold placeholder:text-gray-300"
                        inputmode="numeric"
                        placeholder="0"
                        type="text"
                      />
                    </div>
                  </label>
                  <div class="space-y-3">
                    <p class="text-gray-600 dark:text-gray-400 text-sm font-semibold ml-1">
                      Sumber Dana
                    </p>
                    <div class="grid grid-cols-2 gap-3">
                      <!-- Option 2: Amplop -->
                      <div
                        @click="item.sumberDana = 'amplop'"
                        :class="[
                          'flex items-center p-3 rounded-xl border cursor-pointer transition-all',
                          item.sumberDana === 'amplop'
                            ? 'border-primary bg-primary/10'
                            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary/50',
                        ]"
                      >
                        <div
                          :class="[
                            'w-8 h-8 rounded-full flex items-center justify-center mr-3',
                            item.sumberDana === 'amplop'
                              ? 'bg-primary text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-500',
                          ]"
                        >
                          <span class="material-symbols-outlined text-lg">mail</span>
                        </div>
                        <span
                          :class="[
                            'text-sm font-semibold',
                            item.sumberDana === 'amplop'
                              ? 'text-primary'
                              : 'text-gray-700 dark:text-gray-300',
                          ]"
                          >Amplop</span
                        >
                      </div>
                      <!-- Option 4: Transfer -->
                      <div
                        @click="item.sumberDana = 'transfer'"
                        :class="[
                          'flex items-center p-3 rounded-xl border cursor-pointer transition-all',
                          item.sumberDana === 'transfer'
                            ? 'border-primary bg-primary/10'
                            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary/50',
                        ]"
                      >
                        <div
                          :class="[
                            'w-8 h-8 rounded-full flex items-center justify-center mr-3',
                            item.sumberDana === 'transfer'
                              ? 'bg-primary text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-500',
                          ]"
                        >
                          <span class="material-symbols-outlined text-lg">credit_card</span>
                        </div>
                        <span
                          :class="[
                            'text-sm font-semibold',
                            item.sumberDana === 'transfer'
                              ? 'text-primary'
                              : 'text-gray-700 dark:text-gray-300',
                          ]"
                          >Transfer</span
                        >
                      </div>
                    </div>
                  </div>
                  <!-- Tombol Hapus -->
                  <button
                    @click="hapusPemasukanLainnya(index)"
                    class="flex items-center justify-center w-10 h-10 rounded-full bg-red-50 hover:bg-red-100 text-red-500 transition-colors"
                    title="Hapus"
                  >
                    <span class="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <!-- Sticky Footer with Action Button -->
      <div
        class="absolute bottom-0 left-0 w-full p-4 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-t border-gray-100 dark:border-gray-800"
      >
        <button
          @click="updatePemasukan"
          :disabled="loading"
          class="w-full h-14 bg-gradient-to-r from-[#059669] to-[#047857] hover:from-[#047857] hover:to-[#059669] text-white font-extrabold text-base rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/30 active:scale-[0.98] transition-all transform disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="loading" class="material-symbols-outlined animate-spin">refresh</span>
          <span v-else class="material-symbols-outlined">save</span>
          <span v-if="loading">Menyimpan...</span>
          <span v-else>Simpan Perubahan</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import { usePemasukan } from "@/composables/usePemasukan";
import Swal from "sweetalert2";
import Logout from "@/components/Logout.vue";

const router = useRouter();
const route = useRoute();
const { user, logout } = useAuth();
const { getPemasukanById, updatePemasukan: updatePemasukanData, loading } = usePemasukan();

// Get transaction ID from route
const transactionId = route.params.id;

// Form data
const form = ref({
  tanggal: new Date().toISOString().split("T")[0],
  infaqLaki: "",
  infaqPerempuan: "",
  pemasukanLainnya: [],
});

// Jenis pemasukan yang sedang diedit
const jenisPemasukan = ref("rutin"); // 'rutin' atau 'lainnya'

// Jenis infaq yang sedang diedit (untuk pemasukan rutin)
const jenisInfaq = ref("laki"); // 'laki' atau 'perempuan'

// Load transaction data
const loadTransaction = async () => {
  const result = await getPemasukanById(transactionId);
  if (result.success && result.data) {
    form.value.tanggal = result.data.date;

    // Check if this is a regular income or "Lainnya"
    if (result.data.source === "Kotak Amal Laki-laki") {
      jenisPemasukan.value = "rutin";
      jenisInfaq.value = "laki";
      form.value.infaqLaki = formatNumber(result.data.amount);
    } else if (result.data.source === "Kotak Amal Perempuan") {
      jenisPemasukan.value = "rutin";
      jenisInfaq.value = "perempuan";
      form.value.infaqPerempuan = formatNumber(result.data.amount);
    } else {
      // This is "Lainnya" income
      jenisPemasukan.value = "lainnya";
      form.value.pemasukanLainnya.push({
        nama: result.data.name,
        jumlah: formatNumber(result.data.amount),
        sumberDana: result.data.source === "Amplop" ? "amplop" : "transfer",
      });
    }
  } else {
    Swal.fire({
      icon: "error",
      title: "Gagal",
      text: result.error || "Gagal memuat data transaksi!",
      confirmButtonColor: "#059669",
    }).then(() => {
      router.back();
    });
  }
};

const tambahPemasukanLainnya = () => {
  form.value.pemasukanLainnya.push({
    nama: "",
    jumlah: "",
    sumberDana: "amplop",
  });
};

const hapusPemasukanLainnya = (index) => {
  form.value.pemasukanLainnya.splice(index, 1);
};

// Format number dengan separator ribuan
const formatNumber = (value) => {
  if (!value && value !== 0) return "";
  // Hapus semua karakter non-digit
  const cleanValue = value.toString().replace(/\D/g, "");
  // Format dengan titik sebagai pemisah ribuan
  return cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

// Format input number saat user mengetik
const formatNumberInput = (event, field, index = null) => {
  const inputValue = event.target.value;
  const formattedValue = formatNumber(inputValue);

  if (index !== null) {
    form.value.pemasukanLainnya[index][field] = formattedValue;
  } else {
    form.value[field] = formattedValue;
  }

  // Update input value
  event.target.value = formattedValue;
};

// Unformat number untuk menyimpan ke database
const unformatNumber = (value) => {
  if (!value) return 0;
  // Hapus semua titik
  return parseInt(value.toString().replace(/\./g, "")) || 0;
};

// Format tanggal ke Hijriah
const formatTanggalHijriah = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);

  // Nama bulan Hijriah
  const bulanHijriah = [
    "Muharram",
    "Safar",
    "Rabiul Awwal",
    "Rabiul Akhir",
    "Jumadil Awwal",
    "Jumadil Akhir",
    "Rajab",
    "Sya'ban",
    "Ramadhan",
    "Syawal",
    "Dzul Qa'dah",
    "Dzul Hijjah",
  ];

  // Reference: 1 Ramadhan 1447 H = 19 Februari 2026
  const ramadhan1447Start = new Date("2026-02-19");
  const ramadhan1447StartTimestamp = ramadhan1447Start.getTime();
  const currentTimestamp = date.getTime();

  // Hitung selisih hari dari 1 Ramadhan 1447 H
  const daysDifference = Math.floor(
    (currentTimestamp - ramadhan1447StartTimestamp) / (1000 * 60 * 60 * 24),
  );

  // Hitung tanggal Hijriah berdasarkan selisih hari
  // 1 Ramadhan adalah hari ke-0, jadi kita tambahkan selisihnya
  let hijriDay = 1 + daysDifference;
  let hijriMonth = 8; // Ramadhan adalah bulan ke-9 (index 8)
  let hijriYear = 1447;

  // Panjang bulan Hijriah (alternating 30 dan 29 hari)
  const monthLengths = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29];

  // Sesuaikan jika tanggal melebihi panjang bulan
  while (hijriDay > monthLengths[hijriMonth]) {
    hijriDay -= monthLengths[hijriMonth];
    hijriMonth++;

    if (hijriMonth > 11) {
      hijriMonth = 0;
      hijriYear++;
    }
  }

  // Sesuaikan jika tanggal kurang dari 1 (untuk tanggal sebelum 1 Ramadhan)
  while (hijriDay < 1) {
    hijriMonth--;

    if (hijriMonth < 0) {
      hijriMonth = 11;
      hijriYear--;
    }

    hijriDay += monthLengths[hijriMonth];
  }

  return `${hijriDay} ${bulanHijriah[hijriMonth]} ${hijriYear} H`;
};

const updatePemasukan = async () => {
  // Update berdasarkan jenis pemasukan
  if (jenisPemasukan.value === "rutin") {
    // Validasi form untuk pemasukan rutin
    const infaqLaki = unformatNumber(form.value.infaqLaki);
    const infaqPerempuan = unformatNumber(form.value.infaqPerempuan);
    const total = infaqLaki + infaqPerempuan;

    if (total === 0) {
      Swal.fire({
        icon: "warning",
        title: "Peringatan",
        text: "Mohon isi minimal satu pemasukan!",
        confirmButtonColor: "#059669",
      });
      return;
    }

    // Update infaq laki-laki
    if (jenisInfaq.value === "laki" && infaqLaki > 0) {
      const result = await updatePemasukanData(transactionId, {
        date: form.value.tanggal,
        name: "Infaq Laki-laki",
        amount: infaqLaki,
        source: "Kotak Amal Laki-laki",
      });
      if (!result.success) {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: result.error || "Gagal mengupdate infaq laki-laki!",
          confirmButtonColor: "#059669",
        });
        return;
      }
    }

    // Update infaq perempuan
    if (jenisInfaq.value === "perempuan" && infaqPerempuan > 0) {
      const result = await updatePemasukanData(transactionId, {
        date: form.value.tanggal,
        name: "Infaq Perempuan",
        amount: infaqPerempuan,
        source: "Kotak Amal Perempuan",
      });
      if (!result.success) {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: result.error || "Gagal mengupdate infaq perempuan!",
          confirmButtonColor: "#059669",
        });
        return;
      }
    }
  } else if (jenisPemasukan.value === "lainnya") {
    // Validasi form untuk pemasukan lainnya
    if (form.value.pemasukanLainnya.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Peringatan",
        text: "Mohon isi minimal satu pemasukan!",
        confirmButtonColor: "#059669",
      });
      return;
    }

    // Update pemasukan lainnya
    for (const item of form.value.pemasukanLainnya) {
      const jumlah = unformatNumber(item.jumlah);
      if (jumlah > 0) {
        const result = await updatePemasukanData(transactionId, {
          date: form.value.tanggal,
          name: item.nama || "Pemasukan Lainnya",
          amount: jumlah,
          source: item.sumberDana === "amplop" ? "Amplop" : "Transfer",
        });
        if (!result.success) {
          Swal.fire({
            icon: "error",
            title: "Gagal",
            text: result.error || "Gagal mengupdate pemasukan lainnya!",
            confirmButtonColor: "#059669",
          });
          return;
        }
      }
    }
  }

  Swal.fire({
    icon: "success",
    title: "Berhasil",
    text: "Pemasukan berhasil diupdate!",
    confirmButtonColor: "#059669",
  }).then(() => {
    router.back();
  });
};

// Lifecycle
onMounted(() => {
  loadTransaction();
});
</script>

<style scoped>
.material-symbols-outlined {
  font-variation-settings:
    "FILL" 0,
    "wght" 400,
    "GRAD" 0,
    "opsz" 24;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
