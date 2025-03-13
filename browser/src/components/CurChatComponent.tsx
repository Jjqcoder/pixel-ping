import React, { useState, useEffect } from 'react';

const CurChatComponent = () => {
  const [curChatValue, setCurChatValue] = useState(sessionStorage.getItem('curChat') || '请选择聊天对象');

  useEffect(() => {
    // 定义一个轮询函数，定期检查curChat的值
    /*
      sessionStorage的storage事件在同一个页面中不会触发，它主要用于监听其他页面或标签页对sessionStorage的修改。
      所以暂时退而求其次 使用轮询的方式来
    */
    const intervalId = setInterval(() => {
      const currentValue = sessionStorage.getItem('curChat') || '请选择聊天对象';
      if (currentValue !== curChatValue) {
        (globalThis as any).curChat = currentValue
        setCurChatValue(currentValue);
      }
    }, 1000); // 每1秒检查一次 当前curChat的值是否发生了变化

    // 组件卸载时清除定时器
    return () => clearInterval(intervalId);
  }, [curChatValue]);

  return (
    <div>
      <p>当前curChat的值为：{curChatValue}</p>
    </div>
  );
};

export { CurChatComponent };