import { pinia } from '@/stores/pinia';
import { useUserStore } from '@/stores/user';
import Vue, { getCurrentInstance } from 'vue';
import VueRouter from 'vue-router';
import defaultLayout from '../layout/default-layout.vue';
import appRoutes from './routes';
import { getToken } from '@/utils/auth';
import createRouteGuard from '@/router/guard';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes: [
    // 本地地址
    {
      path: '/',
      redirect: `${import.meta.env.VITE_CONTEXT}login`,
    },
    {
      path: import.meta.env.VITE_CONTEXT,
      redirect: { path: `${import.meta.env.VITE_CONTEXT}login` },
    },
    {
      path: import.meta.env.VITE_CONTEXT + 'login',
      name: 'login',
      component: () => import('@/views/login/index.vue'),
      meta: {
        requiresAuth: false,
      },
    },
    {
      name: 'root',
      path: import.meta.env.VITE_CONTEXT,
      component: defaultLayout,
      children: [],
    },
    {
      path: import.meta.env.VITE_CONTEXT + ':pathMatch(.*)*',
      name: 'notFound',
      component: () => import('@/views/not-found/index.vue'),
    },
    {
      path: import.meta.env.VITE_CONTEXT + 'preview',
      name: 'preview',
      component: () => import('@/views/Preview/index.vue'),
    },
    {
      name: 'redirect',
      path: import.meta.env.VITE_CONTEXT + 'redirect',
      component: () => import('@/views/redirect.vue'),
    },
  ],
});

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
export const useRouter = () => getCurrentInstance()?.proxy.$router!;
export const useRoute = () => appRoutes;
export const useQuery = (key: string) =>
  new URL(window.location.href).searchParams.get(key);

createRouteGuard(router);
export default router;
