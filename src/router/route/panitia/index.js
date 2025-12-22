export const panitia = [
  {
    path: "/dashboard-panitia",
    name: "Dashboard",
    meta: {
      requiresAuth: true,
      allowedRoles: ['ADMIN', 'PANITIA'],
      layout: "admin"
    },
    component: () => import("@/views/Admin/UnggahLomba.vue"),
  },
  {
    path: "/daftar-upload",
    name: "Daftar Upload",
    meta: {
      requiresAuth: true,
      allowedRoles: ['ADMIN', 'PANITIA'],
      layout: "admin"
    },
    component: () => import("@/views/Admin/HistoryLomba.vue"),
  },
  {
    path: "/edit-lomba/:id",
    name: "Edit Lomba",
    meta: {
      requiresAuth: true,
      allowedRoles: ['ADMIN', 'PANITIA'],
      layout: "admin"
    },
    component: () => import("@/views/Admin/EditLomba.vue"),
  },
  {
    path: "/riwayat-daftar-peserta/:id",
    name: "Daftar Peserta Lomba",
    meta: {
      requiresAuth: true,
      allowedRoles: ['ADMIN', 'PANITIA'],
      layout: "admin"
    },
    component: () => import("@/views/Admin/DaftarPesertaLomba.vue"),
  },
];