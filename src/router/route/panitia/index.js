export const panitia = [
  {
    path: "/dashboard-panitia",
    name: "Dashboard",
    meta: {
      layout: "admin"
    },
    component: () => import("@/views/Admin/UnggahLomba.vue"),
  },
  {
    path: "/unggah-lomba",
    name: "UnggahLomba",
    component: () => import("@/views/Admin/UnggahLomba.vue"),
  },
  {
    path: "/riwayat-penyelenggara-lomba",
    name: "HistoryLomba",
    component: () => import("@/views/Admin/HistoryLomba.vue"),
  },
  {
    path: "/riwayat-daftar-peserta",
    name: "DaftarPesertaLomba",
    component: () => import("@/views/Admin/DaftarPesertaLomba.vue"),
  },
];