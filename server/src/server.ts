// 入口文件
import { app } from "./app";

const port = process.env.PORT || 3000;

app.listen(port, () =>
  console.log(`Testing at http://localhost:${port}/users`)
);