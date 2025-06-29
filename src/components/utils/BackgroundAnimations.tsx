
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
        <DynamicGradient colors={['#1A1A1A', '#2A2A2A', '#0A0A0A', '#8B5CF6', '#4338CA']} />
      )}
      
      {includeParticles && (
        <FloatingParticles count={particleCount} />
      )}
      
      {includeInteractive && (
        <InteractiveBackground intensity={0.1} />
      )}
      
      {/* Additional animated elements with reduced opacity */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gray-800/10 rounded-full blur-3xl animate-blob" />
      <div className="absolute top-3/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
      <div className="absolute top-1/2 left-3/4 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl animate-blob animation-delay-4000" />
    </div>
  );
};

export default BackgroundAnimations;
