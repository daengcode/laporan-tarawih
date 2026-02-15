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
          Input Pemasukan
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

          <!-- Section: Pemasukan Kotak Amal -->
          <section>
            <h3
              class="text-gray-900 dark:text-white text-base font-bold leading-tight tracking-tight mb-3 flex items-center gap-2"
            >
              Pemasukan Kotak Amal
            </h3>
            <div class="grid grid-cols-1 gap-4">
              <label class="flex flex-col gap-2">
                <p class="text-gray-600 dark:text-gray-400 text-sm font-semibold ml-1">
                  Infaq Laki-laki
                </p>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span class="text-gray-400 font-bold text-sm">Rp</span>
                  </div>
                  <input
                    v-model="form.infaqLaki"
                    class="form-input flex w-full rounded-xl text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary h-14 pl-10 pr-4 text-base font-bold placeholder:text-gray-300"
                    inputmode="numeric"
                    placeholder="0"
                    type="number"
                  />
                </div>
              </label>
              <label class="flex flex-col gap-2">
                <p class="text-gray-600 dark:text-gray-400 text-sm font-semibold ml-1">
                  Infaq Perempuan
                </p>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span class="text-gray-400 font-bold text-sm">Rp</span>
                  </div>
                  <input
                    v-model="form.infaqPerempuan"
                    class="form-input flex w-full rounded-xl text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary h-14 pl-10 pr-4 text-base font-bold placeholder:text-gray-300"
                    inputmode="numeric"
                    placeholder="0"
                    type="number"
                  />
                </div>
              </label>
            </div>
          </section>

          <!-- Section: Pemasukan Lainnya -->
          <section class="space-y-4">
            <h3
              class="text-gray-900 dark:text-white text-base font-bold leading-tight tracking-tight mb-3 flex items-center gap-2"
            >
              Pemasukan Lainnya
            </h3>
            <div class="grid grid-cols-1 gap-4">
              <label class="flex flex-col gap-2">
                <p class="text-gray-600 dark:text-gray-400 text-sm font-semibold ml-1">Nama</p>
                <div class="relative">
                  <input
                    v-model="form.namaDonatur"
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
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span class="text-gray-400 font-bold text-sm">Rp</span>
                  </div>
                  <input
                    v-model="form.jumlahLainnya"
                    class="form-input flex w-full rounded-xl text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary h-14 pl-10 pr-4 text-base font-bold placeholder:text-gray-300"
                    inputmode="numeric"
                    placeholder="0"
                    type="number"
                  />
                </div>
              </label>
            </div>
            <div class="space-y-3">
              <p class="text-gray-600 dark:text-gray-400 text-sm font-semibold ml-1">Sumber Dana</p>
              <div class="grid grid-cols-2 gap-3">
                <!-- Option 2: Amplop -->
                <div
                  @click="selectSumber('amplop')"
                  :class="[
                    'flex items-center p-3 rounded-xl border cursor-pointer transition-all',
                    form.sumberDana === 'amplop'
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary/50',
                  ]"
                >
                  <div
                    :class="[
                      'w-8 h-8 rounded-full flex items-center justify-center mr-3',
                      form.sumberDana === 'amplop'
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-500',
                    ]"
                  >
                    <span class="material-symbols-outlined text-lg">mail</span>
                  </div>
                  <span
                    :class="[
                      'text-sm font-semibold',
                      form.sumberDana === 'amplop'
                        ? 'text-primary'
                        : 'text-gray-700 dark:text-gray-300',
                    ]"
                    >Amplop</span
                  >
                </div>
                <!-- Option 4: Lainnya -->
                <div
                  @click="selectSumber('lainnya')"
                  :class="[
                    'flex items-center p-3 rounded-xl border cursor-pointer transition-all',
                    form.sumberDana === 'lainnya'
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary/50',
                  ]"
                >
                  <div
                    :class="[
                      'w-8 h-8 rounded-full flex items-center justify-center mr-3',
                      form.sumberDana === 'lainnya'
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-500',
                    ]"
                  >
                    <span class="material-symbols-outlined text-lg">more_horiz</span>
                  </div>
                  <span
                    :class="[
                      'text-sm font-semibold',
                      form.sumberDana === 'lainnya'
                        ? 'text-primary'
                        : 'text-gray-700 dark:text-gray-300',
                    ]"
                    >Lainnya</span
                  >
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
          @click="savePemasukan"
          :disabled="loading"
          class="w-full h-14 bg-gradient-to-r from-[#13ec80] to-[#0bc468] hover:from-[#0bc468] hover:to-[#13ec80] text-gray-900 font-extrabold text-base rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/30 active:scale-[0.98] transition-all transform disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="loading" class="material-symbols-outlined animate-spin">refresh</span>
          <span v-else class="material-symbols-outlined">save</span>
          <span v-if="loading">Menyimpan...</span>
          <span v-else>Simpan Pemasukan</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import { usePemasukan } from "@/composables/usePemasukan";

const router = useRouter();
const { user, logout } = useAuth();
const { addPemasukan, loading } = usePemasukan();

// Form data
const form = ref({
  infaqLaki: "",
  infaqPerempuan: "",
  namaDonatur: "",
  jumlahLainnya: "",
  sumberDana: "kotak-amal",
});

// Methods
const selectSumber = (sumber) => {
  form.value.sumberDana = sumber;
};

const savePemasukan = async () => {
  // Validasi form
  const infaqLaki = parseFloat(form.value.infaqLaki) || 0;
  const infaqPerempuan = parseFloat(form.value.infaqPerempuan) || 0;
  const jumlahLainnya = parseFloat(form.value.jumlahLainnya) || 0;
  const total = infaqLaki + infaqPerempuan + jumlahLainnya;

  if (total === 0) {
    alert("Mohon isi minimal satu pemasukan!");
    return;
  }

  // Simpan infaq laki-laki
  if (infaqLaki > 0) {
    const result = await addPemasukan({
      date: new Date().toISOString().split("T")[0],
      name: "Infaq Laki-laki",
      amount: infaqLaki,
      source: "Kotak Amal Laki-laki",
      createdBy: user.value.id,
    });
    if (!result.success) {
      alert(result.error || "Gagal menyimpan infaq laki-laki!");
      return;
    }
  }

  // Simpan infaq perempuan
  if (infaqPerempuan > 0) {
    const result = await addPemasukan({
      date: new Date().toISOString().split("T")[0],
      name: "Infaq Perempuan",
      amount: infaqPerempuan,
      source: "Kotak Amal Perempuan",
      createdBy: user.value.id,
    });
    if (!result.success) {
      alert(result.error || "Gagal menyimpan infaq perempuan!");
      return;
    }
  }

  // Simpan pemasukan lainnya
  if (jumlahLainnya > 0) {
    const result = await addPemasukan({
      date: new Date().toISOString().split("T")[0],
      name: form.value.namaDonatur || "Pemasukan Lainnya",
      amount: jumlahLainnya,
      source: form.value.sumberDana === "amplop" ? "Amplop" : "Lainnya",
      createdBy: user.value.id,
    });
    if (!result.success) {
      alert(result.error || "Gagal menyimpan pemasukan lainnya!");
      return;
    }
  }

  alert("Pemasukan berhasil disimpan!");
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
