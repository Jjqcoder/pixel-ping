import {useEffect, useState} from 'react'
import {ToastContainer, toast} from 'react-toastify'
import {CurChatComponent} from './../components/CurChatComponent'
import {ChatPageState, SendMessagePayload, SessionId, WebSocketMessage} from './../types'

const ChatPage = () => {
    // 使用 ChatPageState 类型定义状态
    const [state, setState] = useState<ChatPageState>({
        messages: [],
        input: '',
        socket: null,
        curOnline: [],
        sessionId: 'sessionId获取失败'
    })

    useEffect(() => {
        const wsBaseUrl = import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:3000'
        const ws = new WebSocket(wsBaseUrl)
        setState(prevState => ({...prevState, socket: ws}))

        // 连接成功
        ws.onopen = () => {
            console.log('WebSocket连接成功')
        }

        // 接收信息
        ws.onmessage = event => {
            const message: WebSocketMessage = JSON.parse(event.data)
            // console.log("收到消息！！:", message);

            if (message.type === 'sessionMap') {
                setState(prevState => ({
                    ...prevState,
                    curOnline: message.data
                }))
            } else if (message.type === 'sessionId') {
                console.log('我的sessionId是', message.data)
                setState(prevState => ({
                    ...prevState,
                    sessionId: message.data
                }))
            } else if (message.type === 'message') {
                // console.log('😀收到信息', message);
                setState(prevState => ({
                    ...prevState,
                    messages: [...prevState.messages, `【${message.data.from}】向【我】发送的信息: ${message.data.msg}`]
                }))
            }
        }

        // 连接处理
        ws.onerror = error => {
            console.error('WebSocket发生错误:', error)
        }

        // 连接关闭
        ws.onclose = () => {
            console.log('WebSocket连接关闭')
        }

        // 组件卸载时关闭连接
        return () => {
            ws.close()
        }
    }, [])

    // 发送信息
    const sendMessage = () => {
        const {curChat} = globalThis as any
        const {input, socket} = state

        if (!curChat || curChat === '请选择聊天对象') {
            toast(`请选择聊天对象，您当前的聊天对象是【${curChat}】`)
        } else if (input.trim() !== '' && socket) {
            if (socket.readyState === WebSocket.OPEN) {
                const payload: SendMessagePayload = {to: curChat, msg: input}
                socket.send(JSON.stringify(payload))
                setState(prevState => ({
                    ...prevState,
                    messages: [...prevState.messages, `【我】向【${curChat}】发送的信息：${input}`],
                    input: ''
                }))
            } else {
                console.error('WebSocket未连接，无法发送消息')
            }
        } else {
            toast('您未输入内容或websocket未连接，无法发送消息')
        }
    }

    const handleClick = (session: SessionId) => {
        sessionStorage.setItem('curChat', session)
        toast(`您可以向【${session}】发送信息啦！${sessionStorage.getItem('curChat')}`)
    }

    return (
        <div style={styles.container}>
            <ToastContainer />
            <div style={styles.header}>
                <h1 style={styles.title}>pixel-ping</h1>
            </div>

            {/* 展示当前会话的 sessionId */}
            <div style={styles.sessionIdContainer}>
                {state.sessionId ? (
                    <p style={styles.sessionIdText}>我的 sessionId 是: 【{state.sessionId}】</p>
                ) : (
                    <p style={styles.sessionIdText}>正在获取 sessionId...</p>
                )}
            </div>

            <div style={styles.mainContent}>
                <div style={styles.messagesContainer}>
                    <h2 style={styles.messagesTitle}>消息</h2>
                    <div style={styles.messagesList}>
                        {state.messages.map((message, index) => (
                            <div key={index} style={styles.messageItem}>
                                <p style={styles.messageText}>{message}</p>
                            </div>
                        ))}
                    </div>

                    <div style={styles.inputContainer}>
                        <input
                            type='text'
                            value={state.input}
                            onChange={e =>
                                setState(prevState => ({
                                    ...prevState,
                                    input: e.target.value
                                }))
                            }
                            placeholder='输入消息'
                            style={styles.input}
                        />
                        <button onClick={sendMessage} style={styles.sendButton}>
                            发送
                        </button>
                    </div>
                </div>

                <div style={styles.onlineUsersContainer}>
                    <h2 style={styles.onlineUsersTitle}>当前在线的用户（不包含自己哦）</h2>
                    <div style={styles.usersList}>
                        {state.curOnline
                            .filter(session => session !== state.sessionId)
                            .map(session => (
                                <div key={session} style={styles.userItem}>
                                    <p style={styles.userName}>{session}</p>
                                    <button onClick={() => handleClick(session)} style={styles.chatButton}>
                                        向TA发起聊天！
                                    </button>
                                </div>
                            ))}
                    </div>
                </div>
            </div>

            {/* 光线变化效果 */}
            <div style={styles.lightEffect}></div>

            {/* 鼠标移动特效 */}
            <div style={styles.mouseEffect}></div>

            {/* 当前聊天组件 */}
            <CurChatComponent />
        </div>
    )
}
// 折叠下方css代码
// #region
// 样式定义
const styles = {
    container: {
        width: '100%',
        minHeight: '100vh',
        padding: '20px',
        boxSizing: 'border-box',
        position: 'relative',
        backgroundColor: '#f5f7fa', // 背景色，可根据需求调整
        color: '#333',
        fontFamily: 'Arial, sans-serif',
        transition: 'all 0.3s ease'
    },
    header: {
        textAlign: 'center',
        marginBottom: '30px'
    },
    title: {
        fontSize: '2.5rem',
        fontWeight: 'bold',
        color: '#2c3e50',
        textShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    sessionIdContainer: {
        textAlign: 'center',
        marginBottom: '30px'
    },
    sessionIdText: {
        fontSize: '1.2rem',
        color: '#2c3e50'
    },
    mainContent: {
        display: 'flex',
        gap: '30px',
        marginBottom: '30px'
    },
    messagesContainer: {
        flex: 2,
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '20px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    },
    messagesTitle: {
        fontSize: '1.5rem',
        color: '#2c3e50',
        marginBottom: '20px'
    },
    messagesList: {
        maxHeight: '400px',
        overflowY: 'auto',
        marginBottom: '20px'
    },
    messageItem: {
        padding: '10px',
        marginBottom: '10px',
        backgroundColor: '#f8f9fa',
        borderRadius: '5px',
        borderLeft: '4px solid #3498db'
    },
    messageText: {
        fontSize: '1rem',
        color: '#333'
    },
    inputContainer: {
        display: 'flex',
        gap: '10px'
    },
    input: {
        flex: 1,
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ddd',
        fontSize: '1rem'
    },
    sendButton: {
        padding: '10px 20px',
        backgroundColor: '#3498db',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    },
    sendButtonHover: {
        backgroundColor: '#2980b9'
    },
    onlineUsersContainer: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '20px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    },
    onlineUsersTitle: {
        fontSize: '1.5rem',
        color: '#2c3e50',
        marginBottom: '20px'
    },
    usersList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
    },
    userItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px',
        borderRadius: '5px',
        backgroundColor: '#f8f9fa',
        transition: 'all 0.3s ease'
    },
    userItemHover: {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    },
    userName: {
        fontSize: '1rem',
        color: '#333'
    },
    chatButton: {
        padding: '5px 10px',
        backgroundColor: '#2ecc71',
        color: 'white',
        border: 'none',
        borderRadius: '3px',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    },
    chatButtonHover: {
        backgroundColor: '#27ae60'
    },
    lightEffect: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.3) 0%, transparent 70%)',
        zIndex: -1,
        animation: 'lightMove 8s infinite linear',
        opacity: 0.5
    },
    mouseEffect: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999
    },
    curChatComponent: {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '15px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        zIndex: 1000
    }
} as any // 设置为 any 避免ts校验报错

