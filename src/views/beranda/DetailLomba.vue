<script setup>
import { useRoute, useRouter } from "vue-router";
import AxiosInstance from "@/lib/axios/axiosInstance";
import { useDetailLomba } from "@/composables/tanstack-query/useQuery";
import Card from "@/components/Ui/Card.vue";
import { computed, ref } from "vue";
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

const handlePay = async () => {
    if (!token) {
        router.push("/login");
        return;
    }

    try {
        loading.value = true;

        // CEK SUDAH DAFTAR ATAU BELUM
        const cekLomba = await AxiosInstance.get(
            "https://infolomba-be.vercel.app/api/payment/history",
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
                "https://infolomba-be.vercel.app/api/payment/redeem",
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
                "https://infolomba-be.vercel.app/api/payment/create",
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
            </p>

            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                <p v-html="lomba?.deskripsi?.replace(/\n/g, '<br/>')"></p>

                <p v-if="lomba?.harga">
                    💸 Biaya:
                    <strong>Rp{{ lomba.harga.toLocaleString() }}</strong>
                </p>

                <p>
                    📅 Tanggal Lomba:
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
                    🕒 Batas Pendaftaran:
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

            <FwbButton class="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3 rounded-lg"
                :disabled="loading" @click="handlePay">
                {{ loading ? "Memproses..." : "📝 DAFTAR SEKARANG" }}
            </FwbButton>
        </Card>
    </div>
</template>
