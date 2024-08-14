import VueI18n from 'vue-i18n';
import locale from '@opentiny/vue-locale'; // tiny-vue的国际化
import en from './en-US';
import cn from './zh-CN';
import Vue from 'vue';

export const LOCALE_OPTIONS = [
  { label: '中文', value: 'zhCN' },
  { label: 'English', value: 'enUS' },
];

Vue.use(VueI18n);

let _i18n: VueI18n;

export const useI18n = () => _i18n;

const i18n = new VueI18n({
  locale: 'zhCN', // 设置初始语言
  messages: {
    enUS: en,
    zhCN: cn,
  },
});

export default i18n;
