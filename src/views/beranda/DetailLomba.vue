<script setup>
import { useRoute, useRouter } from "vue-router";
import AxiosInstance from "@/lib/axios/axiosInstance";
import { useDetailLomba } from "@/composables/tanstack-query/useQuery";
import Card from "@/components/Ui/Card.vue";
import { computed, ref, watchEffect } from "vue";
import { FwbButton } from "flowbite-vue";
import Swal from "sweetalert2";
import { useUserProfile } from '@/composables/tanstack-query/useQuery'
import cookie from 'vue-cookies'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { 
    faCalendarDays, 
    faHourglassHalf, 
    faMoneyBill, 
    faUniversity, 
    faPhone, 
    faDownload,
    faTag,
    faGraduationCap,
    faLaptop,
    faCheckCircle,
    faCreditCard
} from '@fortawesome/free-solid-svg-icons'

const token = cookie.get('token');  

const route = useRoute();
const router = useRouter();

const loading = ref(false);

// Fetch user profile dengan poin dari database
const { data } = useUserProfile()
const userData = computed(() => data?.value);

const id_lomba = route.params.id_lomba;
const { data: lomba } = useDetailLomba(id_lomba);

const isRegistered = ref(false);

watchEffect(async () => {
    if (userData.value?.id_user) {
        try {
            const res = await AxiosInstance.get("payment/history", {
                params: {
                    id_lomba,
                    id_user: userData.value.id_user
                }
            });
            if (res?.data?.data?.length > 0) {
                isRegistered.value = true;
            }
        } catch (error) {
            console.error(error);
        }
    }
});

const handlePay = async () => {
    if (!token) {
        router.push("/login");
        return;
    }

    try {
        loading.value = true;

        // CEK SUDAH DAFTAR ATAU BELUM
        const cekLomba = await AxiosInstance.get(
            "payment/history",
            {
                params: {
                    id_lomba,
                    id_user: userData.value?.id_user
                },
            }
        );

        if (cekLomba?.data?.data?.length > 0) {
            Swal.fire("Gagal", "Anda sudah terdaftar di lomba ini", "error");
            return;
        }

        const condition = userData.value?.poin >= 100 && lomba.value?.harga > 0;

        // PILIH METODE
        const result = await Swal.fire({
            title: "Pilih Metode Pembayaran",
            text: condition ? "Gunakan poin atau bayar sekarang?" : "Bayar sekarang?",
            icon: "question",
            showDenyButton: condition,
            confirmButtonText: "💳 Bayar Sekarang",
            denyButtonText: "🎁 Redeem 100 Poin",
            cancelButtonText: "Batal",
            showCancelButton: true,
        });

        // ❌ BATAL
        if (result.isDismissed) return;

        // 🎁 REDEEM POINT
        if (result.isDenied) {
            const res = await AxiosInstance.post(
                "payment/redeem",
                {
                    id_user: userData.value?.id_user,
                    id_lomba,
                }
            );

            Swal.fire(
                "Berhasil 🎉",
                "Pendaftaran berhasil menggunakan poin",
                "success"
            );
            return;
        }

        // 💳 MIDTRANS
        if (result.isConfirmed) {
            const res = await AxiosInstance.post(
                "payment/create",
                {
                    id_user: userData.value?.id_user,
                    id_lomba,
                    name: userData.value?.name,
                    email: userData.value?.email,
                }
            );

            // GRATIS
            if (res.data.free) {
                Swal.fire("Berhasil 🎉", "Lomba ini gratis", "success");
                return;
            }

            // BERBAYAR
            window.snap.pay(res.data.snapToken, {
                onSuccess: () =>
                    Swal.fire("Sukses", "Pembayaran berhasil", "success"),
                onPending: () =>
                    Swal.fire("Pending", "Menunggu pembayaran", "info"),
                onError: () =>
                    Swal.fire("Gagal", "Pembayaran gagal", "error"),
                onClose: () =>
                    Swal.fire("Dibatalkan", "Pembayaran dibatalkan", "warning"),
            });
        }
    } catch (err) {
        console.error(err);
        Swal.fire("Error", "Terjadi kesalahan", "error");
    } finally {
        loading.value = false;
    }
};

</script>

