import { NextResponse } from 'next/server'
import ElevenLabs from 'elevenlabs-node'
import fs from 'fs'

const elevenLabs = new ElevenLabs({
  apiKey: process.env.ELEVEN_LABS_API_KEY || '',
})

export async function POST(request: Request) {
  try {
    const { text } = await request.json()

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      )
    }

    const audio = await elevenLabs.textToSpeech({
      voice_id: '21m00Tcm4TlvDq8ikWAM', // Default voice ID
      text,
      model_id: 'eleven_monolingual_v1',
    })

    // Save the audio file
    const fileName = `voiceover-${Date.now()}.mp3`
    const filePath = `/tmp/${fileName}`
    await fs.promises.writeFile(filePath, audio)

    return NextResponse.json({ 
      audioUrl: filePath,
      fileName
    })
  } catch (error) {
    console.error('Error generating audio:', error)
    return NextResponse.json(
      { error: 'Failed to generate audio' },
      { status: 500 }
    )
  }
} 