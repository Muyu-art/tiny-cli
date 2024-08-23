<template>
  <div>
    <tiny-button show-footer @click="onOpen" type="primary">
      {{ $t('locale.add.btn') }}
    </tiny-button>
    <tiny-dialog-box v-model:visible="open" :title="$t('locale.add.title')">
      <tiny-form>
        <tiny-form-item :label="$t('locale.add.key')">
          <tiny-input v-model="locale.key" />
        </tiny-form-item>
        <tiny-form-item :label="$t('locale.add.content')">
          <tiny-input v-model="locale.content" />
        </tiny-form-item>
        <tiny-form-item :label="$t('locale.add.lang')">
          <tiny-select v-model="locale.lang">
            <tiny-option
              v-for="item of langes"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            />
          </tiny-select>
          <tiny-popover>
            <div>
              <tiny-form>
                <tiny-form-item :label="$t('lang.add.title')">
                  <tiny-input v-model="lang.name" />
                </tiny-form-item>
                <tiny-button v-permission="'lang::add'" @click="addLang">
                  {{ $t('lang.add.btn') }}
                </tiny-button>
              </tiny-form>
            </div>
            <template #reference>
              <tiny-button
                v-permission="'lang::add'"
                type="text"
                :text="$t('locale.add.lang.btn')"
              ></tiny-button>
              <tiny-button
                v-permission="'lang::query'"
                type="text"
                :text="$t('lang.manage.btn')"
                @click="setLangTableOpen"
              ></tiny-button>
            </template>
          </tiny-popover>
        </tiny-form-item>
      </tiny-form>
      <tiny-button
        type="text"
        :text="$t('locale.add.btn')"
        @click="addLocale"
      ></tiny-button>
    </tiny-dialog-box>
    <tiny-dialog-box
      v-model:visible="langTableOPen"
      :title="$t('lang.manage.title')"
      width="60%"
    >
      <lang-table />
    </tiny-dialog-box>
  </div>
</template>

<script lang="ts" setup>
import { createLang } from '@/api/lang';
import { type CreateLocal, createLocalItem } from '@/api/local';
import { useDisclosure } from '@/hooks/useDisclosure';
import { useLocales } from '@/stores/modules/locales';
import {
  Notify,
  Button as TinyButton,
  DialogBox as TinyDialogBox,
  Form as TinyForm,
  FormItem as TinyFormItem,
  Input as TinyInput,
  Select as TinySelect,
  Option as TinyOption,
  Popover as TinyPopover,
} from '@opentiny/vue';
import { computed, reactive } from 'vue';
import { useI18n } from 'vue-i18n-composable';
import langTable from './lang-table.vue';

const { open, onOpen, onClose } = useDisclosure();
const { open: langTableOPen, onOpen: setLangTableOpen } = useDisclosure();
const locales = useLocales();
const langes = computed(() => locales.lang);
const locale = reactive<CreateLocal>({
  key: '',
  content: '',
  lang: '' as any,
});
const lang = reactive({ name: '' });

const addLang = () => {
  createLang({ name: lang.name })
    .then(({ data }) => {
      locales.pushLang(data);
    })
    .catch((reason) => {
      Notify({
        type: 'error',
        message: reason.data.message,
      });
    })
    .finally(() => {
      lang.name = '';
      onClose();
    });
};

const i18 = useI18n();

const addLocale = () => {
  createLocalItem(locale)
    .then(({ data }) => {
      locale.key = '';
      locale.content = '';
      locale.lang = '' as any;
      locales.pushLocale(data);
      i18.mergeLocaleMessage(data.lang.name, {
        [data.key]: data.content,
      });
    })
    .catch((reason) => {
      Notify({
        type: 'error',
        message: reason.response.data.message[0],
      });
    })
    .finally(() => {
      onClose();
    });
};
</script>
