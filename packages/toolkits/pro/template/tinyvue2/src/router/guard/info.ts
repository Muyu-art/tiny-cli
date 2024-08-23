import { getUserInfo, type Role } from '@/api/user';
import { _i18n } from '@/locale';
import { useUserStore } from '@/stores';
import { useLocales } from '@/stores/modules/locales';
import { setToken } from '@/utils/auth';

export default function setupInfoGuard(router) {
  router.beforeEach(async (to, from, next) => {
    if (to.name === 'login' || to.name === 'notFound') {
      next();
      return;
    }
    const userStore = useUserStore();
    const localesStore = useLocales();
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
    if (localesStore.shouldFetch) {
      await localesStore.fetchLang();
      await localesStore.fetchLocalTable();
    }
    if (localesStore.shouldMerge) {
      const entries = Object.entries(localesStore.localTable);
      for (let i = 0; i < entries.length; i += 1) {
        const lang = entries[i][0];
        const value = entries[i][1];
        _i18n.mergeLocaleMessage(lang, value);
      }
    }
    localesStore.$patch({
      shouldFetch: false,
      shouldMerge: false,
    });
    userStore.setInfo(data);
    userStore.rolePermission = (data.role as unknown as Role[])
      .flatMap((role) => role.permission)
      .map((permission) => permission.name);
    next();
  });
}
