<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { FwbSpinner } from 'flowbite-vue'
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
import Swal from 'sweetalert2'
import cookie from 'vue-cookies'
import { jwtDecode } from 'jwt-decode'
import { 
  useAllLombaAdmin, 
  useLombaStats, 
  useApproveLomba, 
  useDeleteLomba,
  useAllKategori,
  useAllPendidikan,
  useAllJenis
} from '@/composables/tanstack-query/useQuery'

const router = useRouter()
const token = cookie.get('token')
const decoded = token ? jwtDecode(token) : null

// ===== Queries Master Data =====
const { data: kategoriData } = useAllKategori()
const { data: pendidikanData } = useAllPendidikan()
const { data: jenisData } = useAllJenis()
const { mutateAsync: approveLomba } = useApproveLomba()
const { mutateAsync: deleteLomba } = useDeleteLomba()

// ===== Filter & Search State =====
const filters = ref({
  status_lomba: '', // '' = Semua Status, PENDING, APPROVED, REJECTED
  id_kategori: '',
  id_pendidikan: '',
  id_jenis: '',
  search: ''
})

const searchInput = ref('')
const selectedIds = ref([])
const selectAll = ref(false)

const payload = ref({
  page: 1,
  limit: 10
})

// Query data lomba admin
const queryFilters = computed(() => ({
  status_lomba: filters.value.status_lomba,
  id_kategori: filters.value.id_kategori,
  id_pendidikan: filters.value.id_pendidikan,
  id_jenis: filters.value.id_jenis,
  search: filters.value.search
}))

const { data, isLoading, refetch } = useAllLombaAdmin(
  computed(() => payload.value.page),
  computed(() => payload.value.limit),
  queryFilters
)

const lombaList = computed(() => data.value?.data ?? [])
const pagination = computed(() => data.value?.pagination ?? { totalPages: 1, totalData: 0 })

// Handle Search
const handleSearch = () => {
  filters.value.search = searchInput.value.trim()
  payload.value.page = 1
}

const handleReset = () => {
  searchInput.value = ''
  filters.value = {
    status_lomba: '',
    id_kategori: '',
    id_pendidikan: '',
    id_jenis: '',
    search: ''
  }
  payload.value.page = 1
}

// Watch filters change
watch(
  () => [filters.value.status_lomba, filters.value.id_kategori, filters.value.id_pendidikan, filters.value.id_jenis],
  () => {
    payload.value.page = 1
  }
)

// Select All checkbox
watch(selectAll, (newVal) => {
  if (newVal) {
    selectedIds.value = lombaList.value.map((item) => item.id_lomba)
  } else {
    selectedIds.value = []
  }
})

// Pagination
const nextPage = () => {
  if (payload.value.page < (pagination.value.totalPages || 1)) {
    payload.value.page++
  }
}

const prevPage = () => {
  if (payload.value.page > 1) {
    payload.value.page--
  }
}

