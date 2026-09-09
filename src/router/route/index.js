export const root = [
  {
    path: "/login",
    name: "Login",
    meta: {
      requiresAuth: false,
      guestOnly: true,
      layout: "empty"
    },
    component: () => import("@/views/auth/Login.vue"),
  },
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
  {
    path: "/register",
    name: "Register",
    meta: {
      requiresAuth: false,
      guestOnly: true,
      layout: "empty"
    },
    component: () => import("@/views/auth/Register.vue"),
  },
];
