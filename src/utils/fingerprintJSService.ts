// FingerprintJS Professional Service Integration
// Provides accurate, stable browser fingerprinting using FingerprintJS

export interface FingerprintJSResult {
  visitorId: string;
  confidence: {
    score: number;
    comment?: string;
  };
  components: {
    [key: string]: any;
  };
}

class FingerprintJSService {
  private fpPromise: Promise<any> | null = null;
  private readonly publicKey = 'onMK6K44grIWkfnQU05v';

  /**
   * Initialize FingerprintJS agent
   */
  private async initializeFingerprintJS(): Promise<any> {
    if (this.fpPromise) {
      return this.fpPromise;
    }

    this.fpPromise = import(`https://fpjscdn.net/v3/${this.publicKey}`)
      .then(FingerprintJS => FingerprintJS.load());

    return this.fpPromise;
  }

  /**
   * Get visitor fingerprint using FingerprintJS
   */
  async getVisitorFingerprint(): Promise<FingerprintJSResult> {
    try {
      const fp = await this.initializeFingerprintJS();
      const result = await fp.get();
      
      return {
        visitorId: result.visitorId,
        confidence: result.confidence || { score: 0.99 },
        components: result.components || {}
      };
    } catch (error) {
      console.error('FingerprintJS error:', error);
      throw new Error('Professional fingerprinting service unavailable');
    }
  }

  /**
   * Get extended visitor information (if available with paid plan)
   */
  async getExtendedVisitorInfo(): Promise<any> {
    try {
      const fp = await this.initializeFingerprintJS();
      const result = await fp.get({ extendedResult: true });
      
      return {
        visitorId: result.visitorId,
        confidence: result.confidence,
        components: result.components,
        // Additional data available with paid plans
        botDetection: result.botDetection,
        ipLocation: result.ipLocation,
        incognito: result.incognito,
        rootApps: result.rootApps,
        emulator: result.emulator,
        clonedApp: result.clonedApp,
        factoryReset: result.factoryReset,
        jailbroken: result.jailbroken,
        frida: result.frida,
        privacySettings: result.privacySettings,
        vpn: result.vpn,
        proxy: result.proxy,
        tampering: result.tampering
      };
    } catch (error) {
      // Fallback to basic fingerprinting if extended features aren't available
      return this.getVisitorFingerprint();
    }
  }
}

// Export singleton instance
export const fingerprintJSService = new FingerprintJSService();