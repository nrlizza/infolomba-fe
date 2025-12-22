<script setup>
import { ref } from "vue";
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
    // Daftar field wajib
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
            router.push("/login");
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
      <div class="bg-white rounded-2xl shadow-lg w-full max-w-3xl p-8 overflow-visible">
          <!-- Header -->
          <div class="flex flex-col items-center mb-2">
              <div class="bg-blue-600 text-white p-3 rounded-xl">
                  <font-awesome-icon icon="trophy" class="text-xl" />
              </div>
              <h2 class="text-lg font-semibold text-center text-gray-800 mb-5">Daftar InfoLomba</h2>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleRegister" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Nama -->
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

                  <!-- Tanggal Lahir -->
                  <DatePicker 
                      class="bg-white w-full"
                      v-model="form.tanggal_lahir" 
                      :id="'tanggal_lahir'" 
                      label="Tanggal Lahir" 
                      max-date="true" 
                      required
                      autocomplete="off"
                  />

                  <!-- Email -->
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

                  <!-- Telepon -->
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

                  <!-- Pendidikan -->
                  <fwb-select 
                      class="fwb-select"
                      v-model="form.id_pendidikan" 
                      label="Tingkat Pendidikan" 
                      :options="pendidikanOptions" 
                      placement="bottom-start" 
                      append-to-body 
                      required
                  />

                  <!-- Instansi -->
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

                  <!-- Username -->
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

                  <!-- Password -->
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

              <!-- Submit -->
              <fwb-button type="submit" color="blue" size="lg" class="w-full flex justify-center items-center gap-2">
                  <font-awesome-icon icon="user-plus" />
                  Daftar Sekarang
              </fwb-button>

              <!-- Link ke Login -->
              <p class="text-sm text-center text-gray-600">
                  Sudah punya akun?
                  <a href="/login" class="text-blue-600 font-medium hover:underline">Masuk di sini</a>
              </p>
          </form>
      </div>
  </div>
</template>
