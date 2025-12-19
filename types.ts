
export interface GenerationHistory {
  id: string;
  originalImage: string;
  referenceImages: string[];
  resultImage: string;
  prompt: string;
  parameters: GenerationParameters;
  timestamp: number;
}

export interface GenerationParameters {
  styleStrength: number;
  lightingIntensity: number;
  detailRetention: number;
}

export interface AppState {
  baseImage: string | null;
  referenceImages: string[];
  isGenerating: boolean;
  history: GenerationHistory[];
  error: string | null;
  parameters: GenerationParameters;
}
