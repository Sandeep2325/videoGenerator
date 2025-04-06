import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import ElevenLabs from 'elevenlabs-node'
import fs from 'fs'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const elevenLabs = new ElevenLabs({
  apiKey: process.env.ELEVEN_LABS_API_KEY || '',
})




interface Scene {
  sceneNumber: number
  description: string
  dialogue: string
  duration: number
  footageUrls?: string[]
  voiceoverUrl?: string
}

interface VideoResponse {
  videoUrl: string
  thumbnailUrl: string
  duration: number
  width: number
  height: number
  id: number
}

interface FootageResponse {
  videos: VideoResponse[]
  totalResults: number
}

interface ScriptScene {
  sceneNumber: number
  description: string
  dialogue: string
  duration: number
}

interface ScriptResponse {
  scenes: ScriptScene[]
}

export async function POST(request: Request) {
  try {
    const { 
      topic, 
      duration, 
      style, 
      tone, 
      targetAudience, 
      language, 
      keyPoints, 
      additionalNotes,
      editedScript // Optional edited script from user
    } = await request.json()

    // Generate or use edited script
    const script = editedScript || await generateScript({
      topic,
      duration,
      style,
      tone,
      targetAudience,
      language,
      keyPoints,
      additionalNotes,
    })

    // Parse the script into scenes
    const scenes = parseScriptIntoScenes(script)
    
    // If this is just script generation/editing, return the script without processing
    if (!editedScript) {
      return NextResponse.json({ 
        script,
        scenes,
        status: 'script_generated'
      })
    }

    // Process each scene (only if we have an edited script)
    const processedScenes = await Promise.all(
      scenes.map(async (scene) => {
        // Search for relevant stock footage using Pexels API
        const footageResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/search-footage`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            query: scene.description,
            count: 3 // Get 3 videos per scene
          }),
        })

        if (!footageResponse.ok) {
          throw new Error('Failed to fetch footage')
        }

        const { videos } = await footageResponse.json() as FootageResponse
        const footageUrls = videos.map(video => video.videoUrl)
        
        // Generate voiceover
        const voiceoverUrl = await generateVoiceover(scene.dialogue)

        return {
          ...scene,
          footageUrls,
          voiceoverUrl,
        }
      })
    )

    return NextResponse.json({ 
      script,
      processedScenes,
      status: 'completed'
    })
  } catch (error) {
    console.error('Error processing video:', error)
    return NextResponse.json(
      { error: 'Failed to process video' },
      { status: 500 }
    )
  }
}

async function generateScript(params: {
  topic: string
  duration: string
  style: string
  tone: string
  targetAudience: string
  language: string
  keyPoints: string
  additionalNotes?: string
}): Promise<ScriptResponse> {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `You are a professional video script writer. Create engaging and well-structured video scripts.
        Return the script in the following JSON format:
        {
          "scenes": [
            {
              "sceneNumber": number,
              "description": "Detailed scene description",
              "dialogue": "Character dialogue for this scene",
              "duration": number
            }
          ]
        }`
      },
      {
        role: 'user',
        content: `Create a video script with the following parameters:
        Topic: ${params.topic}
        Duration: ${params.duration} seconds
        Style: ${params.style}
        Tone: ${params.tone}
        Target Audience: ${params.targetAudience}
        Language: ${params.language}
        Key Points: ${params.keyPoints}
        Additional Notes: ${params.additionalNotes || 'None'}
        
        Return the script in JSON format with scenes, descriptions, and dialogue.`
      }
    ],
    model: 'gpt-4o-mini',
    temperature: 0.7,
    max_tokens: 1000,
    response_format: { type: "json_object" }
  })

  const content = completion.choices[0]?.message?.content || ''
  try {
    return JSON.parse(content) as ScriptResponse
  } catch (error) {
    console.error('Error parsing script JSON:', error)
    throw new Error('Failed to parse script JSON')
  }
}

async function generateVoiceover(text: string): Promise<string> {
  try {
    const audio = await elevenLabs.textToSpeech({
      voice_id: '21m00Tcm4TlvDq8ikWAM', // Default voice ID
      text,
      model_id: 'eleven_monolingual_v1',
    })

    // Save the audio file and return the URL
    const audioUrl = await saveAudioFile(audio)
    return audioUrl
  } catch (error) {
    console.error('Error generating voiceover:', error)
    throw error
  }
}

function parseScriptIntoScenes(script: ScriptResponse): Scene[] {
  try {
    if (!script || !script.scenes || !Array.isArray(script.scenes)) {
      throw new Error('Invalid script format')
    }

    return script.scenes.map((scene: ScriptScene) => ({
      sceneNumber: scene.sceneNumber || 0,
      description: scene.description || '',
      dialogue: scene.dialogue || '',
      duration: scene.duration || 0
    }))
  } catch (error) {
    console.error('Error parsing scenes:', error)
    throw new Error('Failed to parse scenes from script')
  }
}

async function saveAudioFile(audio: Buffer): Promise<string> {
  const fileName = `voiceover-${Date.now()}.mp3`
  const filePath = `/tmp/${fileName}`
  
  await fs.promises.writeFile(filePath, audio)
  return filePath
} 