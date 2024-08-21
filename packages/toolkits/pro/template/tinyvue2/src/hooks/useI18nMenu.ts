import type { ITreeNodeData } from '@/router/guard/menu';
import type { Composer } from 'vue-i18n-composable';

export const useI18nMenu = (data: ITreeNodeData[], t: Composer['t']) => {
  const menus: ITreeNodeData[] = [...data];
  const dfs = (menu: ITreeNodeData) => {
    menu.label = t(menu.locale).toString();
    for (const item of menu.children ?? []) {
      dfs(item);
    }
  };
  for (const menu of data) {
    dfs(menu);
  }
  return menus;
};
