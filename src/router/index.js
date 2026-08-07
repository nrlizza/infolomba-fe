import { createRouter, createWebHistory } from 'vue-router';
import { routes } from './routes';
import { globalAuthGuard } from '@/composables/guard';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Selalu scroll ke atas
    return { top: 0 };
  },
});

router.beforeEach(globalAuthGuard);

export default router;
