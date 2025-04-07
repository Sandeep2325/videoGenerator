'use client'

import { Player } from '@remotion/player'
import { useCallback, useState } from 'react'
import {
  Box,
  Button,
  VStack,
  Text,
  useToast,
  Progress,
} from '@chakra-ui/react'
import { MyVideo } from './MyVideo'

interface VideoPreviewProps {
  script: {
    scenes: {
      sceneNumber: number;
      duration: number;
      visualDescription: string;
      narration: string;
      backgroundMusic: string;
      transitions: string;
    }[];
    totalDuration: number;
    voiceStyle: string;
    musicStyle: string;
  }
}

export function VideoPreview({ script }: VideoPreviewProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const toast = useToast()

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true)
    setProgress(0)
    
    try {
      // Simulate video generation progress
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + 10
        })
      }, 1000)

      // TODO: Implement actual video generation with Remotion
      await new Promise((resolve) => setTimeout(resolve, 10000))

      toast({
        title: 'Video generated',
        description: 'Your video is ready to preview',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate video',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsGenerating(false)
    }
  }, [toast])

  return (
    <VStack spacing={6} align="stretch">
      <Box>
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          Video Preview
        </Text>
        
        {isGenerating ? (
          <Box>
            <Text mb={2}>Generating video...</Text>
            <Progress value={progress} size="sm" colorScheme="brand" />
          </Box>
        ) : (
          <Box>
            <Player
              component={MyVideo}
              inputProps={{ script }}
              durationInFrames={script.totalDuration * 30} // Assuming 30fps
              compositionWidth={1920}
              compositionHeight={1080}
              fps={30}
              style={{
                width: '100%',
                aspectRatio: '16/9',
              }}
              controls
            />
          </Box>
        )}
      </Box>

      <Button
        colorScheme="brand"
        onClick={handleGenerate}
        isLoading={isGenerating}
        loadingText="Generating..."
      >
        Generate Video
      </Button>
    </VStack>
  )
} 