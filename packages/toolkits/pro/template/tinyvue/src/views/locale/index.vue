<template>
  <general-layout :breadcrumb="['menu.systemManager', 'menu.i18n']">
    <add-locale v-permission="'i18n::add'" />
    <locale-table />
  </general-layout>
</template>

<script lang="ts" setup>
  import { useI18n } from 'vue-i18n';
  import GeneralLayout from '@/layout/general-layout.vue';
  import addLocale from './components/add-locale.vue';
  import localeTable from './components/locale-table.vue';
</script>
