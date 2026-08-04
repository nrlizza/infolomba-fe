<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import Card from "@/components/Ui/Card.vue";
import DatePicker from "@/components/Ui/FormInput/DatePicker.vue";
import { FwbInput, FwbFileInput, FwbSelect, FwbTextarea, FwbButton } from "flowbite-vue";
import { useInsertlomba, useAllKategori, useAllKabupatenByIdProvinsi, useAllPendidikan, useAllProvinsi, useAllJenis, useAllPembayaran } from "@/composables/tanstack-query/useQuery";
import cookie from "vue-cookies";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";

const router = useRouter();
const token = cookie.get("token");
const decoded = token ? jwtDecode(token) : null;

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
const formatLomba = ref("");
const linkPanduan = ref("");
const deskripsi = ref("");

const formatOptions = [
    { value: 'INDIVIDU', name: 'INDIVIDU' },
    { value: 'KELOMPOK', name: 'KELOMPOK' },
    { value: 'KELOMPOK & INDIVIDU', name: 'BEBAS' }
];

/* ===============================
   FETCH DATA
================================ */
const { data: kategoriLomba } = useAllKategori();
const { data: pendidikan } = useAllPendidikan();
const { data: provinsi } = useAllProvinsi();
const { data: jenis } = useAllJenis();
const { data: pembayaran } = useAllPembayaran();
const { mutate: insertLomba, isLoading } = useInsertlomba();

/* 🔥 KABUPATEN TERGANTUNG PROVINSI */
const { data: kabupaten, refetch } = useAllKabupatenByIdProvinsi(provinsiId);

/* ===============================
   WATCH PROVINSI
================================ */
watch(provinsiId, () => {
    kabupatenId.value = ""; // reset kabupaten saat provinsi ganti
    refetch();
});

/* ===============================
   VALIDASI & SUBMIT
================================ */
const submitLomba = async () => {
    // Validasi field wajib
    const fields = [
        { name: "Judul Lomba", value: judulLomba.value },
        { name: "Kategori", value: kategori.value },
        { name: "Tingkat Peserta", value: tingkatPendidikan.value },
        { name: "Jenis Lomba", value: jenisLomba.value },
        { name: "Status Pembayaran", value: statusPembayaran.value },
        { name: "Pembukaan Daftar Lomba", value: tanggalAcara.value },
        { name: "Penutupan Pendaftaran", value: tanggalBatasPendaftaran.value },
        { name: "Provinsi", value: provinsiId.value },
        { name: "Kabupaten/Kota", value: kabupatenId.value },
        { name: "Format Lomba", value: formatLomba.value },
        { name: "Link Buku Panduan", value: linkPanduan.value },
        { name: "Deskripsi", value: deskripsi.value },
        { name: "Poster", value: poster.value },
    ];

    for (const field of fields) {
        if (!field.value || (Array.isArray(field.value) && field.value.length === 0)) {
            Swal.fire({
                icon: "warning",
                title: "Kolom kosong",
                text: `Kolom "${field.name}" wajib diisi!`,
            });
            return; // hentikan submit
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
        text: "Apakah Anda yakin ingin submit lomba ini?",
        showCancelButton: true,
        confirmButtonText: "Ya, submit",
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
    formData.append("format_lomba", formatLomba.value);
    formData.append("link_panduan", linkPanduan.value);
    formData.append("deskripsi", deskripsi.value);
    formData.append("harga", statusPembayaran.value === 2 ? Number(biayaRegistrasi.value) : 0);
    formData.append("image", poster.value);

    // Submit pakai TanStack Mutation
    insertLomba(formData, {
        onSuccess: () => {
            Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Lomba berhasil ditambahkan!",
            }).then(() => {
                router.push("/daftar-upload");
            });
        },
        onError: (error) => {
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: `Gagal submit lomba: ${error.message || error}`,
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
                <DatePicker v-model="tanggalAcara" label="Pembukaan Daftar Lomba" id="tanggalAcara" min-date />
            </div>
            <div class="w-[45%] mb-5">
                <DatePicker v-model="tanggalBatasPendaftaran" label="Penutupan Pendaftaran" id="tanggalBatasPendaftaran" min-date />
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

        <!-- Format & Link Panduan -->
        <div class="flex justify-between mb-5">
            <div class="w-[45%]">
                <FwbSelect v-model="formatLomba" label="Format Lomba" :options="formatOptions" placeholder="Pilih Format Lomba" />
            </div>
            <div class="w-[45%]">
                <FwbInput v-model="linkPanduan" label="Link Buku Panduan (URL GDrive)" placeholder="https://drive.google.com/..." class="bg-white" />
            </div>
        </div>

        <FwbFileInput v-model="poster" label="Unggah Poster Lomba" dropzone class="bg-white mb-5" />

        <FwbTextarea v-model="deskripsi" label="Deskripsi Lomba" class="bg-white h-48 mb-5" placeholder="Jelaskan detail lomba, tema, tujuan dan mekanisme" />

        <div class="flex justify-end">
            <FwbButton :loading="isLoading" class="bg-brand-500 hover:bg-brand-600" @click="submitLomba"> Submit </FwbButton>
        </div>
    </Card>
</template>

<style scoped>
::v-deep(.custom-bg select) {
    background-color: white !important;
}
</style>
