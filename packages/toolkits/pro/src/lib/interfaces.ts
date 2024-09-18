/**
 * 控制台传入的参数
 */
export interface CliOption {
  clientArgs: any;
  clientOptions: any;
}

export enum VueVersion {
  Vue3 = 'tinyvue',
}

/**
 * 服务端类型
 */
export enum ServerFrameworks {
  EggJs = 'eggJs',
  NestJs = 'nestJs',
  SpringCloud = 'springCloud',
  Skip = '',
}

export enum BuildTool {
  Vite = 'vite',
  Webpack = 'webpack',
  Rspack = 'rspack',
}

export const buildConfigs = {
  vite: ['webpack.config.js', 'rspack.config.js'],
  webpack: ['config', 'rspack.config.js'],
  rspack: ['config', 'webpack.config.js'],
};

export const buildCommand = {
  vite: 'vite build --config ./config/vite.config.prod.ts',
  webpack: 'webpack --config webpack.config.js',
  rspack: 'rspack build',
};

export const devCommand = {
  vite: 'vite --config ./config/vite.config.dev.ts --port 3031',
  webpack: 'webpack-dev-server --progress --config webpack.config.js',
  rspack: 'rspack serve',
};

export const removedCommand = [
  'dev:wp',
  'dev:rp',
  'build:wp',
  'build:rp',
  'dev',
];

/**
 * 需要删除的包
 */
export const removeDependencies = {
  vite: ['style-resources-loader', 'vue-style-loader'],
  webpack: [],
  rspack: [],
};

/**
 * 需要删除的包
 */
export const devDependencies = {
  vite: [
    '@babel/preset-env',
    '@babel/preset-typescript',
    /@rspack\/.*/,
    /webpack/,
    'vue-loader',
    'import-meta-loader',
    'css-loader',
    'core-js',
    'babel-loader',
  ],
  rspack: [
    /@vitejs\/.*/,
    /vite-.*/,
    'vite',
    'webpack',
    'webpack-cli',
    'webpack-dev-server',
  ],
  webpack: [/@vitejs\/.*/, /vite-.*/, 'vite', '@rspack/cli', '@rspack/core'],
};

/**
 * 初始化问题的选项 -> 选择的值
 */
export interface ProjectInfo {
  description: string;
  framework: string;
  name: string;
  serverFramework: ServerFrameworks;
  serverConfirm?: boolean;
  dialect?: string;
  host?: string;
  port?: number;
  database?: string;
  username?: string;
  password?: string;
  redisHost?: string;
  redisPort?: number;
  buildTool: BuildTool;
  vueVersion: VueVersion;
}
