import React, { useState } from "react";
import { Play, Loader2, Fingerprint, RefreshCw } from "lucide-react";
import { FingerprintData } from "../../pages/BrowserFingerprintingDemo";

interface FingerprintCollectorProps {
  onDataCollected: (data: FingerprintData) => void;
  isCollecting: boolean;
  onStartCollection: () => void;
}

const FingerprintCollector: React.FC<FingerprintCollectorProps> = ({
  onDataCollected,
  isCollecting,
  onStartCollection
}) => {
  const [progress, setProgress] = useState(0);

  const collectFingerprint = async () => {
    onStartCollection();
    setProgress(0);

    // Simulate collection progress
    const steps = [
      "Analyzing browser information...",
      "Collecting screen data...",
      "Testing canvas fingerprinting...",
      "Checking WebGL capabilities...",
      "Detecting installed fonts...",
      "Analyzing hardware specs...",
      "Checking permissions...",
      "Finalizing fingerprint..."
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setProgress(((i + 1) / steps.length) * 100);
    }

    // Collect actual browser data
    const data: FingerprintData = await gatherBrowserData();
    onDataCollected(data);
  };

  const gatherBrowserData = async (): Promise<FingerprintData> => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Browser fingerprinting test', 2, 2);
    }

    // WebGL fingerprinting with proper typing
    const webglCanvas = document.createElement('canvas');
    const gl = webglCanvas.getContext('webgl') as WebGLRenderingContext | null || 
               webglCanvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
    let webglInfo = 'Not supported';
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        webglInfo = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      }
    }

    // Font detection (simplified)
    const fonts = ['Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Verdana', 'Georgia', 'Palatino', 'Garamond', 'Bookman', 'Comic Sans MS', 'Trebuchet MS', 'Arial Black', 'Impact'];
    
    // Plugin detection
    const plugins = Array.from(navigator.plugins || []).map(plugin => plugin.name);

    // Permission checks
    const permissions: Record<string, string> = {};
    const permissionsToCheck = ['camera', 'microphone', 'geolocation', 'notifications'];
    
    for (const permission of permissionsToCheck) {
      try {
        if ('permissions' in navigator) {
          const result = await navigator.permissions.query({ name: permission as PermissionName });
          permissions[permission] = result.state;
        }
      } catch (error) {
        permissions[permission] = 'unknown';
      }
    }

    // Battery API (if available)
    let battery: any = null;
    try {
      if ('getBattery' in navigator) {
        battery = await (navigator as any).getBattery();
      }
    } catch (error) {
      battery = 'not available';
    }

    // Network information
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;

    return {
      userAgent: navigator.userAgent,
      screen: {
        width: screen.width,
        height: screen.height,
        colorDepth: screen.colorDepth,
        pixelDepth: screen.pixelDepth
      },
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      languages: Array.from(navigator.languages || []),
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack,
      canvas: canvas.toDataURL(),
      webgl: webglInfo,
      fonts: fonts,
      plugins: plugins,
      touchSupport: 'ontouchstart' in window,
      hardwareConcurrency: navigator.hardwareConcurrency || 0,
      deviceMemory: (navigator as any).deviceMemory,
      connection: connection ? {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt
      } : null,
      battery: battery ? {
        level: battery.level,
        charging: battery.charging
      } : null,
      permissions
    };
  };

  return (
    <div className="bg-cyber rounded-lg border border-pink-400/20 p-6">
      <div className="flex items-center mb-6">
        <div className="bg-pink-400/10 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
          <Fingerprint className="h-6 w-6 text-pink-400" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white">Fingerprint Scanner</h3>
          <p className="text-gray-400 text-sm">Analyze your browser's unique signature</p>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-gray-300 text-sm leading-relaxed">
          Click the button below to start collecting your browser's fingerprint data. 
          This process is completely safe and runs locally in your browser.
        </p>

        {isCollecting && (
          <div className="space-y-3">
            <div className="flex items-center text-sm text-pink-400">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Collecting data... {Math.round(progress)}%
            </div>
            <div className="w-full bg-cyber-dark rounded-full h-2">
              <div 
                className="bg-pink-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        <button
          onClick={collectFingerprint}
          disabled={isCollecting}
          className="w-full bg-pink-400 hover:bg-pink-500 disabled:bg-pink-400/50 text-white font-medium px-4 py-3 rounded-lg transition-colors flex items-center justify-center"
        >
          {isCollecting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Scanning...
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Start Fingerprint Scan
            </>
          )}
        </button>

        <div className="text-xs text-gray-500 space-y-2">
          <p>• No data leaves your browser</p>
          <p>• Educational purposes only</p>
          <p>• Safe and privacy-focused</p>
        </div>
      </div>
    </div>
  );
};

export default FingerprintCollector;
