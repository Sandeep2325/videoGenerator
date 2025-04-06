import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

console.log(process.env.OPENAI_API_KEY)

export async function POST(request: Request) {
  try {
    const { topic, duration, style, tone, targetAudience, language, keyPoints, additionalNotes } = await request.json()

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a professional video script writer. Create engaging and well-structured video scripts.'
        },
        {
          role: 'user',
          content: `Create a video script with the following parameters:
          Topic: ${topic}
          Duration: ${duration} seconds
          Style: ${style}
          Tone: ${tone}
          Target Audience: ${targetAudience}
          Language: ${language}
          Key Points: ${keyPoints}
          Additional Notes: ${additionalNotes || 'None'}
          
          Format the script with clear scene markers and dialogue.`
        }
      ],
      model: 'gpt-4o-mini',
      temperature: 0.7,
      max_tokens: 1000,
    })

    const script = completion.choices[0]?.message?.content || ''

    return NextResponse.json({ script })
  } catch (error) {
    console.error('Error generating script:', error)
    return NextResponse.json(
      { error: 'Failed to generate script' },
      { status: 500 }
    )
  }
} 