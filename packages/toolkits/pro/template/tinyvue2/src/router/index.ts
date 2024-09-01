import { pinia } from '@/stores/pinia';
import { useUserStore } from '@/stores/user';
import Vue, { getCurrentInstance } from 'vue';
import VueRouter from 'vue-router';
import appRoutes from './routes';
import { getToken } from '@/utils/auth';
import createRouteGuard from '@/router/guard';
import { notFound } from './not-found';
import constant from './constant';

const router = new VueRouter({
  mode: 'history',
  routes: [
    // 本地地址
    ...constant,
  ],
});

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
export const useRouter = () => getCurrentInstance()?.proxy.$router!;
export const useRoute = () => appRoutes;
export const useQuery = (key: string) =>
  new URL(window.location.href).searchParams.get(key);

createRouteGuard(router);
export default router;
