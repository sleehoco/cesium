import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";

interface ConsentPreferences {
  analytics: boolean;
  fingerprinting: boolean;
  timestamp: number;
}

const CONSENT_KEY = "cesium-consent-preferences";
const CONSENT_EXPIRY_DAYS = 365;

export const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [consent, setConsent] = useState<ConsentPreferences | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored) {
      try {
        const parsed: ConsentPreferences = JSON.parse(stored);
        const expiryDate = new Date(parsed.timestamp);
        expiryDate.setDate(expiryDate.getDate() + CONSENT_EXPIRY_DAYS);
        
        if (new Date() < expiryDate) {
          setConsent(parsed);
          applyConsent(parsed);
        } else {
          localStorage.removeItem(CONSENT_KEY);
          setShowBanner(true);
        }
      } catch (e) {
        setShowBanner(true);
      }
    } else {
      setShowBanner(true);
    }
  }, []);

  const applyConsent = (preferences: ConsentPreferences) => {
    // Store consent in window object for other components to check
    window.cesiumConsent = preferences;
    
    // Disable analytics if not consented
    if (!preferences.analytics && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied'
      });
    }
  };

  const saveConsent = (analytics: boolean, fingerprinting: boolean) => {
    const preferences: ConsentPreferences = {
      analytics,
      fingerprinting,
      timestamp: Date.now()
    };
    
    localStorage.setItem(CONSENT_KEY, JSON.stringify(preferences));
    setConsent(preferences);
    setShowBanner(false);
    applyConsent(preferences);
    
    // If analytics accepted, enable it
    if (analytics && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted'
      });
    }
  };

  const acceptAll = () => {
    saveConsent(true, true);
  };

  const rejectAll = () => {
    saveConsent(false, false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom-5">
      <Card className="mx-auto max-w-4xl border-2 bg-background/95 backdrop-blur-sm shadow-lg">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Privacy & Cookie Settings</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={rejectAll}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-3 mb-6 text-sm text-muted-foreground">
            <p>
              We use cookies and similar technologies to enhance your experience on our website.
            </p>
            
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                <div>
                  <strong className="text-foreground">Analytics:</strong> Help us understand how you use our site to improve performance and user experience.
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                <div>
                  <strong className="text-foreground">Browser Fingerprinting:</strong> Used for security analysis and fraud detection on our demo pages.
                </div>
              </div>
            </div>
            
            <p>
              You can change your preferences at any time. Essential cookies for site functionality are always enabled.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={acceptAll}
              className="flex-1"
            >
              Accept All
            </Button>
            <Button 
              onClick={rejectAll}
              variant="outline"
              className="flex-1"
            >
              Reject Optional
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

// Helper function to check consent
export const hasConsent = (type: 'analytics' | 'fingerprinting'): boolean => {
  if (typeof window === 'undefined') return false;
  
  const consent = window.cesiumConsent;
  if (!consent) return false;
  
  return consent[type] === true;
};

// Extend Window interface
declare global {
  interface Window {
    cesiumConsent?: ConsentPreferences;
  }
}
