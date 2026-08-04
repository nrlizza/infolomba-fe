export const panitia = [
  {
    path: "/dashboard-panitia",
    name: "Dashboard",
    meta: {
      requiresAuth: true,
      allowedRoles: ['ADMIN', 'PANITIA'],
      layout: "admin"
    },
    component: () => import("@/views/Panitia/UnggahLomba.vue"),
  },
  {
    path: "/daftar-upload",
    name: "Daftar Upload",
    meta: {
      requiresAuth: true,
      allowedRoles: ['ADMIN', 'PANITIA'],
      layout: "admin"
    },
    component: () => import("@/views/Panitia/HistoryLomba.vue"),
  },
  {
    path: "/edit-lomba/:id",
    name: "Edit Lomba",
    meta: {
      requiresAuth: true,
      allowedRoles: ['ADMIN', 'PANITIA'],
      layout: "admin"
    },
    component: () => import("@/views/Panitia/EditLomba.vue"),
  },
  {
    path: "/riwayat-daftar-peserta/:id",
    name: "Daftar Peserta Lomba",
    meta: {
      requiresAuth: true,
      allowedRoles: ['ADMIN', 'PANITIA'],
      layout: "admin"
    },
    component: () => import("@/views/Panitia/DaftarPesertaLomba.vue"),
  },
  {
    path: "/panitia-chat",
    name: "Chat Admin",
    meta: {
      requiresAuth: true,
      allowedRoles: ['ADMIN', 'PANITIA'],
      layout: "admin"
    },
    component: () => import("@/views/Panitia/ChatPanitia.vue"),
  },
];