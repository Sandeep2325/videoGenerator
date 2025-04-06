'use client'

import { useState } from 'react'
import {
  Box,
  Button,
  Input,
  Textarea,
  SimpleGrid,
  Heading,
} from '@chakra-ui/react'
import { useToast } from '@chakra-ui/toast'
import { VStack } from '@chakra-ui/layout'
import {
  FormControl,
  FormLabel,
} from '@chakra-ui/form-control'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const videoSchema = z.object({
  topic: z.string().min(1, 'Topic is required'),
  duration: z.string().min(1, 'Duration is required'),
  style: z.string().min(1, 'Style is required'),
  tone: z.string().min(1, 'Tone is required'),
  targetAudience: z.string().min(1, 'Target audience is required'),
  language: z.string().min(1, 'Language is required'),
  keyPoints: z.string().min(1, 'Key points are required'),
  additionalNotes: z.string().optional(),
})

type VideoFormData = z.infer<typeof videoSchema>

export function VideoInputForm() {
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VideoFormData>({
    resolver: zodResolver(videoSchema),
  })

  const onSubmit = async (data: VideoFormData) => {
    setIsLoading(true)
    try {
      // TODO: Implement API call to generate script
      console.log('Form submitted:', data)
      toast({
        title: 'Script generation started',
        description: 'We are generating your video script. This may take a few moments.',
        status: 'info',
        duration: 5000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to generate script: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
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
          loadingText="Generating..."
          _hover={{
            transform: 'translateY(-2px)',
            boxShadow: '2xl',
          }}
        >
          Generate Video Script
        </Button>
      </VStack>
    </Box>
  )
} 