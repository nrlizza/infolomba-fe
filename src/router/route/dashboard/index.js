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
    path: "/riwayat-user",
    name: "Riwayat User",
    component: () => import("@/views/riwayat-user/RiwayatUser.vue"),
  },
  {
    path: "/poin-lomba",
    name: "PoinLomba",
    component: () => import("@/views/User/PoinLomba.vue"),
  },
];