import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ScriptScene {
  sceneNumber: number
  description: string
  dialogue: string
  duration: number
  footageKeywords: string[]
  voiceoverUrl: string
  transcription: string
  footageUrls: string[]
}

interface ScriptResponse {
  scenes: ScriptScene[]
}

export interface VideoData {
  topic: string
  duration: number
  style: string
  tone: string
  targetAudience: string
  language: string
  keyPoints: string[]
  additionalNotes: string
  orientation: '9:16' | '16:9' | '1:1'
  status: 'idle' | 'generating' | 'completed' | 'error'
  error?: string
  script?: {
    scenes: ScriptScene[]
    totalDuration: number
    voiceStyle: string
    musicStyle: string
  }
  processedScenes?: ScriptScene[]
}

interface VideoStore {
  videoData: VideoData | null
  setVideoData: (data: Partial<VideoData>) => void
  updateVideoData: (data: Partial<VideoData>) => void
  clearVideoData: () => void
}

export const useVideoStore = create<VideoStore>()(
  persist(
    (set) => ({
      videoData: null,
      setVideoData: (data) => set({ videoData: data as VideoData }),
      updateVideoData: (data) =>
        set((state) => ({
          videoData: state.videoData ? { ...state.videoData, ...data } : (data as VideoData),
        })),
      clearVideoData: () => set({ videoData: null }),
    }),
    {
      name: 'video-storage',
    }
  )
) 