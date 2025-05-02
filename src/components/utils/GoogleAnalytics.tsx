
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

// Type for Google Analytics gtag function
declare global {
  interface Window {
    gtag: (
      command: string,
      action: string,
      params?: Record<string, any> | string
    ) => void;
    dataLayer: any[];
  }
}

interface GoogleAnalyticsProps {
  measurementId: string;
}

const GoogleAnalytics = ({ measurementId }: GoogleAnalyticsProps) => {
  const location = useLocation();
  const [initialized, setInitialized] = useState(false);

  // Set up GA tracking
  useEffect(() => {
    if (window.gtag && measurementId && !initialized) {
      window.gtag('config', measurementId);
      setInitialized(true);
      console.log("Google Analytics initialized with ID:", measurementId);
    }
  }, [measurementId, initialized]);
  
  // Track page views
  useEffect(() => {
    if (initialized && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: location.pathname,
      });
      console.log("Page view tracked:", location.pathname);
    }
  }, [location, initialized]);
  
  return null; // This component doesn't render anything
};

// Utility function to track custom events
export const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
  if (window.gtag) {
    window.gtag('event', eventName, eventParams);
    console.log("Event tracked:", eventName, eventParams);
  }
};

export default GoogleAnalytics;
