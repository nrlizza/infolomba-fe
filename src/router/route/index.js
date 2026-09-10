export const root = [
  {
    path: "/panitia-login",
    name: "PanitiaLogin",
    meta: {
      requiresAuth: false,
      guestOnly: true,
      layout: "empty"
    },
    component: () => import("@/views/auth/PanitiaLogin.vue"),
  },
  {
    path: "/panitia-register",
    name: "PanitiaRegister",
    meta: {
      requiresAuth: false,
      guestOnly: true,
      layout: "empty"
    },
    component: () => import("@/views/auth/PanitiaRegister.vue"),
  },
  {
    path: "/admin-login",
    name: "AdminLogin",
    meta: {
      requiresAuth: false,
      adminGuestOnly: true,
      layout: "empty"
    },
    component: () => import("@/views/auth/AdminLogin.vue"),
  },
];
