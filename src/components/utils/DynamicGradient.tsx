
import { useEffect, useRef } from 'react';

interface DynamicGradientProps {
  className?: string;
  colors?: string[];
  speed?: number;
}

const DynamicGradient = ({ 
  className = "", 
  colors = ['#1A1A1A', '#2A2A2A', '#0A0A0A', '#1F2937', '#374151'],
  speed = 0.002
}: DynamicGradientProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const animate = () => {
      timeRef.current += speed;
      
      const gradient = ctx.createLinearGradient(
        0, 0,
        canvas.width + Math.sin(timeRef.current) * 200,
        canvas.height + Math.cos(timeRef.current) * 200
      );

      // Create dynamic gradient stops with subtle colors
      colors.forEach((color, index) => {
        const stop = (index / (colors.length - 1)) + Math.sin(timeRef.current + index) * 0.1;
        gradient.addColorStop(Math.max(0, Math.min(1, stop)), color + '10');
      });

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    animate();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [colors, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 0 }}
    />
  );
};

export default DynamicGradient;
