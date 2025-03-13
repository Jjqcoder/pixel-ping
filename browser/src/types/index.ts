/**
 * 创建时间: 2025-03-13
 * 作者: jjq
 * 描述: 管理聊天页面的类型信息，包括WebSocket消息类型、发送消息的负载格式、会话ID类型以及聊天页面的状态类型。
 */

// 定义从服务端接收到的WebSocket消息类型。
// - type为"sessionMap"的消息：包含当前所有在线会话的sessionId列表，用于通知客户端当前的在线会话情况。
//   当有用户登录或登出时，服务器会将更新后的会话列表发送给所有客户端。
// - type为"sessionId"的消息：告知客户端当前会话的唯一标识（sessionId）。
// - type为"message"的消息：表示一个会话发送给另一个会话的消息内容，包含发送方的sessionId和具体消息内容。
export type WebSocketMessage =
  | { type: "sessionMap"; data: string[] } // 当前所有在线会话的sessionId列表
  | { type: "sessionId"; data: string } // 当前会话的sessionId
  | { type: "message"; data: { from: string; msg: string } }; // 会话间的消息内容

// 定义一个会话向另一个会话发送消息时的负载格式。
// - to：目标会话的sessionId，即消息接收方的会话标识。
// - msg：要发送的消息内容。
export type SendMessagePayload = {
  to: string; // 目标会话的sessionId
  msg: string; // 发送的消息内容
};

// 定义会话ID的类型，由后端随机生成的字符串，用于唯一标识一个会话。
export type SessionId = string;

// 定义聊天页面的状态类型，包含以下字段：
// - messages：聊天记录，存储所有已接收的消息内容。
// - input：当前输入框中的内容，用于用户输入新消息。
// - socket：WebSocket连接实例，用于与服务器进行实时通信，null表示尚未建立连接。
// - curOnline：当前在线的会话sessionId列表，用于显示在线用户信息。
// - sessionId：当前会话的唯一标识（sessionId）。
export type ChatPageState = {
  messages: string[]; // 聊天记录
  input: string; // 当前输入框内容
  socket: WebSocket | null; // WebSocket连接实例
  curOnline: string[]; // 当前在线会话列表
  sessionId: SessionId; // 当前会话的sessionId
};