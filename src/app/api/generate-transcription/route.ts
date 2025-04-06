import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { audioUrl } = await request.json()

    if (!audioUrl) {
      return NextResponse.json(
        { error: 'Audio URL is required' },
        { status: 400 }
      )
    }

    // Read the audio file
    const audioFile = await fetch(audioUrl)
    const audioBuffer = await audioFile.arrayBuffer()

    // Create transcription using Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: new File([audioBuffer], 'audio.mp3', { type: 'audio/mp3' }),
      model: 'whisper-1',
      language: 'en',
      response_format: 'text',
    })

    return NextResponse.json({ 
      transcription,
      captions: formatCaptions(transcription)
    })
  } catch (error) {
    console.error('Error generating transcription:', error)
    return NextResponse.json(
      { error: 'Failed to generate transcription' },
      { status: 500 }
    )
  }
}

function formatCaptions(transcription: string): string {
  // Basic caption formatting - you might want to enhance this
  return transcription.split('.').map((sentence, index) => {
    return `${index + 1}\n00:00:00 --> 00:00:05\n${sentence.trim()}\n\n`
  }).join('')
} 