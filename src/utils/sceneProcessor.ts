import { PerformanceMonitor } from './performanceMonitor';

interface Scene {
  sceneNumber: number;
  description: string;
  dialogue: string;
  duration: number;
  footageKeywords: string[];
  voiceoverUrl: string;
  transcription: string;
  footageUrls: string[];
}

export class SceneProcessor {
  private queue: Scene[] = [];
  private isProcessing = false;
  private monitor = PerformanceMonitor.getInstance();

  constructor(private batchSize: number = 2) {}

  addToQueue(scene: Scene) {
    this.queue.push(scene);
    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  private async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;
    this.monitor.startOperation('processQueue');

    try {
      while (this.queue.length > 0) {
        const batch = this.queue.splice(0, this.batchSize);
        await this.processBatch(batch);
      }
    } catch (error) {
      console.error('Error processing queue:', error);
    } finally {
      this.isProcessing = false;
      this.monitor.endOperation('processQueue');
    }
  }

  private async processBatch(batch: Scene[]) {
    this.monitor.startOperation('processBatch');
    
    try {
      const promises = batch.map(scene => this.processScene(scene));
      await Promise.all(promises);
    } finally {
      this.monitor.endOperation('processBatch');
    }
  }

  private async processScene(scene: Scene) {
    this.monitor.startOperation(`processScene-${scene.sceneNumber}`);
    
    try {
      // Process scene here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing
    } finally {
      this.monitor.endOperation(`processScene-${scene.sceneNumber}`);
    }
  }
} 