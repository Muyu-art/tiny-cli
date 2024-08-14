<template>
  <div></div>
</template>

<script lang="ts" setup>
import { useRouter, useQuery } from '@/router';

const router = useRouter();
const route = router.currentRoute.value;
if (useQuery('path')) {
  router.push({
    path: useQuery('path').toString(),
    query: {
      final: '1',
    },
  });
} else {
  router.push({ name: useQuery('to')?.toString() ?? 'Home' });
}
</script>
