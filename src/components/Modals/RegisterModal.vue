<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { FwbInput, FwbSelect, FwbButton } from "flowbite-vue";
import { useTaskStore } from "@/stores/Taskstore";
import DatePicker from "@/components/Ui/FormInput/DatePicker.vue";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const emit = defineEmits(['close', 'switchToLogin']);
const store = useTaskStore();
const router = useRouter();

const form = ref({
    email: "",
    name: "",
    username: "",
    password: "",
    tanggal_lahir: "",
    nomor_telephone: "",
    id_pendidikan: "",
    nama_instansi: "",
    id_role: 3
});

const pendidikanOptions = [
    { value: 1, name: "SD" },
    { value: 2, name: "SMP" },
    { value: 3, name: "SMA/SMK" },
    { value: 4, name: "Diploma" },
    { value: 5, name: "Sarjana" },
    { value: 6, name: "Pascasarjana" },
];

const showPassword = ref(false);
const togglePassword = () => (showPassword.value = !showPassword.value);

const handleRegister = async () => {
    const requiredFields = [
        { key: "name", label: "Nama Lengkap" },
        { key: "tanggal_lahir", label: "Tanggal Lahir" },
        { key: "email", label: "Email" },
        { key: "nomor_telephone", label: "Nomor Telepon" },
        { key: "id_pendidikan", label: "Tingkat Pendidikan" },
        { key: "nama_instansi", label: "Nama Instansi" },
        { key: "username", label: "Username" },
        { key: "password", label: "Password" },
    ];

    const emptyField = requiredFields.find(field => !form.value[field.key]);
    if (emptyField) {
        return Swal.fire({
            icon: "warning",
            title: "Data belum lengkap",
            text: `Field "${emptyField.label}" harus diisi.`,
            confirmButtonText: "OK",
        });
    }

    try {
        const result = await store.register(form.value);

        if (result === 201) {
            await Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Pendaftaran berhasil! Silakan login untuk melanjutkan.",
                confirmButtonText: "Masuk",
            });

            emit('switchToLogin');
        } else {
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: "Terjadi kesalahan saat pendaftaran",
                confirmButtonText: "Coba Lagi",
            });
        }
    } catch (error) {
        console.error("Register error:", error);

        Swal.fire({
            icon: "error",
            title: "Gagal",
            text: error?.message || "Terjadi kesalahan saat pendaftaran",
            confirmButtonText: "Coba Lagi",
        });
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

const handleSwitchToLogin = () => {
    emit('switchToLogin');
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
    class="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-fade-in overflow-y-auto py-8"
    @click="handleBackdropClick"
  >
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-8 animate-scale-in relative my-auto">
          <button
              @click="emit('close')"
              class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors z-10"
              aria-label="Tutup"
          >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
          </button>

          <div class="flex flex-col items-center mb-6">
              <div class="bg-blue-600 text-white p-3 rounded-xl">
                  <font-awesome-icon icon="trophy" class="text-xl" />
              </div>
              <h2 class="text-lg font-semibold text-center text-gray-800 mt-3">Daftar InfoLomba</h2>
          </div>

          <form @submit.prevent="handleRegister" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <fwb-input 
                      v-model="form.name" 
                      label="Nama Lengkap" 
                      placeholder="Masukkan nama lengkap" 
                      required 
                      autocomplete="off"
                  >
                      <template #prefix>
                          <font-awesome-icon icon="id-card" class="text-gray-400 pr-2" />
                      </template>
                  </fwb-input>

                  <DatePicker 
                      class="bg-white w-full"
                      v-model="form.tanggal_lahir" 
                      :id="'tanggal_lahir'" 
                      label="Tanggal Lahir" 
                      max-date="true" 
                      required
                      autocomplete="off"
                  />

                  <fwb-input 
                      v-model="form.email" 
                      type="email" 
                      label="Email" 
                      placeholder="Masukkan email" 
                      required 
                      autocomplete="off"
                  >
                      <template #prefix>
                          <font-awesome-icon icon="envelope" class="text-gray-400 pr-2" />
                      </template>
                  </fwb-input>

                  <fwb-input 
                      v-model="form.nomor_telephone" 
                      type="tel" 
                      label="Nomor Telepon" 
                      placeholder="08xxxxxxxxxx" 
                      required 
                      autocomplete="off"
                  >
                      <template #prefix>
                          <font-awesome-icon icon="phone" class="text-gray-400 pr-2" />
                      </template>
                  </fwb-input>

                  <fwb-select 
                      class="fwb-select"
                      v-model="form.id_pendidikan" 
                      label="Tingkat Pendidikan" 
                      :options="pendidikanOptions" 
                      placement="bottom-start" 
                      append-to-body 
                      required
                  />

                  <fwb-input 
                      v-model="form.nama_instansi" 
                      label="Nama Instansi" 
                      placeholder="Masukkan nama instansi/sekolah" 
                      required 
                      autocomplete="off"
                  >
                      <template #prefix>
                          <font-awesome-icon icon="building" class="text-gray-400 pr-2" />
                      </template>
                  </fwb-input>

                  <fwb-input 
                      v-model="form.username" 
                      label="Username" 
                      placeholder="Masukkan username" 
                      required 
                      autocomplete="off"
                  >
                      <template #prefix>
                          <font-awesome-icon icon="user" class="text-gray-400 pr-2" />
                      </template>
                  </fwb-input>

                  <div class="relative">
                      <fwb-input 
                          v-model="form.password" 
                          label="Password"
                          :type="showPassword ? 'text' : 'password'" 
                          placeholder="Masukkan password" 
                          required 
                          autocomplete="new-password"
                      >
                          <template #prefix>
                              <font-awesome-icon icon="lock" class="text-gray-400 pr-2" />
                          </template>
                      </fwb-input>
                      <button type="button" @click="togglePassword" class="absolute top-8.5 right-3 text-gray-400">
                          <font-awesome-icon :icon="showPassword ? 'eye-slash' : 'eye'" />
                      </button>
                  </div>
              </div>

              <fwb-button type="submit" color="blue" size="lg" class="w-full flex justify-center items-center gap-2">
                  <font-awesome-icon icon="user-plus" />
                  Daftar Sekarang
              </fwb-button>

              <p class="text-sm text-center text-gray-600">
                  Sudah punya akun?
                  <button type="button" @click="handleSwitchToLogin" class="text-blue-600 font-medium hover:underline">Masuk di sini</button>
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
