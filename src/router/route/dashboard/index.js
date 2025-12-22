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
    path: "/info-lomba",
    name: "InfoLomba",
    component: () => import("@/views/info-lomba/InfoLomba.vue"),
  },
  {
    path: "/riwayat-lomba",
    name: "RiwayatLomba",
    component: () => import("@/views/riwayat-lomba/RiwayatLomba.vue"),
  },
  {
    path: "/poin-lomba",
    name: "PoinLomba",
    component: () => import("@/views/User/PoinLomba.vue"),
  },
];