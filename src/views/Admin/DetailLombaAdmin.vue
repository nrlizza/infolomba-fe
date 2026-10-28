<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { FwbSpinner } from 'flowbite-vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Swal from 'sweetalert2'
import cookie from 'vue-cookies'
import { jwtDecode } from 'jwt-decode'
import { 
  useDetailLomba, 
  useApproveLomba, 
  useDeleteLomba 
} from '@/composables/tanstack-query/useQuery'

const route = useRoute()
const router = useRouter()
const token = cookie.get('token')
const decoded = token ? jwtDecode(token) : null

const idLomba = computed(() => route.params.id_lomba)

const { data: lomba, isLoading, refetch } = useDetailLomba(idLomba.value)
const { mutateAsync: approveLomba } = useApproveLomba()
const { mutateAsync: deleteLomba } = useDeleteLomba()

// State Edit Mode
const isEditing = ref(false)
const editForm = ref({
  status_lomba: '',
  alasan_penolakan: ''
})

const startEdit = () => {
  editForm.value = {
    status_lomba: lomba.value?.status_lomba || 'PENDING',
    alasan_penolakan: lomba.value?.alasan_penolakan || ''
  }
  isEditing.value = true
}

const cancelEdit = () => {
  isEditing.value = false
}

const handleSave = async () => {
  // Validasi: jika status Tidak Valid, alasan wajib diisi
  if (editForm.value.status_lomba === 'REJECTED' && !editForm.value.alasan_penolakan?.trim()) {
    Swal.fire({
      title: 'Keterangan Wajib Diisi!',
      text: 'Mohon tuliskan alasan penolakan kenapa status lomba Tidak Valid.',
      icon: 'warning',
      confirmButtonColor: '#004b75'
    })
    return
  }

  try {
    await approveLomba({
      id_lomba: lomba.value?.id_lomba,
      status_lomba: editForm.value.status_lomba,
      alasan_penolakan: editForm.value.status_lomba === 'REJECTED' ? editForm.value.alasan_penolakan.trim() : null
    })

    Swal.fire('Berhasil Disimpan!', 'Status validasi dan keterangan berhasil diperbarui.', 'success')
    isEditing.value = false
    refetch()
  } catch (error) {
    Swal.fire('Gagal!', error?.response?.data?.message || 'Terjadi kesalahan saat menyimpan perubahan.', 'error')
  }
}

const handleDelete = () => {
  Swal.fire({
    title: 'Hapus Lomba?',
    text: `Data lomba "${lomba.value?.nama_lomba}" akan dihapus permanen!`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Ya, Hapus',
    cancelButtonText: 'Batal'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await deleteLomba({
          id_lomba: lomba.value?.id_lomba,
          id_user: decoded?.id
        })
        Swal.fire('Terhapus!', 'Data lomba berhasil dihapus.', 'success')
        router.push('/admin-dashboard')
      } catch (error) {
        Swal.fire('Gagal!', error?.response?.data?.message || 'Terjadi kesalahan saat menghapus.', 'error')
      }
    }
  })
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch (e) {
    return dateStr
  }
}
</script>

