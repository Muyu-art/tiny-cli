<template>
  <tiny-form :display-only="props.readonly" :rules="rules" :model="menuInfo">
    <tiny-form-item :label="$t('menuInfo.table.name')" prop="locale">
      <tiny-select
        v-model="menuInfo.locale"
        :placeholder="$t('baseForm.form.label.placeholder')"
        filterable
        no-match-text="No Match"
        :options="props.localeData"
        optimization
      >
      </tiny-select>
    </tiny-form-item>
    <tiny-form-item
      prop="oldLabel"
      :label="$t('menuInfo.table.id')"
      extra="修改菜单ID前, 请确保前端工程师知晓此事"
    >
      <tiny-input v-model="menuInfo.oldLabel" />
    </tiny-form-item>
    <tiny-form-item :label="$t('menuInfo.table.order')" prop="order">
      <tiny-input v-model="menuInfo.order"></tiny-input>
    </tiny-form-item>
    <tiny-form-item :label="$t('menuInfo.table.parentId')" prop="parentId">
      <tiny-select
        v-model="menuInfo.parentId"
        value-field="id"
        text-field="label"
        render-type="tree"
        :tree-op="treeOp"
        clearable
      >
      </tiny-select>
    </tiny-form-item>
    <tiny-form-item :label="$t('menuInfo.table.component')" prop="component">
      <tiny-input v-model="menuInfo.component"></tiny-input>
    </tiny-form-item>
    <tiny-form-item :label="$t('menuInfo.table.path')" prop="path">
      <tiny-input v-model="menuInfo.path"></tiny-input>
    </tiny-form-item>
  </tiny-form>
</template>

<script lang="ts" setup>
import {
  Button as TinyButton,
  Form as TinyForm,
  Row as TinyRow,
  Col as TinyCol,
  FormItem as TinyFormItem,
  Input as TinyInput,
  TreeSelect as TinyTreeSelect,
  Select as TinySelect,
} from '@opentiny/vue';
import type { ITreeNodeData } from '@/router/guard/menu';
import { computed, reactive, unref, watch } from 'vue';
import { useDeepClone } from '@/hooks/useDeepClone';

const props = defineProps<{
  node: ITreeNodeData;
  menus: ITreeNodeData[];
  localeData: { value: string; label: string }[];
  readonly: boolean;
}>();

// 校验规则
const rulesType = {
  required: true,
  trigger: 'blur',
};
const rulesSelect = {
  required: true,
  message: '必选',
  trigger: 'blur',
};
const rules = computed(() => {
  return {
    oldLabel: [rulesType],
    order: [rulesType],
    component: [rulesType],
    path: [rulesType],
    locale: [rulesSelect],
  };
});

const coverToTree = (data: ITreeNodeData[]) => {
  if (!data.length) {
    return undefined;
  }
  const menus = useDeepClone(data);
  const ret = [];
  for (let i = 0; i < menus.length; i += 1) {
    const menu = menus[i];
    ret.push({
      value: menu.id,
      label: menu.label,
      children: coverToTree(menu.children),
    });
  }
  return ret;
};

const treeOp = computed(() => ({ data: props.menus }));

const menuInfo = reactive<ITreeNodeData>({
  id: props.node.id,
  label: props.node.label,
  path: props.node.url,
  component: props.node.component,
  customIcon: props.node.customIcon,
  menuType: props.node.menuType,
  parentId: props.node.parentId,
  order: props.node.order,
  locale: props.node.locale,
  oldLabel: props.node.oldLabel,
});

const getMenuInfo = () => {
  return {
    ...unref(menuInfo),
    parentId:
      (menuInfo.parentId as string | number) === '' ||
      menuInfo.parentId === null
        ? null
        : menuInfo.parentId,
  } as ITreeNodeData;
};
defineExpose({
  getMenuInfo,
});
</script>

<style scoped>
:deep(.font-14-css) {
  font-size: 12px;
}
</style>
