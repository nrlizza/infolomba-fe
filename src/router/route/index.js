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