// ===== Approval / Rejection Modal =====
const handleApprove = (lomba) => {
  Swal.fire({
    title: 'Setujui Lomba?',
    text: `Apakah Anda yakin ingin menyetujui "${lomba.nama_lomba}"?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#16a34a',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Ya, Setujui',
    cancelButtonText: 'Batal'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await approveLomba({
          id_lomba: lomba.id_lomba,
          status_lomba: 'APPROVED',
          alasan_penolakan: null
        })
        Swal.fire('Disetujui!', 'Lomba berhasil divalidasi dan dipublikasikan.', 'success')
      } catch (error) {
        Swal.fire('Gagal!', error?.response?.data?.message || 'Terjadi kesalahan.', 'error')
      }
    }
  })
}

const handleReject = (lomba) => {
  Swal.fire({
    title: 'Tolak Lomba?',
    text: `Tuliskan alasan penolakan untuk "${lomba.nama_lomba}":`,
    input: 'textarea',
    inputPlaceholder: 'Contoh: Buku panduan tidak jelas / Informasi narahubung tidak aktif...',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Tolak Lomba',
    cancelButtonText: 'Batal',
    inputValidator: (value) => {
      if (!value) return 'Alasan penolakan tidak boleh kosong!'
    }
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await approveLomba({
          id_lomba: lomba.id_lomba,
          status_lomba: 'REJECTED',
          alasan_penolakan: result.value
        })
        Swal.fire('Ditolak!', 'Lomba berhasil ditolak dengan catatan alasan.', 'success')
      } catch (error) {
        Swal.fire('Gagal!', error?.response?.data?.message || 'Terjadi kesalahan.', 'error')
      }
    }
  })
}

const handleDelete = (lomba) => {
  Swal.fire({
    title: 'Hapus Lomba?',
    text: `Data lomba "${lomba.nama_lomba}" akan dihapus permanen!`,
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
          id_lomba: lomba.id_lomba,
          id_user: decoded?.id
        })
        Swal.fire('Terhapus!', 'Data lomba berhasil dihapus.', 'success')
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
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch (e) {
    return dateStr
  }
}
</script>

<template>
  <div class="p-2 sm:p-4 bg-gray-50 min-h-screen">
    <!-- Header Title & Breadcrumb -->
    <div class="mb-4">
      <div class="flex items-baseline gap-2">
        <h1 class="text-2xl font-bold text-gray-900">Aktivitas dan Validasi Lomba</h1>
        <span class="text-sm text-gray-500 font-medium hidden sm:inline">Daftar Aktivitas dan Validasi</span>
      </div>
    </div>

    <!-- Main Container Card -->
    <div class="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      
      <!-- Top Accent Line (Orange) -->
      <div class="h-1 bg-amber-500 w-full"></div>

      <!-- Section Filter Atas (2 Kolom x 2 Baris) -->
      <div class="p-5 border-b border-gray-200">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          
          <!-- Kategori Lomba -->
          <div class="flex flex-col sm:flex-row sm:items-center">
            <label class="w-full sm:w-44 text-sm font-bold text-amber-700 mb-1 sm:mb-0">
              Kategori Lomba
            </label>
            <select 
              v-model="filters.id_kategori"
              class="flex-1 bg-white border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700"
            >
              <option value="">-- Semua Kategori Lomba --</option>
              <option 
                v-for="item in (kategoriData?.data || [])" 
                :key="item.id_kategori" 
                :value="item.id_kategori"
              >
                {{ item.kategori_lomba }}
              </option>
            </select>
          </div>

          <!-- Tingkat Pendidikan -->
          <div class="flex flex-col sm:flex-row sm:items-center">
            <label class="w-full sm:w-44 text-sm font-bold text-amber-700 mb-1 sm:mb-0">
              Tingkat Pendidikan
            </label>
            <select 
              v-model="filters.id_pendidikan"
              class="flex-1 bg-white border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700"
            >
              <option value="">-- Semua Tingkat Pendidikan --</option>
              <option 
                v-for="item in (pendidikanData?.data || [])" 
                :key="item.id_pendidikan" 
                :value="item.id_pendidikan"
              >
                {{ item.tingkat_pendidikan }}
              </option>
            </select>
          </div>

          <!-- Jenis / Format Lomba -->
          <div class="flex flex-col sm:flex-row sm:items-center">
            <label class="w-full sm:w-44 text-sm font-bold text-amber-700 mb-1 sm:mb-0">
              Jenis Aktivitas
            </label>
            <select 
              v-model="filters.id_jenis"
              class="flex-1 bg-white border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700"
            >
              <option value="">-- Semua Jenis Aktivitas --</option>
              <option 
                v-for="item in (jenisData?.data || [])" 
                :key="item.id_jenis" 
                :value="item.id_jenis"
              >
                {{ item.nama_jenis || item.jenis_lomba }}
              </option>
            </select>
          </div>

          <!-- Status Validasi -->
          <div class="flex flex-col sm:flex-row sm:items-center">
            <label class="w-full sm:w-44 text-sm font-bold text-amber-700 mb-1 sm:mb-0">
              Status Valid
            </label>
            <select 
              v-model="filters.status_lomba"
              class="flex-1 bg-white border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold text-gray-800"
            >
              <option value="">-- Semua Status --</option>
              <option value="PENDING">Belum Divalidasi (Pending)</option>
              <option value="APPROVED">Valid (Disetujui)</option>
              <option value="REJECTED">Tidak Valid (Ditolak)</option>
            </select>
          </div>

        </div>
      </div>

      <!-- Accent Line Green Pembatas Bar Aksi -->
      <div class="h-0.5 bg-emerald-500 w-full"></div>

      <!-- Action & Search Toolbar -->
      <div class="p-4 bg-white flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <!-- Left: Limit + Search + Buttons -->
        <div class="flex flex-wrap items-center gap-2 flex-1">
          <select 
            v-model="payload.limit"
            class="bg-white border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-700 focus:outline-none"
          >
            <option :value="10">10 Baris</option>
            <option :value="25">25 Baris</option>
            <option :value="50">50 Baris</option>
          </select>

          <div class="flex items-center flex-1 max-w-md">
            <input 
              type="text" 
              v-model="searchInput"
              @keyup.enter="handleSearch"
              placeholder="Cari Aktivitas dan Prestasi..." 
              class="w-full border border-gray-300 rounded-l px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500"
            />
            <button 
              @click="handleSearch"
              type="button" 
              title="Cari"
              class="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 text-sm font-medium transition flex items-center justify-center"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </button>
            <button 
              @click="handleReset"
              type="button" 
              title="Reset Filter"
              class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-r text-sm font-medium transition flex items-center justify-center"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Right: Action Buttons (Hijau Tambah, Merah Hapus, Orange Aksi) -->
        <div class="flex items-center gap-2">
          <button 
            type="button"
            @click="refetch"
            class="bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold px-3 py-2 rounded flex items-center gap-1.5 transition shadow-sm"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
            </svg>
            Refresh Data
          </button>
        </div>
      </div>

      <!-- Data Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm border-collapse">
          <!-- Table Header: Dark Navy Blue (#004b75) -->
          <thead>
            <tr class="bg-[#004b75] text-white text-xs font-bold uppercase tracking-wider">
              <th class="p-3 w-10 text-center border-r border-[#003c5e]">
                <input 
                  type="checkbox" 
                  v-model="selectAll"
                  class="rounded text-blue-600 focus:ring-0 cursor-pointer"
                />
              </th>
              <th class="p-3 w-12 text-center border-r border-[#003c5e]">No</th>
              <th class="p-3 min-w-[150px] border-r border-[#003c5e]">Penyelenggara / Instansi</th>
              <th class="p-3 min-w-[280px] border-r border-[#003c5e]">Nama Aktivitas</th>
              <th class="p-3 min-w-[120px] text-center border-r border-[#003c5e]">Tanggal</th>
              <th class="p-3 min-w-[90px] text-center border-r border-[#003c5e]">Biaya</th>
              <th class="p-3 min-w-[130px] text-center border-r border-[#003c5e]">Valid</th>
              <th class="p-3 w-28 text-center">Aksi</th>
            </tr>
          </thead>

          <!-- Table Body -->
          <tbody class="divide-y divide-gray-200 bg-white text-gray-800">
            <!-- Loading State -->
            <tr v-if="isLoading">
              <td colspan="8" class="text-center py-12">
                <fwb-spinner size="10" aria-label="Loading..." class="mx-auto text-[#004b75]" />
                <p class="text-gray-500 mt-2 font-medium">Memuat data lomba...</p>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-else-if="lombaList.length === 0">
              <td colspan="8" class="text-center py-10 text-gray-500">
                <div class="py-6">
                  <p class="text-base font-semibold text-gray-600">Tidak ada data aktivitas yang sesuai dengan filter.</p>
                  <p class="text-xs text-gray-400 mt-1">Coba sesuaikan kata kunci pencarian atau reset filter.</p>
                </div>
              </td>
            </tr>

            <!-- Data Rows -->
            <tr 
              v-else 
              v-for="(item, index) in lombaList" 
              :key="item.id_lomba"
              class="hover:bg-blue-50/50 transition duration-150 border-b border-gray-200"
            >
              <!-- Checkbox -->
              <td class="p-3 text-center border-r border-gray-200">
                <input 
                  type="checkbox" 
                  :value="item.id_lomba"
                  v-model="selectedIds"
                  class="rounded text-blue-600 focus:ring-0 cursor-pointer"
                />
              </td>

              <!-- No -->
              <td class="p-3 text-center font-medium text-gray-600 border-r border-gray-200">
                {{ (payload.page - 1) * payload.limit + index + 1 }}
              </td>

              <!-- Penyelenggara / Instansi -->
              <td class="p-3 border-r border-gray-200">
                <div class="font-semibold text-gray-900 leading-tight">
                  {{ item.institusi_penyelenggara || 'Panitia Lomba' }}
                </div>
                <div class="text-xs text-gray-500 mt-0.5">
                  Telp: {{ item.kontak_penyelenggara || '-' }}
                </div>
              </td>

              <!-- Nama Aktivitas / Lomba -->
              <td class="p-3 border-r border-gray-200">
                <div class="font-medium text-gray-900 leading-snug">
                  {{ item.nama_lomba }}
                </div>
                <div class="text-xs text-gray-500 mt-1 flex flex-wrap items-center gap-2">
                  <span v-if="item.kategori_lomba" class="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded text-[11px]">
                    {{ item.kategori_lomba }}
                  </span>
                  <span v-if="item.tingkat_pendidikan" class="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded text-[11px]">
                    {{ item.tingkat_pendidikan }}
                  </span>
                  <span v-if="item.format_lomba" class="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-[11px]">
                    {{ item.format_lomba }}
                  </span>
                </div>
                <!-- Catatan Penolakan jika ada -->
                <div v-if="item.alasan_penolakan" class="mt-1 text-xs text-red-600 bg-red-50 p-1.5 rounded border border-red-200">
                  <span class="font-bold">Catatan:</span> {{ item.alasan_penolakan }}
                </div>
              </td>

              <!-- Tanggal -->
              <td class="p-3 text-center text-xs text-gray-700 border-r border-gray-200 whitespace-nowrap">
                {{ formatDate(item.tanggal_lomba || item.created_at) }}
              </td>

              <!-- Biaya -->
              <td class="p-3 text-center text-xs font-semibold border-r border-gray-200">
                <span v-if="!item.harga || item.harga == 0" class="text-emerald-600">Gratis</span>
                <span v-else class="text-gray-800">Rp {{ Number(item.harga).toLocaleString('id-ID') }}</span>
              </td>

              <!-- Status Validasi -->
              <td class="p-3 text-center border-r border-gray-200 whitespace-nowrap">
                <div v-if="item.status_lomba === 'APPROVED'" class="inline-flex items-center gap-1 text-emerald-700 font-bold text-xs bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-300">
                  <font-awesome-icon icon="check" class="text-emerald-600 text-sm" />
                  <span>Valid</span>
                </div>
                <div v-else-if="item.status_lomba === 'REJECTED'" class="inline-flex items-center gap-1 text-red-700 font-bold text-xs bg-red-50 px-2.5 py-1 rounded-full border border-red-300">
                  <font-awesome-icon icon="xmark" class="text-red-600 text-sm" />
                  <span>Tidak Valid</span>
                </div>
                <div v-else class="inline-flex items-center gap-1 text-amber-700 font-bold text-xs bg-amber-50 px-2.5 py-1 rounded-full border border-amber-300">
                  <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                  <span>Belum Divalidasi</span>
                </div>
              </td>

              <!-- Aksi Buttons (Sesuai icon di screenshot: Eye Biru, Trash Merah + Action approve) -->
              <td class="p-3 text-center">
                <div class="flex items-center justify-center gap-1">
                  <!-- Tombol Detail (Eye Biru Muda) -->
                  <button 
                    type="button"
                    @click="router.push(`/detail-lomba/${item.id_lomba}`)"
                    title="Lihat Detail"
                    class="bg-cyan-500 hover:bg-cyan-600 text-white p-1.5 rounded text-xs transition shadow-sm"
                  >
                    <font-awesome-icon icon="eye" class="w-3.5 h-3.5" />
                  </button>

                  <!-- Tombol Cepat Setujui (Hijau) jika PENDING -->
                  <button 
                    v-if="item.status_lomba === 'PENDING'"
                    type="button"
                    @click="handleApprove(item)"
                    title="Setujui Lomba"
                    class="bg-emerald-600 hover:bg-emerald-700 text-white p-1.5 rounded text-xs transition shadow-sm"
                  >
                    <font-awesome-icon icon="check" class="w-3.5 h-3.5" />
                  </button>

                  <!-- Tombol Cepat Tolak (Orange/Kuning) jika PENDING -->
                  <button 
                    v-if="item.status_lomba === 'PENDING'"
                    type="button"
                    @click="handleReject(item)"
                    title="Tolak Lomba"
                    class="bg-amber-500 hover:bg-amber-600 text-white p-1.5 rounded text-xs transition shadow-sm"
                  >
                    <font-awesome-icon icon="xmark" class="w-3.5 h-3.5" />
                  </button>

                  <!-- Tombol Hapus (Merah) -->
                  <button 
                    type="button"
                    @click="handleDelete(item)"
                    title="Hapus Lomba"
                    class="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded text-xs transition shadow-sm"
                  >
                    <font-awesome-icon icon="trash" class="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer Pagination Sesuai Standar -->
      <div class="p-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-600">
        <div>
          Menampilkan 
          <span class="font-bold text-gray-900">{{ lombaList.length > 0 ? (payload.page - 1) * payload.limit + 1 : 0 }}</span> 
          sampai 
          <span class="font-bold text-gray-900">{{ Math.min(payload.page * payload.limit, pagination.totalData || 0) }}</span> 
          dari 
          <span class="font-bold text-gray-900">{{ pagination.totalData || lombaList.length }}</span> 
          data
        </div>

        <div class="flex items-center gap-1">
          <button 
            type="button"
            :disabled="payload.page <= 1"
            @click="prevPage"
            class="px-3 py-1.5 border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-semibold"
          >
            Sebelumnya
          </button>

          <span class="px-3 py-1.5 bg-[#004b75] text-white rounded text-xs font-bold">
            {{ payload.page }} / {{ pagination.totalPages || 1 }}
          </span>

          <button 
            type="button"
            :disabled="payload.page >= (pagination.totalPages || 1)"
            @click="nextPage"
            class="px-3 py-1.5 border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-semibold"
          >
            Selanjutnya
          </button>
        </div>
      </div>

    </div>
  </div>
</template>
