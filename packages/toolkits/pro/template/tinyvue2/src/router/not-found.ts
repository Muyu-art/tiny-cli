export const notFound = {
  path: import.meta.env.VITE_CONTEXT + '404',
  name: 'notFound',
  component: () => import('@/views/not-found/index.vue'),
};
