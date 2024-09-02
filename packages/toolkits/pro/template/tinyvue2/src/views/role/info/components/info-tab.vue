<template>
  <div>
    <div class="tiny-fullscreen-scroll">
      <div class="tiny-fullscreen-wrapper">
        <div class="role-add-btn">
          <tiny-button
            v-permission="'role::add'"
            type="primary"
            @click="handleAddRole"
            >{{ $t('roleInfo.modal.title.add') }}</tiny-button
          >
        </div>
        <div class="table">
          <tiny-grid
            ref="expandGrid"
            :data="state.tableData"
            :auto-resize="true"
          >
            <tiny-grid-column type="index" width="60"></tiny-grid-column>
            <tiny-grid-column type="expand">
              <template #default="data">
                <permission-table :permission="data.row.permission" />
              </template>
            </tiny-grid-column>
            <tiny-grid-column field="name" :title="$t('roleInfo.table.id')">
              <template #default="data">
                <span>{{ $t(`${data.row.id}`) }}</span>
              </template>
            </tiny-grid-column>
            <tiny-grid-column field="time" :title="$t('roleInfo.table.name')">
              <template #default="data">
                <span>{{ $t(`${data.row.name}`) }}</span>
              </template>
            </tiny-grid-column>
            <tiny-grid-column field="type" :title="$t('roleInfo.table.desc')">
              <template #default="data">
                <div v-for="item in data.row.permission" :key="item.id">
                  <span>{{ $t(`${item.name}`) }}&nbsp;</span>
                </div>
              </template>
            </tiny-grid-column>
            <tiny-grid-column field="type" :title="$t('roleInfo.table.menu')">
              <template #default="data">
                <a
                  v-permission="'menu::update'"
                  @click="onMenuUpdate(data.row.menuTree, data.row.id)"
                >
                  绑定目录
                </a>
                <!-- {{ Object.keys(data.row.menuTree[0]).join(',') }} -->
                <!-- <tiny-tree :data="data.row.menuTree" :indent="18"></tiny-tree> -->
              </template>
            </tiny-grid-column>
            <tiny-grid-column
              :title="$t('roleInfo.table.operations')"
              align="center"
            >
              <template v-slot="data">
                <a
                  class="operation-update"
                  v-permission="'role::update'"
                  @click="handleUpdate(data.row.id)"
                >
                  {{ $t('roleInfo.table.operations.update') }}
                </a>
                <a
                  class="operation-delete"
                  v-permission="'role::remove'"
                  @click="handleDelete(data.row.id)"
                >
                  {{ $t('roleInfo.table.operations.delete') }}
                </a>
              </template>
            </tiny-grid-column>
          </tiny-grid>
        </div>
      </div>
    </div>
    <menu-drawer
      v-loading="loading"
      :visible="open"
      :menus="i18MenuDatas"
      :selected-id="selectedId"
      @close="onMenuDrawerClose"
      @confirm="onConfirm"
      v-if="open"
    />
    <div v-if="state.isRoleUpdate">
      <tiny-modal
        v-model="state.isRoleUpdate"
        :lock-scroll="true"
        show-header
        show-footer
        :mask-closable="true"
        height="auto"
        width="600"
        :title="$t('roleInfo.modal.title.update')"
      >
        <template #default>
          <tiny-layout>
            <tiny-form
              :model="state.roleUpdData"
              :rules="rules"
              label-width="150px"
              :label-align="true"
              label-position="left"
              size="small"
            >
              <tiny-row :flex="true">
                <tiny-col :span="10" label-width="100px">
                  <tiny-form-item :label="$t('roleInfo.modal.input.id')">
                    <label>{{ state.roleUpdData.id }}</label>
                  </tiny-form-item>
                </tiny-col>
              </tiny-row>
              <tiny-row :flex="true">
                <tiny-col :span="10" label-width="100px">
                  <tiny-form-item
                    :label="$t('roleInfo.modal.input.name')"
                    prop="name"
                  >
                    <tiny-input v-model="state.roleUpdData.name"></tiny-input>
                  </tiny-form-item>
                </tiny-col>
              </tiny-row>

              <tiny-row :flex="true">
                <tiny-col :span="10" label-width="100px">
                  <tiny-form-item
                    :label="$t('roleInfo.modal.input.desc')"
                    prop="desc"
                  >
                    <tiny-base-select
                      v-model="state.roleUpdData.desc"
                      :placeholder="$t('baseForm.form.label.placeholder')"
                      multiple
                    >
                      <tiny-option
                        v-for="item in state.permissionData"
                        :key="item.id"
                        :label="$t(item.name)"
                        :value="item.id"
                      ></tiny-option>
                    </tiny-base-select>
                  </tiny-form-item>
                </tiny-col>
              </tiny-row>
            </tiny-form>
          </tiny-layout>
        </template>
        <template #footer>
          <tiny-button type="primary" @click="handleRoleUpdateSubmit">{{
            $t('menu.btn.confirm')
          }}</tiny-button>
          <tiny-button @click="handleRoleUpdateCancel">{{
            $t('menu.btn.cancel')
          }}</tiny-button>
        </template>
      </tiny-modal>
    </div>
    <div v-if="state.isRoleAdd">
      <tiny-modal
        v-model="state.isRoleAdd"
        :lock-scroll="true"
        show-header
        show-footer
        :mask-closable="true"
        height="auto"
        width="600"
        :title="$t('roleInfo.modal.title.add')"
      >
        <template #default>
          <tiny-layout>
            <tiny-form
              :model="state.roleAddData"
              :rules="rules"
              label-width="150px"
              :label-align="true"
              label-position="left"
              size="small"
            >
              <tiny-row :flex="true">
                <tiny-col :span="10" label-width="100px">
                  <tiny-form-item
                    :label="$t('roleInfo.modal.input.name')"
                    prop="name"
                  >
                    <tiny-input v-model="state.roleAddData.name"></tiny-input>
                  </tiny-form-item>
                </tiny-col>
              </tiny-row>

              <tiny-row :flex="true">
                <tiny-col :span="10" label-width="100px">
                  <tiny-form-item
                    :label="$t('roleInfo.modal.input.desc')"
                    prop="desc"
                  >
                    <tiny-base-select
                      v-model="state.roleAddData.desc"
                      :placeholder="$t('baseForm.form.label.placeholder')"
                      multiple
                    >
                      <tiny-option
                        v-for="item in state.permissionData"
                        :key="item.id"
                        :label="$t(item.name)"
                        :value="item.id"
                      ></tiny-option>
                    </tiny-base-select>
                  </tiny-form-item>
                </tiny-col>
              </tiny-row>
            </tiny-form>
          </tiny-layout>
        </template>
        <template #footer>
          <tiny-button type="primary" @click="handleRoleAddSubmit">{{
            $t('menu.btn.confirm')
          }}</tiny-button>
          <tiny-button @click="handleRoleAddCancel">{{
            $t('menu.btn.cancel')
          }}</tiny-button>
        </template>
      </tiny-modal>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  ref,
  reactive,
  onMounted,
  computed,
  watch,
  onUnmounted,
  inject,
} from 'vue';
import {
  Tabs as TinyTabs,
  TabItem as TinyTabItem,
  Loading,
  GridColumn as TinyGridColumn,
  Grid as TinyGrid,
  Pager as TinyPager,
  Modal as TinyModal,
  Button as TinyButton,
  Form as TinyForm,
  FormItem as TinyFormItem,
  Row as TinyRow,
  Col as TinyCol,
  Input as TinyInput,
  Modal,
  BaseSelect as TinyBaseSelect,
  Select as TinySelect,
  Option as TinyOption,
  Tree as TinyTree,
  TinyLoading,
  Layout as TinyLayout,
} from '@opentiny/vue';
import { useUserStore } from '@/stores';
import {
  getAllRoleDetail,
  updateRole,
  createRole,
  deleteRole,
  getRoleInfo,
} from '@/api/role';
import { getAllPermission } from '@/api/permission';
import { getAllMenu } from '@/api/menu';
import { useRouter } from '@/router';
import { getSimpleDate } from '@/utils/time';
import { updateUserInfo } from '@/api/user';
import { useI18n } from 'vue-i18n-composable';
import permissionTable from './permission-table.vue';
import menuDrawer from './menu-drawer.vue';
import type { ITreeNodeData } from '@/router/guard/menu';
import { toRoutes } from '@/router/guard/menu';
import { useDisclosure } from '@/hooks/useDisclosure';
import { useI18nMenu } from '@/hooks/useI18nMenu';
import { useLoading } from '@/hooks';
import { useMenuId } from '@/hooks/useMenuId';
import type { Role } from '@/stores/user';
import constant from '@/router/constant';
import { useMenuStore } from '@/stores/modules/router';
import { useTabStore } from '@/stores';

