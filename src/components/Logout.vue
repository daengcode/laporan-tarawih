<template>
  <button
    @click="handleLogout"
    class="text-gray-900 dark:text-white flex size-10 shrink-0 items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
    title="Logout"
  >
    <span class="material-symbols-outlined">logout</span>
  </button>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import Swal from "sweetalert2";

const router = useRouter();
const { logout } = useAuth();

const handleLogout = () => {
  Swal.fire({
    title: "Konfirmasi",
    text: "Apakah Anda yakin ingin keluar?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#13ec80",
    cancelButtonColor: "#d33",
    confirmButtonText: "Ya, keluar",
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      logout();
      router.push("/login");
    }
  });
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
</style>
