<script setup>
import footer from "@/assets/footer.svg";
</script>

<template>
    <footer class="bg-indigo-700 text-white relative border-t border-indigo-600">
        <div class="max-w-7xl mx-auto px-6 py-5">
            <div class="flex flex-col md:flex-row justify-between items-center gap-6">
                <!-- LEFT: Logo & Extended Tagline -->
                <div class="flex flex-col md:flex-row items-center gap-6 text-center md:text-left w-full">
                    <img :src="footer" alt="Edvent Logo" class="h-9" />
                    <div class="hidden md:block w-px h-6 bg-white/20"></div>
                    <p class="text-white/80 text-xs md:text-sm max-w-4xl leading-relaxed">
                        Edvent adalah portal edukatif yang membantu pelajar menemukan, mendaftar, dan mempublikasikan berbagai kompetisi serta kegiatan pengembangan diri dari berbagai jenjang pendidikan di seluruh Indonesia.
                    </p>
                </div>
            </div>
            
            <div class="border-t border-white/10 mt-5 pt-4 flex flex-col md:flex-row justify-between items-center gap-3">
                <p class="text-white/60 text-[10px] font-semibold tracking-widest uppercase">© 2026 INFOLOMBA. ALL RIGHTS RESERVED.</p>
            </div>
        </div>
    </footer>
</template>
