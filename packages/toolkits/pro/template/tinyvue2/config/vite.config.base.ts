import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';
import vue2 from '@vitejs/plugin-vue2';
import { resolve } from 'node:path';
import { viteMockServe } from 'vite-plugin-mock';

export default defineConfig({
  plugins: [
    vue2(),
    viteMockServe({
      mockPath: './src/mock',
      enable: true,
    }) as any,
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('../src', import.meta.url)),
    },
  },
  define: {
    'process.env': { ...process.env },
    BUILD_TOOLS: "'VITE'",
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          hack: `true; @import (reference) "${resolve(
            'src/assets/style/breakpoint.less'
          )}";`,
        },
        javascriptEnabled: true,
      },
    },
  },
});
