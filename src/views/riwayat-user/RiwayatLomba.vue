<script setup>
import { ref, computed } from "vue";
import { FwbButton, FwbSpinner } from "flowbite-vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useRouter } from "vue-router";
import Card from "@/components/Ui/Card.vue";
import cookie from "vue-cookies";
import { jwtDecode } from "jwt-decode";
import { useAllLombaPeserta } from "@/composables/tanstack-query/useQuery";

const router = useRouter();

// ===== ambil user dari token =====
const token = cookie.get("token");
const decoded = token ? jwtDecode(token) : null;

// ===== payload pagination =====
const payload = ref({
    id_user: decoded?.id,
    page: 1,
    limit: 5,
});

// ===== query =====
const { data, isLoading } = useAllLombaPeserta(payload);

// ===== pagination helpers =====
const pagination = computed(() => data.value?.pagination ?? {});
const lombaList = computed(() => data.value?.data ?? []);

const nextPage = () => {
    if (payload.value.page < pagination.value.totalPages) {
        payload.value.page++;
    }
};

const prevPage = () => {
    if (payload.value.page > 1) {
        payload.value.page--;
    }
};

// ===== function =====
function goToDetail(id) {
    router.push(`/detail-lomba/${id}`);
}

</script>

<template>
    <div class="min-h-full bg-slate-50/50 py-6 px-4 md:px-6">
        <!-- HEADER -->
        <div class="max-w-7xl mx-auto mb-6">
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-center relative overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-br from-indigo-50/30 via-transparent to-transparent"></div>
                <h1 class="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-1 relative z-10">
                    RIWAYAT <span class="text-indigo-600">LOMBA</span>
                </h1>
                <p class="text-slate-500 text-sm md:text-base max-w-2xl mx-auto relative z-10">
                    Kelola dan pantau semua kompetisi yang telah Anda ikuti.
                </p>
            </div>
        </div>

        <!-- MAIN CONTENT AREA -->
        <div class="max-w-7xl mx-auto">
            <!-- Loading -->
            <div v-if="isLoading" class="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                <div class="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-3"></div>
                <p class="text-sm text-slate-500 font-medium">Memuat riwayat lomba...</p>
            </div>

            <!-- Empty / Not Logged In -->
            <div v-else-if="lombaList.length === 0" class="bg-white rounded-xl shadow-sm border border-gray-100 py-12 px-6 text-center">
                <div v-if="!token" class="flex flex-col items-center max-w-md mx-auto">
                    <div class="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-4 text-indigo-600">
                        <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h3 class="text-xl font-bold text-slate-800 mb-2">Akses Terbatas</h3>
                    <p class="text-sm text-slate-500 mb-6 leading-relaxed">
                        Silakan login terlebih dahulu untuk melihat dan mengelola riwayat kompetisi yang Anda ikuti.
                    </p>
                    <FwbButton color="blue" size="lg" class="w-full md:w-auto px-8 shadow-lg shadow-indigo-200" @click="router.push('/login')">
                        Login Sekarang
                    </FwbButton>
                </div>
                <div v-else class="flex flex-col items-center max-w-md mx-auto">
                    <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-400">
                        <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <h3 class="text-xl font-bold text-slate-800 mb-2">Belum Ada Riwayat</h3>
                    <p class="text-sm text-slate-500 mb-6 leading-relaxed">
                        Sepertinya Anda belum mendaftar di lomba manapun. Mari temukan kompetisi menarik untuk Anda!
                    </p>
                    <FwbButton color="blue" size="lg" class="w-full md:w-auto px-8 shadow-lg shadow-indigo-200" @click="router.push('/info-lomba')">
                        Jelajahi Lomba
                    </FwbButton>
                </div>
            </div>

            <!-- List Display -->
            <div v-else class="space-y-6">
                <div v-for="(lomba, index) in lombaList" :key="index"
                    class="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                        <!-- LEFT -->
                        <div class="flex-1 space-y-4">
                            <!-- Judul + Badge -->
                            <div class="flex flex-wrap items-center gap-3">
                                <h2 class="text-xl font-bold text-slate-800">
                                    {{ lomba.nama_lomba }}
                                </h2>

                                <!-- PAID -->
                                <span v-if="lomba.status_pembayaran === 'PAID'"
                                    class="px-3 py-1 text-xs font-bold rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase tracking-wider">
                                    ✔ Paid
                                </span>

                                <!-- PENDING -->
                                <span v-else-if="lomba.status_pembayaran === 'PENDING'"
                                    class="px-3 py-1 text-xs font-bold rounded-full bg-amber-50 text-amber-600 border border-amber-100 uppercase tracking-wider">
                                    ⏳ Pending
                                </span>

                                <!-- DEFAULT -->
                                <span v-else class="px-3 py-1 text-xs font-bold rounded-full bg-rose-50 text-rose-600 border border-rose-100 uppercase tracking-wider">
                                    ✖ Belum Bayar
                                </span>
                            </div>

                            <!-- Info Icons -->
                            <div class="flex flex-wrap items-center gap-y-2 gap-x-6">
                                <!-- Kategori -->
                                <div class="flex items-center gap-2 text-slate-500">
                                    <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                    <span class="text-sm font-medium">{{ lomba.kategori_lomba }}</span>
                                </div>

                                <!-- Pendidikan -->
                                <div class="flex items-center gap-2 text-slate-500">
                                    <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                    </svg>
                                    <span class="text-sm font-medium">{{ lomba.tingkat_pendidikan }}</span>
                                </div>

                                <!-- Tanggal -->
                                <div class="flex items-center gap-2 text-slate-500">
                                    <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span class="text-sm font-medium">
                                        {{ new Date(lomba.tanggal_lomba).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) }}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- RIGHT -->
                        <div class="w-full lg:w-auto">
                            <FwbButton color="light" size="md" class="w-full lg:w-auto font-bold border-gray-200 hover:bg-slate-50 transition-colors" @click="goToDetail(lomba.id_lomba)">
                                <template #prefix>
                                    <FontAwesomeIcon icon="circle-exclamation" class="mr-1" />
                                </template>
                                Detail Lomba
                            </FwbButton>
                        </div>
                    </div>
                </div>

                <!-- Pagination -->
                <div v-if="pagination.totalPages > 1" class="flex justify-between items-center gap-4 mt-10 pt-6 border-t border-gray-100">
                    <FwbButton color="light" size="md" class="font-bold border-gray-200" :disabled="payload.page === 1" @click="prevPage">
                        Prev
                    </FwbButton>

                    <span class="text-sm font-bold text-slate-600 bg-slate-100 px-4 py-2 rounded-lg">
                        Halaman {{ payload.page }} dari {{ pagination.totalPages }}
                    </span>

                    <FwbButton color="light" size="md" class="font-bold border-gray-200" :disabled="payload.page === pagination.totalPages" @click="nextPage">
                        Next
                    </FwbButton>
                </div>
            </div>
        </div>
    </div>
</template>