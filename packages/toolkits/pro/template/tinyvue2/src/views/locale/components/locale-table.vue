<template>
  <tiny-grid
    ref="grid"
    :pager="pagerConfig"
    :fetch-data="fetchData"
    :edit-config="{ trigger: 'click', mode: 'cell', showStatus: true }"
    :loading="loading"
    @edit-closed="onEditClosed"
  >
    <tiny-grid-column field="id" title="id" width="60"></tiny-grid-column>
    <tiny-grid-column
      field="key"
      title="key"
      :editor="{ component: 'input', autoselect: true }"
    ></tiny-grid-column>
    <tiny-grid-column
      field="content"
      title="content"
      :editor="{ component: 'input' }"
    ></tiny-grid-column>
    <tiny-grid-column
      field="lang"
      title="lang"
      :editor="{ component: 'select', options }"
    ></tiny-grid-column>
    <tiny-grid-column>
      <template #default="data">
        <tiny-button @click="removeLocale(data.row)">
          {{ $t('locale.remove') }}
        </tiny-button>
      </template>
    </tiny-grid-column>
  </tiny-grid>
</template>

<script lang="ts" setup>
import { getAllLocalItems, patchLocal, deleteLocale } from '@/api/local';
import useLoading from '@/hooks/loading';
import { useLocales } from '@/stores/modules/locales';
import {
  Notify,
  Grid as TinyGrid,
  GridColumn as TinyGridColumn,
  Button as TinyButton,
} from '@opentiny/vue';
import { computed, ref } from 'vue';

export type LocalTableData = {
  id: number;
  key: string;
  content: string;
  lang: string;
};

const pagerConfig = ref({
  attrs: {
    currentPage: 1,
    pageSize: 5,
    pageSizes: Array.from({ length: 20 }).map((cur, index) => (index + 1) * 5),
    total: 0,
    align: 'right',
    layout: 'total, prev, pager, next, jumper, sizes',
  },
});

const grid = ref();
const items = ref<LocalTableData[]>([]);
const localeStore = useLocales();
const options = computed(() =>
  localeStore.lang.map((language) => ({
    label: language.name,
    value: language.name,
  }))
);
const { loading, setLoading } = useLoading();
if (!localeStore.lang.length) {
  localeStore.fetchLang();
}

let currentPage = 0;
const getData = ({
  page,
}: {
  page: { pageSize: number; currentPage: number };
}) => {
  const { pageSize } = page;
  currentPage = page.currentPage;
  setLoading(true);
  return new Promise((resolve) => {
    getAllLocalItems(currentPage, pageSize, 0)
      .then(({ data }) => {
        if (items.value.length !== data.meta.totalItems) {
          items.value = Array.from({ length: data.meta.totalItems }).fill({});
        }
        const offset = (currentPage - 1) * pageSize;
        const l = offset;
        const h = offset + pageSize;
        for (let i = 0; i < data.items.length; i += 1) {
          const item = data.items[i];
          items.value[l + i] = {
            id: item.id,
            key: item.key,
            content: item.content,
            lang: item.lang.name,
          };
        }
        resolve({
          result: items.value.slice(offset, offset + pageSize),
          page: {
            total: data.meta.totalItems,
          },
        });
      })
      .finally(() => {
        setLoading(false);
      });
  });
};
const onEditClosed = ({ row }: { row: Record<string, any> }) => {
  if (grid.value.hasRowChange(row)) {
    const langId = localeStore.lang.filter((lang) => lang.name === row.lang)[0]
      .id;
    patchLocal(row.id, {
      content: row.content,
      key: row.key,
      lang: langId,
    })
      .then(() => {
        Notify({
          type: 'info',
          message: '更新成功',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }
};
const removeLocale = (row: any) => {
  setLoading(true);
  grid.value
    .remove(row)
    .then(() => {
      localeStore.$patch({
        locales: localeStore.locales.filter((locale) => locale.id !== row.id),
      });
      items.value = items.value.filter((item) => item.id !== row.id);
      return deleteLocale(row.id);
    })
    .catch(() => {
      grid.value.revertData(row);
    })
    .finally(() => {
      setLoading(false);
    });
};

const fetchData = ref({
  api: getData,
});
</script>
