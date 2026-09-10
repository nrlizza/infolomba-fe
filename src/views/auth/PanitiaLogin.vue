<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { FwbButton, FwbInput } from "flowbite-vue";
import { useTaskStore } from "@/stores/Taskstore";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const store = useTaskStore();
const router = useRouter();

const showPassword = ref(false);

const form = ref({
    username: "",
    password: "",
    role: "PANITIA",
});

const togglePassword = () => {
    showPassword.value = !showPassword.value;
};

const errorMsg = ref("");

const handleLogin = async () => {
    errorMsg.value = "";
    try {
        const result = await store.login({
            username: form.value.username,
            password: form.value.password,
            role: form.value.role,
        });
        
        if (result === 200) {
            router.push("/beranda");
        } else {
            errorMsg.value = "Login gagal. Periksa username & password.";
        }
    } catch (error) {
        errorMsg.value = error.message || "Login gagal. Periksa username & password.";
        console.error("Login error:", error);
    }
};

</script>

<template>
    <section class="bg-gradient-to-b from-blue-50 to-white min-h-screen flex items-center justify-center px-4">
        <div class="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6 border border-gray-100 relative">
            <button
                @click="router.push('/beranda')"
                class="absolute top-4 left-4 flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors group"
            >
                <svg class="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span class="text-sm font-medium">Kembali</span>
            </button>
            
            <div class="text-center space-y-2 mt-4">
                <div class="inline-flex items-center justify-center w-14 h-14 bg-[#4954DE] text-white rounded-xl">
                    <font-awesome-icon icon="user-tie" class="text-2xl" />
                </div>
                <h2 class="text-lg font-bold text-gray-800">Login Panitia</h2>
                <p class="text-sm text-gray-500">Akses khusus untuk penyelenggara lomba</p>
            </div>

            <!-- Error Message -->
            <div v-if="errorMsg" class="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2 text-center">
                {{ errorMsg }}
            </div>

            <!-- Login Form -->
            <form class="space-y-5" @submit.prevent="handleLogin">
                <!-- Username -->
                <div class="relative">
                    <label for="username" class="block mb-1 text-sm font-medium text-gray-700"> Username </label>
                    <font-awesome-icon icon="user" class="absolute left-3 top-9 text-gray-400 z-10" />
                    <fwb-input id="username" v-model="form.username" placeholder="Masukkan username" type="text" required class="pl-10" />
                </div>

                <!-- Password -->
                <div class="relative">
                    <label for="password" class="block text-sm font-medium text-gray-700 mb-1"> Password </label>
                    <font-awesome-icon icon="lock" class="absolute left-3 top-9 text-gray-400 z-10" />
                    <fwb-input id="password" v-model="form.password" :type="showPassword ? 'text' : 'password'" placeholder="Masukkan password" required class="pl-10" />
                    <button type="button" class="absolute top-8.5 right-3 text-gray-400" @click="togglePassword">
                        <font-awesome-icon :icon="showPassword ? 'eye-slash' : 'eye'" />
                    </button>
                </div>

                <!-- Submit -->
                <fwb-button type="submit" color="blue" size="lg" class="w-full flex justify-center items-center gap-2">
                    <div class="flex items-center gap-2">
                        <font-awesome-icon icon="sign-in-alt" />
                        Masuk
                    </div>
                </fwb-button>

                <!-- Divider & Register -->
                <div class="flex items-center gap-3 my-3">
                    <hr class="flex-grow border-[#4954DE]" />
                    <span class="text-xs text-[#4954DE]">atau</span>
                    <hr class="flex-grow border-[#4954DE]" />
                </div>
                
                <p class="text-sm text-center text-gray-600">
                    Belum punya akun?
                    <router-link to="/panitia-register" class="text-[#4954DE] font-semibold hover:underline">Daftar sekarang</router-link>
                </p>
            </form>
        </div>
    </section>
</template>