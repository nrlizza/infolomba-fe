export const dashboard = [
  {
    path: "/",
    name: "Redirect",
    component: () => import("@/components/Ui/Redirect.vue"),
  },
  {
    path: "/beranda",
    name: "Beranda",
    component: () => import("@/views/beranda/Dashboard.vue"),
  },
  {
    path: "/detail-lomba/:id_lomba",
    name: "Detail Lomba",
    component: () => import("@/views/beranda/DetailLomba.vue"),
  },
  {
    path: "/info-lomba",
    name: "Info Lomba",
    component: () => import("@/views/info-lomba/InfoLomba.vue"),
  },
  {
    path: "/riwayat-lomba",
    name: "Riwayat Lomba",
    component: () => import("@/views/riwayat-user/RiwayatLomba.vue"),
  },
  {
    path: "/poin-lomba",
    name: "PoinLomba",
    component: () => import("@/views/User/PoinLomba.vue"),
  },
];