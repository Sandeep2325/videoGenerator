export interface Scene {
  sceneNumber: number;
  description: string;
  dialogue: string;
  duration: number;
  footageUrl: string[];
  voiceoverUrl?: string;
  transcription?: string;
} 