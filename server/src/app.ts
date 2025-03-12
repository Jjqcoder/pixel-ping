// src/app.ts
import express, { json, urlencoded } from "express";
import { RegisterRoutes } from "../build/routes";
import cors from 'cors'
import { WebSocketServer, WebSocket } from "ws"; // 引入 WebSocketServer
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

  // 为每个 WebSocket 客户端生成唯一标识符
  const sessionId = `${Date.now()}-${Math.random().toString(36).substr(2)}`;
  sessions.set(sessionId, ws);

  // 向所有会话广播当前的 sessionMap
  broadcastSessions();

  ws.on("message", (message) => {
    console.log("Received message:", message);

    // 检查消息类型并转换为字符串
    let textMessage: string;
    if (Buffer.isBuffer(message)) {
      // 如果是 Buffer 类型的消息，将其转换为字符串
      textMessage = message.toString("utf8");
    } else if (typeof message === "string") {
      // 如果已经是字符串类型的消息，直接使用
      textMessage = message;
    } else {
      console.error("Received message is neither string nor Buffer:", message);
      return; // 如果消息类型未知，直接返回
    }

    // 解析消息为 JSON 格式
    try {
      const messageData = JSON.parse(textMessage);

      // 检查消息是否包含 to 和 msg 字段
      if (messageData.to && messageData.msg) {
        const toUserId = messageData.to;
        const msg = messageData.msg;

        // 构造发送的消息
        const responseMessage = JSON.stringify({
          from: sessionId, // 当前发送者的 sessionId
          msg: msg,
        });

        // 查找目标用户的 WebSocket 连接
        const targetClient = sessions.get(toUserId);
        if (targetClient && targetClient.readyState === WebSocket.OPEN) {
          targetClient.send(responseMessage);
        } else {
          console.log(`Target user ${toUserId} not found or not connected.`);
        }
      } else {
        console.log("Invalid message format. Message must contain 'to' and 'msg' fields.");
      }
    } catch (error) {
      console.error("Error parsing message:", error);
    }
  });

  ws.on("close", () => {
    console.log("WebSocket client disconnected");
    // 移除会话
    sessions.delete(sessionId);

    // 向所有会话广播当前的 sessionMap
    broadcastSessions();
  });
});

// 提供一个方法来获取当前所有会话
function getAllSessions() {
  return Array.from(sessions.keys());
}

// 广播当前的 sessionMap 给所有会话
function broadcastSessions() {
  const sessionMap = Array.from(sessions.keys());
  const message = JSON.stringify({ type: "sessionMap", data: sessionMap });

  sessions.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(message);
    }
  });
}

// 测试：打印所有会话
setInterval(() => {
  console.log("Current sessions:", getAllSessions());
}, 5000);