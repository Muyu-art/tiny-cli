<script lang="ts" setup>
import { createMenu, deleteMenu, getAllMenu, updateMenu } from '@/api/menu';
import { useI18nMenu } from '@/hooks/useI18nMenu';
import type { ITreeNodeData } from '@/router/guard/menu';
import {
  Button as TinyButton,
  Modal as TinyModal,
  Loading,
} from '@opentiny/vue';
import { getAllLocalItems } from '@/api/local';
import type { Local } from '@/api/local';
import useLoading from '@/hooks/loading';
import { computed, onMounted, ref } from 'vue';
import type { ComponentInstance } from 'vue';
import { useI18n } from 'vue-i18n-composable';
import { useDeepClone } from '@/hooks/useDeepClone';
import { useMenuStore } from '@/stores/modules/router';
import { useRouter } from '@/router';
import menuTree from './menu-tree.vue';
import type { Node } from './menu-tree.vue';
import UpdateForm from './update-form.vue';
import AddMenu from './add-menu.vue';

const { t } = useI18n();
const vLoading = Loading.directive;
const rawMenuData = ref<ITreeNodeData[]>([]);
const localeData = ref<{ value: string; label: string }[]>([]);
const i18nMenuData = computed(() => useI18nMenu(rawMenuData.value, t));

const readonly = ref(false);
const updateModal = ref(false);
const DEFAULT_NODE = {
  id: '',
  label: '',
  url: '',
  component: '',
  customIcon: '',
  menuType: '',
  parentId: 0,
  order: 0,
  locale: '',
};
const activeNode = ref<ITreeNodeData>();
const form = ref<ComponentInstance<typeof UpdateForm>>();
const addMenu = ref<ComponentInstance<typeof AddMenu>>();
const { loading, setLoading } = useLoading(false);
const { loading: treeLoading, setLoading: setTreeLoading } = useLoading(true);
const { loading: addLoading, setLoading: setAddLoading } = useLoading();
const addModal = ref(false);
const router = useRouter();

const handleAddMenu = () => {
  addModal.value = true;
};
const onAddMenuClose = () => {
  addModal.value = false;
};
const onClickAdd = () => {
  const menuInfo = addMenu.value.getMenuInfo();
  setAddLoading(true);
  createMenu(menuInfo)
    .then(() => {
      TinyModal.message({
        message: t('baseForm.form.submit.success'),
        status: 'success',
      });
      return updateUserMenu();
    })
    .then(() => fetchMenu())
    .catch((error) => {
      console.log(error);
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.message || '未知错误';
        TinyModal.message({
          message: errorMessage,
          status: 'error',
        });
      }
    })
    .finally(() => {
      setAddLoading(false);
    });
};
const onClose = () => {
  activeNode.value = DEFAULT_NODE;
};
const onUpdate = ({ data }: Node) => {
  updateModal.value = true;
  activeNode.value = data;
  readonly.value = false;
};
const onCheck = ({ data }: Node) => {
  activeNode.value = data;
  updateModal.value = true;
  readonly.value = true;
};
const onCancel = () => {
  activeNode.value = DEFAULT_NODE;
  updateModal.value = false;
};
const onDelete = ({ data }: Node) => {
  setTreeLoading(true);
  const node = useDeepClone(data);
  if (node.parentId === null) {
    node.parentId = -1;
  }
  deleteMenu(Number(node.id.toString()), node.parentId)
    .then(() => {
      TinyModal.message({
        message: '已删除',
        status: 'success',
      });
      return fetchMenu();
    })
    .then(() => updateUserMenu())
    .catch((reason) => {
      const error = reason;
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.message || '未知错误';
        TinyModal.message({
          message: errorMessage,
          status: 'error',
        });
      }
    })
    .finally(() => {
      setTreeLoading(false);
    });
};
const onConfirm = () => {
  setLoading(true);
  const menuInfo = form.value.getMenuInfo();
  activeNode.value = {
    ...DEFAULT_NODE,
  };
  if (menuInfo.id === menuInfo.parentId) {
    TinyModal.message({
      message: t('menuInfo.modal.message.error'),
      status: 'error',
    });
    return;
  }
  updateMenu(menuInfo)
    .then(() => {
      TinyModal.message({
        message: t('baseForm.form.submit.success'),
        status: 'success',
      });
      setTreeLoading(true);
      return fetchMenu();
    })
    .then(() => updateUserMenu())
    .finally(() => {
      setLoading(false);
      setTreeLoading(false);
    });
  updateModal.value = false;
};
const fetchMenu = async () => {
  const { data } = await getAllMenu();
  rawMenuData.value = data;
};
const menuStore = useMenuStore();
const updateUserMenu = () => {
  menuStore.getMenuList();
};
const fetchLocalItems = () => {
  getAllLocalItems(1, 0, 1).then(({ data }) => {
    localeData.value = data.items.map((item) => {
      return {
        value: item.key,
        label: t(item.key),
      };
    });
  });
};

onMounted(() => {
  Promise.all([fetchMenu(), fetchLocalItems()]).finally(() => {
    treeLoading.value = false;
  });
});
</script>

<template>
  <div class="tiny-fullscreen-scroll">
    <div class="tiny-fullscreen-wrapper">
      <div class="menu-add-btn">
        <tiny-button
          v-permission="'menu::add'"
          type="primary"
          @click="handleAddMenu"
          >{{ $t('menuInfo.modal.title.add') }}</tiny-button
        >
      </div>
      <menu-tree
        v-loading="treeLoading"
        :data="i18nMenuData"
        @update="onUpdate"
        @check="onCheck"
        @delete="onDelete"
      />
      <tiny-modal v-model="addModal" show-footer @close="onAddMenuClose">
        <add-menu
          v-if="addModal"
          ref="addMenu"
          :menus="i18nMenuData"
          :locales="localeData"
        />
        <template #footer>
          <tiny-button
            type="primary"
            :loading="addLoading"
            @click="onClickAdd"
            >{{ $t('menu.btn.confirm') }}</tiny-button
          >
        </template>
      </tiny-modal>
      <tiny-modal v-model="updateModal" show-footer @close="onClose">
        <update-form
          v-if="updateModal"
          ref="form"
          :node="activeNode"
          :menus="i18nMenuData"
          :locale-data="localeData"
          :readonly="readonly"
        />

        <template #footer>
          <tiny-button
            v-if="!readonly"
            type="primary"
            :loading="loading"
            @click="onConfirm"
            >{{ $t('menu.btn.confirm') }}</tiny-button
          >
          <tiny-button v-if="!readonly" @click="onCancel">{{
            $t('menu.btn.cancel')
          }}</tiny-button>
        </template>
      </tiny-modal>
    </div>
  </div>
</template>

<style scoped lang="less">
#contain {
  height: 100%;
  padding: 15px;
  overflow: hidden;
}

.menu-add-btn {
  padding: 10px 0 10px 10px;
}

.table {
  padding-bottom: 20px;
  background-color: #fff;
}

.operation {
  &-delete {
    padding-right: 10px;
    color: red;
  }

  &-update {
    padding-right: 5px;
    color: #1890ff;
  }

  &-info {
    padding-right: 10px;
    color: orange;
  }
}
</style>
