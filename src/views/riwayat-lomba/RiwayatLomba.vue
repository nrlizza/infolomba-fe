<script setup>
import CardRiwayatLomba from '@/components/Ui/CardRiwayatUser.vue'
import { ref } from 'vue'
import { FwbPagination } from 'flowbite-vue'

const currentPage = ref(1)
</script>

<template>
  <section class="bg-white py-12 text-center">
    <h2 class="text-3xl lg:text-4xl font-extrabold text-[#4954DE]">
      Riwayat Lomba
    </h2>

    <div class="container mx-auto px-6 lg:px-14 mt-15">
      <!-- CARD GRID -->
       <div class ="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 place-items-center">
         <CardRiwayatLomba />
         <CardRiwayatLomba />
         <CardRiwayatLomba />
       </div>

      <!-- Pagination -->
      <div class="flex justify-center mt-15">
        <fwb-pagination
          v-model="currentPage"
          :total-pages="10"
          hide-labels
          show-icons
          large
        />
      </div>

      <!-- Footer Text -->
      <div class="mt-10">
        <button class="bg-[#4954DE] text-white px-10 py-5 rounded-xl">
          <p class="text-[25px] font-extrabold">
            Tetap Semangat!
          </p> 
           <p class="text-[15px] font-normal">
            Terus ikuti lomba dan kumpulkan poinmu
          </p> 
        </button>
      </div>

    </div>
  </section>
</template>
