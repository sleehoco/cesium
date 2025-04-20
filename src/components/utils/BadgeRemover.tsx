
import { useEffect } from 'react';

/**
 * Component that attempts to remove any "Edit with Lovable" badges
 * by adding specific CSS and running cleanup scripts
 */
const BadgeRemover = () => {
  useEffect(() => {
    // Function to remove badge elements
    const removeBadgeElements = () => {
      // Direct DOM removal for specific badge elements
      const directBadge = document.getElementById('lovable-badge');
      if (directBadge) {
        console.log('Removing direct badge element');
        directBadge.remove();
      }

      // More aggressive approach - find and remove any elements that match our criteria
      const possibleBadges = document.querySelectorAll('a[href*="lovable.dev"]');
      possibleBadges.forEach(badge => {
        console.log('Removing badge element by URL pattern');
        badge.remove();
      });

      // Try to find and remove any script elements that might be injecting the badge
      const scripts = document.querySelectorAll('script[src*="gpteng"]');
      scripts.forEach(script => {
        console.log('Removing script:', script);
        script.remove();
      });
    };

    // Add CSS to hide known badge selectors
    const style = document.createElement('style');
    style.innerHTML = `
      /* Target known badge selectors */
      div[id*="gpte"],
      div[class*="gpte"],
      div[id*="lovable"],
      div[class*="lovable"],
      a[id*="lovable"],
      a[href*="lovable.dev"],
      #lovable-badge,
      #gpt-engineer-select-root,
      .gpt-engineer-widget,
      [data-lovable-badge="true"],
      [data-gpte-badge="true"] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
        width: 0 !important;
        height: 0 !important;
        position: absolute !important;
        top: -9999px !important;
        left: -9999px !important;
      }
    `;
    document.head.appendChild(style);

    // Call initially
    removeBadgeElements();

    // Set up a mutation observer to detect and remove the badge if it's added dynamically
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(() => {
        removeBadgeElements();
      });
    });

    // Start observing the body for added nodes
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });

    return () => {
      // Cleanup when component unmounts
      style.remove();
      observer.disconnect();
    };
  }, []);

  return null; // This component doesn't render anything
};

export default BadgeRemover;
