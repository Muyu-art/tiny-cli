import { computed, ref } from 'vue';
import i18n from '@/locale';
import locale from '@opentiny/vue-locale';

export default function useLocale(that?: any) {
  const currentLocale = computed(() => {
    return i18n.locale;
  });
  const changeLocale = (value: string) => {
    i18n.locale = value;
    localStorage.setItem('tiny-locale', value);
  };
  return {
    currentLocale,
    changeLocale,
  };
}
