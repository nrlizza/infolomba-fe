<script setup>
import footer from "@/assets/footer.svg";
</script>

<template>
    <footer class="bg-indigo-700 text-white relative border-t border-indigo-600">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-5">
            <div class="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-6">
                <div class="flex flex-col md:flex-row items-center gap-3 sm:gap-6 text-center md:text-left w-full">
                    <img :src="footer" alt="Edvent Logo" class="h-6 sm:h-8 md:h-9 w-auto" />
                    <div class="hidden md:block w-px h-6 bg-white/20"></div>
                    <p class="text-white/80 text-[11px] sm:text-xs md:text-sm max-w-4xl leading-relaxed">
                        Edvent adalah portal edukatif yang membantu pelajar menemukan, mendaftar, dan mempublikasikan berbagai kompetisi serta kegiatan pengembangan diri dari berbagai jenjang pendidikan di seluruh Indonesia.
                    </p>
                </div>
            </div>
            
            <div class="border-t border-white/10 mt-3 sm:mt-5 pt-2 sm:pt-4 flex flex-col md:flex-row justify-between items-center gap-2 sm:gap-3">
                <p class="text-white/60 text-[9px] sm:text-[10px] font-semibold tracking-widest uppercase">© 2026 INFOLOMBA. ALL RIGHTS RESERVED.</p>
            </div>
        </div>
    </footer>
</template>
