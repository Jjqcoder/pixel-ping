import React, { useEffect, useState } from "react";
import { CurChatComponent } from "./../components/CurChatComponent";
import { ToastContainer, toast } from 'react-toastify';

const ChatPage = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>("");
  const [socket, setSocket] = useState<WebSocket | null>(null); // 存储 WebSocket 实例
  const [curOnline, setCurOnline] = useState<string[]>([]);// 当前在线的用户
  const [sessionId, setSessionId] = useState<string>('sessionId获取失败'); // 存储当前会话的 sessionId

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
      } else if (JSON.parse(message).type === 'sessionId') {
        console.log('我的sessionId是', JSON.parse(message).data)
        setSessionId(JSON.parse(message).data);
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
    console.log('查看当前的聊天对象', (globalThis as any).curChat);
    if ((globalThis as any).curChat === undefined || (globalThis as any).curChat === '请选择聊天对象') {
      // 如果未指定聊天对象 则弹窗提示
      toast('请选择聊天对象');
      // alert('请选择聊天对象');
    } else if (input.trim() !== "" && socket) {
      if (socket.readyState === WebSocket.OPEN) {
        console.log(JSON.stringify({'to': (globalThis as any).curChat, 'msg': input}));
        
        socket.send(JSON.stringify({'to': (globalThis as any).curChat, 'msg': input}));
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
      <ToastContainer/>
      <h1>Chat Page</h1>
      {/* 显示 sessionId */}
      {sessionId ? <p>我的 sessionId 是: {sessionId}</p> : <p>正在获取 sessionId...</p>}
      <h2>消息</h2>
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
      <h2>当前在线的用户（不包含自己哦）</h2>
      {curOnline.filter((session)=>session != sessionId).map((session, index)=>{
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