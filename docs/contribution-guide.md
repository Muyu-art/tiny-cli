# 贡献指南

十分感谢您愿意贡献本项目. 在此之前请先阅读本指南, 本指南会从`cli`贡献与`pro套件`贡献两个方向展开.

## 前置准备

### Clone仓库

- 点击 [TinyCLI](https://github.com/opentiny/tiny-cli) 代码仓库右上角的 Fork 按钮，将上游仓库 Fork 到个人仓库
- Clone 个人仓库到本地
- 在 Tiny CLI 根目录下运行 npm init, 安装依赖
- 运行 npm run dev，启动本地代码编译开发

```shell
# username 为用户名，执行前请替换
git clone git@github.com:username/tiny-cli.git
cd tiny-cli
git remote add upstream git@github.com:opentiny/tiny-cli.git
```

### 依赖安装

在 Tiny CLI 根目录下运行 `npm run init` 安装依赖。

## CLI 贡献

### 环境准备

```bash
npm run dev
```

执行上述命令后，出现 `Found 0 errors. Watching for file changes.` 字样则代表开发环境搭建成功。接下来我们需要进入开发阶段

### 命令开发

本章我们将会开发一个命令叫做 `health` 该命令将会输出操作系统、CPU架构、CPU核心数、内存总数(MB单位)。假设我们输入`tiny health`，控制台应该显示

```
           Cpu:
                Intel(R) Core(TM) i5-4460  CPU @ 3.20GHz
      CpuTotal: 1
CpuKernalTotal: 4
          Arch: x64
      Platform: win32
        Memory: 8129 MB
    FreeMemory: 6832 MB
          Time: 2024/9/27
```

左边是机器信息的名字，右边是数值。CPU因为只有一个所以只显示一个，如果有多个那么则显示多个。

首先请确保您运行了`npm run dev`。其次，请另开一个终端执行`npm run link`. 当出现`lerna success run Ran npm script 'link' in 1 package in 47.7s:`字样则表示`link`成功。后续操作不需要继续重复`link`

接下来我们在`packages\cli\commands\src`下创建`health.ts`文件。并写入如下代码

```ts
// packages\cli\commands\src\health.ts
export default function(){}
```

紧接着我们在`packages\cli\commands\src\index.ts`文件下导入health文件并导出。最终`packages\cli\commands\src\index.ts`文件应该如下所示

```ts
// packages\cli\commands\src\index.ts
/**
 * Copyright (c) 2022 - present Tiny CLI Authors.
 * Copyright (c) 2022 - present Huawei Cloud Computing Technologies Co., Ltd.
 *
 * Use of this source code is governed by an MIT-style license.
 *
 * THE OPEN SOURCE SOFTWARE IN THIS PRODUCT IS DISTRIBUTED IN THE HOPE THAT IT WILL BE USEFUL,
 * BUT WITHOUT ANY WARRANTY, WITHOUT EVEN THE IMPLIED WARRANTY OF MERCHANTABILITY OR FITNESS FOR
 * A PARTICULAR PURPOSE. SEE THE APPLICABLE LICENSES FOR MORE DETAILS.
 *
 */
import i from './i';
import clear from './clear';
import help from './help';
import init from './init';
import list from './list';
import locale from './locale';
import main from './main';
import update from './update';
import version from './version';
import install from './install';
import config from './config';
import health from './health';

export default {
  i,
  clear,
  help,
  init,
  list,
  locale,
  main,
  update,
  install,
  version,
  config,
  health
};
```

保存后，在终端中运行`tiny health`命令，会发现控制台没有任何的输出。这是因为`health.ts`文件的默认导出是一个空函数，空函数执行自然不会有任何的输出。所以接下来我们要开始真正的开发了.

将下列代码复制到`packages\cli\commands\src\health.ts`下并保存。之后运行`tiny health`命令会发现，控制台输出了当前机器的一些信息

```ts
// packages\cli\commands\src\health.ts
import { cpus, arch, platform, totalmem, freemem } from 'os'
import { stdout } from 'process';
const formatTitle = (title: string) => `${title[0].toUpperCase()}${title.slice(1)}`
const toMB = (size: number) => Math.floor(size / 1024 / 1024)
const formatMemoryString = (size: number) => `${size} MB`
export default async function () {
  const result = {
    cpu: [] as string[],
    cpuTotal: 0,
    cpuKernalTotal: 0,
    arch: arch(),
    platform: platform(),
    memory: formatMemoryString(toMB(totalmem())),
    freeMemory: formatMemoryString(toMB(totalmem()) - toMB(freemem()))
  };
  const cpuInfos = cpus()
  result.cpu = Array.from(new Set(cpuInfos.map(cpuInfo => cpuInfo.model)));
  result.cpuTotal = result.cpu.length;
  result.cpuKernalTotal = cpuInfos.length;
  const entries = Object.entries(result)
  let maxLenKey = entries[0][0]
  let maxValueKey = 0;
  for (let i = 1; i < entries.length; i++) {
    if (entries[i][0].length > maxLenKey.length) {
      maxLenKey = entries[i][0];
    }
    if (entries[i][1] instanceof Array) {
      continue;
    }
    if (entries[i][1].toString().length > maxValueKey) {
      maxValueKey = entries[i][1].toString().length;
    }
  }
  for (const [key, value] of entries) {
    stdout.write(formatTitle(key).padStart(maxLenKey.length,) + ': ' + (value instanceof Array ? '\n' : ''));
    if (value instanceof Array) {
      value.forEach(val => {
        stdout.write(val.padStart(maxLenKey.length + 2 + val.length) + '\n')
      })
    } else {
      stdout.write(value.toString() + '\n')
    }
  }
}

```

#### 这段代码做了什么事？

这段代码主要使用`os`包来获取机器信息，而后通过stdout来进行输出。之所以使用stdout主要是可以更加灵活的进行输出，实际上使用`console.log`效果也是一样的

## `tiny-toolkit-pro` 套件贡献

### 第一节、目录结构

```
packages
  toolkits
    pro
        src
            lib
                build.ts        # 对应的是 tiny pro build
                help.ts         # 对应的是 tiny pro help
                init.ts         # 对应的是 tiny pro init
                interface.ts
                start.ts        # 对应的是 tiny pro start
                utils.ts
            template
                server        # 后端模板     * 本章只涉及nestjs后端
                tinyng        # ng前端模板
                tinyvue       # vue3前端模板 * 本章只涉及Vue前端
```

### 第二节、贡献套件命令

套件命令对应的文件请参考上一节 `目录结构`. 当修改了套件命令后，贡献者**必须**发布一个私有的套件包。并设置环境变量`TINY_SCOPE`为您的`npm`名称

### 第三节、发布私有套件包

发布私有套件包前，我们假设你拥有npm账号且已经完成了[前置准备](#前置准备)，且已经登陆。如果没有登陆请参考[npm登录](https://docs.npmjs.com/cli/v10/commands/npm-login?v=true)。

1. 替换`packages\toolkits\pro\package.json`中`@opentiny/tiny-toolkit-pro` 为 `@<您的npm名称>/tiny-toolkit-pro`
2. 在`packages\toolkits\pro`下运行`npm publish --access=public`
3. 修改环境变量`TINY_SCOPE=<第一步骤中您填写的私有scope>`
4. 安装`npm i -g @opentiny/cli` (如果您安装完成或link了开发产物可忽略该步骤)
5. `rm -rf ~/.tiny`
6. **新启用一个bash**并执行`tiny init pro`

当出现`[core-module]: 本地尚未安装 @<您的npm名称>/tiny-toolkit-pro ,正在执行自动安装...`后则代表私有包发布成功


### 贡献套件

您可以使用IDE打开`packages\toolkits\pro\templates`，进入对应的技术栈后安装依赖，之后跟随开发指南进行开发

- [前端二次开发指南](./tiny-pro-front-dev-guideline.md)
- [后端二次开发指南](./tiny-pro-backend-dev-guideline.md)

#### 如何调试

- [ ] nestJs后端
    - 源码位置: `packages\toolkits\pro\templates\server\nestJs`
    - 安装nestJs依赖: `npm i`
    - 启动nestJs本地调试: `npm run start`
    - [启动MySQL数据库](https://dev.mysql.com/doc/refman/8.4/en/tutorial.html)
    - [启动Redis](https://redis.io/docs/latest/get-started/)
- [ ] vue3前端
    - 源码位置: `packages\toolkits\pro\templates\tinyvue`
    - 安装nestJs依赖: `npm i`
    - 启动nestJs本地调试: `npm run start`(默认vite启动)
      - webpack启动: `npm run dev:wp`
      - rspack启动: `npm run dev:rp`
    - [成功启动页面](./images/tiny-pro-show.png)

## 遇到困难?

加官方小助手微信 opentiny-official，加入技术交流群