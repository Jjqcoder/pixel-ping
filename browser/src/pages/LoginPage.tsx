import {LockOutlined, UserOutlined} from '@ant-design/icons'
import {Button, Input, Tabs} from 'antd'
import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {ToastContainer, toast} from 'react-toastify'
import {Api} from '../api'

// 创建Api实例
const api = new Api()

const LoginPage = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [activeTab, setActiveTab] = useState('login')
    const navigate = useNavigate() // 获取 useNavigate 钩子

    const handleUsernameChange = (e: any) => {
        setUsername(e.target.value)
    }

    const handlePasswordChange = (e: any) => {
        setPassword(e.target.value)
    }

    const handleLogin = async () => {
        // 确保环境变量正确加载
        console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL)

        let res

        try {
            const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
            res = await api.post(`${apiBaseUrl}/users/login`, {username, password})
            toast(res.message)
            if (res.code === 200) {
                setTimeout(() => {
                    navigate('/chat')
                }, 1000)
            }
        } catch (error: any) {
            console.error('Login error:', error)
            toast('登录过程发生错误：' + (error.message || error))
        }
    }

    const handleRegister = async () => {
        let res

        try {
            const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
            res = await api.post(`${apiBaseUrl}/users/register`, {username, password})
            toast(res.message)
        } catch (error: any) {
            console.error('Register error:', error)
            toast('注册过程发生错误：' + (error.message || error))
        }
    }

    const onTabChange = (key: string) => {
        setActiveTab(key)
    }

    return (
        <div style={{width: 400, margin: '50px auto', padding: 20, border: '1px solid #ccc', borderRadius: 5}}>
            {/* 用于显示弹窗信息 */}
            <ToastContainer />
            <Tabs activeKey={activeTab} onChange={onTabChange} centered>
                <Tabs.TabPane tab='登录' key='login' />
                <Tabs.TabPane tab='注册' key='register' />
            </Tabs>

            <div style={{marginTop: 20}}>
                <Input
                    prefix={<UserOutlined />}
                    placeholder='请输入用户名'
                    value={username}
                    onChange={handleUsernameChange}
                    style={{marginBottom: 15}}
                />
                <Input
                    prefix={<LockOutlined />}
                    type='password'
                    placeholder='请输入密码'
                    value={password}
                    onChange={handlePasswordChange}
                    style={{marginBottom: 20}}
                />
                <Button type='primary' block onClick={activeTab === 'login' ? handleLogin : handleRegister}>
                    {activeTab === 'login' ? '登录' : '注册'}
                </Button>
            </div>
        </div>
    )
}

export {LoginPage}
