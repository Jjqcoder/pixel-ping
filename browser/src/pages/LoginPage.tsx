import React, { useState } from 'react';
import { Input, Button, Tabs } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('login');

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = () => {
    console.log('登录用户名:', username);
    console.log('登录密码:', password);
  };

  const handleRegister = () => {
    console.log('注册用户名:', username);
    console.log('注册密码:', password);
  };

  const onTabChange = (key) => {
    setActiveTab(key);
  };

  return (
    <div style={{ width: 400, margin: '50px auto', padding: 20, border: '1px solid #ccc', borderRadius: 5 }}>
      <Tabs activeKey={activeTab} onChange={onTabChange} centered>
        <Tabs.TabPane tab="登录" key="login" />
        <Tabs.TabPane tab="注册" key="register" />
      </Tabs>

      <div style={{ marginTop: 20 }}>
        <Input
          prefix={<UserOutlined />}
          placeholder="请输入用户名"
          value={username}
          onChange={handleUsernameChange}
          style={{ marginBottom: 15 }}
        />
        <Input
          prefix={<LockOutlined />}
          type="password"
          placeholder="请输入密码"
          value={password}
          onChange={handlePasswordChange}
          style={{ marginBottom: 20 }}
        />
        <Button
          type="primary"
          block
          onClick={activeTab === 'login' ? handleLogin : handleRegister}
        >
          {activeTab === 'login' ? '登录' : '注册'}
        </Button>
      </div>
    </div>
  );
};

export { LoginPage }