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
          @click="router.push('/')"
          class="text-gray-900 dark:text-white flex size-10 shrink-0 items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          <span class="material-symbols-outlined">arrow_back</span>
        </button>
        <h2
          class="text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-tight flex-1 ml-4"
        >
          Input Pengeluaran
        </h2>
        <button
          @click="handleLogout"
          class="text-gray-900 dark:text-white flex size-10 shrink-0 items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          title="Logout"
        >
          <span class="material-symbols-outlined">logout</span>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto pb-24">
        <div class="p-4 space-y-6">
          <!-- Date Section -->
          <section class="mb-2 p-4 rounded-xl bg-primary/5 border border-dashed border-primary/30">
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600 dark:text-gray-400 font-medium">Tanggal Laporan</span>
              <span class="font-bold text-gray-900 dark:text-white flex items-center gap-1">
                12 Ramadhan 1445 H
                <span class="material-symbols-outlined text-base text-primary">calendar_month</span>
              </span>
            </div>
          </section>

          <!-- Section: Pengeluaran Utama -->
          <section>
            <h3
              class="text-gray-900 dark:text-white text-base font-bold leading-tight tracking-tight mb-3 flex items-center gap-2"
            >
              Pengeluaran Utama
            </h3>
            <div class="grid grid-cols-1 gap-4">
              <label class="flex flex-col gap-2">
                <p class="text-gray-600 dark:text-gray-400 text-sm font-semibold ml-1">
                  Honor Ceramah
                </p>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span class="text-gray-400 font-bold text-sm">Rp</span>
                  </div>
                  <input
                    v-model="form.ceramah"
                    class="form-input flex w-full rounded-xl text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary h-14 pl-10 pr-4 text-base font-bold placeholder:text-gray-300"
                    inputmode="numeric"
                    placeholder="0"
                    type="number"
                  />
                </div>
              </label>
              <label class="flex flex-col gap-2">
                <p class="text-gray-600 dark:text-gray-400 text-sm font-semibold ml-1">
                  Honor Imam
                </p>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span class="text-gray-400 font-bold text-sm">Rp</span>
                  </div>
                  <input
                    v-model="form.imam"
                    class="form-input flex w-full rounded-xl text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary h-14 pl-10 pr-4 text-base font-bold placeholder:text-gray-300"
                    inputmode="numeric"
                    placeholder="0"
                    type="number"
                  />
                </div>
              </label>
            </div>
          </section>

          <!-- Section: Pengeluaran Lainnya -->
          <section class="space-y-4">
            <h3
              class="text-gray-900 dark:text-white text-base font-bold leading-tight tracking-tight mb-3 flex items-center gap-2"
            >
              Pengeluaran Lainnya
            </h3>
            <div class="grid grid-cols-1 gap-4">
              <label class="flex flex-col gap-2">
                <p class="text-gray-600 dark:text-gray-400 text-sm font-semibold ml-1">
                  Nama Keperluan
                </p>
                <div class="relative">
                  <input
                    v-model="form.namaKeperluan"
                    class="form-input flex w-full rounded-xl text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary h-14 px-4 text-base font-bold placeholder:text-gray-300"
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
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span class="text-gray-400 font-bold text-sm">Rp</span>
                  </div>
                  <input
                    v-model="form.biayaKeperluan"
                    class="form-input flex w-full rounded-xl text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary h-14 pl-10 pr-4 text-base font-bold placeholder:text-gray-300"
                    inputmode="numeric"
                    placeholder="0"
                    type="number"
                  />
                </div>
              </label>
            </div>
            <div class="space-y-3">
              <p class="text-gray-600 dark:text-gray-400 text-sm font-semibold ml-1">
                Jenis Keperluan
              </p>
              <div class="grid grid-cols-2 gap-3">
                <!-- Option 2: Kebersihan -->
                <div
                  @click="selectJenis('kebersihan')"
                  :class="[
                    'flex items-center p-3 rounded-xl border cursor-pointer transition-all',
                    form.jenisKeperluan === 'kebersihan'
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary/50',
                  ]"
                >
                  <div
                    :class="[
                      'w-8 h-8 rounded-full flex items-center justify-center mr-3',
                      form.jenisKeperluan === 'kebersihan'
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-500',
                    ]"
                  >
                    <span class="material-symbols-outlined text-lg">cleaning_services</span>
                  </div>
                  <span
                    :class="[
                      'text-sm font-semibold',
                      form.jenisKeperluan === 'kebersihan'
                        ? 'text-primary'
                        : 'text-gray-700 dark:text-gray-300',
                    ]"
                    >Kebersihan</span
                  >
                </div>
                <!-- Option 3: Lainnya -->
                <div
                  @click="selectJenis('lainnya')"
                  :class="[
                    'flex items-center p-3 rounded-xl border cursor-pointer transition-all',
                    form.jenisKeperluan === 'lainnya'
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary/50',
                  ]"
                >
                  <div
                    :class="[
                      'w-8 h-8 rounded-full flex items-center justify-center mr-3',
                      form.jenisKeperluan === 'lainnya'
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-500',
                    ]"
                  >
                    <span class="material-symbols-outlined text-lg">more_horiz</span>
                  </div>
                  <span
                    :class="[
                      'text-sm font-semibold',
                      form.jenisKeperluan === 'lainnya'
                        ? 'text-primary'
                        : 'text-gray-700 dark:text-gray-300',
                    ]"
                    >Lainnya</span
                  >
                </div>
              </div>
            </div>
          </section>

          <!-- Upload Proof Section -->
          <section class="space-y-3">
            <p class="text-gray-600 dark:text-gray-400 text-sm font-semibold ml-1">
              Upload Bukti Nota
            </p>
            <div class="relative group cursor-pointer">
              <div
                class="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-primary/40 rounded-xl bg-primary/5 group-hover:bg-primary/10 transition-colors"
              >
                <span class="material-symbols-outlined text-primary text-4xl mb-2"
                  >cloud_upload</span
                >
                <p class="text-sm font-medium text-[#618975]">Ketuk untuk upload foto nota</p>
                <p class="text-xs text-[#618975]/60 mt-1">Format JPG, PNG (Max 5MB)</p>
              </div>
              <input class="absolute inset-0 opacity-0 cursor-pointer" type="file" />
            </div>
          </section>
        </div>
      </div>

      <!-- Sticky Footer with Action Button -->
      <div
        class="absolute bottom-0 left-0 w-full p-4 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-t border-gray-100 dark:border-gray-800"
      >
        <button
          @click="savePengeluaran"
          :disabled="loading"
          class="w-full h-14 bg-gradient-to-r from-[#13ec80] to-[#0bc468] hover:from-[#0bc468] hover:to-[#13ec80] text-gray-900 font-extrabold text-base rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/30 active:scale-[0.98] transition-all transform disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="loading" class="material-symbols-outlined animate-spin">refresh</span>
          <span v-else class="material-symbols-outlined">save</span>
          <span v-if="loading">Menyimpan...</span>
          <span v-else>Simpan Pengeluaran</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import { usePengeluaran } from "@/composables/usePengeluaran";

