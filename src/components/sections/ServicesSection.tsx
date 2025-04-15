
import { Shield, AlertTriangle, Clock, ArrowUpRight, Server, Lock, FileKey, Users } from "lucide-react";
import ScrollAnimation from "../utils/ScrollAnimation";

const ServicesSection = () => {
  const services = [
    {
      id: "vulnerability-assessment",
      title: "Vulnerability Assessment",
      description: "Comprehensive scanning and assessment to identify security vulnerabilities in your systems and applications.",
      icon: AlertTriangle,
      color: "text-orange-400",
      bgColor: "bg-orange-400/10",
      borderColor: "border-orange-400/20"
    },
    {
      id: "penetration-testing",
      title: "Penetration Testing",
      description: "Simulated attacks to identify and exploit vulnerabilities in your network, applications, and infrastructure.",
      icon: Shield,
      color: "text-cesium",
      bgColor: "bg-cesium/10",
      borderColor: "border-cesium/20"
    },
    {
      id: "security-consulting",
      title: "Security Consulting",
      description: "Expert guidance on security strategy, compliance, and best practices tailored to your business needs.",
      icon: Users,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
      borderColor: "border-purple-400/20"
    },
    {
      id: "incident-response",
      title: "Incident Response",
      description: "Rapid response and recovery services to address security breaches and minimize damage.",
      icon: Clock,
      color: "text-red-400",
      bgColor: "bg-red-400/10",
      borderColor: "border-red-400/20"
    },
    {
      id: "cloud-security",
      title: "Cloud Security",
      description: "Specialized security solutions for cloud environments, ensuring data protection across platforms.",
      icon: Server,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
      borderColor: "border-blue-400/20"
    },
    {
      id: "compliance-assistance",
      title: "Compliance Assistance",
      description: "Help navigating complex regulatory requirements including GDPR, HIPAA, PCI DSS, and more.",
      icon: FileKey,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
      borderColor: "border-green-400/20"
    },
  ];

  return (
    <div id="services" className="bg-cyber py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Our <span className="text-cesium">Services</span>
          </h2>
          <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto">
            Comprehensive cybersecurity solutions designed to protect your business at every level
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ScrollAnimation key={service.id} className="delay-100">
              <div 
                id={service.id}
                className={`bg-cyber-dark rounded-lg p-6 border ${service.borderColor} hover:border-opacity-50 transition-all duration-300 group`}
              >
              <div className={`${service.bgColor} w-14 h-14 rounded-lg flex items-center justify-center mb-5`}>
                <service.icon className={`h-7 w-7 ${service.color}`} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                {service.title}
              </h3>
              <p className="text-gray-400 mb-5">
                {service.description}
              </p>
              <a 
                href={`#${service.id}`} 
                className="inline-flex items-center text-sm font-medium text-cesium hover:text-cesium-light"
              >
                Learn more
                <ArrowUpRight className="ml-1 h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesSection;
