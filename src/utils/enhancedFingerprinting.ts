// Enhanced browser fingerprinting utilities

export interface EnhancedFingerprint {
  canvas: string;
  webgl: string;
  audio: string;
  fonts: string[];
  plugins: string[];
  screen: {
    width: number;
    height: number;
    colorDepth: number;
    pixelRatio: number;
  };
  timezone: string;
  language: string;
  platform: string;
  hardware: {
    cores: number;
    memory?: number;
  };
  features: {
    cookieEnabled: boolean;
    doNotTrack: string | null;
    localStorage: boolean;
    sessionStorage: boolean;
    indexedDB: boolean;
  };
  connection: {
    effectiveType?: string;
    downlink?: number;
    rtt?: number;
  };
}

// Generate canvas fingerprint
export const generateCanvasFingerprint = (): string => {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return 'unavailable';

    canvas.width = 200;
    canvas.height = 50;

    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillStyle = '#f60';
    ctx.fillRect(0, 0, 140, 30);
    
    ctx.fillStyle = '#069';
    ctx.fillText('Browser Fingerprint', 2, 2);
    
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.fillText('Canvas Test', 4, 17);

    return canvas.toDataURL();
  } catch (e) {
    return 'error';
  }
};

// Generate WebGL fingerprint
export const generateWebGLFingerprint = (): string => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
    
    if (!gl) return 'unavailable';

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (!debugInfo) return 'no-debug-info';

    const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    
    return `${vendor}~${renderer}`;
  } catch (e) {
    return 'error';
  }
};

// Generate audio fingerprint
export const generateAudioFingerprint = async (): Promise<string> => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return 'unavailable';

    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const analyser = context.createAnalyser();
    const gainNode = context.createGain();
    const scriptProcessor = context.createScriptProcessor(4096, 1, 1);

    gainNode.gain.value = 0; // Mute
    oscillator.type = 'triangle';
    oscillator.connect(analyser);
    analyser.connect(scriptProcessor);
    scriptProcessor.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.start(0);

    return new Promise((resolve) => {
      scriptProcessor.onaudioprocess = (event) => {
        const output = event.outputBuffer.getChannelData(0);
        const sum = output.reduce((acc, val) => acc + Math.abs(val), 0);
        oscillator.stop();
        scriptProcessor.disconnect();
        resolve(sum.toString());
      };
    });
  } catch (e) {
    return 'error';
  }
};

// Detect available fonts
export const detectFonts = (): string[] => {
  const baseFonts = ['monospace', 'sans-serif', 'serif'];
  const testFonts = [
    'Arial', 'Verdana', 'Times New Roman', 'Courier New',
    'Georgia', 'Palatino', 'Garamond', 'Bookman',
    'Comic Sans MS', 'Trebuchet MS', 'Impact'
  ];

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return [];

  const testString = 'mmmmmmmmmmlli';
  const textSize = '72px';

  const baseFontWidths: { [key: string]: number } = {};
  
  // Get baseline widths
  baseFonts.forEach(baseFont => {
    ctx.font = `${textSize} ${baseFont}`;
    baseFontWidths[baseFont] = ctx.measureText(testString).width;
  });

  const availableFonts: string[] = [];

  testFonts.forEach(font => {
    baseFonts.forEach(baseFont => {
      ctx.font = `${textSize} ${font}, ${baseFont}`;
      const width = ctx.measureText(testString).width;
      if (width !== baseFontWidths[baseFont]) {
        availableFonts.push(font);
      }
    });
  });

  return [...new Set(availableFonts)];
};

// Get connection information
export const getConnectionInfo = () => {
  const nav = navigator as any;
  const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
  
  if (!connection) {
    return {};
  }

  return {
    effectiveType: connection.effectiveType,
    downlink: connection.downlink,
    rtt: connection.rtt,
  };
};

// Generate complete enhanced fingerprint
export const generateEnhancedFingerprint = async (): Promise<EnhancedFingerprint> => {
  const canvas = generateCanvasFingerprint();
  const webgl = generateWebGLFingerprint();
  const audio = await generateAudioFingerprint();
  const fonts = detectFonts();
  
  const plugins = Array.from(navigator.plugins).map(p => p.name);
  
  return {
    canvas,
    webgl,
    audio,
    fonts,
    plugins,
    screen: {
      width: window.screen.width,
      height: window.screen.height,
      colorDepth: window.screen.colorDepth,
      pixelRatio: window.devicePixelRatio,
    },
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
    platform: navigator.platform,
    hardware: {
      cores: navigator.hardwareConcurrency,
      memory: (navigator as any).deviceMemory,
    },
    features: {
      cookieEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack,
      localStorage: !!window.localStorage,
      sessionStorage: !!window.sessionStorage,
      indexedDB: !!window.indexedDB,
    },
    connection: getConnectionInfo(),
  };
};

// Generate session ID
export const generateSessionId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};