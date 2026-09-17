import { defineStore } from "pinia";

export const useAuthModalStore = defineStore("authModal", {
    state: () => ({
        activeModal: null,
    }),
    getters: {
        isLoginOpen: (state) => state.activeModal === "login",
        isRegisterOpen: (state) => state.activeModal === "register",
    },
    actions: {
        openLogin() {
            this.activeModal = "login";
        },
        openRegister() {
            this.activeModal = "register";
        },
        close() {
            this.activeModal = null;
        },
        switchToLogin() {
            this.activeModal = "login";
        },
        switchToRegister() {
            this.activeModal = "register";
        },
    },
});