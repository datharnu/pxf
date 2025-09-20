// Track media processing status for Instagram-style progressive loading

interface ProcessingItem {
  s3Key: string;
  startTime: number;
  isComplete: boolean;
}

class ProcessingTracker {
  private processingItems: Map<string, ProcessingItem> = new Map();

  // Add item to processing queue
  addProcessingItem(s3Key: string) {
    this.processingItems.set(s3Key, {
      s3Key,
      startTime: Date.now(),
      isComplete: false,
    });
    console.log(`📥 Added to processing queue: ${s3Key}`);
  }

  // Mark item as complete
  markComplete(s3Key: string) {
    const item = this.processingItems.get(s3Key);
    if (item) {
      item.isComplete = true;
      const processingTime = Date.now() - item.startTime;
      console.log(`✅ Processing complete: ${s3Key} (${processingTime}ms)`);
    }
  }

  // Check if item is still processing
  isProcessing(s3Key: string): boolean {
    const item = this.processingItems.get(s3Key);
    if (!item) return false;

    // Auto-expire after 30 seconds (assume complete if backend doesn't respond)
    const elapsed = Date.now() - item.startTime;
    if (elapsed > 30000) {
      this.markComplete(s3Key);
      return false;
    }

    return !item.isComplete;
  }

  // Get all processing items
  getProcessingItems(): string[] {
    return Array.from(this.processingItems.keys()).filter((key) =>
      this.isProcessing(key)
    );
  }

  // Clean up old completed items
  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.processingItems.entries()) {
      if (item.isComplete || now - item.startTime > 60000) {
        this.processingItems.delete(key);
      }
    }
  }
}

// Global processing tracker instance
export const processingTracker = new ProcessingTracker();

// Clean up every minute
if (typeof window !== "undefined") {
  setInterval(() => {
    processingTracker.cleanup();
  }, 60000);
}
