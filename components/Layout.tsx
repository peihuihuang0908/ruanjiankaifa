
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#0a0a0a]">
      {/* 顶部导航 */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.4)]">
            <span className="text-white font-bold">V</span>
          </div>
          <h1 className="text-xl font-semibold tracking-tight">StyleVision <span className="text-indigo-400">Pro</span></h1>
        </div>
        <div className="flex items-center gap-4 text-sm text-white/60">
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] uppercase tracking-widest">引擎 v2.5 已就绪</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 overflow-hidden">
             <img src="https://picsum.photos/32/32?grayscale" alt="用户头像" />
          </div>
        </div>
      </header>

      {/* 主内容区域 */}
      <main className="flex-1 flex overflow-hidden">
        {children}
      </main>
    </div>
  );
};

export default Layout;
