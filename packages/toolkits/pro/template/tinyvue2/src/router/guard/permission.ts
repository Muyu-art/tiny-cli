// import type { Router, LocationQueryRaw } from 'vue-router';
// import NProgress from 'nprogress'; // progress bar
import { getUserInfo } from '@/api/user';
import { useUserStore } from '@/stores';
import { clearToken, isLogin } from '@/utils/auth';
import { nextTick } from 'vue';

export default function setupPermissionGuard(router: any) {
  router.beforeEach(async (to, from, next) => {
    // NProgress.start();
    if (!isLogin()) {
      if (to.name === 'login') {
        next();
        // NProgress.done();
        return;
      }
      next({
        name: 'login',
        query: {
          redirect: to.name,
          ...to.query,
        } as any,
      });
      // NProgress.done();
    } else {
      await nextTick();
      const userStore = useUserStore();
      if (!userStore.email) {
        clearToken();
        next({
          name: 'login',
          query: {
            redirect: to.name,
            ...to.query,
          } as any,
        });
        return;
      }
      next();
      // NProgress.done();
    }
  });
}
