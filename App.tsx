
import React, { useState, useRef, useEffect } from 'react';
import Layout from './components/Layout';
import { editFashionImage } from './services/geminiService';
import { AppState, GenerationHistory } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('stylevision_pro_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...parsed, isGenerating: false, error: null };
      } catch (e) {
        return {
          baseImage: null, referenceImages: [], isGenerating: false, history: [], error: null,
          parameters: { styleStrength: 85, lightingIntensity: 70, detailRetention: 95 }
        };
      }
    }
    return {
      baseImage: null, referenceImages: [], isGenerating: false, history: [], error: null,
      parameters: { styleStrength: 85, lightingIntensity: 70, detailRetention: 95 }
    };
  });
  
  const [features, setFeatures] = useState({
    angle: 'original',
    whiteBg: false,
    extendBody: false,
    ethnicity: 'original',
    weight: 50,
    height: 50,
  });

  const [prompt, setPrompt] = useState('');
  const baseFileInputRef = useRef<HTMLInputElement>(null);
  const refFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('stylevision_pro_state', JSON.stringify({
      baseImage: state.baseImage,
      referenceImages: state.referenceImages,
      history: state.history,
      parameters: state.parameters
    }));
  }, [state.baseImage, state.referenceImages, state.history, state.parameters]);

  const generate = async () => {
    if (!state.baseImage) return;
    setState(prev => ({ ...prev, isGenerating: true, error: null }));
    try {
      const result = await editFashionImage(
        state.baseImage, 
        state.referenceImages, 
        prompt, 
        { ...state.parameters, ...features }
      );
      
      const newEntry: GenerationHistory = {
        id: Math.random().toString(36).substr(2, 9),
        originalImage: state.baseImage,
        referenceImages: [...state.referenceImages],
        resultImage: result,
        prompt: prompt || "专业视觉合成",
        parameters: { ...state.parameters },
        timestamp: Date.now(),
      };

      setState(prev => ({
        ...prev,
        isGenerating: false,
        history: [newEntry, ...prev.history],
      }));
    } catch (err: any) {
      setState(prev => ({ ...prev, isGenerating: false, error: err.message }));
    }
  };

  return (
    <Layout>
      <div className="flex flex-1 overflow-hidden">
        {/* 左侧控制台 */}
        <aside className="w-[480px] border-r border-white/10 flex flex-col bg-[#0f0f0f] overflow-y-auto">
          <div className="p-8 space-y-10">
            <header className="space-y-2">
              <h3 className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.3em]">配置中心 / CONFIG</h3>
              <p className="text-white/40 text-xs">调整引擎参数以获得最佳商用效果</p>
            </header>

            {/* 底图上传 */}
            <div className="space-y-4">
              <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest">基础底图 (模特/服装原图)</label>
              <div 
                onClick={() => baseFileInputRef.current?.click()}
                className="group relative h-48 border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all overflow-hidden"
              >
                {state.baseImage ? (
                  <img src={state.baseImage} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                ) : (
                  <div className="text-center space-y-2">
                    <span className="text-2xl opacity-40">📸</span>
                    <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">点击或拖拽上传</p>
                  </div>
                )}
                <input type="file" ref={baseFileInputRef} className="hidden" accept="image/*" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => setState(prev => ({ ...prev, baseImage: ev.target?.result as string }));
                    reader.readAsDataURL(file);
                  }
                }} />
              </div>
            </div>

            {/* 模特属性控制 */}
            <div className="space-y-6">
              <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest">模特特征定制</label>
              <div className="grid grid-cols-2 gap-4">
                 <select 
                   value={features.ethnicity}
                   onChange={(e) => setFeatures({...features, ethnicity: e.target.value})}
                   className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                 >
                   <option value="original">保持原有人种</option>
                   <option value="asian">东亚/中亚人种</option>
                   <option value="caucasian">欧美/高加索人种</option>
                   <option value="african">非洲人种</option>
                 </select>
                 <select 
                   value={features.angle}
                   onChange={(e) => setFeatures({...features, angle: e.target.value})}
                   className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                 >
                   <option value="original">保持拍摄角度</option>
                   <option value="front">正面视图 (Front)</option>
                   <option value="side">侧面 45° (Side)</option>
                   <option value="back">背面视图 (Back)</option>
                 </select>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-white/30 uppercase font-bold">体型倾向 (体重)</span>
                  <span className="text-xs text-indigo-400 font-mono">{features.weight}%</span>
                </div>
                <input type="range" min="0" max="100" value={features.weight} onChange={(e) => setFeatures({...features, weight: parseInt(e.target.value)})} className="w-full accent-indigo-500" />
              </div>
            </div>

            {/* 核心指令 */}
            <div className="space-y-4">
              <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest">换装指令 / PROMPT</label>
              <textarea 
                placeholder="例如：将上衣替换为真丝质感，增加自然褶皱，光影调整为下午三点的侧逆光..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-white h-32 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-white/10"
              />
            </div>

            <button 
              onClick={generate}
              disabled={state.isGenerating || !state.baseImage}
              className="w-full py-5 bg-indigo-600 rounded-2xl font-bold text-[11px] text-white uppercase tracking-[0.3em] hover:bg-indigo-500 hover:shadow-[0_0_30px_rgba(79,70,229,0.3)] disabled:opacity-30 disabled:hover:shadow-none transition-all"
            >
              {state.isGenerating ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  渲染中...
                </span>
              ) : "启动 AI 拍摄任务"}
            </button>
          </div>
        </aside>

        {/* 右侧展示区 */}
        <div className="flex-1 bg-black p-12 overflow-y-auto">
          {state.error && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs">
              ⚠️ 引擎提示: {state.error}
            </div>
          )}

          {state.history.length === 0 && !state.isGenerating ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-20">
              <div className="text-6xl">✨</div>
              <div className="space-y-2">
                <p className="text-xl font-light tracking-widest uppercase">等待任务下达</p>
                <p className="text-xs">上传底图并配置参数后开启生成</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
              {state.isGenerating && (
                 <div className="aspect-[3/4] bg-white/5 rounded-3xl animate-pulse flex items-center justify-center border border-white/5">
                    <p className="text-[10px] text-white/20 uppercase tracking-[0.5em] font-bold">渲染计算中...</p>
                 </div>
              )}
              {state.history.map((item) => (
                <div key={item.id} className="group relative bg-[#0f0f0f] rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
                  <img src={item.resultImage} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-8 flex flex-col justify-end">
                    <p className="text-[10px] text-white/80 font-mono mb-2 uppercase tracking-widest">{item.prompt}</p>
                    <div className="flex gap-2">
                       <button className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg text-[10px] text-white font-bold uppercase hover:bg-white hover:text-black transition-all">下载高清图</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default App;
