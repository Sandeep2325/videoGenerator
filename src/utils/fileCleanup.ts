import fs from 'fs'
import path from 'path'

export class FileCleanup {
  private static instance: FileCleanup
  private tempFiles: string[] = []

  private constructor() {}

  static getInstance(): FileCleanup {
    if (!FileCleanup.instance) {
      FileCleanup.instance = new FileCleanup()
    }
    return FileCleanup.instance
  }

  registerTempFile(filePath: string) {
    this.tempFiles.push(filePath)
  }

  async cleanup() {
    for (const filePath of this.tempFiles) {
      try {
        if (fs.existsSync(filePath)) {
          await fs.promises.unlink(filePath)
        }
      } catch (error) {
        console.error(`Failed to delete temp file ${filePath}:`, error)
      }
    }
    this.tempFiles = []
  }

  async cleanupOldFiles(directory: string, maxAge: number = 24 * 60 * 60 * 1000) {
    try {
      const files = await fs.promises.readdir(directory)
      const now = Date.now()

      for (const file of files) {
        const filePath = path.join(directory, file)
        const stats = await fs.promises.stat(filePath)
        
        if (now - stats.mtime.getTime() > maxAge) {
          await fs.promises.unlink(filePath)
        }
      }
    } catch (error) {
      console.error('Error cleaning up old files:', error)
    }
  }
} 