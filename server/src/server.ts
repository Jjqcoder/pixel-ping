// 入口文件
import { httpServer } from "./app";

const port = process.env.PORT || 3000;

// 注意 使用httpServer监听端口 而不是app
httpServer.listen(port, () =>
  console.log(`Testing at http://localhost:${port}/users`)
);