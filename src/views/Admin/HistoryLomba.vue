<script setup>
import { ref } from 'vue'
import { FwbButton } from 'flowbite-vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Modal state
const showModal = ref(false)

// Aksi jika konfirmasi YA
const confirmDelete = () => {
  showModal.value = false
  console.log("Data lomba dihapus!")  
  // Bisa tambahkan API delete di sini
}

// Tutup modal
const closeModal = () => {
  showModal.value = false
}

// Buka modal
const openDeleteModal = () => {
  showModal.value = true
}

const goToDetail = () => {
  router.push("/riwayat-daftar-peserta")
}

const goToEdit = () => {
  router.push("/unggah-lomba")
}
</script>


<template>
  <div class="p-6 max-w-6xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Riwayat Lomba</h1>
      <p class="text-gray-600">Kelola dan Pantau Semua Lomba yang Anda Unggah</p>
    </div>

    <!-- Competition Card -->
    <div class="bg-[#4954DE] rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <!-- Left Section -->
        <div class="flex-1">
          <h2 class="text-xl font-bold text-white mb-4">
            Kompetisi Videografi Nasional
          </h2>
          
          <!-- Info dengan Ikon -->
          <div class="flex flex-wrap items-center gap-4 mb-4">
            <!-- Teknologi -->
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span class="text-white font-medium">Teknologi</span>
            </div>
            
            <!-- Mahasiswa -->
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
              </svg>
              <span class="text-white font-medium">Mahasiswa</span>
            </div>
            
            <!-- Tanggal -->
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span class="text-white">15 Januari 2024</span>
            </div>
          </div>
        </div>

        <!-- Right Section - Buttons -->
        <div class="flex flex-wrap gap-3">
          <fwb-button
  color="light"
  size="lg"
  class="min-w-[120px]"
  @click="goToDetail"
>
  <template #prefix>
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  </template>
  Detail
</fwb-button>
          <fwb-button 
  color="dark" 
  size="lg" 
  class="min-w-[120px]"
  @click="goToEdit"
>
  <template #prefix>
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  </template>
  Edit
</fwb-button>
          <fwb-button color="red" size="lg" class="min-w-[120px]" @click="openDeleteModal">
  <template #prefix>
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  </template>
  Delete
</fwb-button>

<!-- MODAL KONFIRMASI -->
<div 
  v-if="showModal"
  class="fixed inset-0 flex items-center justify-center z-50 bg-black/10 backdrop-blur-[1px]"
>
  <div class="bg-white rounded-2xl shadow-2xl w-[420px] p-8 text-center">

    <!-- ICON BARU -->
    <div class="flex justify-center mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" 
           viewBox="0 0 24 24" stroke-width="1.5" 
           stroke="currentColor" class="w-14 h-14 text-black">
        <path stroke-linecap="round" stroke-linejoin="round" 
              d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 
              3.75h.008v.008H12v-.008Z" />
      </svg>
    </div>

    <h2 class="text-xl font-bold mb-3 text-black">
      Konfirmasi Penghapusan Lomba
    </h2>

    <p class="text-gray-600 mb-6">
      Apakah Anda ingin menghapus data lomba ini?
    </p>

    <div class="flex gap-4 justify-center">
      <button
        @click="confirmDelete"
        class="bg-[#00D615] hover:bg-[#00B812] text-white font-bold px-8 py-3 rounded-lg transition w-32"
      >
        Ya
      </button>

      <button
        @click="closeModal"
        class="bg-[#FF0000] hover:bg-[#DD0000] text-white font-bold px-8 py-3 rounded-lg transition w-32"
      >
        Tidak
      </button>
    </div>

  </div>
</div>


        </div>
      </div>
    </div>
  </div>
</template>

