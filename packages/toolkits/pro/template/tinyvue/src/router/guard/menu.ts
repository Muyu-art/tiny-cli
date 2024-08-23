import { useMenuStore } from '@/store/modules/router';
import { nextTick } from 'vue';
import { Router, RouteRecordRaw } from 'vue-router';
import Demo from '@/views/menu/demo/index.vue';

export interface ITreeNodeData {
  // node-key='id' 设置节点的唯一标识
  id: number | string;
  // 节点显示文本
  label: string;
  // 子节点
  children?: ITreeNodeData[];
  // 链接
  url: string;
  // 组件
  component: string;
  // 图标
  customIcon: string;
  // 类型
  menuType: string;
  // 父节点
  parentId: number;
  // 排序
  order: number;
  // 国际化
  locale: string;
}
const reg = /\.vue$/gim;
let views = {} as any;
if (BUILD_TOOLS === 'VITE' || BUILD_TOOLS === 'WEBPACK') {
  views = import.meta.glob('../../views/**/*.vue');
} else if (BUILD_TOOLS === 'RSPACK') {
  const components = require.context('../../views', true, reg, 'sync');
  components.keys().forEach((path) => {
    if (path.endsWith('.vue')) {
      views[`../../views/${path.replace('./', '')}`] = components(path).default;
    }
  });
}
const toRoutes = (menus: ITreeNodeData[]) => {
  const router: RouteRecordRaw[] = [];
  for (let i = 0; i < menus.length; i += 1) {
    const menu = menus[i];
    const path = `../../views/${menu.component}${menu.component.includes('.vue') ? '' : '.vue'}`;
    if (!views[path]) {
      router.push({
        name: menu.label,
        path: menu.url,
        component: Demo,
        children: [...toRoutes(menu.children ?? [])],
        meta: {
          locale: menu.locale,
          requiresAuth: true,
        },
      });
    } else {
      router.push({
        name: menu.label,
        path: menu.url,
        component: views[path],
        children: [...toRoutes(menu.children ?? [])],
        meta: {
          locale: menu.locale,
          requiresAuth: true,
        },
      });
    }
  }
  return router;
};

export const setupMenuGuard = (router: Router) => {
  router.beforeEach(async (to, from, next) => {
    if (to.name?.toString().toLowerCase() === 'login') {
      next();
      return;
    }
    await nextTick();
    const menuStore = useMenuStore();
    if (menuStore.menuList.length) {
      next();
      return;
    }
    const data = await menuStore.getMenuList();
    const routes = toRoutes(data);
    routes.forEach((route) => router.addRoute('root', route));
    next({ ...to, replace: true });
  });
};