<template>
  <div class="p-2 sm:p-4 bg-gray-50 min-h-screen">
    <!-- Header Title & Breadcrumbs -->
    <div class="mb-3">
      <div class="flex items-baseline gap-2">
        <h1 class="text-2xl font-bold text-gray-900">Aktivitas dan Prestasi</h1>
            </div>
    </div>

    <!-- Main Container Card -->
    <div class="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      <!-- Accent Line Green Sesuai Screenshot -->
      <div class="h-0.5 bg-emerald-500 w-full"></div>

      <!-- Action Toolbar Atas -->
      <div class="p-4 bg-white border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
        <!-- Info Status Mode -->
        <div class="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <span>Detail Informasi Pengajuan Lomba</span>
        
        </div>

        <!-- Tombol Aksi Kanan (Sesuai Screenshot Referensi: Kembali ke Daftar, Edit, Hapus) -->
        <div class="flex flex-wrap items-center gap-2">
          <!-- Tombol Kembali ke Daftar -->
          <button 
            type="button"
            @click="router.push('/admin-dashboard')"
            class="bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold px-3.5 py-2 rounded flex items-center gap-1.5 transition shadow-sm"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            <span>Kembali ke Daftar</span>
          </button>

          <!-- Mode Normal: Tombol Edit (Orange/Amber) -->
          <button 
            v-if="!isEditing"
            type="button"
            @click="startEdit"
            class="bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold px-3.5 py-2 rounded flex items-center gap-1.5 transition shadow-sm"
          >
            <font-awesome-icon icon="pen-to-square" />
            <span>Edit</span>
          </button>

          <!-- Mode Edit: Tombol Batal & Simpan Perubahan -->
          <template v-else>
            <button 
              type="button"
              @click="cancelEdit"
              class="bg-gray-500 hover:bg-gray-600 text-white text-xs font-semibold px-3.5 py-2 rounded flex items-center gap-1.5 transition shadow-sm"
            >
              <span>Batal</span>
            </button>
            <button 
              type="button"
              @click="handleSave"
              class="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3.5 py-2 rounded flex items-center gap-1.5 transition shadow-sm"
            >
              <font-awesome-icon icon="check" />
              <span>Simpan Perubahan</span>
            </button>
          </template>

          <!-- Tombol Hapus (Merah) -->
          <button 
            type="button"
            @click="handleDelete"
            class="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3.5 py-2 rounded flex items-center gap-1.5 transition shadow-sm"
          >
            <font-awesome-icon icon="trash" />
            <span>Hapus</span>
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-20">
        <fwb-spinner size="10" aria-label="Loading..." class="mx-auto text-[#004b75]" />
        <p class="text-gray-500 mt-3 font-medium">Memuat detail aktivitas lomba...</p>
      </div>

      <!-- Not Found State -->
      <div v-else-if="!lomba" class="text-center py-16 text-gray-500">
        <p class="text-lg font-semibold text-gray-700">Data lomba tidak ditemukan.</p>
        <button 
          @click="router.push('/admin-dashboard')" 
          class="mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded hover:bg-blue-700 transition"
        >
          Kembali ke Daftar Lomba
        </button>
      </div>

      <!-- Detail Content Table 2-Kolom -->
      <div v-else class="p-4 sm:p-6">
        <div class="overflow-x-auto border border-gray-200 rounded">
          <table class="w-full text-left text-xs sm:text-sm border-collapse">
            <tbody class="divide-y divide-gray-200">
              
              <!-- Baris 1: Penyelenggara & Tanggal Mulai -->
              <tr class="hover:bg-gray-50/50">
                <td class="w-1/4 p-3 font-semibold text-gray-600 bg-gray-50/60 border-r border-gray-200">
                  Institusi Penyelenggara
                </td>
                <td class="w-1/4 p-3 text-gray-900 font-bold border-r border-gray-200">
                  {{ lomba.institusi_penyelenggara || '-' }}
                </td>
                <td class="w-1/4 p-3 font-semibold text-gray-600 bg-gray-50/60 border-r border-gray-200">
                  Tanggal Mulai Aktivitas
                </td>
                <td class="w-1/4 p-3 text-gray-900">
                  {{ formatDate(lomba.tanggal_lomba) }}
                </td>
              </tr>

              <!-- Baris 2: Jabatan Panitia & Tanggal Akhir -->
              <tr class="hover:bg-gray-50/50">
                <td class="p-3 font-semibold text-gray-600 bg-gray-50/60 border-r border-gray-200">
                  Jabatan Panitia
                </td>
                <td class="p-3 text-gray-900 border-r border-gray-200">
                  {{ lomba.jabatan_panitia || 'Panitia Pelaksana' }}
                </td>
                <td class="p-3 font-semibold text-gray-600 bg-gray-50/60 border-r border-gray-200">
                  Tanggal Batas Pendaftaran
                </td>
                <td class="p-3 text-gray-900 font-medium">
                  {{ formatDate(lomba.tanggal_batas_pendaftaran) }}
                </td>
              </tr>

              <!-- Baris 3: Nama Aktivitas & Dokumen Panduan -->
              <tr class="hover:bg-gray-50/50">
                <td class="p-3 font-semibold text-gray-600 bg-gray-50/60 border-r border-gray-200">
                  Nama Aktivitas
                </td>
                <td class="p-3 text-gray-900 font-bold leading-snug border-r border-gray-200">
                  {{ lomba.nama_lomba }}
                </td>
                <td class="p-3 font-semibold text-gray-600 bg-gray-50/60 border-r border-gray-200">
                  Dokumen Panduan (Guidebook)
                </td>
                <td class="p-3 border-gray-200">
                  <a 
                    v-if="lomba.link_panduan" 
                    :href="lomba.link_panduan" 
                    target="_blank" 
                    class="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-semibold underline"
                  >
                    <span>Buka Link Panduan</span>
                    <span class="text-xs">&UpperRightArrow;</span>
                  </a>
                  <span v-else class="text-gray-400 italic">Tidak ada link</span>
                </td>
              </tr>

              <!-- Baris 4: Kategori Lomba & Bukti Kepanitiaan -->
              <tr class="hover:bg-gray-50/50">
                <td class="p-3 font-semibold text-gray-600 bg-gray-50/60 border-r border-gray-200">
                  Kategori Lomba
                </td>
                <td class="p-3 text-gray-900 border-r border-gray-200">
                  {{ lomba.kategori_lomba || '-' }}
                </td>
                <td class="p-3 font-semibold text-gray-600 bg-gray-50/60 border-r border-gray-200">
                  Bukti Kepanitiaan / SK
                </td>
                <td class="p-3 border-gray-200">
                  <a 
                    v-if="lomba.bukti_kepanitiaan" 
                    :href="lomba.bukti_kepanitiaan" 
                    target="_blank" 
                    class="inline-flex items-center gap-1.5 text-emerald-600 hover:text-emerald-800 font-semibold underline"
                  >
                    <span>Lihat Bukti Kepanitiaan</span>
                    <span class="text-xs">&UpperRightArrow;</span>
                  </a>
                  <span v-else class="text-gray-400 italic">Tidak dilampirkan</span>
                </td>
              </tr>

              <!-- Baris 5: Tingkat Peserta & Tanggal Pengajuan -->
              <tr class="hover:bg-gray-50/50">
                <td class="p-3 font-semibold text-gray-600 bg-gray-50/60 border-r border-gray-200">
                  Tingkat Peserta
                </td>
                <td class="p-3 text-gray-900 border-r border-gray-200">
                  {{ lomba.tingkat_pendidikan || '-' }}
                </td>
                <td class="p-3 font-semibold text-gray-600 bg-gray-50/60 border-r border-gray-200">
                  Tanggal Pengajuan
                </td>
                <td class="p-3 text-gray-900">
                  {{ formatDate(lomba.created_at) }}
                </td>
              </tr>

              <!-- Baris 6: Jenis Lomba & Status Valid (BISA DIEDIT SESUAI SCREENSHOT 2) -->
              <tr class="hover:bg-gray-50/50">
                <td class="p-3 font-semibold text-gray-600 bg-gray-50/60 border-r border-gray-200">
                  Jenis Lomba
                </td>
                <td class="p-3 text-gray-900 border-r border-gray-200">
                  {{ lomba.jenis_lomba || '-' }}
                </td>
                <td class="p-3 font-semibold text-gray-600 bg-gray-50/60 border-r border-gray-200">
                  Valid?
                </td>
                <td class="p-3">
                  <!-- Mode Edit: Dropdown Select dengan Border Hijau sesuai screenshot -->
                  <div v-if="isEditing">
                    <select 
                      v-model="editForm.status_lomba"
                      class="w-full max-w-xs border-2 border-emerald-500 rounded px-3 py-1.5 text-xs sm:text-sm font-semibold text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-sm"
                    >
                      <option value="PENDING">Belum Dikonfirmasi</option>
                      <option value="APPROVED">Valid</option>
                      <option value="REJECTED">Tidak Valid</option>
                    </select>
                  </div>

                  <!-- Mode View: Badge Status Biasa -->
                  <div v-else>
                    <div v-if="lomba.status_lomba === 'APPROVED'" class="inline-flex items-center gap-1.5 text-emerald-700 font-bold text-xs bg-emerald-50 px-2.5 py-1 rounded border border-emerald-300">
                      <font-awesome-icon icon="check" class="text-emerald-600" />
                      <span>Valid</span>
                    </div>
                    <div v-else-if="lomba.status_lomba === 'REJECTED'" class="inline-flex items-center gap-1.5 text-red-700 font-bold text-xs bg-red-50 px-2.5 py-1 rounded border border-red-300">
                      <font-awesome-icon icon="xmark" class="text-red-600" />
                      <span>Tidak Valid</span>
                    </div>
                    <div v-else class="inline-flex items-center gap-1.5 text-amber-700 font-bold text-xs bg-amber-50 px-2.5 py-1 rounded border border-amber-300">
                      <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                      <span>Belum Dikonfirmasi</span>
                    </div>
                  </div>
                </td>
              </tr>

              

              <!-- Baris 8: Lokasi Aktivitas & Kontak Narahubung -->
              <tr class="hover:bg-gray-50/50">
                <td class="p-3 font-semibold text-gray-600 bg-gray-50/60 border-r border-gray-200">
                  Lokasi Aktivitas
                </td>
                <td class="p-3 text-gray-900 border-r border-gray-200">
                  {{ (lomba.nama_kabupaten ? lomba.nama_kabupaten + ', ' : '') + (lomba.nama_provinsi || '-') }}
                </td>
                <td class="p-3 font-semibold text-gray-600 bg-gray-50/60 border-r border-gray-200">
                  Kontak Penyelenggara
                </td>
                <td class="p-3 text-gray-900 font-mono">
                  {{ lomba.kontak_penyelenggara || '-' }}
                </td>
              </tr>

              <!-- Baris 9: Biaya Registrasi & Keterangan / Alasan (BISA DIEDIT JIKA TIDAK VALID) -->
              <tr class="hover:bg-gray-50/50">
                <td class="p-3 font-semibold text-gray-600 bg-gray-50/60 border-r border-gray-200">
                  Biaya Registrasi
                </td>
                <td class="p-3 font-bold border-r border-gray-200">
                  <span v-if="!lomba.harga || lomba.harga == 0" class="text-emerald-600">Gratis</span>
                  <span v-else class="text-gray-900">Rp {{ Number(lomba.harga).toLocaleString('id-ID') }}</span>
                </td>
                <td class="p-3 font-semibold text-gray-600 bg-gray-50/60 border-r border-gray-200">
                  Keterangan
                </td>
                <td class="p-3">
                  <!-- Mode Edit: Input Textarea hanya aktif jika status Tidak Valid -->
                  <div v-if="isEditing">
                    <div v-if="editForm.status_lomba === 'REJECTED'">
                      <textarea 
                        v-model="editForm.alasan_penolakan"
                        rows="2"
                        placeholder="Wajib diisi: alasan kenapa tidak valid..."
                        class="block w-full max-w-xs resize-none border border-red-400 rounded-md px-3 py-1.5 text-sm text-gray-800 placeholder-gray-400 bg-white focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                      ></textarea>
                    </div>
                    <div v-else class="text-gray-400 italic text-xs py-1">
                      - (Keterangan hanya diisi jika status dipilih "Tidak Valid")
                    </div>
                  </div>

                  <!-- Mode View: Tampilan Teks Keterangan Biasa -->
                  <div v-else>
                    <span 
                      v-if="lomba.alasan_penolakan" 
                      class="text-red-600 font-medium bg-red-50 px-2 py-1 rounded border border-red-200 inline-block"
                    >
                      {{ lomba.alasan_penolakan }}
                    </span>
                    <span v-else class="text-gray-400 italic">
                      -
                    </span>
                  </div>
                </td>
              </tr>

            </tbody>
          </table>
        </div>

        <!-- Section Tambahan: Deskripsi & Poster -->
        <div class="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Deskripsi -->
          <div class="lg:col-span-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 class="text-sm font-bold text-gray-800 mb-2">Deskripsi Lengkap Lomba:</h3>
            <div class="text-xs sm:text-sm text-gray-700 whitespace-pre-line leading-relaxed">
              {{ lomba.deskripsi || 'Tidak ada deskripsi yang dilampirkan.' }}
            </div>
          </div>

          <!-- Poster Lomba Preview -->
          <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col items-center">
            <h3 class="text-sm font-bold text-gray-800 mb-2 w-full text-left">Poster Lomba:</h3>
            <div v-if="lomba.image_url || lomba.image" class="mt-2 w-full flex justify-center">
              <a :href="lomba.image_url || lomba.image" target="_blank" title="Klik untuk membuka ukuran penuh">
                <img 
                  :src="lomba.image_url || lomba.image" 
                  alt="Poster Lomba" 
                  class="max-h-80 w-auto object-contain rounded border border-gray-300 shadow-sm hover:opacity-95 transition cursor-pointer"
                />
              </a>
            </div>
            <div v-else class="py-12 text-center text-gray-400 text-xs italic">
              Tidak ada poster yang diunggah.
            </div>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>
