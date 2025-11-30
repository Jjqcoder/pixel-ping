# 第一阶段：构建React应用
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制package.json和pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# 安装pnpm
RUN npm install -g pnpm

# 安装依赖
RUN pnpm install

# 复制所有项目文件
COPY . .

# 构建应用
RUN pnpm run build

# 第二阶段：提供静态文件
FROM nginx:alpine

# 从构建阶段复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 暴露80端口
EXPOSE 80

# 启动nginx
CMD ["nginx", "-g", "daemon off;"]