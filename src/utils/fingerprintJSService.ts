// FingerprintJS Professional Service Integration
// Provides accurate, stable browser fingerprinting using FingerprintJS

export interface FingerprintJSResult {
  visitorId: string;
  confidence: {
    score: number;
    comment?: string;
  };
  components: Record<string, unknown>;
}

interface FingerprintJSConfidence {
  score: number;
  comment?: string;
}

interface FingerprintJSGetResult {
  visitorId?: string;
  confidence?: FingerprintJSConfidence;
  components?: Record<string, unknown>;
  botDetection?: unknown;
  ipLocation?: unknown;
  incognito?: unknown;
  rootApps?: unknown;
  emulator?: unknown;
  clonedApp?: unknown;
  factoryReset?: unknown;
  jailbroken?: unknown;
  frida?: unknown;
  privacySettings?: unknown;
  vpn?: unknown;
  proxy?: unknown;
  tampering?: unknown;
}

interface FingerprintJSAgent {
  get: (options?: { extendedResult?: boolean }) => Promise<FingerprintJSGetResult>;
}

interface FingerprintJSModule {
  load: () => Promise<FingerprintJSAgent>;
}

declare global {
  interface Window {
    FingerprintJS?: FingerprintJSModule;
  }
}

class FingerprintJSService {
  private fpPromise: Promise<FingerprintJSAgent> | null = null;
  private scriptPromise: Promise<FingerprintJSModule> | null = null;
  private readonly publicKey = "onMK6K44grIWkfnQU05v";
  private readonly scriptId = "fingerprintjs-pro-agent";

  private getGlobalModule(): FingerprintJSModule | null {
    return typeof window === "undefined" ? null : window.FingerprintJS ?? null;
  }

  private normalizeResult(result: FingerprintJSGetResult): FingerprintJSResult {
    return {
      visitorId: result.visitorId ?? "",
      confidence: result.confidence ?? { score: 0.99 },
      components: result.components ?? {},
    };
  }

  /**
   * Initialize FingerprintJS agent
   */
  private async loadFingerprintJSModule(): Promise<FingerprintJSModule> {
    const existingModule = this.getGlobalModule();
    if (existingModule) {
      return existingModule;
    }

    if (typeof document === "undefined") {
      throw new Error("FingerprintJS can only be loaded in the browser");
    }

    if (this.scriptPromise) {
      return this.scriptPromise;
    }

    this.scriptPromise = new Promise((resolve, reject) => {
      const existingScript = document.getElementById(this.scriptId) as HTMLScriptElement | null;

      const handleLoad = () => {
        const module = this.getGlobalModule();
        if (module) {
          cleanup();
          resolve(module);
          return;
        }

        cleanup();
        reject(new Error("FingerprintJS script loaded without exposing a global module"));
      };

      const handleError = () => {
        cleanup();
        reject(new Error("Failed to load FingerprintJS script"));
      };

      const cleanup = () => {
        existingScript?.removeEventListener("load", handleLoad);
        existingScript?.removeEventListener("error", handleError);
        pendingScript?.removeEventListener("load", handleLoad);
        pendingScript?.removeEventListener("error", handleError);
      };

      let pendingScript = existingScript;

      if (existingScript) {
        const module = this.getGlobalModule();
        if (module) {
          resolve(module);
          return;
        }

        existingScript.addEventListener("load", handleLoad, { once: true });
        existingScript.addEventListener("error", handleError, { once: true });
        return;
      }

      pendingScript = document.createElement("script");
      pendingScript.id = this.scriptId;
      pendingScript.async = true;
      pendingScript.src = `https://fpjscdn.net/v3/${this.publicKey}`;
      pendingScript.addEventListener("load", handleLoad, { once: true });
      pendingScript.addEventListener("error", handleError, { once: true });
      document.head.appendChild(pendingScript);
    }).catch((error) => {
      this.scriptPromise = null;
      throw error;
    });

    return this.scriptPromise;
  }

  private async initializeFingerprintJS(): Promise<FingerprintJSAgent> {
    if (this.fpPromise) {
      return this.fpPromise;
    }

    this.fpPromise = this.loadFingerprintJSModule()
      .then((fingerprintJS) => fingerprintJS.load())
      .catch((error) => {
        this.fpPromise = null;
        throw error;
      });

    return this.fpPromise;
  }

  /**
   * Get visitor fingerprint using FingerprintJS
   */
  async getVisitorFingerprint(): Promise<FingerprintJSResult> {
    try {
      const fp = await this.initializeFingerprintJS();
      const result = await fp.get();

      return this.normalizeResult(result);
    } catch (error) {
      console.error("FingerprintJS error:", error);
      throw new Error("Professional fingerprinting service unavailable");
    }
  }

  /**
   * Get extended visitor information (if available with paid plan)
   */
  async getExtendedVisitorInfo(): Promise<Record<string, unknown>> {
    try {
      const fp = await this.initializeFingerprintJS();
      const result = await fp.get({ extendedResult: true });

      return {
        ...this.normalizeResult(result),
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
