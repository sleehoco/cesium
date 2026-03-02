import React from "react";
import { AlertTriangle, Shield, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";

const IranCyberRiskBanner: React.FC = () => {
  return (
    <section className="relative py-16 md:py-20 overflow-hidden">
      {/* Urgent gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-950/40 via-cyber-dark to-cyber-dark" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(239,68,68,0.08)_0%,_transparent_60%)]" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Advisory badge */}
          <div className="flex items-center gap-2 mb-6">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
            </span>
            <span className="text-red-400 font-semibold text-sm tracking-widest uppercase">
              Active Threat Advisory
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
            Elevated Iranian Cyber Threat Landscape
          </h2>

          <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
            U.S. government agencies — including CISA, the FBI, and NSA — have issued heightened warnings regarding
            Iranian state-sponsored cyber operations targeting critical infrastructure, government agencies, and private-sector
            organizations. Threat actors linked to Iran's IRGC are leveraging sophisticated tactics including spear-phishing,
            exploitation of known vulnerabilities, ransomware deployment, and destructive wiper malware to disrupt operations
            and exfiltrate sensitive data.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {[
              {
                icon: AlertTriangle,
                title: "Key Threat Vectors",
                items: [
                  "Spear-phishing & social engineering",
                  "Exploitation of VPN & firewall vulnerabilities",
                  "Ransomware & wiper malware campaigns",
                  "Supply chain compromise",
                ],
              },
              {
                icon: Shield,
                title: "Targeted Sectors",
                items: [
                  "Government & defense agencies",
                  "Healthcare & critical infrastructure",
                  "Financial services & banking",
                  "Energy & telecommunications",
                ],
              },
              {
                icon: Shield,
                title: "How We Help",
                items: [
                  "Rapid threat exposure assessments",
                  "Incident response planning & tabletop exercises",
                  "CISA-aligned hardening & patch strategies",
                  "24/7 advisory & monitoring guidance",
                ],
              },
            ].map((col, i) => (
              <motion.div
                key={col.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 * i }}
                className="rounded-xl border border-red-500/20 bg-red-950/20 backdrop-blur-sm p-5"
              >
                <div className="flex items-center gap-2 mb-3">
                  <col.icon className="h-5 w-5 text-red-400" />
                  <h3 className="font-semibold text-foreground text-sm">{col.title}</h3>
                </div>
                <ul className="space-y-2">
                  {col.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <ChevronRight className="h-3.5 w-3.5 mt-0.5 text-red-400 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              asChild
              className="bg-red-600 hover:bg-red-700 text-white font-semibold"
            >
              <a href="/contact">Request a Threat Assessment</a>
            </Button>
            <Button
              variant="outline"
              asChild
              className="border-red-500/30 text-red-300 hover:bg-red-950/40"
            >
              <a href="/services">View Our Security Services</a>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground mt-6">
            Sources: CISA Advisory AA24-290A, FBI Flash MC-000245-MW, NSA Cybersecurity Advisory — Updated March 2026
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default IranCyberRiskBanner;
