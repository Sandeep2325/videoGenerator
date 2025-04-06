'use client'

import { Box, Container, Heading, Text, VStack, Flex, Icon } from '@chakra-ui/react'
import { VideoInputForm } from '@/components/VideoInputForm'
import { FaVideo, FaRobot, FaMicrophone } from 'react-icons/fa'

export default function Home() {
  return (
    <Box
      minH="100vh"
      bgGradient="linear(to-br, brand.100, brand.50)"
      pt={0}
      pb={4}
    >
      <Container maxW="container.xl" centerContent>
        <VStack spacing={6} align="center" w="full">
          <Box textAlign="center" w="full" maxW="800px">
            <Heading
              as="h1"
              size="2xl"
              mb={4}
              bgGradient="linear(to-r, gradient.start, gradient.end)"
              bgClip="text"
              lineHeight="1.2"
            >
              Create Stunning Videos with AI
            </Heading>
            <Text fontSize="lg" color="gray.700" mb={6}>
              Transform your ideas into professional videos with AI-generated scripts and natural voiceovers.
            </Text>
            <Flex gap={3} wrap="wrap" justify="center">
              <Box
                p={3}
                borderRadius="lg"
                bg="white"
                boxShadow="md"
                _hover={{ 
                  transform: 'translateY(-2px)', 
                  boxShadow: 'lg',
                  bgGradient: 'linear(to-r, brand.50, white)'
                }}
                transition="all 0.2s"
              >
                <Icon as={FaVideo} boxSize={5} color="gradient.start" mb={1} />
                <Text fontSize="sm" fontWeight="medium">AI Script Generation</Text>
              </Box>
              <Box
                p={3}
                borderRadius="lg"
                bg="white"
                boxShadow="md"
                _hover={{ 
                  transform: 'translateY(-2px)', 
                  boxShadow: 'lg',
                  bgGradient: 'linear(to-r, brand.50, white)'
                }}
                transition="all 0.2s"
              >
                <Icon as={FaRobot} boxSize={5} color="gradient.start" mb={1} />
                <Text fontSize="sm" fontWeight="medium">Smart Editing</Text>
              </Box>
              <Box
                p={3}
                borderRadius="lg"
                bg="white"
                boxShadow="md"
                _hover={{ 
                  transform: 'translateY(-2px)', 
                  boxShadow: 'lg',
                  bgGradient: 'linear(to-r, brand.50, white)'
                }}
                transition="all 0.2s"
              >
                <Icon as={FaMicrophone} boxSize={5} color="gradient.start" mb={1} />
                <Text fontSize="sm" fontWeight="medium">Natural Voiceovers</Text>
              </Box>
            </Flex>
          </Box>
          
          <Box
            bg="white"
            borderRadius="xl"
            boxShadow="xl"
            p={6}
            position="relative"
            overflow="hidden"
            w="full"
            maxW="800px"
            _before={{
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              bgGradient: 'linear(to-r, gradient.start, gradient.end)',
            }}
          >
            <VideoInputForm />
          </Box>
        </VStack>
      </Container>
    </Box>
  )
}
