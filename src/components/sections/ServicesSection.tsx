
import { Shield, AlertTriangle, Clock, ArrowRight, Server, Lock, FileKey, Users, Factory, Fingerprint } from "lucide-react";
import ScrollAnimation from "../utils/ScrollAnimation";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";

const ServicesSection = () => {
  const navigate = useNavigate();

  const handleDemoNavigation = () => {
    navigate('/browser-fingerprinting-demo');
  };

  const services = [
    {
      id: "vulnerability-assessment",
      title: "Vulnerability Assessment",
      description: "Comprehensive scanning and assessment to identify security vulnerabilities in your systems and applications.",
      icon: AlertTriangle,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200"
    },
    {
      id: "penetration-testing",
      title: "Penetration Testing",
      description: "Simulated attacks to identify and exploit vulnerabilities in your network, applications, and infrastructure.",
      icon: Shield,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      id: "browser-fingerprinting-demo",
      title: "Browser Fingerprinting Demo",
      description: "Interactive demonstration showing how browsers can be tracked and fingerprinted for privacy awareness.",
      icon: Fingerprint,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    },
    {
      id: "security-consulting",
      title: "Security Consulting",
      description: "Expert guidance on security strategy, compliance, and best practices tailored to your business needs.",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      id: "operational-technology",
      title: "Operational Technology Security",
      description: "Specialized security solutions for industrial control systems, SCADA, and IoT environments in critical infrastructure.",
      icon: Factory,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200"
    },
    {
      id: "incident-response",
      title: "Incident Response",
      description: "Rapid response and recovery services to address security breaches and minimize damage.",
      icon: Clock,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200"
    },
    {
      id: "cloud-security",
      title: "Cloud Security",
      description: "Specialized security solutions for cloud environments, ensuring data protection across platforms.",
      icon: Server,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200"
    },
    {
      id: "compliance-assistance",
      title: "Compliance Assistance",
      description: "Help navigating complex regulatory requirements including GDPR, HIPAA, PCI DSS, and more.",
      icon: FileKey,
      color: "text-teal-600",
      bgColor: "bg-teal-50",
      borderColor: "border-teal-200"
    },
  ];

  // Create structured data for services
  const servicesStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": services.map((service, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Service",
        "name": service.title,
        "description": service.description,
        "url": `https://cesiumcyber.com/#${service.id}`,
        "provider": {
          "@type": "Organization",
          "name": "CesiumCyber Security"
        }
      }
    }))
  };

  return (
    <div id="services" className="bg-gray-50 py-24">
      {/* Add structured data for search engines */}
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(servicesStructuredData)}
        </script>
      </Helmet>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our <span className="text-blue-600">Services</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive cybersecurity solutions designed to protect your business at every level
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ScrollAnimation key={service.id} className="delay-100">
              <div 
                id={service.id}
                className={`bg-white rounded-xl p-8 border-2 ${service.borderColor} hover:shadow-lg transition-all duration-300 group h-full`}
              >
                <div className={`${service.bgColor} w-16 h-16 rounded-xl flex items-center justify-center mb-6`}>
                  <service.icon className={`h-8 w-8 ${service.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>
                {service.id === "browser-fingerprinting-demo" ? (
                  <button 
                    onClick={handleDemoNavigation}
                    className={`inline-flex items-center text-sm font-semibold ${service.color} hover:opacity-80 transition-opacity`}
                  >
                    Try Interactive Demo
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                ) : (
                  <Link 
                    to={`/services#${service.id}`}
                    className={`inline-flex items-center text-sm font-semibold ${service.color} hover:opacity-80 transition-opacity`}
                  >
                    Learn more
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
              </div>
            </ScrollAnimation>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link 
            to="/services"
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors shadow-lg"
          >
            View All Services in Detail
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServicesSection;
