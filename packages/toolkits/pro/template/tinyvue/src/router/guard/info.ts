import { getUserInfo } from '@/api/user';
import { useUserStore } from '@/store';
import { Role } from '@/store/modules/user/types';
import { isLogin, setToken } from '@/utils/auth';
import NProgress from 'nprogress';
import { LocationQueryRaw, Router } from 'vue-router';

export default function setupInfoGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    NProgress.start();
    if (to.name === 'login') {
      next();
      NProgress.done();
      return;
    }
    const userStore = useUserStore();
    const { data } = (await getUserInfo()) ?? { data: null };
    if (!data) {
      next({
        name: 'login',
        query: {
          redirect: to.name,
          ...to.query,
        } as LocationQueryRaw,
      });
      setToken('');
      NProgress.done();
      return;
    }
    userStore.setInfo(data);
    userStore.rolePermission = (data.role as unknown as Role[])
      .flatMap((role) => role.permission)
      .map((permission) => permission.name);
    next();
    NProgress.done();
  });
}
