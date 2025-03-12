生成 TSOA 路由和 OpenAPI 文档：
pnpm tsoa spec
pnpm tsoa routes
或者直接使用
pnpm tsoa spec-and-routes

编译 TypeScript：
pnpm tsc

使用最新的表结构覆盖本地的schame.prisma
pnpx prisma db pull --force

生成prisma客户端
pnpm prisma generate

启动项目
node .\build\src\server.js