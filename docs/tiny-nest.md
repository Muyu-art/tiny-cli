# TinyPro 后端部署指南

## 视频教程

[OpenTiny社区](https://space.bilibili.com/15284299)

## 相关术语

### 用户

登陆账号的人

### 角色

权限的集合体，为了方便的进行权限管理

### Guard

门禁/门卫，可以理解为一个中间件。请求会先经过Guard而后才会经过Controller。在代码中体现则是一个实现了`CanActivate`接口的类。

### 受保护的接口

如果一个接口需要登录/需要进行权限校验，那么我们称作这个接口是受保护的接口

### 公开接口

如果一个接口不需要登录/不会进行权限校验，那么我们称作这个接口是公开接口


## 环境准备

请确保您安装了`nodejs`, `npm`, `tiny-cli`

```bash
tiny init pro
```

输入完成上述命令后，请根据指引输入您的信息

```
? 请输入项目名称： tiny-pro
? 请输入项目描述： 基于TinyPro套件创建的中后台系统
* 请选择您希望使用的客户端技术栈： vue
* 请选择您希望使用的服务端技术栈： Nest.js
* 请选择你想要的构建工具:  Vite
* 请确保已安装数据库服务（参考文档
https://www.opentiny.design/tiny-cli/docs/toolkits/pro#database）：
已完成数据库服务安装，开始配置
* 请选择数据库类型： MySql
* 请输入数据库地址： localhost
* 请输入数据库端口： 3306
* 请输入数据库名称： ospp-nest
* 请输入登录用户名： root
* 请输入密码： [hidden]
```

## 目录结构

```
├── .env                        环境变量文件
├── docker-compose.yml          docker-compose 启动文件
├── dockerfile                  docker镜像构建问及那
├── libs                        公用模块
│   ├── db                      数据库连接
│   ├── models                  数据库结构
│   └── redis                   redis链接
├── locales.json                国际化数据库初始化文件
├── src                         源码
    ├── app.module.ts
    ├── auth                    鉴权接口
    ├── employees
    ├── global.d.ts             全局类型
    ├── i18                     后端国际化文件 (报错信息等公用国际化字段)
    ├── i18n                    国际化接口
    ├── main.ts                 nest主入口
    ├── menu                    菜单接口
    ├── permission              权限接口
    ├── public                  公共文件(修饰器等)
    ├── role                    角色接口
    └── user                    用户接口
```
## 环境变量

环境变量存在于 `.env` 文件下，您可以根据需求自行修改.

```properties
# 数据库IP
DATABASE_HOST = 'localhost'
# 数据库端口
DATABASE_PORT = 3306
# 数据库用户名
DATABASE_USERNAME = 'root'
# 数据库密码
DATABASE_PASSWORD = 'root'
# 数据库名 (请确保该库存在)
DATABASE_NAME = 'ospp-nest'
# 请阅读: https://www.typeorm.org/migrations
# 线上环境请关闭
DATABASE_SYNCHRONIZE = 'true'
DATABASE_AUTOLOADENTITIES = 'true'
# jwt secret
AUTH_SECRET = 'secret'
REDIS_SECONDS = 7200
# redis ip
REDIS_HOST = 'localhost'
# redis 端口
REDIS_PORT = 6379
# token过期时间
EXPIRES_IN = '2h'
# 分页默认起始页 (一般可以不修改)
PAGINATION_PAGE = 1
# 分页默认大小
PAGINATION_LIMIT = 10
```

## 快速上手

**为了安全起见`DATABASE_SYNCHRONIZE`默认为`false`, 如果默认为`true` `TypeOrm`可能会删除数据库下的所有数据。**

### Docker

```bash
# 该compose文件会启动三个服务
# 1. mysql
# 2. redis
# 3. 业务服务器
docker compose up -d
```

**注意，请将后端文件`.env`中的`DATABASE_HOST`改为数据库的容器名,`REDIS_HOST`改为redis容器名。`DATABASE_PORT`改为docker数据库对外暴露的端口号，`REIDS_PORT`改为docker数据库对外暴露的端口号**

### 命令启动

**在运行前，请您确保`mysql`, `redis`均在运行中，且请您确保`.env`文件中`DATABASE_NAME`配置项指明的数据库存在。**

```bash
npm i
npm run start
```

## 权限管理

### Token管理

凡是没有被`Public`修饰器修饰的接口，均会被`auth/auth.guard.ts`进行校验, 如果token不存在、token过期、token不合法，均会不允许访问

### 权限控制

如果一个接口没有被`Permission`修饰器进行修饰, 那么这个接口是允许所有已登录用户访问的，如果该接口被`Permission`修饰器进行修饰，那么该接口只允许拥有该权限的用户访问，其余用户则会返回`403`错误代码.

相关代码

- `nestJs/src/permission/permission.guard.ts`

默认存在超级权限`(*)`, 该权限可以在登陆后访问任何接口

## 新增接口

与普通的`nest.js`项目开发完全一致，请阅读:[nest.js 文档](https://docs.nestjs.com/)

## 国际化

> 这里的国际化指的是报错信息的国际化

后端采用的是`nestjs-i18n`依赖库。国际化词条放在`i18n/<lang>/xxx.json`下

```
i18n
  enUS
    exception.json
    validation.json
  zhCN
    exception.json
    validation.json
```

目前仅支持`enUS`与`zhCN`两种语言，且`fallback`为`enUS`.

## 打包构建

> 这里只阐述tiny-pro后端打包, 如果您进行了二次开发，请自行检查dockerfile

### docker打包

```bash
docker build -t tinypro:latest .
```

### 命令打包

```bash
npm run build
```

## 遇到困难?

加官方小助手微信 opentiny-official，加入技术交流群

## 常见问题

### 提示 `Lock file exists, if you want init agin, please remove dist or dist/lock`

为了避免重复初始化，系统会在第一次初始化的时候在`dist`目录下新建`app/lock`文件，如果您需要再次初始化，那么请您删除`dist/app`或者直接删除`dist`文件夹

### docker 部署时数据库超时

`docker-compose.yaml`实际上配置了`depends_on`字段，但`mysql`镜像并没有提供对应的健康检查。如果服务挂掉，可以等待`mysql`启动成功后手动重启后端服务

### 打包速度慢

请阅读[SWC](https://docs.nestjs.com/recipes/swc)
