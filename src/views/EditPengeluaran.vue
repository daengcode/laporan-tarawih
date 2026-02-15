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
          Edit Pengeluaran
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

          <!-- Section: Pengeluaran Utama -->
          <section v-if="jenisPengeluaran === 'rutin'">
            <h3
              class="text-gray-900 dark:text-white text-base font-bold leading-tight tracking-tight mb-3 flex items-center gap-2"
            >
              Pengeluaran Rutin
            </h3>
            <div class="grid grid-cols-1 gap-4">
              <label v-if="jenisRutin === 'ceramah'" class="flex flex-col gap-2">
                <p class="text-gray-600 dark:text-gray-400 text-sm font-semibold ml-1">
                  Honor Ceramah
                </p>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span class="text-gray-400 font-bold text-sm">Rp</span>
                  </div>
                  <input
                    v-model="form.ceramah"
                    @input="formatNumberInput($event, 'ceramah')"
                    class="form-input flex w-full rounded-xl text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary h-14 pl-10 pr-4 text-base font-bold placeholder:text-gray-300"
                    inputmode="numeric"
                    placeholder="0"
                    type="text"
                  />
                </div>
              </label>
              <label v-if="jenisRutin === 'imam'" class="flex flex-col gap-2">
                <p class="text-gray-600 dark:text-gray-400 text-sm font-semibold ml-1">
                  Honor Imam
                </p>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span class="text-gray-400 font-bold text-sm">Rp</span>
                  </div>
                  <input
                    v-model="form.imam"
                    @input="formatNumberInput($event, 'imam')"
                    class="form-input flex w-full rounded-xl text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary h-14 pl-10 pr-4 text-base font-bold placeholder:text-gray-300"
                    inputmode="numeric"
                    placeholder="0"
                    type="text"
                  />
                </div>
              </label>
            </div>
          </section>

          <!-- Section: Pengeluaran Lainnya -->
          <section v-if="jenisPengeluaran === 'lainnya'" class="space-y-4">
            <h3
              class="text-gray-900 dark:text-white text-base font-bold leading-tight tracking-tight mb-3 flex items-center gap-2"
            >
              Pengeluaran Lainnya
            </h3>
            <!-- List Pengeluaran Lainnya -->
            <div v-if="form.pengeluaranLainnya.length > 0" class="space-y-3">
              <div
                v-for="(item, index) in form.pengeluaranLainnya"
                :key="index"
                class="bg-white dark:bg-gray-800 rounded-xl border border-orange-200 dark:border-orange-700 p-4"
              >
                <div class="grid grid-cols-1 gap-4">
                  <label class="flex flex-col gap-2">
                    <p class="text-gray-600 dark:text-gray-400 text-sm font-semibold ml-1">
                      Nama Keperluan
                    </p>
                    <div class="relative">
                      <input
                        v-model="item.nama"
                        class="form-input flex w-full rounded-xl text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-700 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-orange-500 h-14 px-4 text-base font-bold placeholder:text-gray-300"
                        placeholder="Contoh: Perbaikan AC"
                        type="text"
                      />
                    </div>
                  </label>
                  <label class="flex flex-col gap-2">
                    <p class="text-gray-600 dark:text-gray-400 text-sm font-semibold ml-1">
                      Biaya Keperluan
                    </p>
                    <div class="relative">
                      <div
                        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                      >
                        <span class="text-gray-400 font-bold text-sm">Rp</span>
                      </div>
                      <input
                        v-model="item.biaya"
                        @input="formatNumberInput($event, 'biaya', index)"
                        class="form-input flex w-full rounded-xl text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-700 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-orange-500 h-14 pl-10 pr-4 text-base font-bold placeholder:text-gray-300"
                        inputmode="numeric"
                        placeholder="0"
                        type="text"
                      />
                    </div>
                  </label>
                </div>
                <div class="space-y-2 mt-3">
                  <p class="text-gray-600 dark:text-gray-400 text-sm font-semibold ml-1">
                    Jenis Keperluan
                  </p>
                  <div class="grid grid-cols-2 gap-3">
                    <!-- Option 2: Kebersihan -->
                    <div
                      @click="item.jenisKeperluan = 'kebersihan'"
                      :class="[
                        'flex items-center p-3 rounded-xl border cursor-pointer transition-all',
                        item.jenisKeperluan === 'kebersihan'
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-orange-400',
                      ]"
                    >
                      <div
                        :class="[
                          'w-8 h-8 rounded-full flex items-center justify-center mr-3',
                          item.jenisKeperluan === 'kebersihan'
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-500',
                        ]"
                      >
                        <span class="material-symbols-outlined text-lg">cleaning_services</span>
                      </div>
                      <span
                        :class="[
                          'text-sm font-semibold',
                          item.jenisKeperluan === 'kebersihan'
                            ? 'text-orange-700'
                            : 'text-gray-700 dark:text-gray-300',
                        ]"
                        >Kebersihan</span
                      >
                    </div>
                    <!-- Option 3: Buka Puasa -->
                    <div
                      @click="item.jenisKeperluan = 'lainnya'"
                      :class="[
                        'flex items-center p-3 rounded-xl border cursor-pointer transition-all',
                        item.jenisKeperluan === 'lainnya'
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-orange-400',
                      ]"
                    >
                      <div
                        :class="[
                          'w-8 h-8 rounded-full flex items-center justify-center mr-3',
                          item.jenisKeperluan === 'lainnya'
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-500',
                        ]"
                      >
                        <span class="material-symbols-outlined text-lg">restaurant</span>
                      </div>
                      <span
                        :class="[
                          'text-sm font-semibold',
                          item.jenisKeperluan === 'lainnya'
                            ? 'text-orange-700'
                            : 'text-gray-700 dark:text-gray-300',
                        ]"
                        >Buka Puasa</span
                      >
                    </div>
                  </div>
                </div>
                <!-- Tombol Hapus -->
                <button
                  @click="hapusPengeluaranLainnya(index)"
                  class="flex items-center justify-center w-10 h-10 rounded-full bg-red-50 hover:bg-red-100 text-red-500 transition-colors mt-2"
                  title="Hapus"
                >
                  <span class="material-symbols-outlined">delete</span>
                </button>
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
          @click="updatePengeluaran"
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
import { usePengeluaran } from "@/composables/usePengeluaran";
import Swal from "sweetalert2";
import Logout from "@/components/Logout.vue";

