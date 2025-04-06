import { useCallback } from 'react'
import { Composition } from 'remotion'
import { Scene } from './Scene'

interface MyVideoProps {
  script: {
    scenes: Array<{
      sceneNumber: number
      duration: number
      visualDescription: string
      narration: string
      backgroundMusic: string
      transitions: string
    }>
    totalDuration: number
    voiceStyle: string
    musicStyle: string
  }
}

export const MyVideo: React.FC<MyVideoProps> = ({ script }) => {
  const renderScene = useCallback(
    (scene: typeof script.scenes[0], index: number) => {
      return (
        <Composition
          key={scene.sceneNumber}
          id={`scene-${scene.sceneNumber}`}
          component={Scene as React.ComponentType<{ scene: typeof scene; isFirst: boolean; isLast: boolean }>}
          durationInFrames={scene.duration * 30}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            scene,
            isFirst: index === 0,
            isLast: index === script.scenes.length - 1,
          }}
        />
      )
    },
    [script.scenes]
  )

  return (
    <>
      {script.scenes.map((scene, index) => renderScene(scene, index))}
    </>
  )
} 