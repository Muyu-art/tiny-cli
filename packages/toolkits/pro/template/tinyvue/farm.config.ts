import { defineConfig, loadEnv } from '@farmfe/core';
import vue from '@vitejs/plugin-vue';
import less from '@farmfe/js-plugin-less';
import { join, resolve } from 'path';
import { configDotenv } from 'dotenv';

configDotenv({
  path: './.env',
});

const proxyConfig = {
  [loadEnv('', process.cwd()).VITE_BASE_API]: {
    target: loadEnv('', process.cwd()).VITE_SERVER_HOST,
    changeOrigin: true,
    logLevel: 'debug',
    pathRewrite: (path: string) =>
      path.replace(
        new RegExp(`${loadEnv('', process.cwd()).VITE_BASE_API}`),
        '',
      ),
  },
  [loadEnv('', process.cwd()).VITE_MOCK_SERVER_HOST]: {
    target: loadEnv('', process.cwd()).VITE_MOCK_HOST,
    changeOrigin: true,
    pathRewrite: (path: string) => path.replace(/^\/mock/, ''),
  },
};

export default defineConfig({
  vitePlugins: [vue()],
  plugins: [
    less({
      additionalData: `@import "${resolve(__dirname, 'src/assets/style/breakpoint.less')}";`,
    }),
  ],
  compilation: {
    define: {
      'process.env': {},
      'BUILD_TOOLS': '"VITE"',
    },
    resolve: {
      alias: {
        '@': join(__dirname, 'src'),
        'assets': join(__dirname, 'src/assets'),
        'vue-i18n': 'vue-i18n/dist/vue-i18n.esm-bundler.js',
        'vue': 'vue/dist/vue.esm-bundler.js',
      },
      extensions: ['.ts', '.js'],
    },
  },
  server: {
    proxy: proxyConfig,
  },
});
