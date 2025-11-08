// Global Ad Manager to prevent duplicate ad initialization
class AdManager {
  private static instance: AdManager;
  private initializedAds: Set<string> = new Set();
  private adQueue: Array<() => void> = [];
  private isProcessing = false;

  static getInstance(): AdManager {
    if (!AdManager.instance) {
      AdManager.instance = new AdManager();
    }
    return AdManager.instance;
  }

  // Check if an ad with this ID has already been initialized
  isAdInitialized(adId: string): boolean {
    return this.initializedAds.has(adId);
  }

  // Mark an ad as initialized
  markAdInitialized(adId: string): void {
    this.initializedAds.add(adId);
  }

  // Queue an ad for initialization
  queueAd(adId: string, initFunction: () => void): void {
    if (this.isAdInitialized(adId)) {
      console.warn(`Ad ${adId} already initialized, skipping...`);
      return;
    }

    this.adQueue.push(() => {
      if (!this.isAdInitialized(adId)) {
        try {
          initFunction();
          this.markAdInitialized(adId);
        } catch (error) {
          console.error(`Failed to initialize ad ${adId}:`, error);
        }
      }
    });

    this.processQueue();
  }

  // Process the ad queue with throttling
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.adQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.adQueue.length > 0) {
      const initFunction = this.adQueue.shift();
      if (initFunction) {
        initFunction();
        // Small delay to prevent overwhelming AdSense
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    this.isProcessing = false;
  }

  // Initialize AdSense safely
  static initializeAd(element: HTMLElement): void {
    if (!element || element.dataset.adInitialized === "true") {
      return;
    }

    try {
      element.dataset.adInitialized = "true";

      if (typeof window !== "undefined") {
        (window as any).adsbygoogle = (window as any).adsbygoogle || [];
        (window as any).adsbygoogle.push({});
      }
    } catch (error) {
      console.error("Ad initialization error:", error);
      element.dataset.adInitialized = "false";
      throw error;
    }
  }

  // Reset all ads (useful for SPA navigation)
  reset(): void {
    this.initializedAds.clear();
    this.adQueue = [];
    this.isProcessing = false;
  }
}

export default AdManager;