const router = useRouter();
const { t } = useI18n();
const { reloadMenu } = inject<{ reloadMenu: () => void }>('RELOAD');
const menuStore = useMenuStore();
const tabStore = useTabStore();

// 加载效果
const state = reactive<{
  tableData: any;
  permissionData: any;
  menuData: any;
  menuOptionData: any;
  roleUpdData: any;
  roleAddData: any;
  isRoleUpdate: boolean;
  isRoleAdd: boolean;
}>({
  tableData: [] as any,
  permissionData: [] as any,
  menuData: {} as any,
  menuOptionData: {} as any,
  roleUpdData: {} as any,
  roleAddData: {} as any,
  isRoleAdd: false,
  isRoleUpdate: false,
});

const userStore = useUserStore();
const tableData = ref<(Role & { menus: ITreeNodeData[] })[]>([]);
const menus = ref<ITreeNodeData[]>([]);
const vLoading = TinyLoading.directive;
const { loading, setLoading } = useLoading();
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
    name: [rulesType],
    desc: [rulesSelect],
    menu: [rulesSelect],
  };
});
const { open, onClose, onOpen } = useDisclosure();
const menuDatas = ref<ITreeNodeData[]>([]);
const selectedId = ref<number[]>([]);
const i18MenuDatas = computed(() => useI18nMenu(menus.value, t));
const roleId = ref(-1);

