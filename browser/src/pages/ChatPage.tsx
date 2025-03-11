import React, { useState } from 'react';
import { Layout, Input, Button, List, Avatar, Tooltip, Card } from 'antd';
import { useMediaQuery } from 'react-responsive';

const { TextArea } = Input;

const ChatPage = () => {
  const [message, setMessage] = useState(''); // 输入的消息
  const [messages, setMessages] = useState([]); // 消息列表
  const [onlineUsers, setOnlineUsers] = useState([
    { id: 1, name: '用户1' },
    { id: 2, name: '用户2' },
    { id: 3, name: '用户3' },
  ]); // 在线用户列表

  // 判断是否是移动端
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  // 发送消息
  const sendMessage = () => {
    if (message.trim() !== '') {
      setMessages([...messages, { text: message, isMe: true }]);
      setMessage('');
    }
  };

  // 处理消息输入
  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  // 渲染消息列表
  const renderMessages = () => {
    return messages.map((msg, index) => (
      <div
        key={index}
        className={`message-item ${msg.isMe ? 'me' : ''}`}
        style={{
          display: 'flex',
          justifyContent: msg.isMe ? 'flex-end' : 'flex-start',
          margin: '8px 0',
        }}
      >
        <div
          style={{
            backgroundColor: msg.isMe ? '#4CAF50' : '#E0F2F1', // 优化配色
            padding: '8px 12px',
            borderRadius: '12px',
            maxWidth: '60%',
            wordWrap: 'break-word',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.3s ease', // 添加过渡效果
            transform: 'scale(1)',
            '&:hover': {
              transform: 'scale(1.02)',
            },
          }}
        >
          {msg.text}
        </div>
      </div>
    ));
  };

  // 渲染在线用户列表
  const renderOnlineUsers = () => {
    return (
      <Card
        style={{
          position: 'absolute',
          top: '60px',
          left: '16px',
          width: '200px',
          maxHeight: 'calc(100vh - 80px)',
          overflowY: 'auto',
          backgroundColor: '#FFFFFF', // 优化配色
          border: '1px solid #E0E0E0',
          borderRadius: '8px',
          padding: '12px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // 添加阴影
        }}
      >
        <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>
          在线用户
        </div>
        <List
          itemLayout="horizontal"
          dataSource={onlineUsers}
          renderItem={(user) => (
            <List.Item
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '8px',
                transition: 'transform 0.3s ease', // 添加过渡效果
                transform: 'scale(1)',
                '&:hover': {
                  transform: 'scale(1.02)',
                },
              }}
            >
              <Avatar
                style={{ backgroundColor: '#4CAF50', color: '#fff' }}
                icon={user.name[0]}
              />
              <span style={{ marginLeft: '8px', color: '#333333' }}>{user.name}</span>
            </List.Item>
          )}
        />
      </Card>
    );
  };

  return (
    <Layout
      style={{
        height: '100vh',
        backgroundColor: '#FAFAFA', // 优化配色
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.05)', // 添加内阴影
      }}
    >
      {/* 聊天内容区域 */}
      <Layout.Content
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          backgroundColor: '#FAFAFA', // 优化配色
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}
      >
        {renderMessages()}
      </Layout.Content>

      {/* 底部输入区域 */}
      <Layout.Footer
        style={{
          padding: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#FFFFFF', // 优化配色
          boxShadow: '0 -2px 4px rgba(0, 0, 0, 0.1)', // 添加阴影
        }}
      >
        <TextArea
          rows={isMobile ? 2 : 1}
          placeholder="请输入消息"
          value={message}
          onChange={handleInputChange}
          onPressEnter={sendMessage}
          style={{
            width: 'calc(100% - 80px)',
            backgroundColor: '#FFFFFF',
            borderColor: '#E0E0E0',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            transition: 'box-shadow 0.3s ease', // 添加过渡效果
            '&:focus': {
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
            },
          }}
        />
        <Button
          type="primary"
          onClick={sendMessage}
          style={{
            backgroundColor: '#4CAF50',
            borderColor: '#4CAF50',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            transition: 'box-shadow 0.3s ease', // 添加过渡效果
            '&:hover': {
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
            },
          }}
        >
          发送
        </Button>
      </Layout.Footer>

      {/* 在线用户列表 */}
      {renderOnlineUsers()}
    </Layout>
  );
};

export { ChatPage };