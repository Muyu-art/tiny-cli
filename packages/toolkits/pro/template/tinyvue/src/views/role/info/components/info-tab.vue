<script lang="ts" setup>
  import { useI18n } from 'vue-i18n';
  import { computed, inject, nextTick, ref, watch } from 'vue';
  import {
    Button as TinyButton,
    Loading as TinyLoading,
    Modal,
  } from '@opentiny/vue';
  import { Role } from '@/store/modules/user/types';
  import { createRole, getAllRoleDetail, updateRole } from '@/api/role';
  import { useDisclosure } from '@/hooks/useDisclosure';
  import useLoading from '@/hooks/loading';
  import { getAllMenu, getRoleMenu } from '@/api/menu';
  import { ITreeNodeData, toRoutes } from '@/router/guard/menu';
  import { useI18nMenu } from '@/hooks/useI18nMenu';
  import { useMenuId } from '@/hooks/useMenuId';
  import { useRouter } from 'vue-router';
  import constant from '@/router/constant';
  import { useMenuStore } from '@/store/modules/router';
  import { getAllPermission, Permission } from '@/api/permission';
  import { useTabStore } from '@/store';
  import roleTable from './role-table.vue';
  import menuDrawer from './menu-drawer.vue';
  import addRole, { RoleAddData } from './add-role.vue';
  import UpdateRole, { UpdateRoleData } from './update-role.vue';

  const { t } = useI18n();
  const tableData = ref<(Role & { menus: ITreeNodeData[] })[]>([]);
  const menuDatas = ref<ITreeNodeData[]>([]);
  const menus = ref<ITreeNodeData[]>([]);
  const { open, onOpen, onClose } = useDisclosure();
  const {
    open: addModalVisible,
    onOpen: onAdd,
    onClose: onAddHide,
  } = useDisclosure();
  const {
    open: updateRoleVisible,
    onOpen: showUpdateRole,
    onClose: hideUpdateRole,
  } = useDisclosure();
  const { loading, setLoading } = useLoading();
  const i18MenuDatas = computed(() => useI18nMenu(menus.value, t));
  const selectedId = ref<number[]>([]);
  const router = useRouter();
  const menuStore = useMenuStore();
  const tabStore = useTabStore();
  const roleId = ref(-1);
  const permissions = ref<Permission[]>([]);
  const vLoading = TinyLoading.directive;
  const activeRole = ref<UpdateRoleData | null>(null);

  const { reloadMenu } = inject<{ reloadMenu: () => void }>('RELOAD');

  // const stop = watch(
  //   menuDatas,
  //   () => {
  //     selectedId.value = useMenuId(menuDatas.value);
  //   },
  //   {
  //     immediate: true,
  //   },
  // );
  const reloadGrid = ref(false);
  setLoading(true);
  getAllMenu()
    .then((res) => {
      menus.value = res.data;
    })
    .finally(() => {
      setLoading(false);
    });
  getAllPermission().then(({ data }) => {
    permissions.value = data;
  });
  getAllRoleDetail().then(({ data }) => {
    tableData.value = data.roleInfo;
  });
  const onMenuDrawerClose = () => {
    onClose();
  };
  const onMenuUpdate = (menuTree: ITreeNodeData[], id: number, row) => {
    // menuDatas.value = menuTree;
    roleId.value = id;
    selectedId.value = useMenuId(row.menus);
    onOpen();
  };
  const flushRouter = async () => {
    router.clearRoutes();
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
      ({ link }) => !routePaths.includes(link),
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
          (item) => item.id === roleId.value,
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
        // reloadGrid.value = true;
        // nextTick(()=>{
        //   reloadGrid.value = false;
        // })
      })
      .finally(() => {
        open.value = false;
      });
  };
  const onAddRole = (role: RoleAddData) => {
    createRole(role)
      .then(({ data }) => {
        Modal.message({
          message: t('baseForm.form.submit.success'),
          status: 'success',
        });
        tableData.value.push({
          id: data.id,
          permission: data.permission.map((p) => p.name),
          menus: [],
          name: data.name,
        });
      })
      .finally(() => {
        onAddHide();
      });
  };
  const onRoleUpdate = (row: Role) => {
    activeRole.value = {
      id: row.id,
      name: row.name,
      permissionIds: row.permission.map((permission) => permission.id),
    };
    showUpdateRole();
  };
  const onRoleUpdateSuccess = (role: UpdateRoleData) => {
    const idx = tableData.value.findIndex((data) => data.id === role.id);
    if (idx === -1) {
      return;
    }
    const data = tableData.value[idx];
    tableData.value.splice(idx, 1, {
      ...data,
      ...role,
    });
  };
</script>

<template>
  <div>
    <div class="tiny-fullscreen-scroll">
      <div class="tiny-full-screen-wrapper">
        <div class="role-add-btn">
          <tiny-button v-permission="'role::add'" type="primary" @click="onAdd">
            {{ $t('roleInfo.modal.title.add') }}
          </tiny-button>
        </div>
        <div class="table">
          <role-table
            :table-data="tableData"
            @menu-update="onMenuUpdate"
            @role-update="onRoleUpdate"
          />
        </div>
      </div>
    </div>
    <menu-drawer
      v-if="open"
      v-loading="loading"
      :visible="open"
      :menus="i18MenuDatas"
      :selected-id="selectedId"
      @close="onMenuDrawerClose"
      @confirm="onConfirm"
    />
    <add-role
      :visible="addModalVisible"
      :permissions="permissions"
      @hide="onAddHide"
      @confirm="onAddRole"
      @cancel="onAddHide"
    />
    <update-role
      :visible="updateRoleVisible"
      :permissions="permissions"
      :data="activeRole"
      @close="hideUpdateRole"
      @confirm="onRoleUpdateSuccess"
    />
  </div>
</template>

<style scoped lang="less">
  #contain {
    height: 100%;
    padding: 16px;
    overflow: hidden;
  }

  .role-add-btn {
    padding: 10px 0 10px 10px;
  }

  .table {
    padding-bottom: 20px;
    background-color: #fff;
  }
</style>
