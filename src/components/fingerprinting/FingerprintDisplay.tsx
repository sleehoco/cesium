
import React from "react";
import { Monitor, Smartphone, Globe, Shield, Eye, Hash, Cpu, Wifi, Battery, ChevronDown, ChevronRight, Zap, Camera, Gamepad2, Star, Award } from "lucide-react";
import { FingerprintData } from "../../pages/BrowserFingerprintingDemo";
import { useState } from "react";

interface FingerprintDisplayProps {
  data: FingerprintData | null;
  isCollecting: boolean;
  collectionComplete: boolean;
}

const FingerprintDisplay: React.FC<FingerprintDisplayProps> = ({
  data,
  isCollecting,
  collectionComplete
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['basic']));

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  if (!collectionComplete && !isCollecting) {
    return (
      <div className="bg-cyber rounded-lg border border-cesium/20 p-8 text-center">
        <Eye className="h-16 w-16 text-gray-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Ready to Analyze</h3>
        <p className="text-gray-400">
          Click the scan button to reveal what your browser shares about you.
        </p>
      </div>
    );
  }

  if (isCollecting) {
    return (
      <div className="bg-cyber rounded-lg border border-pink-400/20 p-8 text-center">
        <div className="animate-pulse">
          <Hash className="h-16 w-16 text-pink-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Analyzing Your Browser</h3>
          <p className="text-gray-400">
            Collecting real fingerprint data from your device...
          </p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  // Calculate real uniqueness based on collected data
  const calculateUniqueness = () => {
    let score = 0;
    
    // Screen resolution uniqueness
    const commonResolutions = ['1920x1080', '1366x768', '1536x864', '1440x900'];
    const userResolution = `${data.screen.width}x${data.screen.height}`;
    if (!commonResolutions.includes(userResolution)) score += 15;
    
    // Browser and platform
    if (data.userAgent.includes('Chrome')) score += 5;
    else if (data.userAgent.includes('Firefox')) score += 10;
    else if (data.userAgent.includes('Safari')) score += 8;
    else score += 20;
    
    // Fonts
    if (data.fonts.length > 25) score += 15;
    else if (data.fonts.length > 15) score += 10;
    
    // Hardware
    if (data.hardwareConcurrency > 8) score += 10;
    if (data.deviceMemory && data.deviceMemory > 8) score += 8;
    
    // WebGL renderer
    if (data.webgl.includes('NVIDIA') || data.webgl.includes('AMD') || data.webgl.includes('Intel')) score += 12;
    
    // Languages
    if (data.languages.length > 3) score += 8;
    
    // Timezone
    const commonTimezones = ['America/New_York', 'America/Los_Angeles', 'Europe/London', 'UTC'];
    if (!commonTimezones.includes(data.timezone)) score += 10;
    
    return Math.min(95, Math.max(65, score));
  };

  const uniquenessScore = calculateUniqueness();

  const sections = [
    {
      id: 'basic',
      title: 'Browser & System Information',
      icon: Globe,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
      items: [
        { label: 'User Agent', value: data.userAgent, important: true },
        { label: 'Platform/OS', value: data.platform },
        { label: 'Primary Language', value: data.language },
        { label: 'All Languages', value: data.languages.join(', ') },
        { label: 'Timezone', value: data.timezone, important: true },
        { label: 'Cookies Enabled', value: data.cookieEnabled ? 'Yes' : 'No' },
        { label: 'Do Not Track', value: data.doNotTrack || 'Not set' }
      ]
    },
    {
      id: 'screen',
      title: 'Display & Graphics',
      icon: Monitor,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
      items: [
        { label: 'Screen Resolution', value: `${data.screen.width} × ${data.screen.height}`, important: true },
        { label: 'Available Space', value: `${data.screen.availWidth} × ${data.screen.availHeight}` },
        { label: 'Color Depth', value: `${data.screen.colorDepth} bits` },
        { label: 'Pixel Depth', value: `${data.screen.pixelDepth} bits` },
        { label: 'Device Pixel Ratio', value: `${data.screen.pixelRatio}x`, important: true },
        { label: 'Touch Support', value: data.touchSupport ? 'Yes' : 'No' },
        { label: 'WebGL Renderer', value: data.webgl, important: true }
      ]
    },
    {
      id: 'hardware',
      title: 'Hardware Specifications',
      icon: Cpu,
      color: 'text-orange-400',
      bgColor: 'bg-orange-400/10',
      items: [
        { label: 'CPU Cores', value: data.hardwareConcurrency.toString(), important: true },
        { label: 'Device Memory', value: data.deviceMemory ? `${data.deviceMemory} GB` : 'Not available', important: !!data.deviceMemory },
        { label: 'Max Touch Points', value: navigator.maxTouchPoints?.toString() || 'Unknown' }
      ]
    },
    {
      id: 'capabilities',
      title: 'Browser Capabilities',
      icon: Zap,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10',
      items: Object.entries(data.additionalInfo || {}).map(([key, value]) => ({
        label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
        value: value ? 'Supported' : 'Not supported'
      }))
    },
    {
      id: 'network',
      title: 'Network Information',
      icon: Wifi,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10',
      items: data.connection ? [
        { label: 'Connection Type', value: data.connection.effectiveType },
        { label: 'Downlink Speed', value: data.connection.downlink },
        { label: 'Round Trip Time', value: data.connection.rtt },
        { label: 'Connection Tech', value: data.connection.type || 'Unknown' },
        { label: 'Data Saver', value: data.connection.saveData ? 'Enabled' : 'Disabled' }
      ] : [{ label: 'Network Info', value: 'Not available' }]
    },
    {
      id: 'battery',
      title: 'Battery Status',
      icon: Battery,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      items: data.battery && !data.battery.error ? [
        { label: 'Battery Level', value: `${data.battery.level}%`, important: true },
        { label: 'Charging Status', value: data.battery.charging ? 'Charging' : 'Not charging' },
        { label: 'Charging Time', value: data.battery.chargingTime },
        { label: 'Discharging Time', value: data.battery.dischargingTime }
      ] : [{ label: 'Battery Information', value: 'Not available' }]
    },
    {
      id: 'permissions',
      title: 'Permission States',
      icon: Shield,
      color: 'text-red-400',
      bgColor: 'bg-red-400/10',
      items: Object.entries(data.permissions).map(([key, value]) => ({
        label: key.charAt(0).toUpperCase() + key.slice(1).replace(/-/g, ' '),
        value: value,
        important: value === 'granted'
      }))
    },
    {
      id: 'fonts',
      title: 'Available Fonts',
      icon: Hash,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-400/10',
      items: [
        { label: 'Total Fonts Detected', value: data.fonts.length.toString(), important: true },
        { label: 'Font List', value: data.fonts.join(', '), truncate: true }
      ]
    },
    {
      id: 'plugins',
      title: 'Browser Plugins',
      icon: Gamepad2,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-400/10',
      items: data.plugins.length > 0 ? [
        { label: 'Total Plugins', value: data.plugins.length.toString() },
        ...data.plugins.slice(0, 5).map((plugin: any, index: number) => ({
          label: `Plugin ${index + 1}`,
          value: typeof plugin === 'string' ? plugin : plugin.name || 'Unknown plugin'
        })),
        ...(data.plugins.length > 5 ? [{ label: 'Additional Plugins', value: `${data.plugins.length - 5} more...` }] : [])
      ] : [{ label: 'Plugins', value: 'No plugins detected' }]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Professional Visitor ID */}
      {data.fingerprintJS && (
        <div className="bg-cyber rounded-lg border border-blue-400/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-blue-400/10 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
                <Award className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Professional Visitor ID</h3>
                <p className="text-gray-400 text-sm">Powered by FingerprintJS</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-400 font-mono break-all">
                {data.fingerprintJS.visitorId}
              </div>
              <div className="text-sm text-gray-400">
                Confidence: {Math.round(data.fingerprintJS.confidence * 100)}%
              </div>
            </div>
          </div>
          <div className="bg-cyber-dark/50 p-4 rounded-lg">
            <p className="text-gray-300 text-sm leading-relaxed">
              This is your <strong className="text-blue-400">professional visitor identifier</strong> - a highly accurate, 
              stable fingerprint that remains consistent across browsing sessions. Unlike basic browser fingerprinting, 
              this uses advanced techniques to provide {Math.round(data.fingerprintJS.confidence * 100)}% accuracy 
              for visitor identification.
            </p>
          </div>
        </div>
      )}

      {/* FingerprintJS Error/Fallback */}
      {!data.fingerprintJS && (
        <div className="bg-cyber rounded-lg border border-orange-400/20 p-6">
          <div className="flex items-center mb-4">
            <div className="bg-orange-400/10 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
              <Shield className="h-6 w-6 text-orange-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Educational Mode Only</h3>
              <p className="text-gray-400 text-sm">Professional fingerprinting unavailable</p>
            </div>
          </div>
          <p className="text-gray-300 text-sm">
            Professional FingerprintJS service is not available. Using educational browser fingerprinting below.
          </p>
        </div>
      )}

      {/* Uniqueness Score */}
      <div className="bg-cyber rounded-lg border border-red-400/20 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">Your Browser's Uniqueness Score</h3>
          <div className="text-2xl font-bold text-red-400">{uniquenessScore}%</div>
        </div>
        <div className="w-full bg-cyber-dark rounded-full h-3 mb-3">
          <div 
            className={`h-3 rounded-full transition-all duration-1000 ${
              uniquenessScore > 85 ? 'bg-gradient-to-r from-red-500 to-red-600' :
              uniquenessScore > 70 ? 'bg-gradient-to-r from-orange-500 to-red-500' :
              'bg-gradient-to-r from-yellow-400 to-orange-500'
            }`}
            style={{ width: `${uniquenessScore}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-400">
          {uniquenessScore > 85 ? 'Very unique - easy to track across websites' :
           uniquenessScore > 70 ? 'Moderately unique - trackable with some effort' :
           'Less unique - harder to track individually'}
        </p>
      </div>

      {/* Detailed Sections */}
      <div className="space-y-4">
        {sections.map((section) => (
          <div key={section.id} className="bg-cyber rounded-lg border border-cesium/20">
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full p-4 flex items-center justify-between hover:bg-cyber-dark/50 transition-colors"
            >
              <div className="flex items-center">
                <div className={`${section.bgColor} w-10 h-10 rounded-lg flex items-center justify-center mr-3`}>
                  <section.icon className={`h-5 w-5 ${section.color}`} />
                </div>
                <h4 className="text-lg font-semibold text-white">{section.title}</h4>
              </div>
              {expandedSections.has(section.id) ? (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronRight className="h-5 w-5 text-gray-400" />
              )}
            </button>
            
            {expandedSections.has(section.id) && (
              <div className="px-4 pb-4 space-y-3">
                {section.items.map((item, index) => (
                  <div key={index} className={`flex justify-between items-start bg-cyber-dark/30 p-3 rounded ${item.important ? 'border-l-4 border-pink-400' : ''}`}>
                    <span className="text-gray-300 text-sm font-medium flex items-center">
                      {item.label}:
                      {item.important && <span className="ml-2 w-2 h-2 bg-pink-400 rounded-full"></span>}
                    </span>
                    <span className={`text-white text-sm text-right max-w-md ${item.truncate ? 'truncate' : 'break-all'}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Canvas Fingerprint */}
      <div className="bg-cyber rounded-lg border border-cesium/20 p-4">
        <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
          <Camera className="h-5 w-5 mr-2 text-pink-400" />
          Your Unique Canvas Fingerprint
        </h4>
        <div className="bg-cyber-dark/50 p-3 rounded overflow-hidden">
          <img 
            src={data.canvas} 
            alt="Your browser's canvas fingerprint" 
            className="max-w-full h-auto border border-gray-600 rounded"
          />
        </div>
        <p className="text-xs text-gray-400 mt-2">
          This unique image is generated by your specific browser, GPU, and system configuration. 
          Even tiny differences in rendering create a distinctive signature.
        </p>
      </div>

      {/* Summary Alert */}
      <div className="bg-orange-400/10 border border-orange-400/20 rounded-lg p-4">
        <h4 className="text-orange-400 font-semibold mb-2">Privacy Impact Summary</h4>
        <p className="text-gray-300 text-sm">
          Your browser reveals {sections.reduce((acc, section) => acc + section.items.length, 0)} distinct data points. 
          This information can be combined to create a unique profile for tracking across websites, 
          even without cookies or login information.
        </p>
      </div>
    </div>
  );
};

export default FingerprintDisplay;
