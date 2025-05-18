
import { useEffect, useState, ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface LazyLoadProps {
  children: ReactNode;
  height?: string;
  width?: string;
  className?: string;
  placeholder?: ReactNode;
}

const LazyLoad = ({
  children,
  height = "200px",
  width = "100%",
  className = "",
  placeholder
}: LazyLoadProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [element, setElement] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!element) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: "200px" // Load when within 200px of viewport
      }
    );

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [element]);

  return (
    <div 
      ref={setElement} 
      className={`transition-all duration-300 ${className}`}
      style={{ minHeight: isVisible ? "auto" : height, width }}
    >
      {isVisible ? (
        children
      ) : (
        placeholder || <Skeleton className="w-full h-full" />
      )}
    </div>
  );
};

export default LazyLoad;
