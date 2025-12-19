import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

/**
 * StyleVision Pro 入口引导
 * 确保 DOM 结构完整后再初始化 React 根节点
 */
const initApp = () => {
  const container = document.getElementById('root');
  
  if (!container) {
    console.error("Fatal Error: Root container not found");
    return;
  }

  try {
    const root = ReactDOM.createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.info("StyleVision Pro: UI Core Mounted Successfully");
  } catch (err) {
    console.error("StyleVision Pro: Mount Failed", err);
  }
};

// 监听 DOM 加载状态
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// 全局异常捕捉，防止渲染静默失败
window.onerror = (msg, url, line) => {
  console.error(`Runtime Error: ${msg} at ${url}:${line}`);
  return false;
};