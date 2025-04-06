import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { topic, duration, style, additionalNotes } = await request.json()

    const prompt = `Create a video script for a ${duration}-second ${style} video about "${topic}". ${
      additionalNotes ? `Additional requirements: ${additionalNotes}` : ''
    }

    Format the script as a JSON object with the following structure:
    {
      "scenes": [
        {
          "sceneNumber": number,
          "duration": number,
          "visualDescription": string,
          "narration": string,
          "backgroundMusic": string,
          "transitions": string
        }
      ],
      "totalDuration": number,
      "voiceStyle": string,
      "musicStyle": string
    }`

    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-4-turbo-preview',
      response_format: { type: 'json_object' },
    })

    const script = JSON.parse(completion.choices[0].message.content || '{}')

    return NextResponse.json(script)
  } catch (error) {
    console.error('Error generating script:', error)
    return NextResponse.json(
      { error: 'Failed to generate script' },
      { status: 500 }
    )
  }
} 