// src/app.ts
import express, { json, urlencoded } from "express";
import { RegisterRoutes } from "../build/routes";
import cors from 'cors'
import { WebSocketServer, WebSocket } from "ws"; // 引入 WebSocketServer
import { createServer } from "http"; // 引入 createServer
import { WebSocketManager } from "./utils/websocket/index"; // 引入 WebSocketManager

export const app = express();

// 开启跨域
app.use(cors())

// Use body parser to read sent json payloads
app.use(
  urlencoded({
    extended: true,
  })
);
app.use(json());

RegisterRoutes(app);

// 创建 HTTP 服务器（后续用来监听端口 而不是使用app）
export const httpServer = createServer(app);

// 创建websocket管理器
const webSocketManager = new WebSocketManager(httpServer);

// 测试：打印所有会话
setInterval(() => {
  console.log("Current sessions:", webSocketManager.getAllSessions());
}, 5000);