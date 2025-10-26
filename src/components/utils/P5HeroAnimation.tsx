import { useEffect, useRef, useState } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  connections: number[];
}

const P5HeroAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5Instance = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("P5HeroAnimation: Component mounted");
    
    if (!containerRef.current) {
      console.log("P5HeroAnimation: Container ref not found");
      return;
    }

    // Dynamically import p5
    import('p5').then((p5Module) => {
      console.log("P5HeroAnimation: p5 loaded successfully");
      const p5 = p5Module.default;
      
      const sketch = (p: any) => {
      let nodes: Node[] = [];
      const numNodes = 50;
      const maxDistance = 150;

      p.setup = () => {
        console.log("P5HeroAnimation: Setup started");
        const parent = containerRef.current;
        if (!parent) {
          console.log("P5HeroAnimation: No parent element in setup");
          return;
        }
        
        const w = parent.clientWidth || window.innerWidth;
        const h = parent.clientHeight || window.innerHeight;
        
        const canvas = p.createCanvas(w, h);
        canvas.parent(parent);
        canvas.style('display', 'block');
        canvas.style('position', 'absolute');
        canvas.style('top', '0');
        canvas.style('left', '0');
        
        console.log(`P5HeroAnimation: Canvas created ${w}x${h}`);

        // Initialize nodes
        for (let i = 0; i < numNodes; i++) {
          nodes.push({
            x: p.random(p.width),
            y: p.random(p.height),
            vx: p.random(-0.5, 0.5),
            vy: p.random(-0.5, 0.5),
            connections: []
          });
        }
      };

      p.draw = () => {
        p.clear();

        // Update and draw nodes
        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i];
          
          // Update position
          node.x += node.vx;
          node.y += node.vy;

          // Wrap around edges
          if (node.x < 0) node.x = p.width;
          if (node.x > p.width) node.x = 0;
          if (node.y < 0) node.y = p.height;
          if (node.y > p.height) node.y = 0;

          // Draw connections
          node.connections = [];
          for (let j = i + 1; j < nodes.length; j++) {
            const distance = p.dist(node.x, node.y, nodes[j].x, nodes[j].y);
            
            if (distance < maxDistance) {
              const alpha = p.map(distance, 0, maxDistance, 80, 0);
              p.stroke(100, 200, 255, alpha);
              p.strokeWeight(1);
              p.line(node.x, node.y, nodes[j].x, nodes[j].y);
              node.connections.push(j);
            }
          }

          // Draw node
          p.noStroke();
          p.fill(100, 200, 255, 200);
          const size = p.map(node.connections.length, 0, 10, 3, 8);
          p.circle(node.x, node.y, size);

          // Pulse effect for highly connected nodes
          if (node.connections.length > 3) {
            const pulse = p.sin(p.frameCount * 0.05 + i) * 5 + 10;
            p.fill(100, 200, 255, 50);
            p.circle(node.x, node.y, size + pulse);
          }
        }

        // Add mouse interaction
        if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
          for (const node of nodes) {
            const distance = p.dist(p.mouseX, p.mouseY, node.x, node.y);
            if (distance < maxDistance * 1.5) {
              const alpha = p.map(distance, 0, maxDistance * 1.5, 150, 0);
              p.stroke(100, 200, 255, alpha);
              p.strokeWeight(2);
              p.line(p.mouseX, p.mouseY, node.x, node.y);
            }
          }
          
          p.noStroke();
          p.fill(100, 200, 255, 255);
          p.circle(p.mouseX, p.mouseY, 12);
        }
      };

      p.windowResized = () => {
        const parent = containerRef.current;
        if (parent) {
          p.resizeCanvas(parent.clientWidth, parent.clientHeight);
        }
      };
    };

      try {
        p5Instance.current = new p5(sketch);
        setIsLoading(false);
        console.log("P5HeroAnimation: p5 instance created successfully");
      } catch (error) {
        console.error("P5HeroAnimation: Error creating p5 instance", error);
        setIsLoading(false);
      }
    }).catch((error) => {
      console.error("P5HeroAnimation: Error loading p5", error);
      setIsLoading(false);
    });

    return () => {
      console.log("P5HeroAnimation: Cleanup");
      p5Instance.current?.remove();
      p5Instance.current = null;
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
};

export default P5HeroAnimation;
