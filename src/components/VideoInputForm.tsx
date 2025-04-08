'use client'

import { useState, lazy, Suspense } from 'react'
import {
  Box,
  Button,
  Input,
  Textarea,
  SimpleGrid,
  Heading,
  useToast,
  Progress,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  VStack,
  HStack,
  Icon,
} from '@chakra-ui/react'
import {
  FormControl,
  FormLabel,
} from '@chakra-ui/form-control'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useVideoStore } from '@/store/videoStore'
import { ErrorBoundary } from './ErrorBoundary'
import { PerformanceMonitor } from '@/utils/performanceMonitor'
import { SceneProcessor } from '@/utils/sceneProcessor'
import { FaPlus, FaMobile, FaDesktop, FaSquare } from 'react-icons/fa'

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

const videoSchema = z.object({
  topic: z.string().min(1, 'Topic is required'),
  duration: z.string().min(1, 'Duration is required'),
  style: z.string().min(1, 'Style is required'),
  tone: z.string().min(1, 'Tone is required'),
  targetAudience: z.string().min(1, 'Target audience is required'),
  language: z.string().min(1, 'Language is required'),
  keyPoints: z.string().min(1, 'Key points are required'),
  additionalNotes: z.string().optional(),
  orientation: z.enum(['9:16', '16:9', '1:1']),
})

type VideoFormData = z.infer<typeof videoSchema>

// Lazy load heavy components
const SceneEditor = lazy(() => import('./SceneEditor').then(mod => ({ default: mod.SceneEditor })))
const VideoPreview = lazy(() => import('./VideoPreview').then(mod => ({ default: mod.VideoPreview })))

const monitor = PerformanceMonitor.getInstance()
const sceneProcessor = new SceneProcessor()

