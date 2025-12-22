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
    role: "PESERTA",
});

const togglePassword = () => {
    showPassword.value = !showPassword.value;
};

const handleLogin = async () => {
    try {
        const result = await store.login({
            username: form.value.username,
            password: form.value.password,
            role: form.value.role,
        });
        
        if (result === 200) {
            router.push("/beranda");
        } else {
            alert("Login gagal. Periksa username & password.");
        }
    } catch (error) {
        alert(error.message || "Login gagal. Periksa username & password.");
        console.error("Login error:", error);
    }
};

const roles = ["PANITIA", "PESERTA"];
</script>

<template>
    <section class="bg-gradient-to-b from-blue-50 to-white min-h-screen flex items-center justify-center px-4">
        <div class="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6 border border-gray-100">
            <!-- Logo -->
            <div class="text-center space-y-2">
                <div class="inline-flex items-center justify-center w-14 h-14 bg-blue-600 text-white rounded-xl">
                    <font-awesome-icon icon="trophy" class="text-2xl" />
                </div>
                <h2 class="text-lg font-semibold text-gray-800">Selamat Datang Kembali</h2>
                <p class="text-sm text-gray-500">Masuk ke akun Anda untuk melanjutkan</p>
            </div>

            <!-- Role Toggle -->
            <div class="grid grid-cols-2 gap-2">
                <fwb-button v-for="r in roles" :key="r" size="sm" :color="form.role === r ? 'blue' : 'light'" class="w-full rounded-md" @click="form.role = r">
                    {{ r }}
                </fwb-button>
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
                    <font-awesome-icon icon="right-to-bracket" />
                    Masuk
                </fwb-button>

                <!-- Divider -->
                <div class="flex items-center gap-3 my-3">
                    <hr class="flex-grow border-gray-200" />
                    <span class="text-xs text-gray-400">atau</span>
                    <hr class="flex-grow border-gray-200" />
                </div>

                <!-- Register -->
                <p class="text-sm text-center text-gray-600">
                    Belum punya akun?
                    <a href="/register" class="text-blue-600 hover:underline font-medium">Daftar sekarang</a>
                </p>
            </form>
        </div>
    </section>
</template>