const router = useRouter();
const { user, logout } = useAuth();
const { addPengeluaran, loading } = usePengeluaran();

// Form data
const form = ref({
  ceramah: "",
  imam: "",
  namaKeperluan: "",
  biayaKeperluan: "",
  jenisKeperluan: "konsumsi",
});

// Methods
const selectJenis = (jenis) => {
  form.value.jenisKeperluan = jenis;
};

const savePengeluaran = async () => {
  // Validasi form
  const ceramah = parseFloat(form.value.ceramah) || 0;
  const imam = parseFloat(form.value.imam) || 0;
  const biayaKeperluan = parseFloat(form.value.biayaKeperluan) || 0;
  const total = ceramah + imam + biayaKeperluan;

  if (total === 0) {
    alert("Mohon isi minimal satu pengeluaran!");
    return;
  }

  // Simpan honor ceramah
  if (ceramah > 0) {
    const result = await addPengeluaran({
      date: new Date().toISOString().split("T")[0],
      name: "Honor Ceramah",
      amount: ceramah,
      expense_type: "Rutin",
      created_by: user.value.id,
    });
    if (!result.success) {
      alert(result.error || "Gagal menyimpan honor ceramah!");
      return;
    }
  }

  // Simpan honor imam
  if (imam > 0) {
    const result = await addPengeluaran({
      date: new Date().toISOString().split("T")[0],
      name: "Honor Imam",
      amount: imam,
      expense_type: "Rutin",
      created_by: user.value.id,
    });
    if (!result.success) {
      alert(result.error || "Gagal menyimpan honor imam!");
      return;
    }
  }

  // Simpan pengeluaran lainnya
  if (biayaKeperluan > 0) {
    const result = await addPengeluaran({
      date: new Date().toISOString().split("T")[0],
      name: form.value.namaKeperluan || "Pengeluaran Lainnya",
      amount: biayaKeperluan,
      expense_type: form.value.jenisKeperluan === "kebersihan" ? "Kebersihan" : "Lainnya",
      created_by: user.value.id,
    });
    if (!result.success) {
      alert(result.error || "Gagal menyimpan pengeluaran lainnya!");
      return;
    }
  }

  alert("Pengeluaran berhasil disimpan!");
  router.push("/");
};

const handleLogout = () => {
  if (confirm("Apakah Anda yakin ingin logout?")) {
    logout();
    router.push("/login");
  }
};
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
