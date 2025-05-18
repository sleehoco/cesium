
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ImageOptimizerProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  blur?: boolean;
}

const ImageOptimizer = ({ 
  src, 
  alt, 
  width,
  height,
  className,
  priority = false,
  blur = true
}: ImageOptimizerProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);

  useEffect(() => {
    if (priority) return; // Skip if priority image
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    
    const element = document.getElementById(`image-${src.replace(/\W/g, "")}`);
    if (element) observer.observe(element);
    
    return () => {
      observer.disconnect();
    };
  }, [src, priority]);
  
  return (
    <div 
      id={`image-${src.replace(/\W/g, "")}`}
      className={cn(
        "relative overflow-hidden",
        className
      )}
      style={{ width, height }}
    >
      {(isInView || priority) && (
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          onLoad={() => setIsLoaded(true)}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-500",
            isLoaded ? "opacity-100" : "opacity-0",
          )}
          width={width}
          height={height}
        />
      )}
      
      {blur && !isLoaded && (
        <div className="absolute inset-0 bg-cyber-dark/20 animate-pulse" />
      )}
    </div>
  );
};

export default ImageOptimizer;
