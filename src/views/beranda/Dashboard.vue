<script setup>
import { useRouter } from 'vue-router'; // Import useRouter dari vue-router
import Card from "@/components/Ui/Card.vue";
import bg from "@/assets/bg.png";
import mask from "@/assets/Mask group.svg";
import { FwbPagination } from 'flowbite-vue'
import { ref } from 'vue'
import { useAllLomba } from '@/composables/tanstack-query/useQuery';
import FwbCard from '@/components/Ui/FwbCard.vue';

// Mendapatkan instance router
const router = useRouter();
const currentPage = ref(1)

const { data, isLoading } = useAllLomba();

// Fungsi untuk navigasi ke halaman Info Lomba
const goToInfoLomba = () => {
  router.push('/info-lomba'); // Arahkan ke halaman /info-lomba
};
</script>

<template>
  <div>
    <!-- =================== HERO SECTION =================== -->
    <section class=" min-h-[75vh] flex items-center text-white px-16" :style="{
      backgroundImage: `url(${bg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }">
      <div class="flex items-center w-full justify-between gap-10 pb">

        <!-- TEXT -->
        <div class="max-w-xl space-y-10">
          <h1 class="text-5xl font-extrabold leading-tight">
            Temukan dan Ikuti <br />
            Lomba Sesuai <br />
            <span class="text-[#FFD277]">Passionmu!</span>
          </h1>

          <p class="text-gray-200 text-xl">
            Jelajahi berbagai lomba yang menarik dan kembangkan bakat terbaikmu
            bersama ribuan peserta lainnya.
          </p>

          <!-- Tombol yang memanggil fungsi goToInfoLomba -->
          <button @click="goToInfoLomba"
            class="flex items-center gap-3 bg-white text-[#4657B5] px-6 py-3 rounded-full font-semibold shadow-md hover:shadow-lg transition">
            <span class="text-lg">🔍</span>
            Jelajahi Lomba
          </button>
        </div>

        <!-- ILLUSTRATION -->
        <div class="flex justify-center">
          <img :src="mask" class="rounded-xl lg:w-[380px]" />
        </div>
      </div>
    </section>

    <!-- =================== LOMBA TERBARU =================== -->
    <section class="bg-white py-12 lg:py-16 text-center">
      <h2 class="text-3xl lg:text-4xl font-extrabold text-[#4954DE] tracking-wide">
        LOMBA TERBARU
      </h2>

      <p class="text-base lg:text-lg text-[#4954DE] mt-2">
        Temukan lomba terbaru yang sesuai dengan minat dan bakatmu di sini!
      </p>

      <div class="container mx-auto px-5 lg:px-15 mt-15">
        <div class="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 place-items-center">
          <FwbCard v-for="lomba in data?.data" :key="lomba.nama_lomba" :lomba="lomba" />
        </div>

      </div>
    </section>
  </div>
</template>
