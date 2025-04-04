import React, { useState } from 'react';
import { Input, Button, Tabs } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Api } from '../api';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


// 创建Api实例
const api = new Api();

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('login');
  const navigate = useNavigate(); // 获取 useNavigate 钩子

  const handleUsernameChange = (e: any) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: any) => {
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    // console.log('登录用户名:', username);
    // console.log('登录密码:', password);

    let res;

    try {
      res = await api.post(`${import.meta.env.VITE_API_BASE_URL}/users/login`, { username, password });
      toast(res.message)
      if (res.code === 200) {
        setTimeout(() => { navigate('/chat') }, 1000)
      }
    } catch (error) {
      toast("登录过程发生错误：" + error)
    }

  };

  const handleRegister = async () => {
    // console.log('注册用户名:', username);
    // console.log('注册密码:', password);
    let res;

    try {
      res = await api.post(`${import.meta.env.VITE_API_BASE_URL}/users/register`, { username, password });
      toast(res.message)
    } catch (error) {
      toast("注册过程发生错误：" + error)
    }
  };

  const onTabChange = (key: string) => {
    setActiveTab(key);
  };

  return (
    <div style={{ width: 400, margin: '50px auto', padding: 20, border: '1px solid #ccc', borderRadius: 5 }}>
      {/* 用于显示弹窗信息 */}
      <ToastContainer />
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