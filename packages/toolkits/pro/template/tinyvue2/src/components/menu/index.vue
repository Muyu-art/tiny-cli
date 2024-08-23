<template>
  <div class="menu-router">
    <tiny-tree-menu
      ref="tree"
      :data="MenuData"
      :show-filter="false"
      node-key="id"
      wrap
      :default-expanded-keys="expandeArr"
      @current-change="currentChange"
    >
      <template #default="slotScope">
        <div v-for="(item, index) in routerTitle" :key="index">
          <span v-if="slotScope.label === item.label" class="menu-title">
            <component :is="item.customIcon"></component>
            <span>{{ $t(item.locale) }}</span>
          </span>
        </div>
      </template>
    </tiny-tree-menu>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, computed, reactive } from 'vue';
import { Tabs, TreeMenu as tinyTreeMenu } from '@opentiny/vue';
import { useMenuStore } from '@/stores/modules/router';
import router from '@/router';
import * as icons from '@opentiny/vue-icon';
import { useTabStore } from '@/stores/modules/tabs';

interface ITreeNodeData {
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

const menuStore = useMenuStore();
const rawMenuData = structuredClone(menuStore.menuList);

type SideMenuData = (ITreeNodeData & { meta: { url: string } })[];

const routerTitle = [] as any;

const filtter = (treeNodeDatas: ITreeNodeData[]) => {
  const menus: SideMenuData = [];
  for (let i = 0; i < treeNodeDatas.length; i += 1) {
    const treeNodeData = treeNodeDatas[i];
    const url = treeNodeData.url!;
    delete treeNodeData.url;
    const temp = {} as any;
    temp.label = treeNodeData.label;
    temp.locale = treeNodeData.locale;
    if (treeNodeData.customIcon) {
      temp.customIcon = icons[treeNodeData.customIcon]();
    }
    routerTitle.push(temp);
    menus.push({
      ...treeNodeData,
      meta: {
        url,
      },
      children: [...filtter(treeNodeData.children ?? [])],
    });
  }
  return menus;
};

const MenuData = ref<SideMenuData>(filtter(rawMenuData));
const tree = ref();
const expandeArr = ref<(string | number)[]>([]);
const tabStore = useTabStore();

const currentChange = (data: any, node) => {
  const filter = [];
  if (!node.isLeaf) {
    return;
  }
  router.replace({ name: data.label });
};

const findId = (name: string, path: string) => {
  const dfs = (item, url: string[]) => {
    if (url.join('/') === path) {
      return item.id;
    }
    const len = item.children.length ?? 0;
    for (let i = 0; i < len; i++) {
      if (item.children?.[i]) {
        const id = dfs(item.children[i], [...url, item.children[i].meta.url]);
        if (id !== undefined) {
          return id;
        }
      }
    }
    return undefined;
  };
  for (let i = 0; i < MenuData.value.length; i += 1) {
    const menu = MenuData.value[i];
    const data = dfs(menu, [
      import.meta.env.VITE_CONTEXT.replace(/\/$/, ''),
      menu.meta.url.endsWith('/')
        ? menu.meta.url.replace(/\/$/, '')
        : menu.meta.url,
    ]);
    if (data !== undefined) {
      return data;
    }
  }
  return -1;
};

/**
 * 监听路由变化高亮当前菜单
 */
onMounted(() => {
  watch(
    () => tabStore.current,
    () => {
      const key = findId(tabStore.current.name, tabStore.current.link);
      if (!expandeArr.value.includes(key)) {
        expandeArr.value.push(key);
      }
      tree.value.setCurrentKey(key);
    },
    { deep: true, immediate: true }
  );
});
</script>

<style scoped></style>
