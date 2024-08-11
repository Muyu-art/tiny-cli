import { useRouter } from '@/router';
import { useI18n } from '@/locale';
import { Modal } from '@opentiny/vue';
import { useUserStore } from '@/stores/user';
import {t} from '@opentiny/vue-locale';

export default function useUser() {
  const router = useRouter();
  const userStore = useUserStore();
  const logout = async (logoutTo?: string) => {
    await userStore.logout();
    const currentRoute = router.currentRoute;
    Modal.message({
      message: t('setting.loginout'),
      status: 'success',
    });
    router.push({
      name: logoutTo && typeof logoutTo === 'string' ? logoutTo : 'login',
      query: {
        ...router.currentRoute.query,
        redirect: currentRoute.name as string,
      },
    });
  };
  return {
    logout,
  };
}
