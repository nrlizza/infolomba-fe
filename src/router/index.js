import { createRouter, createWebHistory } from 'vue-router';
import { routes } from './routes';
import { globalAuthGuard } from '@/composables/guard';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(globalAuthGuard);

export default router;
