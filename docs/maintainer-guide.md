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
```
npm run link
```

当出现终端出现下述文本，则表示开发环境搭建成功

```
lerna success run Ran npm script 'link' in 1 package in 10.6s:
lerna success - @opentiny/cli
```

### 打包分发

有时我们需要进行打包来测试构建产物是否正常，这个时候需要批量的进行替换`@opentiny`前缀，并改为自己的私有前缀。您可以手动替换或使用IDE进行辅助替换

```bash
npm run publish --access=public
```

批量替换完成后，我们可以直接进行版本发布，因为所有的子包都会存在一个`prepublish`生命周期钩子，该钩子会在`prepublish`前强制执行一次构建操作，所以无需再次构建。

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

其中`template`是模板文件，如果您只需要开发`tiny-pro`前端或后端项目，可以使用IDE单独打开该文件，并进入相应的技术栈文件夹中安装目录。如果您需要开发`cli`命令，可以直接进入`src > lib`文件夹下，一个文件对应的便是一个命令。

### 线上调试

有时我们需要线上调试`tiny-pro`套件。

1. 替换packages.json中`@opentiny/tiny-toolkit-pro` 为 `@<您的私有scope>/tiny-toolkit-pro`
2. 运行`npm publish --access=public`
3. 修改环境变量`TINY_SCOPE=<第一步骤中您填写的私有scope>`
4. 安装`npm i -g @opentiny/cli` (如果您安装完成可忽略该步骤)
5. **新启用一个bash**并执行`tiny init pro`

### 本地开发

#### Nest.js

请确保您的机器中安装了`mysql`, `redis`两个必要服务后，您可以直接进入`template > server > nestJs`下执行 `npm i`。等待安装完成后请将`.env`文件中的内容修改为您的数据库与redis信息。

修改完成后运行`npm run start:dev`如果出现`Application is running on: http://[::1]:3000`即代表后端启动成功

#### 前端

您可以直接进入`template > tinyvue`下执行`npm i`。依赖安装完成后运行`npm run start`，等待浏览器自动打开，即代表前端启动成功。

### 新功能追加

在追加新功能前, 我们建议您开启一个[Issue](https://github.com/opentiny/tiny-cli/issues/new?assignees=&labels=%E2%9C%A8+feature&projects=&template=feature-request.yml&title=%E2%9C%A8+%5BFeature%5D%3A+)

### 开发指南

请参考[tiny-pro前端开发](./tinyvue.md)与[tiny-pro后端开发](./tiny-nest.md)

### 更多帮助

- 添加官方小助手微信 opentiny-official，加入技术交流群
- 加入邮件列表 opentiny@googlegroups.com