
# StyleVision Pro - 专业级 AI 时尚拍摄引擎

![Status](https://img.shields.io/badge/Status-Production--Ready-green)
![Tech](https://img.shields.io/badge/Tech-React%20%7C%20Gemini%20API%20%7C%20Capacitor-blue)

StyleVision Pro 是一款集成了顶尖时尚审美与数字图像处理能力的 AI 换装系统。通过 Google Gemini API 驱动，它能够实现商用级的高保真服装替换与模特多角度生成。

## 🌟 核心功能 (Core Features)

- **高保真局部换装**：精准识别材质纹理，保留自然光影。
- **模特属性定制**：支持全球化人种切换、体型调节及姿态保持。
- **多角度一致性**：从单张参考图生成正面、侧面及背面的商用视图。
- **全平台支持**：支持 Web (PWA)、Android (APK) 及 iOS 分发。

## 🚀 技术栈 (Tech Stack)

- **Frontend**: React 19, Tailwind CSS
- **AI Engine**: Google GenAI SDK (Gemini 2.5 Flash / Pro)
- **Mobile Bridge**: Capacitor CLI
- **State Persistence**: Browser LocalStorage & Project Export (.vision)

## 🛠️ 如何在本地运行 (Installation)

1. **克隆项目**
   ```bash
   git clone https://github.com/YOUR_USERNAME/stylevision-pro.git
   cd stylevision-pro
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置环境**
   在根目录创建 `.env` 文件并填入您的 API KEY:
   ```env
   API_KEY=YOUR_GEMINI_API_KEY
   ```

4. **启动开发服务器**
   ```bash
   npm run dev
   ```

## 📄 开源协议
MIT License
