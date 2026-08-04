export const admin = [
  {
    path: "/admin-dashboard",
    name: "Admin Dashboard",
    meta: {
      requiresAuth: true,
      allowedRoles: ['ADMIN'],
      layout: "admin"
    },
    component: () => import("@/views/Admin/DashboardAdmin.vue"),
  },
  {
    path: "/admin-riwayat",
    name: "Riwayat Validasi Admin",
    meta: {
      requiresAuth: true,
      allowedRoles: ['ADMIN'],
      layout: "admin"
    },
    component: () => import("@/views/Admin/RiwayatAdmin.vue"),
  },
  {
    path: "/admin-chat",
    name: "Chat Panitia Admin",
    meta: {
      requiresAuth: true,
      allowedRoles: ['ADMIN'],
      layout: "admin"
    },
    component: () => import("@/views/Admin/ChatAdmin.vue"),
  }
];