const stop = watch(
  menuDatas,
  () => {
    selectedId.value = useMenuId(menuDatas.value);
  },
  {
    immediate: true,
  }
);

setLoading(true);
getAllMenu()
  .then((res) => {
    menus.value = res.data;
  })
  .finally(() => {
    setLoading(false);
  });

// 初始化请求数据
onMounted(() => {
  fetchRoleData();
  fetchPermissionData();
  fetchMenuData();
});

const onMenuDrawerClose = () => {
  onClose();
};

const onMenuUpdate = (data: ITreeNodeData[], roldId: number) => {
  menuDatas.value = data;
  roleId.value = roldId;
  onOpen();
};

const flushRouter = async () => {
  router.getRoutes().forEach((route) => router.remove(route));
  constant.forEach((staticRoute) => router.addRoute(staticRoute));
  await menuStore.getMenuList();
  const routes = toRoutes(menuStore.menuList);
  routes.forEach((route) => {
    router.addRoute('root', route);
  });
};
const flushTabs = () => {
  const routePaths = router.getRoutes().map((routeItem) => routeItem.path);
  const removeTabs = tabStore.data.filter(
    ({ link }) => !routePaths.includes(link)
  );
  removeTabs.forEach(({ link }) => tabStore.delByLink(link));
};

const onConfirm = (ids: number[]) => {
  updateRole({
    id: roleId.value,
    menuIds: ids,
  })
    .then(({ data }) => {
      selectedId.value = ids;
      const itemIdx = tableData.value.findIndex(
        (item) => item.id === roleId.value
      );
      tableData.value.splice(itemIdx, 1, {
        ...tableData.value[itemIdx],
        menus: data.menus,
      });
      return flushRouter();
    })
    .then(() => {
      flushTabs();
      reloadMenu();
    })
    .finally(() => {
      open.value = false;
    });
};

// 请求数据接口方法
async function fetchRoleData() {
  const { data } = await getAllRoleDetail();
  for (let i = 0; i < data.roleInfo.length; i += 1) {
    data.roleInfo[i].menuTree = data.menuTree[i];
  }
  state.tableData = data.roleInfo;
}

