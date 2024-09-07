# TinyPro of nestJs
## 环境准备
`npm install`

## 项目启动
`npm run start`

## Docker启动
项目中存在`docker-compose.yml`文件，用于docker启动nest项目  

`docker-compose up -d`  

docker终止nest运行  

`docker-compose down`

## 项目介绍
### 初始化
#### 初始化账户
> 初始化账户为 email：admin@no-reply.com  password：admin  
> 
> 初始化账户为admin角色，拥有最高权限和所有菜单页面
#### 初始化编辑菜单
> /src/menu/init/menuData.ts文件中是初始化菜单的数据  
> 
> 开发者可根据需求自定调整初始化菜单  
> 
> 注意：由于menuData.ts中没有写明父菜单ID，开发者需要在/src/menu/menu.service.ts中的handleMenuParentId函数中，调整各菜单的父菜单，也就是调整菜单的层级  

#### 初始化国际化词条
> /locales.json文件中是初始化国际化词条的数据  
> 
> 包含中英两种语言  

### Guard
> /src/auth/auth.guard.ts  
> 
> 1.激活i18n国际化服务  
> 
> 2.获取登录的token

### @Permission装饰器
> 用于判断用户请求接口时是否有相应权限  

### @Public装饰器
> 公共操作，所有用户都可访问@Public装饰器的接口  



