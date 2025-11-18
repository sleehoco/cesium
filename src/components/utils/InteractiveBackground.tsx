
import { useEffect, useRef, useState } from 'react';

interface InteractiveBackgroundProps {
  className?: string;
  intensity?: number;
}

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
}

const InteractiveBackground = ({ 
  className = "", 
  intensity = 0.1 
}: InteractiveBackgroundProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: -1000, y: -1000 });
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      initParticles();
    };

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = [];
      const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
      
      for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const colors = ['hsl(var(--primary))', 'hsl(var(--primary) / 0.6)', 'hsl(var(--accent))'];
        
        particlesRef.current.push({
          x,
          y,
          baseX: x,
          baseY: y,
          vx: 0,
          vy: 0,
          size: Math.random() * 2 + 1,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
    };

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particlesRef.current.forEach((particle) => {
        // Calculate distance from mouse
        const dx = mousePosition.x - particle.x;
        const dy = mousePosition.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 150;
        
        // Apply mouse influence
        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance;
          const angle = Math.atan2(dy, dx);
          particle.vx += Math.cos(angle) * force * 0.3;
          particle.vy += Math.sin(angle) * force * 0.3;
        }
        
        // Return to base position
        particle.vx += (particle.baseX - particle.x) * 0.02;
        particle.vy += (particle.baseY - particle.y) * 0.02;
        
        // Apply velocity with damping
        particle.vx *= 0.92;
        particle.vy *= 0.92;
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        
        // Opacity based on distance from mouse
        const opacity = distance < maxDistance ? 0.8 : 0.3;
        ctx.fillStyle = particle.color.replace(')', ` / ${opacity})`);
        ctx.fill();
        
        // Draw connections
        particlesRef.current.forEach((other) => {
          const dx2 = particle.x - other.x;
          const dy2 = particle.y - other.y;
          const dist = Math.sqrt(dx2 * dx2 + dy2 * dy2);
          
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `hsl(var(--primary) / ${0.1 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    container.addEventListener('mousemove', handleMouseMove);
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      container.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [mousePosition.x, mousePosition.y]);

  const gradientStyle = {
    background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, 
      hsl(var(--primary) / ${intensity * 0.8}) 0%, 
      hsl(var(--accent) / ${intensity * 0.4}) 25%, 
      transparent 50%)`,
  };

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 ${className}`}
      style={{ zIndex: 2 }}
    >
      <div 
        className="absolute inset-0 transition-all duration-300 ease-out pointer-events-none"
        style={gradientStyle}
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
    </div>
  );
};

export default InteractiveBackground;