export function VideoInputForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState<'input' | 'edit' | 'processing'>('input')
  const [scenes, setScenes] = useState<ScriptScene[]>([])
  const [processingProgress, setProcessingProgress] = useState({
    current: 0,
    total: 0,
    message: ''
  })
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const { setVideoData, updateVideoData } = useVideoStore()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<VideoFormData>({
    resolver: zodResolver(videoSchema),
  })

  const handleSceneUpdate = (sceneNumber: number, updatedScene: ScriptScene) => {
    setScenes(prevScenes => 
      prevScenes.map(scene => 
        scene.sceneNumber === sceneNumber ? updatedScene : scene
      )
    )
  }

  const handleSceneDelete = (sceneNumber: number) => {
    setScenes(prevScenes => 
      prevScenes
        .filter(scene => scene.sceneNumber !== sceneNumber)
        .map((scene, index) => ({ ...scene, sceneNumber: index + 1 }))
    )
  }

  const handleAddScene = () => {
    setScenes(prevScenes => [
      ...prevScenes,
      {
        sceneNumber: prevScenes.length + 1,
        description: '',
        dialogue: '',
        duration: 0,
        footageKeywords: [],
        voiceoverUrl: '',
        transcription: '',
        footageUrls: []
      }
    ])
  }

  const onSubmit = async (data: VideoFormData) => {
    monitor.startOperation('formSubmit')
    setIsLoading(true)
    
    try {
      setVideoData({
        ...data,
        duration: Number(data.duration),
        keyPoints: data.keyPoints.split(',').map(point => point.trim()),
        status: 'generating',
        orientation: data.orientation
      })

      const response = await fetch('/api/process-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Failed to generate script')

      const { script, status } = await response.json()
      
      if (status === 'script_generated') {
        // Process scenes in batches
        script.scenes.forEach(scene => sceneProcessor.addToQueue(scene))
        
        setScenes(script.scenes)
        setCurrentStep('edit')
        onOpen()
      }
    } catch (error) {
      updateVideoData({
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
      
      toast({
        title: 'Error',
        description: `Failed to generate script: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
      monitor.endOperation('formSubmit')
    }
  }

  return (
    <ErrorBoundary>
      <Box 
        as="form" 
        onSubmit={handleSubmit(onSubmit)}
        bg="white"
        p={8}
        borderRadius="2xl"
        boxShadow="2xl"
        maxW="3xl"
        mx="auto"
        bgGradient="linear(to-br, white, brand.50)"
      >
        <VStack spacing={8} align="stretch">
          <Heading size="xl" color="brand.600" textAlign="center" mb={4}>
            Create Your Video Script
          </Heading>

          {isLoading && (
            <Box>
              <Text mb={2}>Processing your video...</Text>
              <Progress
                size="sm"
                isIndeterminate
                colorScheme="brand"
              />
            </Box>
          )}

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <FormControl isInvalid={!!errors.topic}>
              <FormLabel fontSize="lg" fontWeight="medium">Video Topic</FormLabel>
              <Input
                placeholder="Enter your video topic"
                size="lg"
                {...register('topic')}
              />
            </FormControl>

            <FormControl isInvalid={!!errors.duration}>
              <FormLabel fontSize="lg" fontWeight="medium">Video Duration</FormLabel>
              <Input
                as="select"
                placeholder="Select duration"
                size="lg"
                {...register('duration')}
              >
                <option value="30">30 seconds</option>
                <option value="60">1 minute</option>
                <option value="120">2 minutes</option>
                <option value="180">3 minutes</option>
              </Input>
            </FormControl>

            <FormControl isInvalid={!!errors.style}>
              <FormLabel fontSize="lg" fontWeight="medium">Video Style</FormLabel>
              <Input
                as="select"
                placeholder="Select style"
                size="lg"
                {...register('style')}
              >
                <option value="educational">Educational</option>
                <option value="promotional">Promotional</option>
                <option value="entertainment">Entertainment</option>
                <option value="documentary">Documentary</option>
                <option value="tutorial">Tutorial</option>
                <option value="explainer">Explainer</option>
              </Input>
            </FormControl>

            <FormControl isInvalid={!!errors.tone}>
              <FormLabel fontSize="lg" fontWeight="medium">Tone</FormLabel>
              <Input
                as="select"
                placeholder="Select tone"
                size="lg"
                {...register('tone')}
              >
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="friendly">Friendly</option>
                <option value="authoritative">Authoritative</option>
                <option value="humorous">Humorous</option>
              </Input>
            </FormControl>

            <FormControl isInvalid={!!errors.targetAudience}>
              <FormLabel fontSize="lg" fontWeight="medium">Target Audience</FormLabel>
              <Input
                as="select"
                placeholder="Select audience"
                size="lg"
                {...register('targetAudience')}
              >
                <option value="general">General Public</option>
                <option value="business">Business Professionals</option>
                <option value="students">Students</option>
                <option value="tech">Tech Enthusiasts</option>
                <option value="children">Children</option>
              </Input>
            </FormControl>

            <FormControl isInvalid={!!errors.language}>
              <FormLabel fontSize="lg" fontWeight="medium">Language</FormLabel>
              <Input
                as="select"
                placeholder="Select language"
                size="lg"
                {...register('language')}
              >
                <option value="english">English</option>
                <option value="spanish">Spanish</option>
                <option value="french">French</option>
                <option value="german">German</option>
              </Input>
            </FormControl>

            <FormControl isInvalid={!!errors.orientation}>
              <FormLabel fontSize="lg" fontWeight="medium">Video Orientation</FormLabel>
              <HStack spacing={4} width="100%" justify="space-between">
                <Button
                  type="button"
                  variant={watch('orientation') === '9:16' ? 'solid' : 'outline'}
                  colorScheme="blue"
                  leftIcon={<Icon as={FaMobile} />}
                  onClick={() => setValue('orientation', '9:16')}
                  width="30%"
                  minWidth="100px"
                >
                  Vertical (9:16)
                </Button>
                <Button
                  type="button"
                  variant={watch('orientation') === '16:9' ? 'solid' : 'outline'}
                  colorScheme="blue"
                  leftIcon={<Icon as={FaDesktop} />}
                  onClick={() => setValue('orientation', '16:9')}
                  width="30%"
                  minWidth="100px"
                >
                  Horizontal (16:9)
                </Button>
                <Button
                  type="button"
                  variant={watch('orientation') === '1:1' ? 'solid' : 'outline'}
                  colorScheme="blue"
                  leftIcon={<Icon as={FaSquare} />}
                  onClick={() => setValue('orientation', '1:1')}
                  width="30%"
                  minWidth="100px"
                >
                  Square (1:1)
                </Button>
              </HStack>
              <input type="hidden" {...register('orientation')} />
            </FormControl>
          </SimpleGrid>

          <FormControl isInvalid={!!errors.keyPoints}>
            <FormLabel fontSize="lg" fontWeight="medium">Key Points to Cover</FormLabel>
            <Textarea
              placeholder="List the main points you want to cover in the video"
              size="lg"
              minH="100px"
              {...register('keyPoints')}
            />
          </FormControl>

          <FormControl>
            <FormLabel fontSize="lg" fontWeight="medium">Additional Notes</FormLabel>
            <Textarea
              placeholder="Any specific requirements or notes for the video"
              size="lg"
              minH="100px"
              {...register('additionalNotes')}
            />
          </FormControl>

          <Button
            type="submit"
            variant="gradient"
            size="lg"
            height="16"
            fontSize="xl"
            isLoading={isLoading}
            loadingText={currentStep === 'input' ? "Generating Script..." : "Processing Video..."}
            _hover={{
              transform: 'translateY(-2px)',
              boxShadow: '2xl',
            }}
          >
            {currentStep === 'input' ? "Generate Script" : "Process Video"}
          </Button>
        </VStack>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="6xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Your Script</ModalHeader>
          <ModalBody>
            <VStack spacing={6} align="stretch">
              <Suspense fallback={<div>Loading editor...</div>}>
                {scenes.map((scene: ScriptScene) => (
                  <SceneEditor
                    key={scene.sceneNumber}
                    scene={scene}
                    onUpdate={(updatedScene: ScriptScene) => handleSceneUpdate(scene.sceneNumber, updatedScene)}
                    onDelete={() => handleSceneDelete(scene.sceneNumber)}
                  />
                ))}
              </Suspense>
              <Button onClick={handleAddScene} colorScheme="blue" variant="outline" leftIcon={<FaPlus />}>
                Add New Scene
              </Button>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={() => {
                updateVideoData({
                  status: 'completed',
                  script: { 
                    scenes,
                    totalDuration: scenes.reduce((acc, scene) => acc + scene.duration, 0),
                    voiceStyle: 'default',
                    musicStyle: 'default'
                  },
                  processedScenes: scenes
                })
                onClose()
              }}
            >
              Save Script
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {isLoading && currentStep === 'processing' && (
        <Box position="fixed" bottom={4} left={4} right={4} p={4} bg="white" borderRadius="md" boxShadow="lg">
          <Text mb={2}>{processingProgress.message}</Text>
          <Progress
            value={(processingProgress.current / processingProgress.total) * 100}
            size="sm"
            colorScheme="blue"
          />
        </Box>
      )}
    </ErrorBoundary>
  )
} 