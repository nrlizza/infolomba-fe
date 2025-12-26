<script setup>
import { ref, watch, onMounted, watchEffect } from "vue";
import { useRouter, useRoute } from "vue-router";
import Card from "@/components/Ui/Card.vue";
import { FwbInput, FwbFileInput, FwbSelect, FwbTextarea, FwbButton } from "flowbite-vue";
import { useGetLombaById, useUpdateLomba, useAllKategori, useAllKabupatenByIdProvinsi, useAllPendidikan, useAllProvinsi, useAllJenis, useAllPembayaran } from "@/composables/tanstack-query/useQuery";
import cookie from "vue-cookies";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";

const router = useRouter();
const route = useRoute();
const token = cookie.get("token");
const decoded = token ? jwtDecode(token) : null;

/* ===============================
   GET LOMBA ID FROM ROUTE
================================ */
const lombaId = ref(route.params.id);

/* ===============================
   FORM STATE
================================ */
const judulLomba = ref("");
const poster = ref("");
const kategori = ref("");
const tingkatPendidikan = ref("");
const jenisLomba = ref("");
const statusPembayaran = ref("");
const biayaRegistrasi = ref("");
const tanggalAcara = ref("");
const tanggalBatasPendaftaran = ref("");
const provinsiId = ref("");
const kabupatenId = ref("");
const deskripsi = ref("");

/* ===============================
   FETCH DATA
================================ */
const { data: lombaData, isLoading: isLoadingLomba } = useGetLombaById(lombaId.value);
const { data: kategoriLomba } = useAllKategori();
const { data: pendidikan } = useAllPendidikan();
const { data: provinsi } = useAllProvinsi();
const { data: jenis } = useAllJenis();
const { data: pembayaran } = useAllPembayaran();
const { mutate: updateLomba, isLoading } = useUpdateLomba();

/* 🔥 KABUPATEN TERGANTUNG PROVINSI */
const { data: kabupaten, refetch } = useAllKabupatenByIdProvinsi(provinsiId);

/* ===============================
   TEMP STORAGE UNTUK KABUPATEN ID
================================ */
const isInitialLoad = ref(true);
const savedKabupatenId = ref(null);

/* ===============================
   AUTO-POPULATE DATA SAAT EDIT
================================ */
onMounted(() => {
    watch(lombaData, (newData) => {
        if (newData?.data) {
            const lomba = newData.data;
            
            // 1. Set field biasa
            judulLomba.value = lomba.nama_lomba || "";
            kategori.value = lomba.id_kategori ? Number(lomba.id_kategori) : "";
            tingkatPendidikan.value = lomba.id_pendidikan ? Number(lomba.id_pendidikan) : "";
            jenisLomba.value = lomba.id_jenis ? Number(lomba.id_jenis) : "";
            deskripsi.value = lomba.deskripsi || "";
            
            // 2. Status pembayaran
            statusPembayaran.value = lomba.id_status_pembayaran ? Number(lomba.id_status_pembayaran) : 1;
            biayaRegistrasi.value = (lomba.harga && lomba.harga > 0) ? lomba.harga : "";
            
            // 3. Provinsi & simpan kabupaten ID (jangan set kabupaten di sini)
            provinsiId.value = lomba.id_provinsi ? Number(lomba.id_provinsi) : "";
            savedKabupatenId.value = lomba.id_kabupaten ? Number(lomba.id_kabupaten) : null;
            
            // 4. Set tanggal (langsung, tidak perlu nextTick dengan input native)
            tanggalAcara.value = lomba.tanggal_lomba || "";
            tanggalBatasPendaftaran.value = lomba.tanggal_batas_pendaftaran || "";
            
            
        }
    }, { immediate: true });
});

/* ===============================
   SET KABUPATEN SETELAH DATA LOADED
================================ */
watchEffect(() => {
    // Auto-set kabupaten ketika data kabupaten sudah loaded dan ada savedKabupatenId
    if (kabupaten.value?.data?.length > 0 && savedKabupatenId.value && isInitialLoad.value) {
        // Cek apakah kabupaten ID ada di list
        const kabupatenExists = kabupaten.value.data.find(k => k.value === savedKabupatenId.value);
        if (kabupatenExists) {
            kabupatenId.value = savedKabupatenId.value;
            isInitialLoad.value = false;
            
        }
    }
});

/* ===============================
   WATCH PROVINSI
================================ */
watch(provinsiId, (newVal, oldVal) => {
    // Hanya reset kabupaten jika bukan initial load dan provinsi berubah
    if (!isInitialLoad.value && newVal !== oldVal && oldVal !== "") {
        kabupatenId.value = "";
    }
    refetch();
});

