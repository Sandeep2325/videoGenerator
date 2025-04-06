import { useState } from 'react'
import {
  Box,
  Button,
  Textarea,
  Text,
  VStack,
  HStack,
  IconButton,
  useToast,
  Collapse,
  Badge,
  Input,
} from '@chakra-ui/react'
import { FaEdit, FaSave, FaTrash, FaSearch, FaVolumeUp } from 'react-icons/fa'
import { useVideoStore } from '@/store/videoStore'

interface Scene {
  sceneNumber: number
  description: string
  dialogue: string
  duration: number
  footageKeywords: string[]
  voiceoverUrl: string
  transcription: string
}

interface SceneEditorProps {
  scene: Scene
  onUpdate: (updatedScene: Scene) => void
  onDelete: () => void
}

export function SceneEditor({ scene, onUpdate, onDelete }: SceneEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedScene, setEditedScene] = useState<Scene>({
    ...scene,
    footageKeywords: scene.footageKeywords || [],
    voiceoverUrl: scene.voiceoverUrl || '',
    transcription: scene.transcription || ''
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const toast = useToast()
  const { videoData } = useVideoStore()

  const handleSave = () => {
    onUpdate(editedScene)
    setIsEditing(false)
  }

  const handleSearchFootage = async () => {
    setIsProcessing(true)
    try {
      if (!videoData) {
        throw new Error('Video data not found')
      }

      const response = await fetch('/api/search-footage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sceneNumber: scene.sceneNumber,
          description: scene.description,
          dialogue: scene.dialogue,
          orientation: videoData.orientation
        })
      })
      
      if (!response.ok) throw new Error('Failed to search footage')
      
      const { keywords, footageUrls } = await response.json()
      onUpdate({
        ...scene,
        footageKeywords: keywords || []
      })
      
      toast({
        title: 'Footage Found',
        description: `Found ${footageUrls?.length || 0} matching footage clips`,
        status: 'success',
        duration: 3000,
      })
    } catch (error) {
      console.error('Error searching footage:', error)
      toast({
        title: 'Error',
        description: 'Failed to search footage',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleGenerateVoiceover = async () => {
    setIsProcessing(true)
    try {
      const response = await fetch('/api/generate-voiceover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sceneNumber: scene.sceneNumber,
          text: scene.dialogue
        })
      })
      
      if (!response.ok) throw new Error('Failed to generate voiceover')
      
      const { voiceoverUrl, transcription } = await response.json()
      onUpdate({
        ...scene,
        voiceoverUrl: voiceoverUrl || '',
        transcription: transcription || ''
      })
      
      toast({
        title: 'Voiceover Generated',
        description: 'Successfully generated voiceover for this scene',
        status: 'success',
        duration: 3000,
      })
    } catch (error) {
      console.error('Error generating voiceover:', error)
      toast({
        title: 'Error',
        description: 'Failed to generate voiceover',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Box
      p={4}
      borderWidth="1px"
      borderRadius="lg"
      bg="white"
      boxShadow="sm"
      _hover={{ boxShadow: 'md' }}
    >
      <VStack align="stretch" spacing={4}>
        <HStack justify="space-between">
          <Text fontSize="lg" fontWeight="bold">
            Scene {scene.sceneNumber}
          </Text>
          <HStack>
            <IconButton
              aria-label="Search footage"
              icon={<FaSearch />}
              onClick={handleSearchFootage}
              isLoading={isProcessing}
              colorScheme="blue"
              variant="ghost"
            />
            <IconButton
              aria-label="Generate voiceover"
              icon={<FaVolumeUp />}
              onClick={handleGenerateVoiceover}
              isLoading={isProcessing}
              colorScheme="green"
              variant="ghost"
            />
            <IconButton
              aria-label="Edit scene"
              icon={<FaEdit />}
              onClick={() => setIsEditing(!isEditing)}
              colorScheme="gray"
              variant="ghost"
            />
            <IconButton
              aria-label="Delete scene"
              icon={<FaTrash />}
              onClick={onDelete}
              colorScheme="red"
              variant="ghost"
            />
          </HStack>
        </HStack>

        <Collapse in={isEditing}>
          <VStack spacing={4} align="stretch">
            <Box>
              <Text mb={2} fontWeight="medium">Description</Text>
              <Textarea
                value={editedScene.description}
                onChange={(e) => setEditedScene({ ...editedScene, description: e.target.value })}
                placeholder="Describe the scene..."
                minH="100px"
              />
            </Box>
            <Box>
              <Text mb={2} fontWeight="medium">Dialogue</Text>
              <Textarea
                value={editedScene.dialogue}
                onChange={(e) => setEditedScene({ ...editedScene, dialogue: e.target.value })}
                placeholder="Enter the dialogue..."
                minH="100px"
              />
            </Box>
            <Box>
              <Text mb={2} fontWeight="medium">Duration (seconds)</Text>
              <Input
                type="number"
                value={editedScene.duration}
                onChange={(e) => setEditedScene({ ...editedScene, duration: parseInt(e.target.value) || 0 })}
                placeholder="Duration in seconds"
              />
            </Box>
            <Button
              leftIcon={<FaSave />}
              colorScheme="blue"
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </VStack>
        </Collapse>

        {!isEditing && (
          <>
            <Box>
              <Text fontWeight="medium">Description</Text>
              <Text>{scene.description}</Text>
            </Box>
            <Box>
              <Text fontWeight="medium">Dialogue</Text>
              <Text>{scene.dialogue}</Text>
            </Box>
            <Box>
              <Text fontWeight="medium">Duration</Text>
              <Text>{scene.duration} seconds</Text>
            </Box>
          </>
        )}

        {scene.footageKeywords?.length > 0 && (
          <Box>
            <Text fontWeight="medium">Footage Keywords</Text>
            <HStack wrap="wrap" spacing={2}>
              {scene.footageKeywords.map((keyword, index) => (
                <Badge key={index} colorScheme="blue">
                  {keyword}
                </Badge>
              ))}
            </HStack>
          </Box>
        )}

        {scene.voiceoverUrl && (
          <Box>
            <Text fontWeight="medium">Voiceover</Text>
            <audio controls src={scene.voiceoverUrl} />
          </Box>
        )}

        {scene.transcription && (
          <Box>
            <Text fontWeight="medium">Transcription</Text>
            <Text>{scene.transcription}</Text>
          </Box>
        )}
      </VStack>
    </Box>
  )
} 