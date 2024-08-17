<template>
  <div></div>
</template>

<script lang="ts" setup>
import { useRouter } from '@/router';

const router = useRouter();
const route = router.currentRoute;
if (route.query.final) {
  router.replace({ name: 'login' });
} else {
  router.replace({
    path:
      route.query.path.toString() ??
      [import.meta.env.VITE_CONTEXT, 'login'].join(''),
    query: {
      final: '1',
    },
  });
}
</script>
