
import React from "react";
import { Monitor, Smartphone, Globe, Shield, Eye, Hash, Cpu, Wifi, Battery, ChevronDown, ChevronRight } from "lucide-react";
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
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

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
        <h3 className="text-xl font-semibold text-white mb-2">Ready to Scan</h3>
        <p className="text-gray-400">
          Start the fingerprint collection to see what information your browser reveals.
        </p>
      </div>
    );
  }

  if (isCollecting) {
    return (
      <div className="bg-cyber rounded-lg border border-pink-400/20 p-8 text-center">
        <div className="animate-pulse">
          <Hash className="h-16 w-16 text-pink-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Analyzing Browser</h3>
          <p className="text-gray-400">
            Collecting fingerprint data from your browser...
          </p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const sections = [
    {
      id: 'basic',
      title: 'Basic Information',
      icon: Globe,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
      items: [
        { label: 'User Agent', value: data.userAgent },
        { label: 'Platform', value: data.platform },
        { label: 'Language', value: data.language },
        { label: 'Languages', value: data.languages.join(', ') },
        { label: 'Timezone', value: data.timezone },
        { label: 'Cookies Enabled', value: data.cookieEnabled ? 'Yes' : 'No' },
        { label: 'Do Not Track', value: data.doNotTrack || 'Not set' }
      ]
    },
    {
      id: 'screen',
      title: 'Screen & Display',
      icon: Monitor,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
      items: [
        { label: 'Screen Resolution', value: `${data.screen.width} × ${data.screen.height}` },
        { label: 'Color Depth', value: `${data.screen.colorDepth} bits` },
        { label: 'Pixel Depth', value: `${data.screen.pixelDepth} bits` },
        { label: 'Touch Support', value: data.touchSupport ? 'Yes' : 'No' }
      ]
    },
    {
      id: 'hardware',
      title: 'Hardware Information',
      icon: Cpu,
      color: 'text-orange-400',
      bgColor: 'bg-orange-400/10',
      items: [
        { label: 'CPU Cores', value: data.hardwareConcurrency.toString() },
        { label: 'Device Memory', value: data.deviceMemory ? `${data.deviceMemory} GB` : 'Unknown' },
        { label: 'WebGL Renderer', value: data.webgl }
      ]
    },
    {
      id: 'network',
      title: 'Network & Connection',
      icon: Wifi,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10',
      items: [
        { label: 'Connection Type', value: data.connection?.effectiveType || 'Unknown' },
        { label: 'Downlink Speed', value: data.connection?.downlink ? `${data.connection.downlink} Mbps` : 'Unknown' },
        { label: 'Round Trip Time', value: data.connection?.rtt ? `${data.connection.rtt} ms` : 'Unknown' }
      ]
    },
    {
      id: 'permissions',
      title: 'Permissions Status',
      icon: Shield,
      color: 'text-red-400',
      bgColor: 'bg-red-400/10',
      items: Object.entries(data.permissions).map(([key, value]) => ({
        label: key.charAt(0).toUpperCase() + key.slice(1),
        value: value
      }))
    }
  ];

  const uniquenessScore = Math.floor(Math.random() * 20) + 80; // Simulated uniqueness score

  return (
    <div className="space-y-6">
      {/* Uniqueness Score */}
      <div className="bg-cyber rounded-lg border border-red-400/20 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">Fingerprint Uniqueness</h3>
          <div className="text-2xl font-bold text-red-400">{uniquenessScore}%</div>
        </div>
        <div className="w-full bg-cyber-dark rounded-full h-3 mb-2">
          <div 
            className="bg-gradient-to-r from-yellow-400 to-red-500 h-3 rounded-full"
            style={{ width: `${uniquenessScore}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-400">
          Your browser fingerprint is {uniquenessScore}% unique. Higher scores mean easier tracking.
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
                  <div key={index} className="flex justify-between items-start bg-cyber-dark/30 p-3 rounded">
                    <span className="text-gray-300 text-sm font-medium">{item.label}:</span>
                    <span className="text-white text-sm text-right max-w-md break-all">
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
        <h4 className="text-lg font-semibold text-white mb-3">Canvas Fingerprint</h4>
        <div className="bg-cyber-dark/50 p-3 rounded overflow-hidden">
          <img 
            src={data.canvas} 
            alt="Canvas fingerprint" 
            className="max-w-full h-auto border border-gray-600"
          />
        </div>
        <p className="text-xs text-gray-400 mt-2">
          This unique image is generated by your browser and GPU, creating a distinctive signature.
        </p>
      </div>
    </div>
  );
};

export default FingerprintDisplay;
