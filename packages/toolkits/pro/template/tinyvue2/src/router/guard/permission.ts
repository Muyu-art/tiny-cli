import { isLogin } from '@/utils/auth';

export default function setupPermissionGuard(router: any) {
  router.beforeEach((to, from, next) => {
    if (!isLogin()) {
      if (to.name === 'login' || to.name === 'notFound') {
        next();
        return;
      }
      next({
        name: 'login',
        query: {
          redirect: to.name,
          ...to.query,
        },
      });
    } else {
      next();
    }
  });
}
