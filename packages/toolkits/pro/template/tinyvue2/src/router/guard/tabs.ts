import { useTabStore } from '@/stores/modules/tabs';
import { nextTick } from 'vue';
// import { Router } from "vue-router";

export const setupTabsGuard = (router: any) => {
  router.beforeEach(async (to, from, next) => {
    await nextTick();
    const tabStore = useTabStore();
    if (tabStore.has(to.meta.locale ?? '')) {
      tabStore.set(to.meta.locale!);
      next();
      return;
    }
    tabStore.add({ name: to.meta.locale!, link: to.fullPath });
    tabStore.set(to.meta.locale!);
    next();
  });
};
