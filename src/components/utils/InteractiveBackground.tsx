
import { useEffect, useRef, useState } from 'react';

interface InteractiveBackgroundProps {
  className?: string;
  intensity?: number;
}

const InteractiveBackground = ({ 
  className = "", 
  intensity = 0.1 
}: InteractiveBackgroundProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      
      setMousePosition({ x, y });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  const style = {
    background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
      rgba(139, 92, 246, ${intensity}) 0%, 
      rgba(99, 102, 241, ${intensity * 0.5}) 25%, 
      transparent 50%)`,
  };

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 transition-all duration-300 ease-out pointer-events-none ${className}`}
      style={{ ...style, zIndex: 2 }}
    />
  );
};

export default InteractiveBackground;
