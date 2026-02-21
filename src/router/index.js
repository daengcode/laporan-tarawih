import { createRouter, createWebHistory } from "vue-router";
import Beranda from "../views/Beranda.vue";
import Ceramah from "../views/Ceramah.vue";
import Imam from "../views/Imam.vue";
import InputPemasukan from "../views/InputPemasukan.vue";
import InputPengeluaran from "../views/InputPengeluaran.vue";
import EditPemasukan from "../views/EditPemasukan.vue";
import EditPengeluaran from "../views/EditPengeluaran.vue";
import Laporan from "../views/Laporan.vue";
import LaporanPublik from "../views/LaporanPublik.vue";
import LaporanAmaliyahRamadhan from "../views/LaporanAmaliyahRamadhan.vue";
import NotFound from "../views/NotFound.vue";
import Login from "../views/Login.vue";
import { useAuth } from "@/composables/useAuth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "login",
      component: Login,
      meta: { requiresAuth: false },
    },
    {
      path: "/",
      name: "beranda",
      component: Beranda,
      meta: { requiresAuth: true },
    },
    {
      path: "/ceramah",
      name: "ceramah",
      component: Ceramah,
      meta: { requiresAuth: true },
    },
    {
      path: "/imam",
      name: "imam",
      component: Imam,
      meta: { requiresAuth: true },
    },
    {
      path: "/input-pemasukan",
      name: "input-pemasukan",
      component: InputPemasukan,
      meta: { requiresAuth: true },
    },
    {
      path: "/input-pengeluaran",
      name: "input-pengeluaran",
      component: InputPengeluaran,
      meta: { requiresAuth: true },
    },
    {
      path: "/edit-pemasukan/:id",
      name: "edit-pemasukan",
      component: EditPemasukan,
      meta: { requiresAuth: true },
    },
    {
      path: "/edit-pengeluaran/:id",
      name: "edit-pengeluaran",
      component: EditPengeluaran,
      meta: { requiresAuth: true },
    },
    {
      path: "/laporan",
      name: "laporan",
      component: Laporan,
      meta: { requiresAuth: true },
    },
    {
      path: "/laporan-amaliyah-ramadhan/:date",
      name: "laporan-publik",
      component: LaporanPublik,
      meta: { requiresAuth: false },
    },
    {
      path: "/laporan-amaliyah-ramadhan",
      name: "laporan-amaliyah-ramadhan",
      component: LaporanAmaliyahRamadhan,
      meta: { requiresAuth: false },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: NotFound,
      meta: { requiresAuth: false },
    },
  ],
});

// Navigation guard untuk cek auth
router.beforeEach((to, from, next) => {
  const { isAuthenticated, checkAuth } = useAuth();
  checkAuth(); // Cek auth dari localStorage

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (requiresAuth && !isAuthenticated.value) {
    // Jika halaman memerlukan auth tapi user belum login
    next("/login");
  } else if (to.path === "/login" && isAuthenticated.value) {
    // Jika user sudah login tapi mencoba akses halaman login
    next("/");
  } else {
    // Lanjutkan ke halaman yang diminta
    next();
  }
});

export default router;
