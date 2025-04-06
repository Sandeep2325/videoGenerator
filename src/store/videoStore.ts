import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface VideoData {
  topic: string
  duration: string
  style: string
  tone: string
  targetAudience: string
  language: string
  keyPoints: string
  additionalNotes?: string
  script?: string
  status: 'idle' | 'generating' | 'completed' | 'error'
  error?: string
}

interface VideoStore {
  videoData: VideoData | null
  setVideoData: (data: VideoData) => void
  updateVideoData: (data: Partial<VideoData>) => void
  resetVideoData: () => void
}

export const useVideoStore = create<VideoStore>()(
  persist(
    (set) => ({
      videoData: null,
      setVideoData: (data) => set({ videoData: data }),
      updateVideoData: (data) => 
        set((state) => ({
          videoData: state.videoData ? { ...state.videoData, ...data } : data as VideoData
        })),
      resetVideoData: () => set({ videoData: null }),
    }),
    {
      name: 'video-storage',
    }
  )
) 