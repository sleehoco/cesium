import React from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import MetaTags from "../components/utils/MetaTags";
import ScrollAnimation from "../components/utils/ScrollAnimation";
import { Shield, AlertTriangle, Clock, Server, Lock, FileKey, Users, Factory, ArrowRight, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Services = () => {
  const navigate = useNavigate();

  const handleContactNavigation = () => {
    navigate('/', { replace: true });
    // Small delay to ensure navigation completes before scrolling
    setTimeout(() => {
      const element = document.getElementById('contact');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const services = [
    {
      id: "vulnerability-assessment",
      title: "Vulnerability Assessment",
      icon: AlertTriangle,
      color: "text-orange-400",
      bgColor: "bg-orange-400/10",
      borderColor: "border-orange-400/20",
      what: "A comprehensive evaluation of your IT infrastructure to identify security weaknesses and potential entry points for cyber threats.",
      how: [
        "Automated scanning of networks, systems, and applications",
        "Manual testing to identify complex vulnerabilities",
        "Risk assessment and prioritization of findings",
        "Detailed reporting with remediation recommendations",
        "Follow-up testing to verify fixes"
      ],
      benefits: [
        "Proactive identification of security gaps",
        "Compliance with industry standards",
        "Reduced risk of data breaches",
        "Improved security posture"
      ]
    },
    {
      id: "penetration-testing",
      title: "Penetration Testing",
      icon: Shield,
      color: "text-cesium",
      bgColor: "bg-cesium/10",
      borderColor: "border-cesium/20",
      what: "Authorized simulated cyber attacks against your systems to evaluate the effectiveness of your security defenses.",
      how: [
        "Reconnaissance and information gathering",
        "Vulnerability identification and exploitation",
        "Privilege escalation and lateral movement",
        "Data exfiltration simulation",
        "Comprehensive reporting and debriefing"
      ],
      benefits: [
        "Real-world attack simulation",
        "Validation of security controls",
        "Identification of critical vulnerabilities",
        "Enhanced incident response preparedness"
      ]
    },
    {
      id: "security-consulting",
      title: "Security Consulting",
      icon: Users,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
      borderColor: "border-purple-400/20",
      what: "Strategic cybersecurity guidance tailored to your business needs, helping you build and maintain a robust security framework.",
      how: [
        "Security posture assessment and gap analysis",
        "Development of security policies and procedures",
        "Security architecture design and review",
        "Risk management and mitigation strategies",
        "Staff training and awareness programs"
      ],
      benefits: [
        "Expert guidance on security best practices",
        "Customized security strategies",
        "Improved security governance",
        "Enhanced team capabilities"
      ]
    },
    {
      id: "operational-technology",
      title: "Operational Technology Security",
      icon: Factory,
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/10",
      borderColor: "border-yellow-400/20",
      what: "Specialized security solutions for industrial control systems, SCADA networks, and IoT environments in critical infrastructure.",
      how: [
        "OT network assessment and segmentation",
        "Industrial control system security testing",
        "SCADA and HMI security evaluation",
        "IoT device security assessment",
        "OT-specific incident response planning"
      ],
      benefits: [
        "Protection of critical infrastructure",
        "Operational continuity assurance",
        "Compliance with industry regulations",
        "Reduced downtime risks"
      ]
    },
    {
      id: "incident-response",
      title: "Incident Response",
      icon: Clock,
      color: "text-red-400",
      bgColor: "bg-red-400/10",
      borderColor: "border-red-400/20",
      what: "Rapid response services to contain, investigate, and recover from security incidents and data breaches.",
      how: [
        "24/7 incident response hotline",
        "Immediate threat containment and isolation",
        "Digital forensics and evidence collection",
        "Root cause analysis and timeline reconstruction",
        "Recovery planning and business continuity support"
      ],
      benefits: [
        "Minimized incident impact",
        "Faster recovery times",
        "Preserved evidence for legal proceedings",
        "Lessons learned for future prevention"
      ]
    },
    {
      id: "cloud-security",
      title: "Cloud Security",
      icon: Server,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
      borderColor: "border-blue-400/20",
      what: "Comprehensive security solutions for cloud environments, ensuring data protection across AWS, Azure, GCP, and hybrid platforms.",
      how: [
        "Cloud configuration assessment and hardening",
        "Identity and access management review",
        "Data encryption and key management",
        "Cloud workload protection implementation",
        "Continuous monitoring and compliance validation"
      ],
      benefits: [
        "Secure cloud migration and operations",
        "Improved data protection",
        "Enhanced visibility and control",
        "Regulatory compliance assurance"
      ]
    },
    {
      id: "compliance-assistance",
      title: "Compliance Assistance",
      icon: FileKey,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
      borderColor: "border-green-400/20",
      what: "Expert guidance to help your organization meet complex regulatory requirements including GDPR, HIPAA, PCI DSS, and SOX.",
      how: [
        "Compliance gap analysis and assessment",
        "Policy and procedure development",
        "Control implementation and testing",
        "Audit preparation and support",
        "Ongoing compliance monitoring"
      ],
      benefits: [
        "Reduced regulatory risk",
        "Streamlined audit processes",
        "Enhanced customer trust",
        "Avoided penalties and fines"
      ]
    }
  ];

  const servicesStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": services.map((service, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Service",
        "name": service.title,
        "description": service.what,
        "url": `https://cesiumcyber.com/services#${service.id}`,
        "provider": {
          "@type": "Organization",
          "name": "CesiumCyber Security"
        }
      }
    }))
  };

  return (
    <div className="bg-cyber min-h-screen">
      <MetaTags 
        title="Cybersecurity Services - CesiumCyber Security Solutions"
        description="Comprehensive cybersecurity services including penetration testing, vulnerability assessment, incident response, cloud security, and compliance assistance."
        keywords="cybersecurity services, penetration testing, vulnerability assessment, security consulting, incident response, cloud security, compliance, GDPR, HIPAA, PCI DSS"
        url="https://cesiumcyber.com/services"
        canonical="https://cesiumcyber.com/services"
      />
      
      <script type="application/ld+json">
        {JSON.stringify(servicesStructuredData)}
      </script>

      <Navbar />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-cyber py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Our <span className="text-cesium">Services</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Comprehensive cybersecurity solutions designed to protect your business at every level. 
                From proactive assessments to incident response, we've got you covered.
              </p>
            </div>
          </div>
        </section>

        {/* Services Detail Section */}
        <section className="bg-cyber-dark py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-16">
              {services.map((service, index) => (
                <ScrollAnimation key={service.id} className="delay-100">
                  <div id={service.id} className="scroll-mt-24">
                    <div className={`bg-cyber rounded-lg border ${service.borderColor} p-8 lg:p-12`}>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* Left Column - What */}
                        <div>
                          <div className="flex items-center mb-6">
                            <div className={`${service.bgColor} w-16 h-16 rounded-lg flex items-center justify-center mr-4`}>
                              <service.icon className={`h-8 w-8 ${service.color}`} />
                            </div>
                            <h2 className="text-3xl font-bold text-white">{service.title}</h2>
                          </div>
                          
                          <div className="mb-8">
                            <h3 className="text-xl font-semibold text-cesium mb-4 flex items-center">
                              What is {service.title}?
                            </h3>
                            <p className="text-gray-300 text-lg leading-relaxed">
                              {service.what}
                            </p>
                          </div>

                          <div>
                            <h3 className="text-xl font-semibold text-cesium mb-4">
                              Key Benefits
                            </h3>
                            <ul className="space-y-3">
                              {service.benefits.map((benefit, idx) => (
                                <li key={idx} className="flex items-start">
                                  <CheckCircle className="h-5 w-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                                  <span className="text-gray-300">{benefit}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Right Column - How */}
                        <div>
                          <h3 className="text-xl font-semibold text-cesium mb-6 flex items-center">
                            How We Deliver This Service
                            <ArrowRight className="h-5 w-5 ml-2" />
                          </h3>
                          
                          <div className="space-y-4">
                            {service.how.map((step, idx) => (
                              <div key={idx} className="flex items-start">
                                <div className={`w-8 h-8 rounded-full ${service.bgColor} flex items-center justify-center mr-4 mt-1 flex-shrink-0`}>
                                  <span className={`text-sm font-semibold ${service.color}`}>
                                    {idx + 1}
                                  </span>
                                </div>
                                <div className="flex-1">
                                  <p className="text-gray-300 leading-relaxed">{step}</p>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="mt-8 pt-6 border-t border-cesium/20">
                            <button 
                              onClick={handleContactNavigation}
                              className={`inline-flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${service.bgColor} ${service.color} hover:bg-opacity-20`}
                            >
                              Get Started with {service.title}
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollAnimation>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-cyber py-16">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Secure Your Business?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Contact us today to discuss your cybersecurity needs and get a customized solution.
            </p>
            <button 
              onClick={handleContactNavigation}
              className="bg-cesium hover:bg-cesium-light text-cyber-dark font-semibold px-8 py-4 rounded-lg transition-colors"
            >
              Contact Us Today
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Services;
