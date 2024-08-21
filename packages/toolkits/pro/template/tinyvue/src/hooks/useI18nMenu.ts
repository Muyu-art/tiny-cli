import type { ITreeNodeData } from '@/router/guard/menu';

export const useI18nMenu = (
  data: ITreeNodeData[],
  t: (key: string) => string,
) => {
  const menus: ITreeNodeData[] = [...data];
  const dfs = (menu: ITreeNodeData) => {
    menu.label = t(menu.locale).toString();
    for (let i = 0; i < menu.children.length; i += 1) {
      const item = menu.children[i];
      dfs(item);
    }
  };
  for (let i = 0; i < data.length; i += 1) {
    const menu = data[i];
    dfs(menu);
  }
  return menus;
};