async function fetchPermissionData() {
  const { data } = await getAllPermission();
  state.permissionData = data;
}

async function fetchMenuData() {
  const { data } = await getAllMenu();
  state.menuData = data;
}

async function handleDelete(id: string) {
  try {
    await deleteRole(id);
    TinyModal.message({
      message: t('message.delete.success'),
      status: 'success',
    });
    state.isRoleUpdate = false;
    state.roleUpdData = {} as any;
    await fetchRoleData();
  } catch (error) {
    if (error.response && error.response.data) {
      const errorMessage = error.response.data.message || '未知错误';
      Modal.message({
        message: errorMessage,
        status: 'error',
      });
    }
  }
}

async function convertMenu(data: any) {
  const menu = [] as any;
  for (let j = 0; j < data.menus.length; j += 1) {
    menu.push(data.menus[j].id);
    if (data.menus[j].children !== null) {
      convertMenu(data.menus[j].children);
    }
  }
  return menu;
}

const handleUpdate = (id: string) => {
  state.isRoleUpdate = true;
  const data = state.tableData[id - 1];
  const permission = [] as any;
  for (let i = 0; i < data.permission.length; i += 1) {
    permission.push(data.permission[i].id);
  }
  const menu = [] as any;
  for (let j = 0; j < data.menus.length; j += 1) {
    menu.push(data.menus[j].id);
  }
  state.roleUpdData = {
    id: data.id,
    name: data.name,
    menus: menu,
    desc: permission,
  };
  state.menuOptionData = ref({
    data: state.menuData,
  });
};

const handleRoleUpdateCancel = () => {
  state.isRoleUpdate = false;
  state.roleUpdData = {} as any;
};

async function handleRoleUpdateSubmit() {
  const dataTmp = state.roleUpdData;
  const newTemp = {
    id: dataTmp.id,
    name: dataTmp.name,
    permissionIds: dataTmp.desc,
    menuIds: dataTmp.menus,
  };
  try {
    await updateRole(newTemp);
    Modal.message({
      message: t('baseForm.form.submit.success'),
      status: 'success',
    });
    state.isRoleUpdate = false;
    state.roleUpdData = {} as any;
    await fetchRoleData();
    const { userInfo } = userStore;
    if (userInfo.role[0].id === dataTmp.id) {
      const { data } = await getRoleInfo(userInfo.role[0].id);
      userInfo.rolePermission = data.permission.map(
        (permission) => permission.name
      );
      userStore.setInfo(userInfo);
    }
  } catch (error) {
    if (error.response && error.response.data) {
      const errorMessage = error.response.data.message || '未知错误';
      Modal.message({
        message: errorMessage,
        status: 'error',
      });
    }
  }
}

function handleAddRole() {
  state.isRoleAdd = true;
  state.menuOptionData = ref({
    data: state.menuData,
  });
}

async function handleRoleAddSubmit() {
  const data = state.roleAddData;
  const newTemp = {
    name: data.name,
    permissionIds: data.desc,
    menuIds: data.menus,
  };
  try {
    await createRole(newTemp);
    Modal.message({
      message: t('baseForm.form.submit.success'),
      status: 'success',
    });
    state.isRoleAdd = false;
    state.roleAddData = {} as any;
    await fetchRoleData();
  } catch (error) {
    if (error.response && error.response.data) {
      const errorMessage = error.response.data.message || '未知错误';
      Modal.message({
        message: errorMessage,
        status: 'error',
      });
    }
  }
}

async function handleRoleAddCancel() {
  state.isRoleAdd = false;
  state.roleAddData = {} as any;
}

onUnmounted(() => {
  stop();
});
</script>

<style scoped lang="less">
#contain {
  height: 100%;
  padding: 15px;
  overflow: hidden;
}

.role-add-btn {
  padding: 10px 0 10px 10px;
}

.table {
  padding-bottom: 20px;
  background-color: #fff;
}

.operation {
  &-delete {
    padding-right: 5px;
    color: red;
  }

  &-update {
    padding-right: 5px;
    color: #1890ff;
  }

  &-pwd-update {
    color: orange;
  }
}
</style>
