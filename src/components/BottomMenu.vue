<template>
  <nav
    class="fixed bottom-0 left-0 right-0 bg-white border-t border-primary/10 flex items-center justify-between z-50"
  >
    <div class="max-w-md mx-auto w-full px-6 py-3 flex items-center justify-between">
      <a
        @click.prevent="navigateTo('beranda')"
        :class="[
          'flex flex-col items-center gap-1 cursor-pointer transition-colors',
          currentPage === 'beranda' ? 'text-primary' : 'text-gray-400 hover:text-primary',
        ]"
      >
        <span class="material-symbols-outlined">dashboard</span>
        <span class="text-[10px] font-bold uppercase tracking-widest">Beranda</span>
      </a>

      <!-- <a
        @click.prevent="navigateTo('ceramah')"
        :class="[
          'flex flex-col items-center gap-1 cursor-pointer transition-colors',
          currentPage === 'ceramah' ? 'text-primary' : 'text-gray-400 hover:text-primary',
        ]"
      >
        <span class="material-symbols-outlined">campaign</span>
        <span class="text-[10px] font-bold uppercase tracking-widest">Ceramah</span>
      </a> -->

      <!-- FAB Button di Tengah -->
      <button
        @click="$emit('openModal')"
        class="flex flex-col items-center gap-1 -mt-8 bg-primary text-white w-14 h-14 rounded-full shadow-lg shadow-primary/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
      >
        <span class="material-symbols-outlined text-3xl">add_circle</span>
      </button>

      <!-- <a
        @click.prevent="navigateTo('imam')"
        :class="[
          'flex flex-col items-center gap-1 cursor-pointer transition-colors',
          currentPage === 'imam' ? 'text-primary' : 'text-gray-400 hover:text-primary',
        ]"
      >
        <span class="material-symbols-outlined">groups</span>
        <span class="text-[10px] font-bold uppercase tracking-widest">Imam</span>
      </a> -->

      <a
        @click.prevent="navigateTo('laporan')"
        :class="[
          'flex flex-col items-center gap-1 cursor-pointer transition-colors',
          currentPage === 'laporan' ? 'text-primary' : 'text-gray-400 hover:text-primary',
        ]"
      >
        <span class="material-symbols-outlined">analytics</span>
        <span class="text-[10px] font-bold uppercase tracking-widest">Laporan</span>
      </a>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

defineProps({
  currentPage: {
    type: String,
    default: "beranda",
  },
});

defineEmits(["openModal"]);

const navigateTo = (page) => {
  if (page === "beranda") {
    router.push("/");
  } else if (page === "ceramah") {
    router.push("/ceramah");
  } else if (page === "imam") {
    router.push("/imam");
  } else if (page === "laporan") {
    router.push("/laporan");
  }
};
</script>
