import { NextResponse } from 'next/server'
import ElevenLabs from 'elevenlabs-node'
import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import OpenAI from 'openai'

const elevenLabs = new ElevenLabs({
  apiKey: process.env.ELEVENLABS_API_KEY || '',
})

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { sceneNumber, text } = await request.json()

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required for voiceover generation' },
        { status: 400 }
      )
    }

    // Generate voiceover using ElevenLabs
    const audioBuffer = await elevenLabs.textToSpeech({
      voice_id: process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM', // Default voice ID
      text,
      model_id: 'eleven_monolingual_v1'
    })

    // Save the audio file temporarily
    const fileName = `voiceover-${uuidv4()}.mp3`
    const filePath = path.join(process.cwd(), 'public', 'temp', fileName)
    
    // Ensure the temp directory exists
    const tempDir = path.join(process.cwd(), 'public', 'temp')
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true })
    }

    fs.writeFileSync(filePath, audioBuffer)

    // Generate transcription using OpenAI
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: "whisper-1",
    })

    return NextResponse.json({
      sceneNumber,
      voiceoverUrl: `/temp/${fileName}`,
      transcription: transcription.text
    })
  } catch (error) {
    console.error('Error generating voiceover:', error)
    return NextResponse.json(
      { error: 'Failed to generate voiceover' },
      { status: 500 }
    )
  }
} 