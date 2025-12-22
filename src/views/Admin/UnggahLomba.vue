<script lang="ts" setup>
import { ref } from 'vue'
import { FwbInput, FwbSelect, FwbTextarea, FwbButton, FwbFileInput } from 'flowbite-vue'

// State untuk form
const judulLomba = ref('')
const posterFile = ref(null)
const kategoriLomba = ref('')
const tingkatPeserta = ref('')
const jenisLomba = ref('')
const statusPembayaran = ref('')
const tanggalPendaftaran = ref('')
const tanggalPenutupan = ref('')
const areaKompetisi = ref('')
const deskripsiLomba = ref('')

// Options untuk dropdown
const kategoriOptions = [
  { value: 'olahraga', name: 'Olahraga' },
  { value: 'karya tulis ilmiah', name: 'Karya Tulis Ilmiah' },
  { value: 'esai', name: 'Esai' },
  { value: 'debat', name: 'Debat' },
  { value: 'desain grafis', name: 'Desain Grafis' },
  { value: 'fotografi', name: 'Fotografi' },
  { value: 'videografi', name: 'Videografi' },
  { value: 'tari', name: 'Tari' },
  { value: 'musik', name: 'Musik' },
  { value: 'cerdas cermat', name: 'Cerdas Cermat' },
  { value: 'programming / coding', name: 'Programming / Coding' },
  { value: 'voice over', name: 'Voice Over' },
  { value: 'pembaca berita', name: 'Pembaca Berita' },
  { value: 'pidato', name: 'Pidato' },
  { value: 'poster digital', name: 'Poster Digital' },
  { value: 'matematika', name: 'Matematika' },
  { value: 'bahasa inggris', name: 'Bahasa Inggris' },
  { value: 'puisi', name: 'Puisi' },
  { value: 'menulis cerpen', name: 'Menulis Cerpen' },
  { value: 'ui/ux design', name: 'UI/UX Design' }
]

const tingkatOptions = [
  { value: 'sd', name: 'SD' },
  { value: 'smp', name: 'SMP' },
  { value: 'sma', name: 'SMA' },
  { value: 'diploma', name: 'Diploma' },
  { value: 'sarjana', name: 'Sarjana' },
  { value: 'pascasarjana', name: 'Pascasarjana' },
  { value: 'umum', name: 'Umum' }
]

const jenisOptions = [
  { value: 'online', name: 'Online' },
  { value: 'offline', name: 'Offline' }
]

const statusOptions = [
  { value: 'gratis', name: 'Gratis' },
  { value: 'berbayar', name: 'Berbayar' }
]

const areaOptions = [
  { value: 'Aceh', name: 'Aceh' },
  { value: 'Sumatera Utara', name: 'Sumatera Utara' },
  { value: 'Sumatera Barat', name: 'Sumatera Barat' },
  { value: 'Riau', name: 'Riau' },
  { value: 'Kepulauan Riau', name: 'Kepulauan Riau' },
  { value: 'Jambi', name: 'Jambi' },
  { value: 'Sumatera Selatan', name: 'Sumatera Selatan' },
  { value: 'Bangka Belitung', name: 'Bangka Belitung' },
  { value: 'Bengkulu', name: 'Bengkulu' },
  { value: 'Lampung', name: 'Lampung' },
  { value: 'DKI Jakarta', name: 'DKI Jakarta' },
  { value: 'Jawa Barat', name: 'Jawa Barat' },
  { value: 'Banten', name: 'Banten' },
  { value: 'Jawa Tengah', name: 'Jawa Tengah' },
  { value: 'DI Yogyakarta', name: 'DI Yogyakarta' },
  { value: 'Jawa Timur', name: 'Jawa Timur' },
  { value: 'Bali', name: 'Bali' },
  { value: 'Nusa Tenggara Barat', name: 'Nusa Tenggara Barat' },
  { value: 'Nusa Tenggara Timur', name: 'Nusa Tenggara Timur' },
  { value: 'Kalimantan Barat', name: 'Kalimantan Barat' },
  { value: 'Kalimantan Tengah', name: 'Kalimantan Tengah' },
  { value: 'Kalimantan Selatan', name: 'Kalimantan Selatan' },
  { value: 'Kalimantan Timur', name: 'Kalimantan Timur' },
  { value: 'Kalimantan Utara', name: 'Kalimantan Utara' },
  { value: 'Sulawesi Utara', name: 'Sulawesi Utara' },
  { value: 'Sulawesi Tengah', name: 'Sulawesi Tengah' },
  { value: 'Sulawesi Selatan', name: 'Sulawesi Selatan' },
  { value: 'Sulawesi Tenggara', name: 'Sulawesi Tenggara' },
  { value: 'Gorontalo', name: 'Gorontalo' },
  { value: 'Maluku', name: 'Maluku' },
  { value: 'Maluku Utara', name: 'Maluku Utara' },
  { value: 'Papua', name: 'Papua' },
  { value: 'Papua Barat', name: 'Papua Barat' },
  { value: 'Papua Tengah', name: 'Papua Tengah' },
  { value: 'Papua Pegunungan', name: 'Papua Pegunungan' },
  { value: 'Papua Selatan', name: 'Papua Selatan' },
  { value: 'Papua Barat Daya', name: 'Papua Barat Daya' }
]

