import VueI18n from 'vue-i18n';
import en from './en-US';
import cn from './zh-CN';
import Vue from 'vue';
import { createI18n } from 'vue-i18n-composable';

export const LOCALE_OPTIONS = [
  { label: '中文', value: 'zhCN' },
  { label: 'English', value: 'enUS' },
];

Vue.use(VueI18n);

export let _i18n: VueI18n;

export const useI18n = () => _i18n;

export default ({ locale }: { locale: string }) => {
  _i18n = createI18n({
    locale,
    messages: {
      enUS: en,
      zhCN: cn,
    },
  });
  return _i18n;
};
