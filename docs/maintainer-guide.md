# 维护者指南

本文主要面向与该仓库维护者，主要讲解的是发包流程

## 依赖安装

请确保已经全局安装了lerna

```bash
npm run init
```

## 构建产物

```bash
npm run build
```

## 本地测试

```bash
npm run dev
```

```bash
npm run link
```

等待出现

```
lerna success run Ran npm script 'link' in 1 package in 10.6s:
lerna success - @opentiny/cli
```

即代表本地测试环境搭建成功

## 发布测试包

> 执行此步骤前，请您悉知如何修改环境变量
> Linux如何修改环境变量: https://wiki.archlinuxcn.org/wiki/%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F
> Windows如何修改环境变量: https://support.esri.com/zh-cn/knowledge-base/edit-an-environment-variable-1462478594981-000002146
> Macos如何修改环境变量: https://support.apple.com/zh-cn/guide/terminal/apd382cc5fa-4f58-4449-b20a-41c53c006f8f/mac

**在修改环境变量后请重新启动终端**

有时我们会需要发布一些测试包来测试构建产物是否能够正常使用，您可以根据下列指引来进行测试. 这里使用的是`@opentiny/tiny-toolkit-pro
`作为演示

1. 全局替换`@opentiny`前缀为`@xxx`(其中xxx为您的npm名称)
2. 运行`npm publish --access=public`
3. 修改环境变量`TINY_SCOPE=xxx` (第一步中替换的结果, 但是不要包含@)
   1. 例如 `@opentiny/tiny-toolkit-pro
` -> `@foo/tiny-toolkit-pro
`
   2. TINY_SCOPE应该是`foo`而不是`@foo`
4. 安装`npm i -g @opentiny/cli` (如果您安装完成可忽略该步骤)
5. `rm -rf ~/.tiny`
6. `tiny init pro`

