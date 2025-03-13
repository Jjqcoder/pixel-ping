import React, { useEffect, useState } from "react";
import { CurChatComponent } from "./../components/CurChatComponent";
import { ToastContainer, toast } from 'react-toastify';
import {
  WebSocketMessage,
  SendMessagePayload,
  SessionId,
  ChatPageState
} from "./../types";

const ChatPage = () => {
  // 使用 ChatPageState 类型定义状态
  const [state, setState] = useState<ChatPageState>({
    messages: [],// 
    input: "",
    socket: null,
    curOnline: [],
    sessionId: 'sessionId获取失败'
  });

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000");
    setState((prevState) => ({ ...prevState, socket: ws }));

    // 连接成功
    ws.onopen = () => {
      console.log("WebSocket连接成功");
    };

    // 接收信息
    ws.onmessage = (event) => {
      const message: WebSocketMessage = JSON.parse(event.data); // 使用 WebSocketMessage 类型
      console.log("收到消息:", message);

      if (message.type === 'sessionMap') {
        setState((prevState) => ({
          ...prevState,
          curOnline: message.data
        }));
      } else if (message.type === 'sessionId') {
        console.log('我的sessionId是', message.data);
        setState((prevState) => ({
          ...prevState,
          sessionId: message.data
        }));
      } else {
        setState((prevState) => ({
          ...prevState,
          messages: [...prevState.messages, JSON.stringify(message)]
        }));
      }
    };

    // 连接处理
    ws.onerror = (error) => {
      console.error("WebSocket发生错误:", error);
    };

    // 连接关闭
    ws.onclose = () => {
      console.log("WebSocket连接关闭");
    };

    // 组件卸载时关闭连接
    return () => {
      ws.close();
    };
  }, []);

  // 发送信息
  const sendMessage = () => {
    const { curChat } = (globalThis as any);
    const { input, socket } = state;
    
    if (!curChat || curChat === '请选择聊天对象') {// 判断使用指定了聊天对象
      toast('请选择聊天对象');
    } else if (input.trim() !== "" && socket) {// 如果输入信息为空或者websocket连接未建立，就不发送信息
      if (socket.readyState === WebSocket.OPEN) {
        const payload: SendMessagePayload = { to: curChat, msg: input }; // 使用 SendMessagePayload 类型
        socket.send(JSON.stringify(payload));// 信息发送！
        setState((prevState) => ({
          ...prevState,// 导入之前的聊天记录
          messages: [...prevState.messages, `我: ${input}`],// 新增刚刚发送的信息
          input: ""// 输入框设置为空
        }));
      } else {
        console.error("WebSocket未连接，无法发送消息");
      }
    }
  };

  const handleClick = (session: SessionId) => { // 使用 SessionId 类型
    sessionStorage.setItem('curChat', session);
    console.log("点击了", session);
  };

  return (
    <div>
      <ToastContainer />
      <h1>Chat Page</h1>
      {/* 展示当前会话的 sessionId */}
      {state.sessionId ? (
        <p>我的 sessionId 是: {state.sessionId}</p>
      ) : (
        <p>正在获取 sessionId...</p>
      )}
      <h2>消息</h2>
      <div>
        {state.messages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>
      <input
        type="text"
        value={state.input}
        onChange={(e) => setState((prevState) => ({
          ...prevState,
          input: e.target.value
        }))}
        placeholder="输入消息"
      />
      <button onClick={sendMessage}>发送</button>
      <CurChatComponent />
      <h2>当前在线的用户（不包含自己哦）</h2>
      {state.curOnline
        .filter((session) => session !== state.sessionId)
        .map((session, index) => (
          <div key={session}>
            <p>{session}</p>
            <button onClick={() => handleClick(session)}>向TA发起聊天！</button>
          </div>
        ))}
    </div>
  );
};

export { ChatPage };