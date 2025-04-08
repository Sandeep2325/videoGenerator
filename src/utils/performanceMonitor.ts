interface PerformanceMemory {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

interface ExtendedPerformance extends Performance {
  memory?: PerformanceMemory;
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private memoryUsage: { [key: string]: number } = {};
  private startTime: number = 0;

  private constructor() {}

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startOperation(operationName: string) {
    this.startTime = performance.now();
    if (typeof window !== 'undefined') {
      const perf = window.performance as ExtendedPerformance;
      this.memoryUsage[operationName] = perf.memory?.usedJSHeapSize || 0;
    }
    console.log(`Starting operation: ${operationName}`);
  }

  endOperation(operationName: string) {
    const endTime = performance.now();
    const duration = endTime - this.startTime;
    let memoryDiff = 0;
    
    if (typeof window !== 'undefined') {
      const perf = window.performance as ExtendedPerformance;
      const endMemory = perf.memory?.usedJSHeapSize || 0;
      memoryDiff = endMemory - this.memoryUsage[operationName];
    }

    console.log(`Operation ${operationName} completed in ${duration.toFixed(2)}ms`);
    console.log(`Memory usage: ${(memoryDiff / 1024 / 1024).toFixed(2)}MB`);
  }

  logMemoryUsage(label: string) {
    if (typeof window !== 'undefined') {
      const perf = window.performance as ExtendedPerformance;
      const memory = perf.memory;
      if (memory) {
        console.log(`${label} - Memory: ${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`);
      }
    }
  }
} 