<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useTaskStore } from "@/stores/Taskstore";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const emit = defineEmits(['close', 'authenticated', 'switchToRegister']);
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
            emit('authenticated');
            emit('close');
            if (form.value.role === 'ADMIN') {
                router.push("/admin-dashboard");
            } else if (form.value.role === 'PANITIA') {
                router.push("/dashboard-panitia");
            } else {
                router.push("/beranda");
            }
        } else {
            alert("Login gagal. Periksa username & password.");
        }
    } catch (error) {
        alert(error.message || "Login gagal. Periksa username & password.");
        console.error("Login error:", error);
    }
};

const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
        emit('close');
    }
};

const handleEscape = (e) => {
    if (e.key === 'Escape') {
        emit('close');
    }
};

const handleSwitchToRegister = () => {
    emit('switchToRegister');
};

onMounted(() => {
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
});

onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape);
    document.body.style.overflow = '';
});

</script>

<template>
    <div 
        class="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-fade-in"
        @click="handleBackdropClick"
    >
        <div class="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8 space-y-5 border border-gray-100 animate-scale-in relative">
            <button
                @click="emit('close')"
                class="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Kembali
            </button>

            <div class="text-center space-y-2">
                <div class="inline-flex items-center justify-center w-14 h-14 bg-blue-600 text-white rounded-xl">
                    <font-awesome-icon icon="trophy" class="text-2xl" />
                </div>
                <h2 class="text-lg font-semibold text-gray-800">Selamat Datang Kembali</h2>
                <p class="text-sm text-gray-500">Masuk ke akun Anda untuk melanjutkan</p>
            </div>

            <form class="space-y-5" @submit.prevent="handleLogin">
                <div class="relative">
                    <label for="modal-username" class="block mb-1 text-sm font-medium text-gray-700"> Username </label>
                    <font-awesome-icon icon="user" class="absolute left-3 top-9 text-gray-400 pointer-events-none z-10" />
                    <input id="modal-username" v-model="form.username" placeholder="Masukkan username" type="text" required autocomplete="username" class="w-full rounded-lg border border-gray-300 bg-gray-50 py-2.5 pl-10 pr-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
                </div>

                <div class="relative">
                    <label for="modal-password" class="block text-sm font-medium text-gray-700 mb-1"> Password </label>
                    <font-awesome-icon icon="lock" class="absolute left-3 top-9 text-gray-400 pointer-events-none z-10" />
                    <input id="modal-password" v-model="form.password" :type="showPassword ? 'text' : 'password'" placeholder="Masukkan password" required autocomplete="current-password" class="w-full rounded-lg border border-gray-300 bg-gray-50 py-2.5 pl-10 pr-10 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
                    <button type="button" class="absolute top-8.5 right-3 text-gray-400" @click="togglePassword">
                        <font-awesome-icon :icon="showPassword ? 'eye-slash' : 'eye'" />
                    </button>
                </div>

                <button type="submit" class="w-full h-11 rounded-lg bg-blue-600 text-sm font-bold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 flex justify-center items-center gap-2">
                    <font-awesome-icon icon="right-to-bracket" />
                    Masuk
                </button>

                <div class="flex items-center gap-3 my-3">
                    <hr class="flex-grow border-gray-200" />
                    <span class="text-xs text-gray-400">atau</span>
                    <hr class="flex-grow border-gray-200" />
                </div>

                <p class="text-sm text-center text-gray-600">
                    Belum punya akun?
                    <button type="button" @click="handleSwitchToRegister" class="text-blue-600 hover:underline font-medium">Daftar sekarang</button>
                </p>
            </form>
        </div>
    </div>
</template>

<style scoped>
@keyframes fade-in {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes scale-in {
    from {
        opacity: 0;
        transform: scale(0.95);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

.animate-fade-in {
    animation: fade-in 0.2s ease-out;
}

.animate-scale-in {
    animation: scale-in 0.3s ease-out;
}
</style>
