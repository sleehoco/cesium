
import React, { useState } from "react";
import { Play, Loader2, Fingerprint, RefreshCw, Shield } from "lucide-react";
import { FingerprintData } from "../../pages/BrowserFingerprintingDemo";
import { fingerprintJSService } from "../../utils/fingerprintJSService";

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

    // Simulate collection progress with real steps
    const steps = [
      "Initializing FingerprintJS...",
      "Reading user agent...",
      "Measuring screen properties...", 
      "Generating canvas fingerprint...",
      "Testing WebGL renderer...",
      "Detecting available fonts...",
      "Checking hardware capabilities...",
      "Testing permissions...",
      "Getting professional visitor ID...",
      "Calculating uniqueness..."
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 400));
      setProgress(((i + 1) / steps.length) * 100);
    }

    // Collect both professional and educational browser data
    const data: FingerprintData = await gatherBrowserData();
    onDataCollected(data);
  };

  const gatherBrowserData = async (): Promise<FingerprintData> => {
    // First, get professional FingerprintJS data
    let fingerprintJSData = null;
    try {
      const result = await fingerprintJSService.getVisitorFingerprint();
      fingerprintJSData = {
        visitorId: result.visitorId,
        confidence: result.confidence.score,
        components: result.components
      };
    } catch (error) {
      console.warn('Professional fingerprinting failed:', error);
      fingerprintJSData = null;
    }
    // Canvas fingerprinting - create a more complex pattern
    const canvas = document.createElement('canvas');
    canvas.width = 280;
    canvas.height = 60;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Text rendering test
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = '#f60';
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = '#069';
      ctx.font = '11pt Arial';
      ctx.fillText('Fingerprint Test 🔍', 2, 15);
      ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
      ctx.font = '18pt Arial';
      ctx.fillText('Canvas 1.0', 4, 45);
      
      // Geometric shapes
      ctx.globalCompositeOperation = 'multiply';
      ctx.fillStyle = 'rgb(255,0,255)';
      ctx.beginPath();
      ctx.arc(50, 50, 50, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = 'rgb(0,255,255)';
      ctx.beginPath();
      ctx.arc(100, 50, 50, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fill();
    }

    // WebGL fingerprinting with detailed renderer info
    const webglCanvas = document.createElement('canvas');
    const gl = webglCanvas.getContext('webgl') as WebGLRenderingContext | null || 
               webglCanvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
    let webglInfo = 'WebGL not supported';
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        webglInfo = `${vendor} - ${renderer}`;
      } else {
        webglInfo = `${gl.getParameter(gl.VENDOR)} - ${gl.getParameter(gl.RENDERER)}`;
      }
    }

    // Comprehensive font detection
    const testFonts = [
      'Arial', 'Arial Black', 'Arial Narrow', 'Arial Rounded MT Bold',
      'Helvetica', 'Helvetica Neue', 'Times', 'Times New Roman',
      'Courier', 'Courier New', 'Verdana', 'Georgia', 'Palatino',
      'Garamond', 'Bookman', 'Comic Sans MS', 'Trebuchet MS',
      'Impact', 'Lucida Console', 'Lucida Sans Unicode', 'Tahoma',
      'Calibri', 'Cambria', 'Segoe UI', 'Consolas', 'Monaco',
      'Menlo', 'Ubuntu', 'Roboto', 'Open Sans', 'Source Sans Pro'
    ];
    
    const detectedFonts = testFonts.filter(font => {
      return document.fonts ? document.fonts.check(`12px "${font}"`) : true;
    });

    // Plugin detection with more details - fix version property access
    const plugins = Array.from(navigator.plugins || []).map(plugin => ({
      name: plugin.name,
      description: plugin.description,
      filename: plugin.filename,
      version: (plugin as any).version || 'Unknown' // Use type assertion for optional version property
    }));

    // Comprehensive permission checks
    const permissions: Record<string, string> = {};
    const permissionsToCheck = [
      'camera', 'microphone', 'geolocation', 'notifications', 
      'persistent-storage', 'push', 'midi', 'background-sync'
    ];
    
    for (const permission of permissionsToCheck) {
      try {
        if ('permissions' in navigator) {
          const result = await navigator.permissions.query({ name: permission as PermissionName });
          permissions[permission] = result.state;
        }
      } catch (error) {
        permissions[permission] = 'not available';
      }
    }

    // Battery API with full details
    let battery: any = null;
    try {
      if ('getBattery' in navigator) {
        const batteryInfo = await (navigator as any).getBattery();
        battery = {
          level: Math.round(batteryInfo.level * 100),
          charging: batteryInfo.charging,
          chargingTime: batteryInfo.chargingTime === Infinity ? 'Unknown' : `${Math.round(batteryInfo.chargingTime / 60)} minutes`,
          dischargingTime: batteryInfo.dischargingTime === Infinity ? 'Unknown' : `${Math.round(batteryInfo.dischargingTime / 60)} minutes`
        };
      }
    } catch (error) {
      battery = { error: 'Battery API not available' };
    }

    // Enhanced network information
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    let connectionInfo = null;
    if (connection) {
      connectionInfo = {
        effectiveType: connection.effectiveType || 'Unknown',
        downlink: connection.downlink ? `${connection.downlink} Mbps` : 'Unknown',
        rtt: connection.rtt ? `${connection.rtt} ms` : 'Unknown',
        type: connection.type || 'Unknown',
        saveData: connection.saveData || false
      };
    }

    // Additional browser capabilities - fix RTC property access
    const windowWithRTC = window as any;
    const additionalInfo = {
      webRTC: !!(window.RTCPeerConnection || windowWithRTC.webkitRTCPeerConnection || windowWithRTC.mozRTCPeerConnection),
      webGL: !!gl,
      webAssembly: typeof WebAssembly === 'object',
      serviceWorker: 'serviceWorker' in navigator,
      localStorage: typeof Storage !== 'undefined',
      sessionStorage: typeof sessionStorage !== 'undefined',
      indexedDB: 'indexedDB' in window,
      webSpeech: 'speechSynthesis' in window,
      geolocation: 'geolocation' in navigator,
      vibration: 'vibrate' in navigator
    };

    return {
      // Professional FingerprintJS data
      fingerprintJS: fingerprintJSData,
      
      // Educational browser fingerprinting data
      userAgent: navigator.userAgent,
      screen: {
        width: screen.width,
        height: screen.height,
        colorDepth: screen.colorDepth,
        pixelDepth: screen.pixelDepth,
        availWidth: screen.availWidth,
        availHeight: screen.availHeight,
        pixelRatio: window.devicePixelRatio || 1
      },
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      languages: Array.from(navigator.languages || []),
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack,
      canvas: canvas.toDataURL(),
      webgl: webglInfo,
      fonts: detectedFonts,
      plugins: plugins,
      touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      hardwareConcurrency: navigator.hardwareConcurrency || 1,
      deviceMemory: (navigator as any).deviceMemory,
      connection: connectionInfo,
      battery: battery,
      permissions: permissions,
      additionalInfo: additionalInfo
    };
  };

  return (
    <div className="bg-cyber rounded-lg border border-pink-400/20 p-6">
      <div className="flex items-center mb-6">
        <div className="bg-pink-400/10 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
          <Fingerprint className="h-6 w-6 text-pink-400" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white">Real-Time Browser Scanner</h3>
          <p className="text-gray-400 text-sm">Collect your actual browser fingerprint</p>
        </div>
      </div>

        <div className="space-y-4">
        <div className="flex items-start space-x-3 p-3 bg-blue-400/10 border border-blue-400/20 rounded-lg">
          <Shield className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-blue-400 text-sm font-medium">Professional + Educational Analysis</p>
            <p className="text-gray-300 text-xs mt-1">
              Uses FingerprintJS for accurate visitor identification alongside educational browser data collection.
            </p>
          </div>
        </div>
        
        <p className="text-gray-300 text-sm leading-relaxed">
          This scanner combines professional fingerprinting with educational demonstrations. 
          All data is processed locally and never leaves your browser.
        </p>

        {isCollecting && (
          <div className="space-y-3">
            <div className="flex items-center text-sm text-pink-400">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Scanning your browser... {Math.round(progress)}%
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
              Scan My Browser
            </>
          )}
        </button>

        <div className="text-xs text-gray-500 space-y-2">
          <p>• Professional FingerprintJS integration</p>
          <p>• Real browser data collection</p>
          <p>• 100% privacy-focused (local only)</p>
          <p>• Educational demonstration</p>
        </div>
      </div>
    </div>
  );
};

export default FingerprintCollector;
