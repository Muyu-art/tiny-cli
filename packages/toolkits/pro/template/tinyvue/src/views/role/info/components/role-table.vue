<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { Role } from '@/store/modules/user/types';
  import {
    Grid as TinyGrid,
    GridColumn as TinyGridColumn,
    Modal,
  } from '@opentiny/vue';
  import { deleteRole } from '@/api/role';
  import { ITreeNodeData } from '@/router/guard/menu';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import permissionTable from './permission-table.vue';

  const props = defineProps<{
    tableData: (Role & { menus: ITreeNodeData[] })[];
  }>();

  const emits = defineEmits<{
    menuUpdate: [ITreeNodeData[], number, Role];
    roleUpdate: [Role];
  }>();

  const { t } = useI18n();
  const grid = ref();
  const { loading, setLoading } = useLoading();

  const onMenuUpdate = (data: ITreeNodeData[], roldId: number, role: Role) => {
    emits('menuUpdate', data, roldId, role);
  };
  const onRoleUpdate = (row: Role) => {
    emits('roleUpdate', row);
  };
  const onRoleDelete = (id: number, row) => {
    setLoading(true);
    deleteRole(id)
      .then(() => {
        grid.value.remove(row);
      })
      .then(() => {
        Modal.message({
          message: t('message.delete.success'),
          status: 'success',
        });
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          const errorMessage = error.response.data.message || '未知错误';
          Modal.message({
            message: errorMessage,
            status: 'error',
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  watch(
    props,
    () => {
      grid.value.loadData(props.tableData);
    },
    { deep: true },
  );
</script>

<template>
  <tiny-grid ref="grid" :data="props.tableData" auto-resize :loading="loading">
    <tiny-grid-column type="expand">
      <template #default="data">
        <permission-table :permission="data.row.permission" />
      </template>
    </tiny-grid-column>
    <tiny-grid-column
      field="id"
      :title="$t('roleInfo.table.id')"
    ></tiny-grid-column>
    <tiny-grid-column
      field="name"
      :title="$t('roleInfo.table.name')"
    ></tiny-grid-column>
    <tiny-grid-column field="type" :title="$t('roleInfo.table.menu')">
      <template #default="data">
        <a
          v-permission="'menu::update'"
          @click="onMenuUpdate(data.row.menus, data.row.id, data.row)"
        >
          {{ $t('roleInfo.table.bind') }}
        </a>
      </template>
    </tiny-grid-column>
    <tiny-grid-column :title="$t('roleInfo.table.operations')" align="center">
      <template #default="data">
        <a
          v-permission="'role::update'"
          class="operation-update"
          @click="onRoleUpdate(data.row)"
        >
          {{ $t('roleInfo.table.operations.update') }}
        </a>
        <a
          v-permission="'role::remove'"
          class="operation-delete"
          @click="onRoleDelete(data.row.id, data.row)"
        >
          {{ $t('roleInfo.table.operations.delete') }}
        </a>
      </template>
    </tiny-grid-column>
  </tiny-grid>
</template>

<style lang="less" scoped>
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
