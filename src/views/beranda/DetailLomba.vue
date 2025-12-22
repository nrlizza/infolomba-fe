<script setup>
import { useRoute, useRouter } from "vue-router";
import AxiosInstance from "@/lib/axios/axiosInstance";
import { useDetailLomba } from "@/composables/tanstack-query/useQuery";
import Card from "@/components/Ui/Card.vue";
import { ref } from "vue";
import { FwbButton } from "flowbite-vue";
import cookie from "vue-cookies";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";

const route = useRoute();
const router = useRouter();

const token = cookie?.get("token");
const decoded = token ? jwtDecode(token) : null;

const loading = ref(false);

const id_lomba = route.params.id_lomba;
const { data: lomba } = useDetailLomba(id_lomba);

const handlePay = async () => {
    if (!token) {
        router.push("/login");
        return;
    }

    try {
        loading.value = true;

        const cekLomba = await AxiosInstance.get(
            "http://localhost:3001/api/payment/history",
            {
                params: {
                    id_lomba,
                    id_user: decoded?.id
                },
            }
        );

        if (cekLomba?.data?.data) {
            Swal.fire({
                icon: "error",
                title: "Gagal Daftar",
                text: "Anda sudah terdaftar di lomba ini.",
                confirmButtonText: "OK",
            });
            loading.value = false;
            return;
        }

        const res = await AxiosInstance.post(
            "http://localhost:3001/api/payment/create",
            {
                id_user: decoded?.id,
                id_lomba,
                name: decoded?.name,
                email: decoded?.email || "peserta@gmail.com",
            }
        );

        // 🔥 CASE GRATIS
        if (res.data.free) {
            Swal.fire({
                icon: "success",
                title: "Berhasil Daftar 🎉",
                text: "Lomba ini gratis, kamu sudah terdaftar.",
                confirmButtonText: "OK",
            });
            return;
        }

        // 💰 CASE BERBAYAR
        const snapToken = res.data.snapToken;

        window.snap.pay(snapToken, {
            onSuccess: () => {
                Swal.fire({
                    icon: "success",
                    title: "Pembayaran Berhasil",
                    text: "Pembayaran berhasil diproses.",
                    confirmButtonText: "OK",
                });
            },
            onPending: () => {
                Swal.fire({
                    icon: "info",
                    title: "Menunggu Pembayaran",
                    text: "Silakan selesaikan pembayaran.",
                    confirmButtonText: "OK",
                });
            },
            onError: () => {
                Swal.fire({
                    icon: "error",
                    title: "Pembayaran Gagal",
                    text: "Terjadi kesalahan saat proses pembayaran.",
                    confirmButtonText: "OK",
                });
            },
            onClose: () => {
                Swal.fire({
                    icon: "warning",
                    title: "Pembayaran Dibatalkan",
                    text: "Popup pembayaran ditutup.",
                    confirmButtonText: "OK",
                });
            },
        });
    } catch (err) {
        console.error(err);
        Swal.fire("Error", "Terjadi kesalahan saat daftar lomba", "error");
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

            <FwbButton class="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3 rounded-lg" :disabled="loading" @click="handlePay">
                {{ loading ? "Memproses..." : "📝 DAFTAR SEKARANG" }}
            </FwbButton>
        </Card>
    </div>
</template>
