import { getCurrentInstance, ref, watch } from 'vue';
import { use } from '@opentiny/vue-locale';
import {} from 'vue-i18n/';

export const useCurrentLocal = () => {
  const locale = ref(localStorage.getItem('tiny-locale'));
  watch(
    () => localStorage.getItem('tiny-locale'),
    () => {
      locale.value = localStorage.getItem('tiny-locale');
    },
    { deep: true, immediate: true }
  );
  return locale;
};

export const t = (key: string) => getCurrentInstance()?.proxy.$t(key);
const events: Record<string, ((...args: any[]) => void)[]> = {};
export default function useLocale(that?: any) {
  const currentLocale = ref(
    that?.$i18n?.locale ?? localStorage.getItem('tiny-locale')
  );
  const changeLocale = (lang: string) => {
    that.$i18n.locale = lang;
    use(lang);
    currentLocale.value = lang;
    localStorage.setItem('tiny-locale', lang);
    events['onLocalUpdate']?.forEach?.((f) => f(lang));
  };
  const on = (name: string, f: (...args: any[]) => void) => {
    if (!events[name]) {
      events[name] = [f];
    } else {
      events[name].push(f);
    }
  };
  return {
    currentLocale,
    changeLocale,
    on,
  };
}
