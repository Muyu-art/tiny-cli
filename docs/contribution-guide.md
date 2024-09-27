# 贡献指南

十分感谢您愿意贡献本项目. 在此之前请先阅读本指南, 本指南会从`cli`贡献与`pro套件`贡献两个方向展开.

## Cli 贡献

### 环境安装

```bash
# 如果您没有安装lerna请安装lerna
# npm i -g lerna@7
npm run init
```

### 开发

在执行该步骤前请先执行 `环境安装`

```bash
npm run dev
```

运行上述命令后，出现

```
[19:16:13] Starting compilation in watch mode...
@opentiny/tiny-plugin-hwc: [19:16:15] Found 0 errors. Watching for file changes.
```

即表示开发编译完成，此时您需要开启一个新的`bash`环境运行

```bash
npm run link
```

当出现终端出现下述文本，则表示开发环境搭建成功

```bash
lerna success run Ran npm script 'link' in 1 package in 10.6s:
lerna success - @opentiny/cli
```

### 打包分发

有时我们需要进行打包来测试构建产物是否正常，这个时候需要批量的进行替换`@opentiny`前缀，并改为自己的私有前缀。您可以手动替换或使用IDE进行辅助替换。批量替换完成后，我们可以直接进行版本发布，因为所有的子包都会存在一个`prepublish`生命周期钩子，该钩子会在`publish`前强制执行一次构建操作，所以无需再次构建。

```bash
npm run publish --access=public
```

## tiny-pro 套件开发

`tiny-pro`套件中存在两个目录`src`目录与`template`目录。

```bash
src
    lib
        build.ts
        help.ts
        init.ts
        interface.ts
        start.ts
        utils.ts
template
    server
        nestJs
    tinyng
    tinyvue
    tinyvue2
```

其中`template`是模板文件夹，如果您只需要开发`tiny-pro`前端或后端项目，可以使用IDE单独打开该文件夹，并进入相应的技术栈文件夹中安装依赖。如果您需要开发套件对应的命令，可以直接进入`packages\toolkits\pro\src`文件夹下，一个文件对应的便是一个命令。

### 发布测试包

> 执行此步骤前，请您悉知如何修改环境变量
> Linux如何修改环境变量: https://wiki.archlinuxcn.org/wiki/%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F
> Windows如何修改环境变量: https://support.esri.com/zh-cn/knowledge-base/edit-an-environment-variable-1462478594981-000002146
> Macos如何修改环境变量: https://support.apple.com/zh-cn/guide/terminal/apd382cc5fa-4f58-4449-b20a-41c53c006f8f/mac

**在修改环境变量后请重新启动终端**

有时我们需要发布`tiny-pro`套件测试包，您可以跟随下列步骤

1. 替换`packages\toolkits\pro\package.json`中`@opentiny/tiny-toolkit-pro` 为 `@<您的私有scope>/tiny-toolkit-pro`
2. 运行`npm publish --access=public`
3. 修改环境变量`TINY_SCOPE=<第一步骤中您填写的私有scope>`
4. 安装`npm i -g @opentiny/cli` (如果您安装完成可忽略该步骤)
5. `rm -rf ~/.tiny`
6. **新启用一个bash**并执行`tiny init pro`

### 本地开发

您可以使用IDE打开`packages\toolkits\pro\templates`下，并进入对应的技术栈后安装依赖，之后跟随开发指南进行开发

- [前端开发指南](./tinyvue.md)
- [后端开发指南](./tiny-nest.md)