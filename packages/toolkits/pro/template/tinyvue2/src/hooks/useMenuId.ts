import type { ITreeNodeData } from '@/router/guard/menu';

export const useMenuId = (datas: ITreeNodeData[]) => {
  const ids: any[] = [];
  const dfs = (menu: ITreeNodeData) => {
    ids.push(menu.id);
    for (const child of menu.children ?? []) {
      dfs(child);
    }
  };
  for (const data of datas) {
    dfs(data);
  }
  return ids;
};
