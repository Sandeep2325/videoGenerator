'use client'

import { useState } from 'react'
import {
  Box,
  Button,
  Text,
  Textarea,
  HStack,
} from '@chakra-ui/react'
import { useToast } from '@chakra-ui/toast'
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/accordion'
import { Stack } from '@chakra-ui/layout'

interface Scene {
  sceneNumber: number
  duration: number
  visualDescription: string
  narration: string
  backgroundMusic: string
  transitions: string
}

interface Script {
  scenes: Scene[]
  totalDuration: number
  voiceStyle: string
  musicStyle: string
}

interface ScriptReviewProps {
  script: Script
  onSave: (editedScript: Script) => void
}

export function ScriptReview({ script, onSave }: ScriptReviewProps) {
  const [editedScript, setEditedScript] = useState<Script>(script)
  const toast = useToast()

  const handleSceneChange = (
    sceneIndex: number,
    field: keyof Scene,
    value: string
  ) => {
    const updatedScenes = [...editedScript.scenes]
    updatedScenes[sceneIndex] = {
      ...updatedScenes[sceneIndex],
      [field]: value,
    }
    setEditedScript({ ...editedScript, scenes: updatedScenes })
  }

  const handleSave = () => {
    onSave(editedScript)
    toast({
      title: 'Script saved',
      description: 'Your changes have been saved successfully',
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  }

  return (
    <Stack spacing={6} align="stretch">
      <Box>
        <Text fontSize="lg" fontWeight="bold">
          Total Duration: {editedScript.totalDuration} seconds
        </Text>
        <Text>Voice Style: {editedScript.voiceStyle}</Text>
        <Text>Music Style: {editedScript.musicStyle}</Text>
      </Box>

      <Accordion allowMultiple>
        {editedScript.scenes.map((scene, index) => (
          <AccordionItem key={scene.sceneNumber}>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Scene {scene.sceneNumber} ({scene.duration}s)
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Stack spacing={4} align="stretch">
                <Box>
                  <Text fontWeight="bold">Visual Description</Text>
                  <Textarea
                    value={scene.visualDescription}
                    onChange={(e) =>
                      handleSceneChange(index, 'visualDescription', e.target.value)
                    }
                  />
                </Box>
                <Box>
                  <Text fontWeight="bold">Narration</Text>
                  <Textarea
                    value={scene.narration}
                    onChange={(e) =>
                      handleSceneChange(index, 'narration', e.target.value)
                    }
                  />
                </Box>
                <Box>
                  <Text fontWeight="bold">Background Music</Text>
                  <Textarea
                    value={scene.backgroundMusic}
                    onChange={(e) =>
                      handleSceneChange(index, 'backgroundMusic', e.target.value)
                    }
                  />
                </Box>
                <Box>
                  <Text fontWeight="bold">Transitions</Text>
                  <Textarea
                    value={scene.transitions}
                    onChange={(e) =>
                      handleSceneChange(index, 'transitions', e.target.value)
                    }
                  />
                </Box>
              </Stack>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>

      <HStack justify="flex-end">
        <Button colorScheme="brand" onClick={handleSave}>
          Save Changes
        </Button>
      </HStack>
    </Stack>
  )
} 