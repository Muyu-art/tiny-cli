# 维护者指南

## 依赖安装

```bash
# npm install -g lerna # 如果没有安装, 请先安装lerna
npm run init
```

## 本地开发

请参考[贡献者指南](./contribution-guide.md)

## 构建产物

```bash
npm run build
```

## 本地联调

```bash
npm run dev
```

```bash
# 新bash
npm run link
```

当出现 `lerna success - @opentiny/cli` 字样后代表link成功

## 发布测试包

> 执行此步骤前，请您悉知如何修改环境变量
>
> Linux如何修改环境变量: https://wiki.archlinuxcn.org/wiki/%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F
>
> Windows如何修改环境变量: https://support.esri.com/zh-cn/knowledge-base/edit-an-environment-variable-1462478594981-000002146
>
> Macos如何修改环境变量: https://support.apple.com/zh-cn/guide/terminal/apd382cc5fa-4f58-4449-b20a-41c53c006f8f/mac


**!!!在修改环境变量后请重新启动终端(Bash)!!!**

**!!!在修改环境变量后请重新启动终端(Bash)!!!**

**!!!在修改环境变量后请重新启动终端(Bash)!!!**

有时我们会需要发布一些测试包来测试构建产物是否能够正常使用，您可以根据下列指引来进行测试. 这里使用的是`@opentiny/tiny-toolkit-pro
`作为演示

0. 自增`package.json`中的`version`字段
1. `package.json`文件中替换`@opentiny`为`@xxx`(其中xxx为您的npm名称)
2. 运行`npm publish --access=public`
3. 修改环境变量`TINY_SCOPE=xxx` (第一步中替换的结果, 但是不要包含@)
   1. 例如 `@foo/tiny-toolkit-pro`，TINY_SCOPE应该是`foo`而不是`@foo`
4. 安装`npm i -g @opentiny/cli` (如果您安装完成可忽略该步骤)
5. `rm -rf ~/.tiny`
6. `tiny init pro`

### 发布测试包前检查清单

- [ ] lerna已被安装
- [ ] `npm run init`已被执行
- [ ] `npm run build`已被执行
- [ ] 需要发布的测试包`package.json`文件中`version`自增
- [ ] 需要发布的测试包`package.json`文件中`@opentiny`被替换为`@<您的npm账号名>`
- [ ] `npm publish --access=public`已被执行
- [ ] 环境变量`TINY_SCOPE`已修改为您的npm账号名
- [ ] 终端已重启
- [ ] `npm i -g @opentiny/cli`已被执行
- [ ] `rm -rf ~/.tiny`已被执行

## 发布正式包

与发布测试包相同，只是不需要替换`@opentiny`前缀

### 发布正式包前检查清单

- [ ] lerna已被安装
- [ ] `npm run init`已被执行
- [ ] `npm run build`已被执行
- [ ] 需要发布的正式包`package.json`文件中`version`自增
- [ ] `npm publish --access=public`已被执行
- [ ] 终端已重启
- [ ] `npm i -g @opentiny/cli`已被执行
- [ ] `rm -rf ~/.tiny`已被执行

## 遇到困难?

加官方小助手微信 opentiny-official，加入技术交流群