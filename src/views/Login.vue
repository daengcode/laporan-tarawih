<template>
  <div
    class="bg-background-light dark:bg-background-dark text-[#111814] min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
  >
    <!-- Background Decoration -->
    <div class="absolute inset-0 islamic-pattern pointer-events-none"></div>
    <div class="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
    <div class="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>

    <!-- Main Content -->
    <main
      class="w-full max-w-[420px] bg-white dark:bg-[#1a2e24] p-8 rounded-xl shadow-xl shadow-primary/5 z-10 border border-primary/10"
    >
      <!-- Logo & Header -->
      <div class="flex flex-col items-center mb-8">
        <div class="bg-primary/20 p-4 rounded-full mb-4">
          <span
            class="material-symbols-outlined text-primary text-4xl"
            style="font-variation-settings: &quot;FILL&quot; 1"
            >mosque</span
          >
        </div>
        <h1 class="text-2xl font-extrabold tracking-tight text-[#111814] dark:text-white">
          Masjid Baiturrahim
        </h1>
        <p class="text-sm text-[#4a5d53] dark:text-gray-400 mt-2 text-center font-medium">
          Kelola Laporan Keuangan Tarawih dengan Mudah
        </p>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="space-y-5">
        <!-- Username/Email Field -->
        <div class="flex flex-col gap-2">
          <label
            class="text-sm font-semibold text-[#111814] dark:text-gray-200 ml-1"
            for="username"
          >
            Username
          </label>
          <div class="relative group">
            <span
              class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#618975] group-focus-within:text-primary transition-colors"
            >
              person
            </span>
            <input
              v-model="form.username"
              class="w-full pl-10 pr-4 py-3.5 rounded-lg border border-[#dbe6e0] dark:border-[#2d4a3b] bg-white dark:bg-[#102219] text-[#111814] dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all placeholder:text-[#618975]/60"
              id="username"
              placeholder="Masukkan username"
              type="text"
            />
          </div>
        </div>

        <!-- Password Field -->
        <div class="flex flex-col gap-2">
          <label
            class="text-sm font-semibold text-[#111814] dark:text-gray-200 ml-1"
            for="password"
          >
            Password
          </label>
          <div class="relative group">
            <span
              class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#618975] group-focus-within:text-primary transition-colors"
            >
              lock
            </span>
            <input
              v-model="form.password"
              class="w-full pl-10 pr-12 py-3.5 rounded-lg border border-[#dbe6e0] dark:border-[#2d4a3b] bg-white dark:bg-[#102219] text-[#111814] dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all placeholder:text-[#618975]/60"
              id="password"
              placeholder="••••••"
              type="password"
            />
            <button
              @click="togglePasswordVisibility"
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-[#618975] hover:text-primary transition-colors"
            >
              <span class="material-symbols-outlined" v-if="!showPassword">visibility</span>
              <span class="material-symbols-outlined" v-else>visibility_off</span>
            </button>
          </div>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-primary hover:bg-primary/90 text-[#0a2014] font-bold py-4 rounded-lg shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="loading" class="material-symbols-outlined animate-spin">refresh</span>
          <span v-else>Masuk</span>
          <span v-if="!loading" class="material-symbols-outlined">login</span>
        </button>

        <!-- Error Message -->
        <div
          v-if="error"
          class="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
        >
          <p class="text-sm text-red-600 dark:text-red-400 text-center">{{ error }}</p>
        </div>
      </form>

      <!-- Footer / Registration -->
      <div class="mt-10 pt-6 border-t border-[#dbe6e0] dark:border-[#2d4a3b] text-center">
        <span
          class="mt-2 inline-block text-[#111814] dark:text-white font-extrabold hover:text-primary transition-colors underline decoration-primary underline-offset-4"
        >
          Ramadhan 1447 H
        </span>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";

const router = useRouter();
const { login, loading, error } = useAuth();

// Form data
const form = ref({
  username: "",
  password: "",
  rememberMe: false,
});

const showPassword = ref(false);

// Methods
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const handleLogin = async () => {
  // Validasi form
  if (!form.value.username || !form.value.password) {
    return;
  }

  // Panggil fungsi login dari useAuth
  const result = await login(form.value.username, form.value.password);

  if (result.success) {
    // Login berhasil, redirect ke beranda
    router.push("/");
  }
  // Error sudah ditampilkan melalui ref error dari useAuth
};
</script>

<style scoped>
.islamic-pattern {
  background-color: transparent;
  background-image:
    radial-gradient(#13ec80 0.5px, transparent 0.5px), radial-gradient(#13ec80 0.5px, #f6f8f7 0.5px);
  background-size: 20px 20px;
  background-position:
    0 0,
    10px 10px;
  opacity: 0.08;
  pointer-events: none;
}

.material-symbols-outlined {
  font-variation-settings:
    "FILL" 0,
    "wght" 400,
    "GRAD" 0,
    "opsz" 24;
}

.material-symbols-outlined.font-fill {
  font-variation-settings:
    "FILL" 1,
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
