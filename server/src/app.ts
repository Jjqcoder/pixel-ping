// src/app.ts
import express, {json, urlencoded} from "express";
import { RegisterRoutes } from "../build/routes";
import cors from 'cors'
import { WebSocketServer, WebSocket  } from "ws"; // 引入 WebSocketServer
import { createServer } from "http"; // 引入 createServer

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

// 创建 WebSocket 服务器并绑定到 HTTP 服务器
const wss = new WebSocketServer({ server: httpServer });

// 用于存储 WebSocket 会话的映射表
const sessions = new Map<string, WebSocket>();

// WebSocket 事件处理
wss.on("connection", (ws) => {
  console.log("WebSocket client connected");

  // 为每个 WebSocket 客户端生成唯一标识符（这里简单使用时间戳和随机数）
  const sessionId = `${Date.now()}-${Math.random().toString(36).substr(2)}`;
  sessions.set(sessionId, ws);

  ws.on("message", (message) => {
    // console.log("Received message:", message);

    // 检查消息类型并转换为字符串
    if (Buffer.isBuffer(message)) {
        // 如果是二进制数据，将其转换为字符串
        const textMessage = message.toString("utf8");
        console.log("Received text message:", textMessage);

        // 广播消息到所有客户端
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              if (textMessage === "PING") {
                client.send('PONG'); // 发送字符串
              } else {
                client.send('消息来自服务器'+textMessage); // 发送字符串
              }
                
            }
        });
    } else {
        // 如果已经是字符串，直接处理
        console.log("Received text message:", message);

        // 广播消息到所有客户端
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message); // 发送字符串
            }
        });
    }
});

  ws.on("close", () => {
    console.log("WebSocket client disconnected");
    // 移除会话
    sessions.delete(sessionId);
  });
});

// 提供一个方法来获取当前所有会话
function getAllSessions() {
  return Array.from(sessions.keys());
}

// 测试：打印所有会话
setInterval(() => {
  console.log("Current sessions:", getAllSessions());
}, 5000);