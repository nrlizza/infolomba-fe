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
    <div class="flex gap-6 items-stretch justify-evenly my-5">
        <!-- POSTER -->
        <Card class="w-2/5 p-0 overflow-hidden">
            <img :src="lomba?.image_url" alt="gambar lomba" class="w-full h-full object-cover" />
        </Card>

        <!-- CONTENT -->
        <Card class="w-2/5 space-y-4 h-fit">
            <h1 class="text-3xl font-bold text-center text-[#4954DE]">
                {{ lomba?.nama_lomba }}
            </h1>

            <p class="text-sm text-center text-gray-500">
                <strong>{{ lomba?.kategori_lomba }}</strong>
                |
                <strong>{{ lomba?.tingkat_pendidikan }}</strong>
                <span v-if="lomba?.format_lomba">
                    |
                    <strong class="text-brand-500">{{ lomba?.format_lomba }}</strong>
                </span>
            </p>

            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                <p v-html="lomba?.deskripsi?.replace(/\n/g, '<br/>')"></p>

                <div v-if="lomba?.link_panduan" class="mt-4 mb-6">
                    <a :href="lomba.link_panduan" target="_blank" class="inline-flex items-center justify-center gap-2 text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-4 py-2 rounded-lg font-semibold text-sm transition">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                        Unduh Buku Panduan
                    </a>
                </div>
                <p v-if="lomba?.harga">
                    💸 Biaya:
                    <strong>Rp{{ lomba.harga.toLocaleString() }}</strong>
                </p>

                <p v-if="lomba?.institusi_penyelenggara">
                    🏛️ Universitas/Institusi:
                    <strong>{{ lomba.institusi_penyelenggara }}</strong>
                </p>

                <p v-if="lomba?.kontak_penyelenggara">
                    📞 Nomor Telepon/WA:
                    <strong>{{ lomba.kontak_penyelenggara }}</strong>
                </p>

                <p>
                    📅 Pembukaan Daftar Lomba:
                    <strong>
                        {{
                            new Date(lomba?.tanggal_lomba).toLocaleDateString("id-ID", {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                            })
                        }}
                    </strong>
                </p>

                <p v-if="lomba?.tanggal_batas_pendaftaran">
                    🕒 Penutupan Pendaftaran:
                    <strong>
                        {{
                            new Date(lomba?.tanggal_batas_pendaftaran).toLocaleDateString("id-ID", {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                            })
                        }}
                    </strong>
                </p>
            </div>

            <FwbButton v-if="userData?.role !== 'ADMIN'" class="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3 rounded-lg"
                :disabled="loading || isRegistered" @click="handlePay">
                {{ loading ? "Memproses..." : (isRegistered ? "✅ SUDAH TERDAFTAR" : "📝 DAFTAR SEKARANG") }}
            </FwbButton>
        </Card>
    </div>
</template>
