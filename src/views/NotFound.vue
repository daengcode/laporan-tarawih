<template>
  <div
    class="bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center p-4"
  >
    <div class="text-center max-w-md">
      <div class="mb-8">
        <span class="material-symbols-outlined text-9xl text-gray-300">error_outline</span>
      </div>
      <h1 class="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
      <h2 class="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-4">
        Halaman Tidak Ditemukan
      </h2>
      <p class="text-gray-600 dark:text-gray-400 mb-8">
        Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.
      </p>
      <button
        @click="goToHome"
        class="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30"
      >
        Kembali ke Beranda
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const goToHome = () => {
  router.push("/");
};
</script>

<style scoped>
.material-symbols-outlined {
  font-variation-settings:
    "FILL" 0,
    "wght" 100,
    "GRAD" 0,
    "opsz" 48;
}
</style>
