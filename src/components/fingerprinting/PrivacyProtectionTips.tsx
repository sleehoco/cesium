
import React from "react";
import { Shield, Eye, Lock, Globe, Smartphone, Server, CheckCircle } from "lucide-react";

const PrivacyProtectionTips = () => {
  const protectionMethods = [
    {
      icon: Shield,
      title: "Use Privacy-Focused Browsers",
      description: "Switch to browsers like Tor, Brave, or Firefox with strict privacy settings.",
      effectiveness: "High",
      color: "text-green-400",
      bgColor: "bg-green-400/10"
    },
    {
      icon: Eye,
      title: "Enable Browser Extensions",
      description: "Install uBlock Origin, Privacy Badger, and NoScript to block tracking scripts.",
      effectiveness: "High",
      color: "text-blue-400",
      bgColor: "bg-blue-400/10"
    },
    {
      icon: Globe,
      title: "Use VPN Services",
      description: "Hide your IP address and location with a reliable VPN service.",
      effectiveness: "Medium",
      color: "text-purple-400",
      bgColor: "bg-purple-400/10"
    },
    {
      icon: Lock,
      title: "Disable JavaScript",
      description: "Turn off JavaScript for sensitive browsing (may break some websites).",
      effectiveness: "Very High",
      color: "text-orange-400",
      bgColor: "bg-orange-400/10"
    },
    {
      icon: Smartphone,
      title: "Spoof User Agent",
      description: "Use browser extensions to randomize or spoof your user agent string.",
      effectiveness: "Medium",
      color: "text-pink-400",
      bgColor: "bg-pink-400/10"
    },
    {
      icon: Server,
      title: "Use Proxy Servers",
      description: "Route traffic through proxy servers to mask your fingerprint.",
      effectiveness: "Medium",
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/10"
    }
  ];

  const browserSettings = [
    "Disable WebGL in browser settings",
    "Block third-party cookies",
    "Disable geolocation services",
    "Turn off camera and microphone permissions",
    "Use private/incognito browsing mode",
    "Regularly clear browser data and cookies",
    "Disable font enumeration",
    "Use canvas poisoning extensions"
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Protect Your <span className="text-cesium">Privacy</span>
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Implement these strategies to reduce your browser fingerprint and enhance your online privacy.
        </p>
      </div>

      {/* Protection Methods */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {protectionMethods.map((method, index) => (
          <div key={index} className="bg-cyber-dark rounded-lg border border-cesium/20 p-6">
            <div className="flex items-start mb-4">
              <div className={`${method.bgColor} w-12 h-12 rounded-lg flex items-center justify-center mr-4 flex-shrink-0`}>
                <method.icon className={`h-6 w-6 ${method.color}`} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">{method.title}</h3>
                <span className={`text-xs px-2 py-1 rounded ${method.color} bg-opacity-20`}>
                  {method.effectiveness} Effectiveness
                </span>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              {method.description}
            </p>
          </div>
        ))}
      </div>

      {/* Browser Settings */}
      <div className="bg-cyber-dark rounded-lg border border-cesium/20 p-8">
        <h3 className="text-2xl font-semibold text-white mb-6 flex items-center">
          <Shield className="h-6 w-6 text-cesium mr-3" />
          Essential Browser Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {browserSettings.map((setting, index) => (
            <div key={index} className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
              <span className="text-gray-300">{setting}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Warning Box */}
      <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-6">
        <div className="flex items-start">
          <div className="bg-orange-500/20 w-10 h-10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
            <Eye className="h-5 w-5 text-orange-500" />
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-2">Important Notice</h4>
            <p className="text-gray-300 text-sm leading-relaxed">
              While these methods can significantly reduce your fingerprint, complete anonymity is nearly impossible. 
              Advanced tracking techniques and combinations of data points can still identify users. 
              For maximum privacy, consider using specialized privacy-focused operating systems like Tails.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyProtectionTips;
