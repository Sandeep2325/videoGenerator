import { Composition } from 'remotion';
import { VideoComposition } from './composition';
import type { ComponentType } from 'react';
import type { Scene } from '@/types/video';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Video"
        component={VideoComposition as ComponentType<{ scenes: Scene[] }>}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          scenes: []
        }}
      />
    </>
  );
}; 