const router = useRouter();
const route = useRoute();
const { user, logout } = useAuth();
const { getPengeluaranById, updatePengeluaran: updatePengeluaranData, loading } = usePengeluaran();

// Get transaction ID from route
const transactionId = route.params.id;

// Form data
const form = ref({
  tanggal: new Date().toISOString().split("T")[0],
  ceramah: "",
  imam: "",
  pengeluaranLainnya: [],
});

// Jenis pengeluaran yang sedang diedit
const jenisPengeluaran = ref("rutin"); // 'rutin' atau 'lainnya'

// Jenis pengeluaran rutin yang sedang diedit
const jenisRutin = ref("ceramah"); // 'ceramah' atau 'imam'

// Load transaction data
const loadTransaction = async () => {
  const result = await getPengeluaranById(transactionId);
  if (result.success && result.data) {
    form.value.tanggal = result.data.date;

    // Check if this is a regular expense or "Lainnya"
    if (result.data.name === "Honor Ceramah") {
      jenisPengeluaran.value = "rutin";
      jenisRutin.value = "ceramah";
      form.value.ceramah = formatNumber(result.data.amount);
    } else if (result.data.name === "Honor Imam") {
      jenisPengeluaran.value = "rutin";
      jenisRutin.value = "imam";
      form.value.imam = formatNumber(result.data.amount);
    } else {
      // This is "Lainnya" expense
      jenisPengeluaran.value = "lainnya";
      form.value.pengeluaranLainnya.push({
        nama: result.data.name,
        biaya: formatNumber(result.data.amount),
        jenisKeperluan: result.data.expense_type === "Kebersihan" ? "kebersihan" : "lainnya",
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

const tambahPengeluaranLainnya = () => {
  form.value.pengeluaranLainnya.push({
    nama: "",
    biaya: "",
    jenisKeperluan: "kebersihan",
  });
};

const hapusPengeluaranLainnya = (index) => {
  form.value.pengeluaranLainnya.splice(index, 1);
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
    form.value.pengeluaranLainnya[index][field] = formattedValue;
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

  // Reference: 1 Ramadhan 1447 H = 18 Februari 2026
  const ramadhan1447Start = new Date("2026-02-18");
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

const updatePengeluaran = async () => {
  // Update berdasarkan jenis pengeluaran
  if (jenisPengeluaran.value === "rutin") {
    // Validasi form untuk pengeluaran rutin
    const ceramah = unformatNumber(form.value.ceramah);
    const imam = unformatNumber(form.value.imam);
    const total = ceramah + imam;

    if (total === 0) {
      Swal.fire({
        icon: "warning",
        title: "Peringatan",
        text: "Mohon isi minimal satu pengeluaran!",
        confirmButtonColor: "#059669",
      });
      return;
    }

    // Update honor ceramah
    if (jenisRutin.value === "ceramah" && ceramah > 0) {
      const result = await updatePengeluaranData(transactionId, {
        date: form.value.tanggal,
        name: "Honor Ceramah",
        amount: ceramah,
        expense_type: "Rutin",
      });
      if (!result.success) {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: result.error || "Gagal mengupdate honor ceramah!",
          confirmButtonColor: "#059669",
        });
        return;
      }
    }

    // Update honor imam
    if (jenisRutin.value === "imam" && imam > 0) {
      const result = await updatePengeluaranData(transactionId, {
        date: form.value.tanggal,
        name: "Honor Imam",
        amount: imam,
        expense_type: "Rutin",
      });
      if (!result.success) {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: result.error || "Gagal mengupdate honor imam!",
          confirmButtonColor: "#059669",
        });
        return;
      }
    }
  } else if (jenisPengeluaran.value === "lainnya") {
    // Validasi form untuk pengeluaran lainnya
    if (form.value.pengeluaranLainnya.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Peringatan",
        text: "Mohon isi minimal satu pengeluaran!",
        confirmButtonColor: "#059669",
      });
      return;
    }

    // Update pengeluaran lainnya
    for (const item of form.value.pengeluaranLainnya) {
      const biaya = unformatNumber(item.biaya);
      if (biaya > 0) {
        const result = await updatePengeluaranData(transactionId, {
          date: form.value.tanggal,
          name: item.nama || "Pengeluaran Lainnya",
          amount: biaya,
          expense_type: item.jenisKeperluan === "kebersihan" ? "Kebersihan" : "Buka Puasa",
        });
        if (!result.success) {
          Swal.fire({
            icon: "error",
            title: "Gagal",
            text: result.error || "Gagal mengupdate pengeluaran lainnya!",
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
    text: "Pengeluaran berhasil diupdate!",
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
