
import { Search, FileText, ShieldCheck, ArrowRightCircle } from "lucide-react";

const ApproachSection = () => {
  const approachSteps = [
    {
      id: 1,
      title: "Assessment",
      description: "We begin with a comprehensive evaluation of your current security posture to identify vulnerabilities and gaps.",
      icon: Search,
      color: "text-cesium",
      bgColor: "bg-cesium/10",
    },
    {
      id: 2,
      title: "Strategy Development",
      description: "Based on our findings, we develop a tailored security strategy aligned with your business objectives.",
      icon: FileText,
      color: "text-cesium",
      bgColor: "bg-cesium/10",
    },
    {
      id: 3,
      title: "Implementation",
      description: "We deploy advanced security solutions and controls to protect your systems, networks, and data.",
      icon: ShieldCheck,
      color: "text-cesium",
      bgColor: "bg-cesium/10",
    },
    {
      id: 4,
      title: "Continuous Monitoring",
      description: "Our team provides ongoing monitoring and optimization to adapt to evolving threats.",
      icon: ArrowRightCircle,
      color: "text-cesium",
      bgColor: "bg-cesium/10",
    },
  ];

  return (
    <div id="approach" className="bg-cyber py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Our <span className="text-cesium">Approach</span>
          </h2>
          <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto">
            A systematic methodology to ensure comprehensive protection
          </p>
        </div>

        <div className="relative">
          {/* Connection line */}
          <div className="absolute left-1/2 top-8 bottom-8 w-0.5 bg-cesium/30 transform -translate-x-1/2 hidden md:block"></div>
          
          <div className="space-y-12 relative">
            {approachSteps.map((step, index) => (
              <div key={step.id} className="relative z-10">
                <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:ml-auto' : 'md:pl-12'}`}>
                  <div className="bg-cyber-dark rounded-lg p-6 border border-cesium/20 hover:border-cesium/50 transition-all duration-300">
                    <div className="flex items-center mb-4">
                      <div className={`${step.bgColor} w-12 h-12 rounded-full flex items-center justify-center mr-4`}>
                        <step.icon className={`h-6 w-6 ${step.color}`} />
                      </div>
                      <div>
                        <span className="text-cesium text-sm font-semibold">Step {step.id}</span>
                        <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                      </div>
                    </div>
                    <p className="text-gray-400">{step.description}</p>
                  </div>
                </div>
                
                {/* Circle on the timeline */}
                <div className="absolute top-6 left-1/2 w-4 h-4 bg-cesium rounded-full transform -translate-x-1/2 hidden md:block"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApproachSection;
