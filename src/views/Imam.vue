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
              Daftar Imam Tarawih
            </h1>
            <p class="text-xs text-gray-500">Ramadhan 1447 H</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <Logout />
        </div>
      </div>
    </header>

    <main class="max-w-md mx-auto p-4">
      <!-- Info Tanggal Hari Ini -->
      <div class="bg-primary/5 rounded-xl p-4 mb-4 border border-primary/20">
        <p class="text-sm text-gray-600">
          Hari ini:
          <span class="font-bold text-primary">{{ formatDateIndo(todayDate) }}</span> (Ramadhan
          ke-{{ currentRamadhanDay }})
        </p>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-xl shadow-sm border border-primary/5 overflow-hidden">
        <table class="w-full">
          <thead class="bg-primary/10">
            <tr>
              <th
                class="px-4 py-3 text-left text-xs font-bold text-primary uppercase tracking-wider"
              >
                Hari
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-bold text-primary uppercase tracking-wider"
              >
                Tanggal
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-bold text-primary uppercase tracking-wider"
              >
                Imam
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="(imam, index) in daftarImam"
              :key="index"
              :class="[
                'transition-colors',
                imam.hari === currentRamadhanDay
                  ? 'bg-primary/20 font-bold text-primary'
                  : 'hover:bg-gray-50',
              ]"
            >
              <td class="px-4 py-3 text-sm text-gray-800">{{ imam.hari }}</td>
              <td class="px-4 py-3 text-sm text-gray-800">{{ imam.tanggal }}</td>
              <td class="px-4 py-3 text-sm text-gray-800">{{ imam.nama }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>

    <!-- Bottom Menu Component -->
    <BottomMenu current-page="imam" @open-modal="showAddModal = true" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import BottomMenu from "@/components/BottomMenu.vue";
import Logout from "@/components/Logout.vue";

const showAddModal = ref(false);
const todayDate = ref(new Date());

// Hitung hari Ramadhan ke berapa
const currentRamadhanDay = computed(() => {
  // Tanggal awal Ramadhan 1447 H (sesuaikan dengan tanggal sebenarnya)
  // Misalnya Ramadhan 1447 H dimulai pada 19 Februari 2026
  const ramadhanStartDate = new Date(2026, 1, 19); // Bulan 1 = Februari (0-indexed)
  const diffTime = todayDate.value - ramadhanStartDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays >= 0 && diffDays < 30) {
    return diffDays + 1;
  }
  return 0;
});

// Helper function untuk format tanggal Indonesia
const formatDateIndo = (date) => {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

// Generate tanggal untuk setiap hari Ramadhan
const generateRamadhanDates = () => {
  const dates = [];
  const startDate = new Date(2026, 1, 19); // 19 Februari 2026

  for (let i = 0; i < 30; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    dates.push(formatDateIndo(date));
  }

  return dates;
};

const ramadhanDates = generateRamadhanDates();

const daftarImam = Array.from({ length: 30 }, (_, index) => ({
  hari: index + 1,
  tanggal: ramadhanDates[index],
  nama: "Imam",
}));

onMounted(() => {
  todayDate.value = new Date();
});
</script>