// Function untuk submit
const handleSubmit = () => {
  console.log({
    judulLomba: judulLomba.value,
    posterFile: posterFile.value,
    kategoriLomba: kategoriLomba.value,
    tingkatPeserta: tingkatPeserta.value,
    jenisLomba: jenisLomba.value,
    statusPembayaran: statusPembayaran.value,
    areaKompetisi: areaKompetisi.value,
    tanggalPendaftaran: tanggalPendaftaran.value,
    tanggalPenutupan: tanggalPenutupan.value,
    deskripsiLomba: deskripsiLomba.value
  })
  alert('Lomba berhasil diunggah!')
}
</script>

<template>
  <div class="min-h-screen bg-blue-50 py-6 pl-45 ">

    <!-- WRAPPER UTAMA -->
    <div class="max-w-5xl mx-auto flex gap-4 items-start">

      <!-- TOMBOL KEMBALI (LUAR FORM, KIRI) -->
      <button
        @click="$router.back()"
        class="flex items-center gap-2 bg-[#4954DE] hover:bg-[#3b44b1] text-white px-3 py-2 text-sm rounded-lg font-semibold shadow-md transition shrink-0 mt-20"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-4 h-4"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
          />
        </svg>
        Kembali
      </button>

      <!-- AREA KONTEN KANAN (HEADER + FORM) -->
      <div class="flex-1 max-w-2xl">

        <!-- HEADER -->
        <div class="mb-4">
          <h1 class="text-3xl font-bold text-gray-800">
            Unggah Lomba Baru
          </h1>
          <p class="text-gray-600 mt-1">
            Lengkapi informasi lomba dengan detail yang akurat
          </p>
        </div>

        <!-- FORM CONTAINER -->
        <div class="bg-[#4954DE] rounded-3xl shadow-2xl px-8 py-6">
          <div class="space-y-4">

            <div>
              <label class="block text-white text-sm font-medium mb-1">
                Judul Lomba
              </label>
              <fwb-input 
                v-model="judulLomba" 
                placeholder="Masukkan judul lomba"
                size="md"
              />
            </div>

            <div>
              <label class="block text-white text-sm font-medium mb-1">
                Unggah Poster Lomba
              </label>
              <fwb-file-input v-model="posterFile" dropzone>
                <template #label>
                  <div class="flex flex-col items-center justify-center py-3">
                    <svg class="w-10 h-10 text-blue-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p class="text-blue-600 font-medium text-sm">
                      Pilih atau Tarik File Poster di Sini
                    </p>
                    <p class="text-gray-500 text-xs">Format: JPG, PNG</p>
                  </div>
                </template>
              </fwb-file-input>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label class="block text-white text-sm font-medium mb-1">Kategori Lomba</label>
                <fwb-select v-model="kategoriLomba" :options="kategoriOptions" size="md" />
              </div>

              <div>
                <label class="block text-white text-sm font-medium mb-1">Tingkat Peserta</label>
                <fwb-select v-model="tingkatPeserta" :options="tingkatOptions" size="md" />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label class="block text-white text-sm font-medium mb-1">Jenis Lomba</label>
                <fwb-select v-model="jenisLomba" :options="jenisOptions" size="md" />
              </div>

              <div>
                <label class="block text-white text-sm font-medium mb-1">Status Pembayaran</label>
                <fwb-select v-model="statusPembayaran" :options="statusOptions" size="md" />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label class="block text-white text-sm font-medium mb-1">Tanggal Pendaftaran</label>
                <fwb-input v-model="tanggalPendaftaran" type="date" size="md" />
              </div>

              <div>
                <label class="block text-white text-sm font-medium mb-1">Tanggal Penutupan</label>
                <fwb-input v-model="tanggalPenutupan" type="date" size="md" />
              </div>
            </div>

            <div>
              <label class="block text-white text-sm font-medium mb-1">
                Area Kompetisi
              </label>
              <fwb-select
                v-model="areaKompetisi"
                :options="areaOptions"
                size="md"
                placeholder="Pilih Area"
              />
            </div>

            <div>
              <label class="block text-white text-sm font-medium mb-1">
                Deskripsi Lomba
              </label>
              <fwb-textarea
                v-model="deskripsiLomba"
                :rows="6"
                placeholder="Jelaskan detail lomba, tema, tujuan dan mekanisme"
              />
            </div>

            <fwb-button 
              @click="handleSubmit"
              color="light"
              size="xl"
              class="w-full mt-2 
                    bg-white text-[#4954DE] border border-[#4954DE] 
                    hover:bg-[#4DB8E2] hover:text-white 
                    active:bg-[#3a46c4]"
            >
              Unggah Lomba
            </fwb-button>

          </div>
        </div>
      </div>

    </div>
  </div>
</template>




<style scoped>
/* Custom styling untuk Flowbite components */
:deep(.fwb-file-input) {
  background-color: white;
  border-radius: 0.5rem;
}
</style>