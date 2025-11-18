
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

interface TrailPoint {
  x: number;
  y: number;
  alpha: number;
  size: number;
}

const InteractiveBackground = ({ 
  className = "", 
  intensity = 0.1 
}: InteractiveBackgroundProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: -1000, y: -1000 });
  const particlesRef = useRef<Particle[]>([]);
  const trailRef = useRef<TrailPoint[]>([]);
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
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setMousePosition({ x, y });
      
      // Add trail point
      trailRef.current.push({
        x,
        y,
        alpha: 1,
        size: 8
      });
      
      // Limit trail length
      if (trailRef.current.length > 20) {
        trailRef.current.shift();
      }
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw and update trail
      trailRef.current = trailRef.current.filter(point => {
        point.alpha -= 0.05;
        point.size *= 0.95;
        
        if (point.alpha > 0) {
          ctx.beginPath();
          ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2);
          ctx.fillStyle = `hsl(var(--primary) / ${point.alpha * 0.4})`;
          ctx.fill();
          
          // Draw glow around trail
          const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, point.size * 3);
          gradient.addColorStop(0, `hsl(var(--primary) / ${point.alpha * 0.2})`);
          gradient.addColorStop(1, 'transparent');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(point.x, point.y, point.size * 3, 0, Math.PI * 2);
          ctx.fill();
          
          return true;
        }
        return false;
      });
      
      particlesRef.current.forEach((particle) => {
        // Calculate distance from mouse
        const dx = mousePosition.x - particle.x;
        const dy = mousePosition.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 250;
        
        // Apply mouse influence with stronger effect
        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance;
          const angle = Math.atan2(dy, dx);
          particle.vx += Math.cos(angle) * force * 0.5;
          particle.vy += Math.sin(angle) * force * 0.5;
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
        
        // Draw connections with enhanced visibility near mouse
        particlesRef.current.forEach((other) => {
          const dx2 = particle.x - other.x;
          const dy2 = particle.y - other.y;
          const dist = Math.sqrt(dx2 * dx2 + dy2 * dy2);
          
          if (dist < 120) {
            const mouseDistToLine = Math.min(
              Math.sqrt((mousePosition.x - particle.x) ** 2 + (mousePosition.y - particle.y) ** 2),
              Math.sqrt((mousePosition.x - other.x) ** 2 + (mousePosition.y - other.y) ** 2)
            );
            const lineOpacity = mouseDistToLine < maxDistance ? 0.3 : 0.1;
            
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `hsl(var(--primary) / ${lineOpacity * (1 - dist / 120)})`;
            ctx.lineWidth = mouseDistToLine < maxDistance ? 1.5 : 0.5;
            ctx.stroke();
          }
        });
      });
      
      // Draw mouse cursor glow
      if (mousePosition.x > 0 && mousePosition.y > 0) {
        const gradient = ctx.createRadialGradient(
          mousePosition.x, mousePosition.y, 0,
          mousePosition.x, mousePosition.y, 60
        );
        gradient.addColorStop(0, 'hsl(var(--primary) / 0.4)');
        gradient.addColorStop(0.5, 'hsl(var(--primary) / 0.2)');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(mousePosition.x, mousePosition.y, 60, 0, Math.PI * 2);
        ctx.fill();
      }
      
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
