//i need remotion composition here where i will pass array of scenes and it will generate video
// sceneNumber: number
//   description: string
//   dialogue: string
//   duration: number
//   footageKeywords: string[]
//   voiceoverUrl: string
//   transcription: string

import { 
  AbsoluteFill, 
  Audio, 
  Img, 
  OffthreadVideo, 
  useVideoConfig
} from 'remotion';
import { Scene } from '@/types/video';

interface VideoCompositionProps {
  scenes: Scene[];
}

export const VideoComposition: React.FC<VideoCompositionProps> = ({ scenes }) => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      {scenes.map((scene, index) => {
        const startFrame = scenes.slice(0, index).reduce((acc, s) => acc + s.duration * fps, 0);
        const endFrame = startFrame + scene.duration * fps;

        // Different transitions for each scene
        const transitions = [
          { name: 'fade', duration: 30 },
          { name: 'slide', duration: 30 },
          { name: 'zoom', duration: 30 },
          { name: 'rotate', duration: 30 },
          { name: 'flip', duration: 30 }
        ];

        const currentTransition = transitions[index % transitions.length];

        return (
          <div key={scene.sceneNumber}>
            {index > 0 && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  ...(currentTransition.name === 'fade' && { opacity: 0 }),
                  ...(currentTransition.name === 'slide' && { transform: 'translateX(100%)' }),
                  ...(currentTransition.name === 'zoom' && { transform: 'scale(0.8)' }),
                  ...(currentTransition.name === 'rotate' && { transform: 'rotate(90deg)' }),
                  ...(currentTransition.name === 'flip' && { transform: 'rotateY(90deg)' }),
                  transition: `all ${currentTransition.duration / fps}s ease-in-out`
                }}
              />
            )}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                transition: `all ${currentTransition.duration / fps}s ease-in-out`
              }}
            >
              {/* Media Content */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', height: '100%' }}>
                {scene.footageUrl.map((url, urlIndex) => (
                  <div key={urlIndex} style={{ width: '100%', height: '100%' }}>
                    {url.endsWith('.mp4') ? (
                      <OffthreadVideo
                        src={url}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <Img
                        src={url}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Voiceover */}
              {scene.voiceoverUrl && (
                <Audio
                  src={scene.voiceoverUrl}
                  startFrom={startFrame}
                  endAt={endFrame}
                />
              )}

              {/* Scene Description Overlay */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '20px',
                  background: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  fontSize: '24px',
                  textAlign: 'center',
                }}
              >
                {scene.description}
              </div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

