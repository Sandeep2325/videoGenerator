import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion'
import { useEffect, useState } from 'react'

interface SceneProps {
  scene: {
    sceneNumber: number
    duration: number
    visualDescription: string
    narration: string
    backgroundMusic: string
    transitions: string
  }
  isFirst: boolean
  isLast: boolean
}

export const Scene: React.FC<SceneProps> = ({ scene, isFirst, isLast }) => {
  const frame = useCurrentFrame()
  const [imageUrl, setImageUrl] = useState<string>('')
  const [audioUrl, setAudioUrl] = useState<string>('')

  useEffect(() => {
    // TODO: Implement stock footage search and audio generation
    // This is a placeholder for actual implementation
    const fetchAssets = async () => {
      try {
        // Fetch stock footage based on visualDescription
        const imageResponse = await fetch(
          `https://api.pexels.com/videos/search?query=${encodeURIComponent(
            scene.visualDescription
          )}&per_page=1`,
          {
            headers: {
              Authorization: process.env.PEXELS_API_KEY || '',
            },
          }
        )
        const imageData = await imageResponse.json()
        setImageUrl(imageData.videos[0]?.video_files[0]?.link || '')

        // Generate audio using ElevenLabs
        const audioResponse = await fetch(
          'https://api.elevenlabs.io/v1/text-to-speech',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'xi-api-key': process.env.ELEVENLABS_API_KEY || '',
            },
            body: JSON.stringify({
              text: scene.narration,
              voice_id: 'default',
              model_id: 'eleven_monolingual_v1',
            }),
          }
        )
        const audioBlob = await audioResponse.blob()
        setAudioUrl(URL.createObjectURL(audioBlob))
      } catch (error) {
        console.error('Error fetching assets:', error)
      }
    }

    fetchAssets()
  }, [scene])

  const opacity = interpolate(
    frame,
    [0, 30, scene.duration * 30 - 30, scene.duration * 30],
    [0, 1, 1, 0]
  )

  return (
    <AbsoluteFill
      style={{
        opacity,
        backgroundColor: 'black',
      }}
    >
      {imageUrl && (
        <video
          src={imageUrl}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          autoPlay
          loop
          muted
        />
      )}
      {audioUrl && (
        <audio
          src={audioUrl}
          autoPlay
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
          }}
        />
      )}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '20px',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          color: 'white',
        }}
      >
        {scene.narration}
      </div>
    </AbsoluteFill>
  )
} 