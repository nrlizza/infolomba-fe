<script setup>
import { ref } from 'vue';

const showModal = ref(false);
const showDetailModal = ref(false);

const openDetail = () => {
  showDetailModal.value = true;
};

const closeDetail = () => {
  showDetailModal.value = false;
};

const openModal = () => {
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const confirmCancel = () => {
  // Aksi ketika user klik "Ya"
  console.log('Lomba dibatalkan');
  closeModal();
  // Tambahkan logic pembatalan di sini
};
</script>

<template>
  <div>
    <!-- CARD LOMBA -->
    <div class="relative bg-white shadow-md rounded-[20px] w-[430px] h-[250px] border overflow-hidden">
      <!-- FLEX UTAMA -->
      <div class="flex">
        <!-- GAMBAR KIRI -->
        <img
          src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
          class="w-45 h-66 object-cover"
          alt="poster lomba"
        />

        <!-- KONTEN KANAN -->
        <div class="flex-1 px-6 py-3">
          <!-- Judul -->
          <h2 class="font-semibold text-[16px] text-[#4954DE] leading-tight -ml-3">
            Kompetisi UI/UX Nasional
          </h2>

          <!-- Detail Info -->
          <div class="mt-3 space-y-2 text-[14px]">
            <!-- Kategori -->
            <div class="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"
                class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"/>
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M6 6h.008v.008H6V6Z"/>
              </svg>
              <p>Teknologi</p>
            </div>

            <!-- Tanggal -->
            <div class="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"
                class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"/>
              </svg>
              <p>30 Maret 2026</p>
            </div>

            <!-- Peserta -->
            <div class="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"
                class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"/>
              </svg>
              <p>Mahasiswa</p>
            </div>

            <!-- Pembayaran -->
            <div class="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
              </svg>
              <p class="text-green-600 font-semibold">Pembayaran Sukses</p>
            </div>

            <!-- Rating -->
            <div class="flex items-center gap-4 mt-1">
              ⭐ <span>10</span>
            </div>
          </div>

          <div class="mt-4 ml-0 flex items-center gap-4">
            <button
              @click="openDetail"
              class="bg-[#4DB8E2] hover:bg-[#4954DE] text-white w-[135px] py-2 rounded-md font-semibold transition"
            >
              Detail Lomba
            </button>

            <div 
              @click="openModal"
              class="w-10 h-10 flex items-center justify-center border-2 border-red-500 rounded-md cursor-pointer hover:bg-red-50 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="red" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL DETAIL LOMBA -->
    <div 
      v-if="showDetailModal"
      class="fixed inset-0 flex items-center justify-center z-50 bg-black/10 backdrop-blur-[1px]"
    >
      <div class="bg-white rounded-2xl shadow-2xl w-[900px] max-h-[85vh] overflow-hidden">
        
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b">
          <div class="flex items-center gap-3">
            <h3 class="text-3xl font-bold text-[#4954DE]">VIDEO KREATIF</h3>
          </div>
          <button 
            @click="closeDetail"
            class="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <!-- Body -->
        <div class="flex p-6 gap-6">
          <!-- Sidebar Poster -->
          <div class="w-2/5">
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTL1UxiNU-5f0-084Dqb_QBNY5LxiLfXK8X9A&s" 
              alt="Poster Creative Video"
              class="rounded-lg shadow-lg w-full h-auto object-cover"
            />
          </div>

          <!-- Content -->
          <div class="w-3/5 max-h-[470px] overflow-y-auto pr-2 space-y-6">
            <!-- Informasi Lomba -->
            <section>
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                <p>📣✨ <strong>CALL FOR CREATIVE VIDEO NATIONAL 2025</strong> 🎬🌟</p>
                <p>Tema Utama: <strong>"Kreativitas Digital untuk Pelestarian Budaya Indonesia"</strong></p>
                <br>

                <p>🎥 <strong>Sub Tema Pilihan:</strong></p>
                <ul class="list-disc pl-6">
                  <li>Ekspresi Budaya Lokal dalam Media Digital</li>
                  <li>Inovasi Kreatif untuk Warisan Budaya Nusantara</li>
                  <li>Cerita Rakyat dalam Perspektif Milenial/Gen-Z</li>
                  <li>Kearifan Lokal dan Gaya Hidup Masa Kini</li>
                </ul>
                <br>

                <p>🗓️ <strong>Timeline:</strong></p>
                <p>Pembukaan: <strong>20 Oktober 2025</strong></p>
                <p>Deadline: <strong>20 Desember 2025</strong></p>
                <p>Pengumuman: <strong>25 Desember 2025</strong></p>
                <br>

                <p>✅ <strong>GRATIS! Tanpa Biaya Pendaftaran</strong></p>
                <p>📤 Submit karya melalui: <strong>www.literatika.id/callforcreative</strong></p>
                <p>📄 Panduan: <strong>unesa.me/panduanvideobudaya</strong></p>
                <br>

                <p>☎️ Narahubung: <strong>0823-3543-3354 (Yoko)</strong></p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL KONFIRMASI HAPUS -->
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
          Apakah Anda ingin menghapus lomba ini?
        </p>

        <div class="flex gap-4 justify-center">
          <button
            @click="confirmCancel"
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
</template>

<style scoped>
/* Animasi fade in untuk modal */
.fixed {
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>