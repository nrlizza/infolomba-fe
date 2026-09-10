<script setup>
import { ref, computed } from "vue";
import { FwbInput, FwbSelect, FwbButton } from "flowbite-vue";
import { useTaskStore } from "@/stores/Taskstore";
import DatePicker from "@/components/Ui/FormInput/DatePicker.vue";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

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
    jabatan_panitia: "",
    bukti_kepanitiaan: "",
    id_role: 2
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
const passwordValid = computed(() => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(form.value.password));

const handleRegister = async () => {
    // Daftar field wajib
    const requiredFields = [
        { key: "name", label: "Nama Lengkap" },
        { key: "tanggal_lahir", label: "Tanggal Lahir" },
        { key: "email", label: "Email" },
        { key: "nomor_telephone", label: "Nomor Telepon" },
        { key: "id_pendidikan", label: "Tingkat Pendidikan" },
        { key: "jabatan_panitia", label: "Jabatan Panitia" },
        { key: "nama_instansi", label: "Nama Instansi" },
        { key: "bukti_kepanitiaan", label: "Bukti Surat Kepanitiaan" },
        { key: "username", label: "Username" },
        { key: "password", label: "Password" },
    ];

    // Cek field kosong
    const emptyField = requiredFields.find(field => !form.value[field.key]);
    if (emptyField) {
        return Swal.fire({
            icon: "warning",
            title: "Data belum lengkap",
            text: `Field "${emptyField.label}" harus diisi.`,
            confirmButtonText: "OK",
        });
    }

    if (!passwordValid.value) {
        return Swal.fire({
            icon: "warning",
            title: "Password belum valid",
            text: "Password harus minimal 8 karakter dan memiliki huruf besar, huruf kecil, angka, serta simbol.",
            confirmButtonText: "OK",
        });
    }

    try {
        // Proses register
        const result = await store.register(form.value);

        if (result === 201) {
            // Notifikasi sukses
            await Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Pendaftaran berhasil! Silakan login untuk melanjutkan.",
                confirmButtonText: "Masuk",
            });

            // Arahkan ke halaman login
            router.push("/panitia-login");
        } else {
            // Notifikasi error
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: error?.message || "Terjadi kesalahan saat pendaftaran",
                confirmButtonText: "Coba Lagi",
            });
        }
    } catch (error) {
        console.error("Register error:", error);

        // Notifikasi error
        Swal.fire({
            icon: "error",
            title: "Gagal",
            text: error?.message || "Terjadi kesalahan saat pendaftaran",
            confirmButtonText: "Coba Lagi",
        });
    }
};

</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-blue-50 px-4">
      <div class="bg-white rounded-2xl shadow-lg w-full max-w-3xl p-8 overflow-visible relative">
          <button
              @click="router.push('/beranda')"
              class="absolute top-4 left-4 flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors group z-10"
          >
              <svg class="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span class="text-sm font-medium">Kembali</span>
          </button>
          
          <div class="flex flex-col items-center mb-2">
              <div class="bg-blue-600 text-white p-3 rounded-xl">
                  <font-awesome-icon icon="user-tie" class="text-xl" />
              </div>
              <h2 class="text-lg font-bold text-center text-gray-800 mb-5 mt-2">Daftar sebagai Panitia</h2>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleRegister" class="required-form space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Nama -->
                  <fwb-input 
                      class="required-field"
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

                  <!-- Tanggal Lahir -->
                  <DatePicker v-model="form.tanggal_lahir" label="Tanggal Lahir" max-date required />

                  <!-- Email -->
                  <fwb-input 
                      class="required-field"
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

                  <!-- Telepon -->
                  <fwb-input 
                      class="required-field"
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

                  <!-- Pendidikan -->
                  <div class="education-select">
                      <label class="required-label block mb-2 text-sm font-medium text-gray-900">
                          Tingkat Pendidikan <span class="text-red-500">*</span>
                      </label>
                      <fwb-select
                          class="w-full"
                          v-model="form.id_pendidikan"
                          :options="pendidikanOptions"
                          placement="bottom-start"
                          append-to-body
                          required
                      />
                  </div>

                  <!-- Instansi -->
                  <fwb-input 
                      class="required-field"
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

                  <!-- Jabatan Panitia -->
                  <fwb-input 
                      class="required-field"
                      v-model="form.jabatan_panitia" 
                      label="Jabatan Panitia" 
                      placeholder="Masukkan jabatan panitia" 
                      required 
                      autocomplete="off"
                  >
                      <template #prefix>
                          <font-awesome-icon icon="user-tie" class="text-gray-400 pr-2" />
                      </template>
                  </fwb-input>

                  <!-- Bukti Surat Kepanitiaan -->
                  <fwb-input 
                      class="required-field"
                      v-model="form.bukti_kepanitiaan" 
                      label="Bukti Surat Kepanitiaan" 
                      placeholder="Masukkan link Google Drive dll" 
                      required 
                      autocomplete="off"
                  >
                      <template #prefix>
                          <font-awesome-icon icon="envelope" class="text-gray-400 pr-2" />
                      </template>
                  </fwb-input>

                  <!-- Username -->
                  <fwb-input 
                      class="required-field"
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

                  <!-- Password -->
                  <div class="relative required-field">
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
                      <p v-if="form.password && !passwordValid" class="mt-1 text-xs text-red-600">
                          Password minimal 8 karakter, dengan huruf besar, huruf kecil, angka, dan simbol.
                      </p>
                  </div>
              </div>

              <!-- Submit -->
              <fwb-button type="submit" color="blue" size="lg" class="w-full flex justify-center items-center gap-2">
                  <font-awesome-icon icon="user-plus" />
                  Daftar
              </fwb-button>

              <!-- Link ke Login -->
              <p class="text-sm text-center text-gray-600">
                  Sudah punya akun?
                  <router-link to="/panitia-login" class="text-[#4954DE] font-bold hover:underline">Masuk di sini</router-link>
              </p>
          </form>
      </div>
  </div>
</template>

<style scoped>
.required-form :deep(label:not(.required-label))::after {
    content: " *";
    color: #ef4444;
}

.education-select :deep(label)::after {
    content: none !important;
}
</style>
