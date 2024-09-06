# 使用Node.js官方镜像，带有npm
FROM node:18

# 设置工作目录
WORKDIR /usr/src/app

# 复制package.json文件和源代码
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 复制源代码到工作目录
COPY . .

# 设置环境变量，如有需要
ENV NODE_ENV=development

# 对外暴露容器的端口号
EXPOSE 3000

# 启动Nest.js项目
CMD ["npm", "run", "start"]

#docker build -t tiny-nestjs-app .
#docker run -p 3000:3000 -d tiny-nestjs-app