// 添加动画关键帧
const keyframes = `
  @keyframes lightMove {
    0% { background-position: 0% 0%; }
    100% { background-position: 100% 100%; }
  }
`

// 添加鼠标移动特效的 CSS
const mouseEffectCSS = `
  .mouse-effect-particle {
    position: fixed;
    width: 10px;
    height: 10px;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    pointer-events: none;
    transform: translate(-50%, -50%);
    animation: particleFade 1.5s ease-out forwards;
  }

  @keyframes particleFade {
    0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    100% { opacity: 0; transform: translate(-50%, -50%) scale(2); }
  }
`

// 将关键帧和鼠标特效 CSS 添加到文档中
const styleElement = document.createElement('style')
styleElement.textContent = keyframes + mouseEffectCSS
document.head.appendChild(styleElement)

// 鼠标移动时创建粒子特效
document.addEventListener('mousemove', e => {
    const particle = document.createElement('div')
    particle.className = 'mouse-effect-particle'
    particle.style.left = e.clientX + 'px'
    particle.style.top = e.clientY + 'px'
    document.querySelector('.mouse-effect')!.appendChild(particle)

    // 1.5秒后移除粒子
    setTimeout(() => {
        particle.remove()
    }, 1500)
})

// #endregion

export {ChatPage}
