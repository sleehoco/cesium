import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Award, Users, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CEOPopupTrigger from '@/components/ceo/CEOPopupTrigger';

const Founders = () => {
  const founders = [
    {
      name: "Julia Morrison",
      role: "CEO & Co-Founder", 
      image: "/lovable-uploads/66d70e58-99fb-4681-aeca-18433b0b3de0.png",
      bio: "Expert in cybersecurity - vulnerability management, Operational Technology, Threat Intelligence. Her unique legal background (Law degree, BS in Law) combined with MS in Cyber Security provides deep understanding of compliance, risk frameworks, and regulatory requirements. Led security transformations with 15+ years of experience.",
      expertise: ["Threat Intelligence", "Enterprise Security", "Risk Management", "AI"],
    },
    {
      name: "Sung Lee",
      role: "CTO & Co-Founder",
      image: "/placeholder.svg",
      bio: "Expert in cybersecurity - incident response, cloud security, and AI-driven threat detection. Specialized in developing advanced security architectures for enterprise environments with 12+ years of experience.",
      expertise: ["Incident Response", "Cloud Security", "AI Security", "Enterprise Architecture"]
    }
  ];

  const missionStatement = "To empower organizations with proactive cybersecurity solutions that anticipate and neutralize threats before they impact business operations.";
  const coreValues = [
    {
      title: "Innovation",
      description: "We continuously explore and implement the latest advancements in cybersecurity to stay ahead of emerging threats.",
      icon: Shield
    },
    {
      title: "Collaboration", 
      description: "We work closely with our clients to understand their unique needs and develop tailored security strategies.",
      icon: Users
    },
    {
      title: "Proactive Defense",
      description: "We focus on preventing security breaches before they occur, minimizing potential damage and downtime.",
      icon: Target
    },
    {
      title: "Excellence",
      description: "We are committed to delivering the highest quality cybersecurity services and solutions.",
      icon: Award
    }
  ];

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      
      <div className="pt-20 pb-16">
        {/* Header Section */}
        <section className="py-16 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Meet Our <span className="text-primary">Founders</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Industry veterans with decades of combined experience in cybersecurity,
                dedicated to protecting your digital assets.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                >
                  Learn More
                </Button>
                
                <CEOPopupTrigger>
                  CEO & Her McLaren
                </CEOPopupTrigger>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Founders Grid */}
        <section className="py-12 px-4">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8"
            >
              {founders.map((founder, index) => (
                <Card key={index} className="bg-card text-card-foreground shadow-md hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-24 h-24 rounded-full overflow-hidden mr-4">
                        <img src={founder.image} alt={founder.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold">{founder.name}</h3>
                        <p className="text-muted-foreground">{founder.role}</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-4">{founder.bio}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {founder.expertise.map((skill, i) => (
                        <span key={i} className="inline-block bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-medium">{skill}</span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Mission Statement Section */}
        <section className="py-16 px-4 bg-secondary">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h2 className="text-3xl font-bold text-secondary-foreground mb-6">Our Mission</h2>
              <p className="text-xl text-secondary-foreground leading-relaxed">{missionStatement}</p>
            </motion.div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-center text-foreground mb-8">Our Core Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {coreValues.map((value, index) => (
                  <Card key={index} className="bg-card text-card-foreground shadow-md hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6 text-center">
                      <value.icon className="h-8 w-8 text-primary mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                      <p className="text-muted-foreground">{value.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </div>
      
      <Footer />
    </div>
  );
};

export default Founders;
