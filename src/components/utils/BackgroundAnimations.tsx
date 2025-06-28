
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
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {includeGradients && (
        <DynamicGradient colors={['#D4AF37', '#FFD700', '#B78727', '#8B5CF6', '#F97316']} />
      )}
      
      {includeParticles && (
        <FloatingParticles count={particleCount} />
      )}
      
      {includeInteractive && (
        <InteractiveBackground intensity={0.2} />
      )}
      
      {/* Additional animated elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cesium/5 rounded-full blur-3xl animate-blob" />
      <div className="absolute top-3/4 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-blob animation-delay-2000" />
      <div className="absolute top-1/2 left-3/4 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl animate-blob animation-delay-4000" />
    </div>
  );
};

export default BackgroundAnimations;
