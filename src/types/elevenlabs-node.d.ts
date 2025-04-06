declare module 'elevenlabs-node' {
  interface ElevenLabsOptions {
    apiKey: string
  }

  interface TextToSpeechOptions {
    voice_id: string
    text: string
    model_id?: string
  }

  class ElevenLabs {
    constructor(options: ElevenLabsOptions)
    textToSpeech(options: TextToSpeechOptions): Promise<Buffer>
  }

  export default ElevenLabs
} 