import { getAllLang, type Lang } from '@/api/lang';
import {
  type CreateLocalReturn,
  getLocalTable,
  type I18Table,
  type Local,
} from '@/api/local';
import { defineStore } from 'pinia';

export const useLocales = defineStore('locals', {
  state: () => ({
    shouldFetch: true,
    locales: [] as Local[],
    lang: [] as Lang[],
    localTable: {} as I18Table,
    shouldMerge: true,
  }),
  actions: {
    async fetchLocalTable(lang?: string) {
      return getLocalTable(lang).then(({ data }) => {
        this.localTable = data;
      });
    },
    async fetchLang() {
      return getAllLang().then(({ data }) => {
        this.lang = data;
      });
    },
    pushLang(lang: Lang) {
      this.lang.push(lang);
    },
    pushLocale(data: CreateLocalReturn) {
      this.locales.push(data);
    },
  },
});
