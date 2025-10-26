import { useEffect, useRef } from 'react';
import p5 from 'p5';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  connections: number[];
}

const P5HeroAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5Instance = useRef<p5 | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const sketch = (p: p5) => {
      let nodes: Node[] = [];
      const numNodes = 50;
      const maxDistance = 150;
      let bgColor: p5.Color;
      let nodeColor: p5.Color;
      let lineColor: p5.Color;

      p.setup = () => {
        const canvas = p.createCanvas(
          containerRef.current?.offsetWidth || window.innerWidth,
          containerRef.current?.offsetHeight || window.innerHeight
        );
        canvas.parent(containerRef.current!);
        
        // Get CSS color values
        const isDark = document.documentElement.classList.contains('dark');
        bgColor = isDark ? p.color(10, 10, 20, 0) : p.color(255, 255, 255, 0);
        nodeColor = isDark ? p.color(100, 200, 255, 200) : p.color(50, 100, 200, 200);
        lineColor = isDark ? p.color(100, 200, 255, 50) : p.color(50, 100, 200, 30);

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
        p.background(bgColor);

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
              const alpha = p.map(distance, 0, maxDistance, 100, 0);
              p.stroke(p.red(lineColor), p.green(lineColor), p.blue(lineColor), alpha);
              p.strokeWeight(1);
              p.line(node.x, node.y, nodes[j].x, nodes[j].y);
              node.connections.push(j);
            }
          }

          // Draw node
          p.noStroke();
          p.fill(nodeColor);
          const size = p.map(node.connections.length, 0, 10, 3, 8);
          p.circle(node.x, node.y, size);

          // Pulse effect for highly connected nodes
          if (node.connections.length > 3) {
            const pulse = p.sin(p.frameCount * 0.05 + i) * 5 + 10;
            p.fill(p.red(nodeColor), p.green(nodeColor), p.blue(nodeColor), 50);
            p.circle(node.x, node.y, size + pulse);
          }
        }

        // Add mouse interaction
        if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
          for (const node of nodes) {
            const distance = p.dist(p.mouseX, p.mouseY, node.x, node.y);
            if (distance < maxDistance * 1.5) {
              const alpha = p.map(distance, 0, maxDistance * 1.5, 150, 0);
              p.stroke(p.red(nodeColor), p.green(nodeColor), p.blue(nodeColor), alpha);
              p.strokeWeight(2);
              p.line(p.mouseX, p.mouseY, node.x, node.y);
            }
          }
          
          p.noStroke();
          p.fill(nodeColor);
          p.circle(p.mouseX, p.mouseY, 12);
        }
      };

      p.windowResized = () => {
        if (containerRef.current) {
          p.resizeCanvas(containerRef.current.offsetWidth, containerRef.current.offsetHeight);
        }
      };
    };

    p5Instance.current = new p5(sketch);

    return () => {
      p5Instance.current?.remove();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  );
};

export default P5HeroAnimation;