/* ===============================
   VALIDASI & SUBMIT
================================ */
const submitLomba = async () => {
    // Validasi field wajib (poster tidak wajib saat edit)
    const fields = [
        { name: "Judul Lomba", value: judulLomba.value },
        { name: "Kategori", value: kategori.value },
        { name: "Tingkat Peserta", value: tingkatPendidikan.value },
        { name: "Jenis Lomba", value: jenisLomba.value },
        { name: "Status Pembayaran", value: statusPembayaran.value },
        { name: "Tanggal Acara", value: tanggalAcara.value },
        { name: "Tanggal Batas Pendaftaran", value: tanggalBatasPendaftaran.value },
        { name: "Provinsi", value: provinsiId.value },
        { name: "Kabupaten/Kota", value: kabupatenId.value },
        { name: "Deskripsi", value: deskripsi.value },
    ];

    for (const field of fields) {
        if (!field.value || (Array.isArray(field.value) && field.value.length === 0)) {
            Swal.fire({
                icon: "warning",
                title: "Kolom kosong",
                text: `Kolom "${field.name}" wajib diisi!`,
            });
            return;
        }
    }

    // Validasi biayaRegistrasi
    if (statusPembayaran.value === 2 && !biayaRegistrasi.value) {
        Swal.fire({
            icon: "warning",
            title: "Kolom kosong",
            text: `Kolom "Biaya Registrasi" wajib diisi karena status pembayaran berbayar!`,
        });
        return;
    }

    // Konfirmasi submit
    const result = await Swal.fire({
        icon: "question",
        title: "Konfirmasi",
        text: "Apakah Anda yakin ingin update lomba ini?",
        showCancelButton: true,
        confirmButtonText: "Ya, update",
        cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    // Prepare FormData
    const formData = new FormData();

    formData.append("id_kategori", kategori.value ? Number(kategori.value) : "");
    formData.append("id_pendidikan", tingkatPendidikan.value ? Number(tingkatPendidikan.value) : "");
    formData.append("id_jenis", jenisLomba.value ? Number(jenisLomba.value) : "");
    formData.append("id_provinsi", provinsiId.value ? Number(provinsiId.value) : "");
    formData.append("id_kabupaten", kabupatenId.value ? Number(kabupatenId.value) : "");
    formData.append("id_user", decoded?.id ? Number(decoded.id) : "");
    formData.append("nama_lomba", judulLomba.value);
    formData.append("tanggal_lomba", tanggalAcara.value);
    formData.append("tanggal_batas_pendaftaran", tanggalBatasPendaftaran.value);
    formData.append("deskripsi", deskripsi.value);
    formData.append("harga", statusPembayaran.value === 2 ? Number(biayaRegistrasi.value) : 0);
    
    // Hanya append image jika ada file baru
    if (poster.value) {
        formData.append("image", poster.value);
    }

    // Submit pakai TanStack Mutation untuk Update
    updateLomba({ id: lombaId.value, data: formData }, {
        onSuccess: () => {
            Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Lomba berhasil diupdate!",
            }).then(() => {
                router.push("/daftar-upload");
            });
        },
        onError: (error) => {
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: `Gagal update lomba: ${error.message || error}`,
            });
        },
    });
};
</script>


<template>
    <Card>
        <!-- Judul & Kategori -->
        <div class="flex justify-between">
            <div class="w-[45%]">
                <FwbInput v-model="judulLomba" label="Judul Lomba" placeholder="Masukkan Judul Lomba" class="bg-white mb-5" />
            </div>
            <div class="w-[45%]">
                <FwbSelect v-model="kategori" label="Kategori Lomba" :options="kategoriLomba?.data" placeholder="Pilih Kategori Lomba" />
            </div>
        </div>

        <!-- Tingkat & Jenis -->
        <div class="flex justify-between">
            <div class="w-[45%] mb-5">
                <FwbSelect v-model="tingkatPendidikan" label="Tingkat Peserta" :options="pendidikan?.data" placeholder="Pilih Tingkat Peserta" />
            </div>
            <div class="w-[45%] mb-5">
                <FwbSelect v-model="jenisLomba" label="Jenis Lomba" :options="jenis?.data" placeholder="Pilih Jenis Lomba" />
            </div>
        </div>

        <!-- Status Pembayaran & Biaya -->
        <div class="flex justify-between">
            <div class="w-[45%] mb-5">
                <FwbSelect v-model="statusPembayaran" label="Status Pembayaran" :options="pembayaran?.data" placeholder="Pilih Status Pembayaran" />
            </div>
            <div v-if="statusPembayaran === 2" class="w-[45%] mb-5">
                <FwbInput v-model="biayaRegistrasi" label="Biaya Registrasi" type="number" placeholder="Masukkan Biaya Registrasi" class="bg-white" />
            </div>
        </div>

        <!-- Tanggal -->
        <div class="flex justify-between">
            <div class="w-[45%] mb-5">
                <label class="block mb-2 text-sm font-medium text-gray-900">Tanggal Acara</label>
                <input 
                    type="date" 
                    v-model="tanggalAcara"
                    class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
            </div>
            <div class="w-[45%] mb-5">
                <label class="block mb-2 text-sm font-medium text-gray-900">Tanggal Batas Pendaftaran</label>
                <input 
                    type="date" 
                    v-model="tanggalBatasPendaftaran"
                    class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
            </div>
        </div>

        <!-- Provinsi & Kabupaten -->
        <div class="flex justify-between mb-5">
            <div class="w-[45%]">
                <FwbSelect v-model="provinsiId" label="Provinsi" :options="provinsi?.data" placeholder="Pilih Provinsi" />
            </div>
            <div class="w-[45%]">
                <FwbSelect v-model="kabupatenId" label="Kabupaten/Kota" :options="kabupaten?.data" placeholder="Pilih Kabupaten/Kota" :disabled="!provinsiId" />
            </div>
        </div>

        <FwbFileInput v-model="poster" label="Unggah Poster Lomba (Opsional - Kosongkan jika tidak ingin mengubah)" dropzone class="bg-white mb-5" />

        <FwbTextarea v-model="deskripsi" label="Deskripsi Lomba" class="bg-white h-48 mb-5" placeholder="Jelaskan detail lomba, tema, tujuan dan mekanisme" />

        <div class="flex justify-center">
            <div class="w-[100%]">
                <FwbButton :loading="isLoading || isLoadingLomba" class="bg-brand-500 hover:bg-brand-600 w-full" @click="submitLomba"> Update Lomba </FwbButton>
            </div>
        </div>
    </Card>
</template>

<style scoped>
::v-deep(.custom-bg select) {
    background-color: white !important;
}
</style>