<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div class="max-w-5xl mx-auto px-4 py-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 lg:items-start">
                <Card class="p-0 overflow-hidden shadow-2xl order-2 lg:order-1 lg:h-fit">
                    <img :src="lomba?.image_url" alt="gambar lomba" class="w-full h-auto object-contain min-h-[300px] lg:max-h-[430px]" />
                </Card>
                
                <div class="space-y-4 order-1 lg:order-2">
                    <Card class="shadow-lg">
                        <div class="flex flex-wrap gap-2 mb-3">
                            <span class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white rounded-full text-xs font-semibold">
                                <FontAwesomeIcon :icon="faTag" class="w-3 h-3" />
                                {{ lomba?.kategori_lomba }}
                            </span>
                            <span class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-500 text-white rounded-full text-xs font-semibold">
                                <FontAwesomeIcon :icon="faGraduationCap" class="w-3 h-3" />
                                {{ lomba?.tingkat_pendidikan }}
                            </span>
                            <span v-if="lomba?.format_lomba" class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-500 text-white rounded-full text-xs font-semibold">
                                <FontAwesomeIcon :icon="faLaptop" class="w-3 h-3" />
                                {{ lomba?.format_lomba }}
                            </span>
                        </div>
                        <h1 class="text-2xl lg:text-3xl font-bold text-gray-900 mb-2 leading-tight">
                            {{ lomba?.nama_lomba }}
                        </h1>
                        <p v-if="lomba?.institusi_penyelenggara" class="text-gray-600 text-sm font-medium flex items-center gap-2">
                            <FontAwesomeIcon :icon="faUniversity" class="w-4 h-4 text-indigo-600" />
                            {{ lomba?.institusi_penyelenggara }}
                        </p>
                    </Card>

                    <div class="grid grid-cols-2 gap-3">
                        <Card class="shadow-lg" v-if="lomba?.harga !== undefined">
                            <div class="text-center">
                                <div class="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                                    <FontAwesomeIcon :icon="faMoneyBill" class="w-5 h-5 text-white" />
                                </div>
                                <p class="text-xs text-gray-600 mb-1">Biaya</p>
                                <p class="text-sm font-bold text-gray-900">
                                    {{ lomba.harga === 0 ? 'GRATIS' : `Rp${lomba.harga.toLocaleString('id-ID')}` }}
                                </p>
                            </div>
                        </Card>

                        <Card class="shadow-lg">
                            <div class="text-center">
                                <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                                    <FontAwesomeIcon :icon="faCalendarDays" class="w-5 h-5 text-white" />
                                </div>
                                <p class="text-xs text-gray-600 mb-1">Pembukaan</p>
                                <p class="text-xs font-bold text-gray-900">
                                    {{
                                        new Date(lomba?.tanggal_lomba).toLocaleDateString("id-ID", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        })
                                    }}
                                </p>
                            </div>
                        </Card>

                        <Card v-if="lomba?.tanggal_batas_pendaftaran" class="shadow-lg">
                            <div class="text-center">
                                <div class="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                                    <FontAwesomeIcon :icon="faHourglassHalf" class="w-5 h-5 text-white" />
                                </div>
                                <p class="text-xs text-gray-600 mb-1">Penutupan</p>
                                <p class="text-xs font-bold text-gray-900">
                                    {{
                                        new Date(lomba?.tanggal_batas_pendaftaran).toLocaleDateString("id-ID", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        })
                                    }}
                                </p>
                            </div>
                        </Card>

                        <Card v-if="lomba?.kontak_penyelenggara" class="shadow-lg">
                            <div class="text-center">
                                <div class="w-10 h-10 bg-gradient-to-br from-rose-500 to-rose-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                                    <FontAwesomeIcon :icon="faPhone" class="w-5 h-5 text-white" />
                                </div>
                                <p class="text-xs text-gray-600 mb-1">Kontak</p>
                                <p class="text-xs font-bold text-gray-900">{{ lomba.kontak_penyelenggara }}</p>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            <Card class="shadow-xl mb-4 border-t-4 border-[#4954DE]">
                <h2 class="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <span class="w-1 h-6 bg-[#4954DE] rounded-full"></span>
                    Tentang Lomba
                </h2>
                <div class="text-sm text-gray-700 leading-relaxed mb-4" v-html="lomba?.deskripsi?.replace(/\n/g, '<br/>')"></div>
                
                <a v-if="lomba?.link_panduan" :href="lomba.link_panduan" target="_blank" class="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200">
                    <FontAwesomeIcon :icon="faDownload" class="w-4 h-4" />
                    Unduh Buku Panduan
                </a>
            </Card>
        </div>

        <div v-if="userData?.role !== 'ADMIN'" class="fixed bottom-8 right-8 z-50">
            <FwbButton 
                @click="handlePay"
                :disabled="loading || isRegistered"
                class="group relative bg-gradient-to-r from-[#4954DE] to-[#6366F1] hover:from-[#3944CE] hover:to-[#5356E1] text-white font-bold rounded-full shadow-2xl hover:shadow-[#4954DE]/50 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed w-16 h-16 lg:w-auto lg:h-auto lg:px-8 lg:py-4 flex items-center justify-center lg:rounded-full animate-bounce hover:animate-none hover:scale-110">
                <span class="lg:inline-flex items-center gap-2.5">
                    <FontAwesomeIcon v-if="isRegistered" :icon="faCheckCircle" class="w-6 h-6 lg:w-5 lg:h-5" />
                    <FontAwesomeIcon v-else :icon="faCreditCard" class="w-6 h-6 lg:w-5 lg:h-5" />
                    <span class="hidden lg:inline">
                        {{ loading ? "Memproses..." : (isRegistered ? "TERDAFTAR" : "DAFTAR") }}
                    </span>
                </span>
            </FwbButton>
            
            <div class="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-ping" v-if="!isRegistered && !loading"></div>
        </div>
    </div>
</template>
