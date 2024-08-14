import { computed, ref } from 'vue';
import { i18n } from '@/locale';
import initI18 from '@/locale';

export default function useLocale(that?: any) {
  const currentLocale = computed(() => {
    return i18n.locale;
  });
  const changeLocale = (value: string) => {
    i18n.locale = value;
    initI18({ locale: value });
    localStorage.setItem('tiny-locale', value);
  };
  return {
    currentLocale,
    changeLocale,
  };
}
