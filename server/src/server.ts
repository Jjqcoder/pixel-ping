// 入口文件
import { httpServer } from "./app";

const port = process.env.PORT || 3000;

// 注意 使用httpServer监听端口 而不是app
httpServer.listen(port, () => {
  console.log("        _          _             _              ");
  console.log("  _ __ (_)_  _____| |      _ __ (_)_ __   __ _ ");
  console.log(" | '_ \\| \\ \\/ / _ \\ |_____| '_ \\| | '_ \\ / _` |");
  console.log(" | |_) | |>  <  __/ |_____| |_) | | | | | (_| |");
  console.log(" | .__/|_/_/\\_\\___|_|     | .__/|_|_| |_|\\__, |");
  console.log(" |_|                      |_|            |___/ ");
}
);