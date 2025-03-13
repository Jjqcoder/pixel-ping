import React, { useEffect, useState } from "react";
import { CurChatComponent } from "./../components/CurChatComponent";

const ChatPage = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>("");
  const [socket, setSocket] = useState<WebSocket | null>(null); // 存储 WebSocket 实例
  const [curOnline, setCurOnline] = useState<string[]>([]);// 当前在线的用户

  useEffect(() => {
    // 创建 WebSocket 实例
    const ws = new WebSocket("ws://localhost:3000");

    // 将 WebSocket 实例存储到状态中
    setSocket(ws);

    ws.onopen = () => {
      console.log("WebSocket连接成功");
    };

    ws.onmessage = (event) => {
      const message = event.data;
      // console.log("收到消息:", JSON.parse(message).data);
      console.log("收到消息:", JSON.parse(message));
      // 如果收到的消息是sessionMap, 则更新当前在线的用户
      if (JSON.parse(message).type === 'sessionMap') {
        setCurOnline(JSON.parse(message).data)
      }
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    ws.onerror = (error) => {
      console.error("WebSocket发生错误:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket连接关闭");
    };

    // 组件卸载时关闭 WebSocket 连接
    return () => {
      ws.close();
    };
  }, []);

  // 发送消息
  const sendMessage = () => {
    if (input.trim() !== "" && socket) {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(input);
        setMessages((prevMessages) => [...prevMessages, `我: ${input}`]);
        setInput("");
      } else {
        console.error("WebSocket未连接，无法发送消息");
      }
    }
  };

  // 设置当前的聊天对象
  const handleClick = (session: string) => {
    sessionStorage.setItem('curChat', session);
    console.log("点击了", session);
  }

  return (
    <div>
      <h1>Chat Page</h1>
      <div>
        {messages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="输入消息"
      />
      <button onClick={sendMessage}>发送</button>
      {/* 当前的聊天对象 */}
      <CurChatComponent/>
      {/* 当前在线的用户 */}
      <h2>当前在线的用户</h2>
      {curOnline.map((session, index)=>{
        return <>
        {/* 唯一的key帮助react高效更新DOM */}
        <div key={session}>
          <p>{session}</p>
          <button onClick={()=>handleClick(session)}>向TA发起聊天！</button>
        </div>
        </>
      })}
    </div>
  );
};

export { ChatPage };