import { 
  AbsoluteFill, 
  Audio, 
  Img, 
  OffthreadVideo, 
  useVideoConfig
} from 'remotion';
import { TransitionSeries, springTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import { Scene } from '@/types/video';

interface VideoCompositionProps {
  scenes: Scene[];
}

export const VideoComposition: React.FC<VideoCompositionProps> = ({ scenes }) => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <TransitionSeries>
        {scenes.map((scene, index) => (
          <>
            <TransitionSeries.Sequence durationInFrames={scene.duration * fps}>
              <div style={{ width: '100%', height: '100%' }}>
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
                    startFrom={0}
                    endAt={scene.duration * fps}
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
            </TransitionSeries.Sequence>

            {/* Add transition between scenes */}
            {index < scenes.length - 1 && (
              <TransitionSeries.Transition
                presentation={index % 2 === 0 ? fade() : slide()}
                timing={springTiming({ config: { damping: 200 } })}
              />
            )}
          </>
        ))}
      </TransitionSeries>
    </AbsoluteFill>
  );
};

