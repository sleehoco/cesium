
import { useEffect } from 'react';

/**
 * Component that attempts to remove any "Edit with Lovable" badges
 * by adding specific CSS and running cleanup scripts
 */
const BadgeRemover = () => {
  useEffect(() => {
    // Add CSS to hide known badge selectors
    const style = document.createElement('style');
    style.innerHTML = `
      /* Target known badge selectors */
      div[id*="gpte"],
      div[class*="gpte"],
      div[id*="lovable"],
      div[class*="lovable"],
      #gpt-engineer-select-root,
      .gpt-engineer-widget,
      [data-lovable-badge="true"],
      [data-gpte-badge="true"] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
      }
    `;
    document.head.appendChild(style);

    // Try to find and remove any scripts that might be injecting the badge
    const scripts = document.querySelectorAll('script[src*="gpteng"]');
    scripts.forEach(script => {
      console.log('Removing script:', script);
      script.remove();
    });

    return () => {
      // Cleanup if component unmounts
      style.remove();
    };
  }, []);

  return null; // This component doesn't render anything
};

export default BadgeRemover;
