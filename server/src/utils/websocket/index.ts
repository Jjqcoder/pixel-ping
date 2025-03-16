/**
 * 创建时间: 2025-03-12
 * 作者: jjq
 * 描述: websocket 工具类
 */

import { WebSocketServer, WebSocket } from "ws";
import { createServer } from "http";

export class WebSocketManager {
  private wss: WebSocketServer;
  private sessions: Map<string, WebSocket>;

  constructor(server: ReturnType<typeof createServer>) {
    this.sessions = new Map<string, WebSocket>();
    this.wss = new WebSocketServer({ server });

    this.initWebSocket();
  }

  private initWebSocket() {
    this.wss.on("connection", (ws) => {
      console.log("WebSocket client connected");

      // 为每个 WebSocket 客户端生成唯一标识符
      const sessionId = `${Date.now()}-${Math.random().toString(36).substr(2)}`;
      this.sessions.set(sessionId, ws);

      // 向当前连接的客户端发送他的 sessionId
      ws.send(JSON.stringify({ type: "sessionId", data: sessionId }));

      // 向所有会话广播当前的 sessionMap
      this.broadcastSessions();

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
              type: "message", // 消息类型
              data: {
                from: sessionId, // 当前发送者的 sessionId
                msg: msg, // 消息内容
              },
            });

            // 查找目标用户的 WebSocket 连接
            const targetClient = this.sessions.get(toUserId);
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
        this.sessions.delete(sessionId);

        // 向所有会话广播当前的 sessionMap
        this.broadcastSessions();
      });
    });
  }

  public getAllSessions() {
    return Array.from(this.sessions.keys());
  }

  private broadcastSessions() {
    const sessionMap = Array.from(this.sessions.keys());
    const message = JSON.stringify({ type: "sessionMap", data: sessionMap });

    this.sessions.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(message);
      }
    });
  }
}