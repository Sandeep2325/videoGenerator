import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface VideoFile {
  id: number
  quality: string
  file_type: string
  width: number
  height: number
  link: string
}

interface PexelsVideo {
  id: number
  width: number
  height: number
  duration: number
  image: string
  video_files: VideoFile[]
}

interface PexelsResponse {
  page: number
  per_page: number
  total_results: number
  videos: PexelsVideo[]
}

export async function POST(request: Request) {
  try {
    const { sceneNumber, description, dialogue, orientation } = await request.json()

    if (!description && !dialogue) {
      return NextResponse.json(
        { error: 'Description or dialogue is required' },
        { status: 400 }
      )
    }

    // Generate search keywords using OpenAI
    const prompt = `Generate 5-7 relevant search keywords for stock footage based on this scene description and dialogue. 
    Focus on visual elements, actions, and settings that would be useful for video editing.
    
    Description: ${description}
    Dialogue: ${dialogue}
    
    Return the keywords as a comma-separated list.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that generates search keywords for stock footage."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
    })

    const keywords = completion.choices[0].message.content?.split(',').map(k => k.trim()) || []
    const searchQuery = keywords.join(' ')

    // Search Pexels API
    const pexelsApiKey = process.env.PEXELS_API_KEY
    if (!pexelsApiKey) {
      throw new Error('Pexels API key is not configured')
    }

    let orientationParam = 'portrait'
    if (orientation === '16:9') {
      orientationParam = 'landscape'
    } else if (orientation === '1:1') {
      orientationParam = 'square'
    }

    const response = await fetch(
      `https://api.pexels.com/videos/search?query=${encodeURIComponent(searchQuery)}&per_page=10&orientation=${orientationParam}`,
      {
        headers: {
          'Authorization': pexelsApiKey,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch footage from Pexels: ${response.statusText}`)
    }

    const data: PexelsResponse = await response.json()
    if (!data.videos || data.videos.length === 0) {
      throw new Error('No videos found for the given query')
    }

    // Filter for vertical/square videos and ensure valid video files
    const videos = data.videos
      .filter(video => {
        // Filter for vertical or square videos (height >= width)
        return video.height >= video.width
      })
      .map(video => {
        // Find the best quality video file that's available
        const videoFile = video.video_files.find(file => file.quality === 'sd') || 
                         video.video_files.find(file => file.quality === 'hd') ||
                         video.video_files[0]

        if (!videoFile || !videoFile.link) {
          return null
        }

        return {
          videoUrl: videoFile.link,
          thumbnailUrl: video.image,
          duration: video.duration,
          width: video.width,
          height: video.height,
          id: video.id
        }
      })
      .filter(Boolean) // Remove any null entries
      .slice(0, 3) // Take only the first 3 valid videos

    if (videos.length === 0) {
      throw new Error('No suitable vertical videos found')
    }

    return NextResponse.json({
      sceneNumber,
      keywords,
      footageUrls: videos.map(v => v!.videoUrl),
      thumbnails: videos.map(v => v!.thumbnailUrl)
    })
  } catch (error) {
    console.error('Error searching footage:', error)
    return NextResponse.json(
      { error: 'Failed to search footage' },
      { status: 500 }
    )
  }
} 