# 后端构建阶段
FROM node:20-alpine as build

WORKDIR /app

# 安装pnpm
RUN npm install -g pnpm

# 复制依赖文件
COPY package.json pnpm-lock.yaml* ./

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制所有源代码
COPY . .

# 生成Prisma客户端
RUN pnpm prisma generate

# 构建TypeScript
RUN pnpm tsoa spec-and-routes && pnpm tsc

# 生产环境部署阶段
FROM node:20-alpine

WORKDIR /app

# 复制构建产物
COPY --from=build /app/build ./build
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./
COPY --from=build /app/prisma ./prisma

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["node", "./build/src/server.js"]