
import FloatingParticles from './FloatingParticles';
import DynamicGradient from './DynamicGradient';
import InteractiveBackground from './InteractiveBackground';

interface BackgroundAnimationsProps {
  includeParticles?: boolean;
  includeGradients?: boolean;
  includeInteractive?: boolean;
  particleCount?: number;
  className?: string;
}

const BackgroundAnimations = ({
  includeParticles = true,
  includeGradients = true,
  includeInteractive = true,
  particleCount = 50,
  className = ""
}: BackgroundAnimationsProps) => {
  return (
    <div className={`absolute inset-0 ${className}`} style={{ pointerEvents: 'none' }}>
      {includeGradients && (
        <DynamicGradient colors={['#F8F9FA', '#E8F0FE', '#D2E3FC', '#FFFFFF']} speed={0.001} />
      )}
      
      {includeParticles && (
        <FloatingParticles count={particleCount} />
      )}
      
      {includeInteractive && (
        <InteractiveBackground intensity={0.15} />
      )}
    </div>
  );
};

export default BackgroundAnimations;
