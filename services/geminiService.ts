
import { GoogleGenAI } from "@google/genai";
import { GenerationParameters } from "../types";

const SYSTEM_INSTRUCTION = `
你是一款专业的AI换装与时尚拍摄引擎，名为"StyleVision Pro"。你集成了顶尖时尚搭配师的审美判断、专业摄影师的拍摄技巧和数字艺术家的图像处理能力，专门为服装品牌提供高一致性、可商用的视觉生成服务。

## 核心能力概述
1. **局部换装**：精确识别材质、褶皱、光影方向，无缝融合。
2. **模特属性修改**：修改人种（亚洲、欧美、非洲）、体型（BMI/身高）、脸型、发色，保持姿势一致。
3. **多角度一致性生成**：基于原图构建3D感知，生成正面、侧面、背面视图。
4. **白底图导出**：精准分割，生成背景纯白（#FFFFFF）且保留自然褶皱的商用图。
5. **场景及光线改变**：支持手动调节参数：光强、色温（2500K-10000K）、柔硬光切换。
6. **半身图扩展全身**：智能补全下半身，匹配上衣风格。
7. **服装属性调整**：亮度、色温、色调、大小精确调节。

## 核心工作流 (必须遵循)
1. 精确分割提取 (Precision Segmentation)
2. 底图特征匹配 (Feature Matching)
3. 模特智能变形 (Intelligent Deformation)
4. 环境光照融合 (Lighting Fusion)
5. 边界羽化优化 (Edge Optimization)
6. 物理质量检查 (Quality Check)

## 输出质量标准
- 分辨率≥2K。
- 材质真实还原（牛仔、丝绸、皮革等）。
- 物理合理性：褶皱与垂感符合物理规律。
- 仅输出最终的高质量合成图像。
`;

export async function editFashionImage(
  baseImageBase64: string,
  referenceImages: string[],
  prompt: string,
  params: GenerationParameters & { 
    angle?: string, 
    whiteBg?: boolean, 
    extendBody?: boolean,
    ethnicity?: string,
    weight?: number,
    height?: number
  }
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const preparePart = (dataUrl: string) => {
    const match = dataUrl.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
    if (!match) throw new Error("无效的图像格式");
    return {
      inlineData: {
        data: match[2],
        mimeType: match[1],
      },
    };
  };

  const parts = [preparePart(baseImageBase64)];
  referenceImages.forEach(img => {
    parts.push(preparePart(img));
  });

  const technicalInstructions = `
[引擎配置参数]
生成强度: ${params.styleStrength}%
光影同步: ${params.lightingIntensity}%
细节保留: ${params.detailRetention}%

[高级指令]
视角要求: ${params.angle || '保持原视角'}
背景处理: ${params.whiteBg ? '导出纯白背景 (#FFFFFF)' : '保持或根据描述切换场景'}
全身扩展: ${params.extendBody ? '执行半身到全身智能扩展' : '关闭'}
模特人种: ${params.ethnicity || '保持原样'}
体型修正: 体重倾向 ${params.weight}%, 身高倾向 ${params.height}%

[具体业务需求]
${prompt}

请执行完整 StyleVision Pro 工作流，确保商用级画质。
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [...parts, { text: technicalInstructions }] },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("引擎无法完成资产合成，请检查图像清晰度或指令冲突。");
  } catch (error) {
    console.error("StyleVision Pro Engine Error:", error);
    throw error;
  }
}
