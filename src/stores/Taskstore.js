import { defineStore } from "pinia";
import AxiosInstance from "@/lib/axios/axiosInstance.js";

export const useTaskStore = defineStore("taskstore", {
    state: () => ({
        API_INFO_LOMBA: import.meta.env.VITE_API_INFO_LOMBA_URL,
    }),
    actions: {

        /* -------------------------------------------------------------------------- */
        /*                                 Login Start                                */
        /* -------------------------------------------------------------------------- */

        async login(payload) {
            try {
                const res = await AxiosInstance.post(`auth/login`, payload, {
                    withCredentials: true,
                });
                return res.status;
            } catch (error) {
                console.error("Error logging in:", error);
            }
        },

        async register(payload) {
            try {
                const res = await AxiosInstance.post(`auth/register`, payload, {
                    withCredentials: true,
                });
                return res.status;
            } catch (error) {
                console.error("Error logging in:", error);
                throw error;
            }
        },


        async logout() {
            try {
                const res = await AxiosInstance.post(
                    `auth/logout`,
                    {},
                    {
                        withCredentials: true,
                    }
                );
                return res.status;
            } catch (error) {
                console.error("Error logging out:", error);
            }
        },

        /* -------------------------------------------------------------------------- */
        /*                                  Login End                                 */
        /* -------------------------------------------------------------------------- */
    },
    
});
