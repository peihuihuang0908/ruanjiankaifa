
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// 确保 DOM 加载完成后挂载
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("StyleVision Engine: 找不到 root 节点，渲染中止。");
} else {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

// 捕获异步渲染中的未处理错误
window.addEventListener('unhandledrejection', (event) => {
  console.warn('捕获到异步异常:', event.reason);
});
