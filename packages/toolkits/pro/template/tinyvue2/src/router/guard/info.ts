import { getUserInfo, type Role } from '@/api/user';
import { useUserStore } from '@/stores';
import { setToken } from '@/utils/auth';

export default function setupInfoGuard(router) {
  router.beforeEach(async (to, from, next) => {
    if (to.name === 'login' || to.name === 'notFound') {
      next();
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
        },
      });
      setToken('');
      return;
    }
    userStore.setInfo(data);
    userStore.rolePermission = (data.role as unknown as Role[])
      .flatMap((role) => role.permission)
      .map((permission) => permission.name);
    next();
  });
}
