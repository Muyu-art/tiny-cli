// import type { Router, LocationQueryRaw } from 'vue-router';
// import NProgress from 'nprogress'; // progress bar
import { useUserStore } from '@/stores';
import { isLogin } from '@/utils/auth';

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
      next();
      // NProgress.done();
    }
  });
}
