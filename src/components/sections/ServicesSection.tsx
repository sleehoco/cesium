
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import PretextText from '@/components/utils/PretextText';

const services = [
  {
    id: "openclaw",
    file: "FILE #001",
    status: "NEW",
    statusColor: "text-[#D4AF37] border-[#D4AF37]",
    title: "OPENCLAW AGENTIC RED TEAM",
    description: "AI agents that act like hackers — testing your defenses around the clock so you don't have to wonder if you're vulnerable. Built on OpenClaw, the same autonomous security stack used by enterprises.",
    link: "/services#openclaw",
    cta: "LEARN MORE",
  },
  {
    id: "ai-offensive",
    file: "FILE #002",
    status: "NEW",
    statusColor: "text-[#D4AF37] border-[#D4AF37]",
    title: "AI OFFENSIVE SECURITY",
    description: "We use AI to find weaknesses before attackers do — including testing any AI tools your business uses for vulnerabilities like data leaks and manipulation. Stay ahead of AI-powered threats.",
    link: "/services#ai-offensive",
    cta: "LEARN MORE",
  },
  {
    id: "penetration-testing",
    file: "FILE #003",
    status: "ACTIVE",
    statusColor: "text-green-400 border-green-400",
    title: "PENETRATION TESTING",
    description: "We try to hack your business the same way a real attacker would — legally and safely. Then we show you exactly what we found and how to fix it before anyone else finds it.",
    link: "/services#penetration-testing",
    cta: "LEARN MORE",
  },
  {
    id: "vulnerability-assessment",
    file: "FILE #004",
    status: "ACTIVE",
    statusColor: "text-green-400 border-green-400",
    title: "VULNERABILITY ASSESSMENT",
    description: "A thorough health check for your business's digital systems. We scan everything, rank the risks from most to least serious, and give you a plain-English action plan.",
    link: "/services#vulnerability-assessment",
    cta: "LEARN MORE",
  },
  {
    id: "operational-technology",
    file: "FILE #005",
    status: "ACTIVE",
    statusColor: "text-green-400 border-green-400",
    title: "OPERATIONAL TECHNOLOGY SECURITY",
    description: "If your business uses industrial equipment, smart devices, or connected machinery, we secure those systems too — not just computers and phones.",
    link: "/services#operational-technology",
    cta: "LEARN MORE",
  },
  {
    id: "incident-response",
    file: "FILE #006",
    status: "ACTIVE",
    statusColor: "text-green-400 border-green-400",
    title: "INCIDENT RESPONSE",
    description: "If you've been hacked or suspect a breach, call us. We respond quickly, stop the damage, recover your data, and make sure it doesn't happen again.",
    link: "/services#incident-response",
    cta: "LEARN MORE",
  },
  {
    id: "cloud-security",
    file: "FILE #007",
    status: "ACTIVE",
    statusColor: "text-green-400 border-green-400",
    title: "CLOUD SECURITY",
    description: "Using Google Drive, Microsoft 365, Dropbox, or AWS? We make sure your cloud storage and apps are set up correctly so your files and customer data stay private.",
    link: "/services#cloud-security",
    cta: "LEARN MORE",
  },
  {
    id: "microsoft-365-security",
    file: "FILE #008",
    status: "ACTIVE",
    statusColor: "text-green-400 border-green-400",
    title: "MICROSOFT 365 SECURITY CHECK",
    description: "Most M365 accounts have security settings that are off or misconfigured by default. We audit your setup and fix the gaps — email, Teams, SharePoint, and more.",
    link: "/m365-security-assessment",
    cta: "TAKE ASSESSMENT",
  },
  {
    id: "security-consulting",
    file: "FILE #009",
    status: "ACTIVE",
    statusColor: "text-green-400 border-green-400",
    title: "SECURITY CONSULTING",
    description: "Not sure where to start? We sit down with you, understand your business, and build a realistic security plan that fits your budget and your risk level.",
    link: "/services#security-consulting",
    cta: "LEARN MORE",
  },
  {
    id: "shannon-plus-plus",
    file: "FILE #010",
    status: "NEW",
    statusColor: "text-[#D4AF37] border-[#D4AF37]",
    title: "SHANNON++",
    description: "Autonomous application security and phishing simulation for teams that want proof-based findings, repeatable testing workflows, and measurable human-risk exercises.",
    link: "/shannon-plus-plus",
    cta: "VIEW PRODUCT",
  },
  {
    id: "ai-policy-generator",
    file: "FILE #011",
    status: "ACTIVE",
    statusColor: "text-green-400 border-green-400",
    title: "AI POLICY GENERATOR",
    description: "Create a professional cybersecurity policy for your business in minutes. Required by many insurers and regulators — we generate one tailored to your industry.",
    link: "/policy-generator",
    cta: "GENERATE POLICY",
  },
  {
    id: "compliance-assistance",
    file: "FILE #012",
    status: "ACTIVE",
    statusColor: "text-green-400 border-green-400",
    title: "COMPLIANCE ASSISTANCE",
    description: "Need to meet HIPAA, PCI DSS, or other requirements? We guide you through exactly what's required, handle the documentation, and make sure you're covered.",
    link: "/services#compliance-assistance",
    cta: "LEARN MORE",
  },
  {
    id: "browser-fingerprinting-demo",
    file: "FILE #013",
    status: "DEMO",
    statusColor: "text-white/40 border-white/20",
    title: "BROWSER FINGERPRINTING DEMO",
    description: "See firsthand how websites can track and identify you even without cookies. A free, interactive tool to understand your digital footprint.",
    link: "/browser-fingerprinting-demo",
    cta: "TRY DEMO",
  },
];

const homepageServiceIds = [
  "incident-response",
  "shannon-plus-plus",
  "microsoft-365-security",
  "vulnerability-assessment",
];

const formatTitle = (title: string) =>
  title
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

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
      "url": `https://cesiumcyber.com/${service.link}`,
      "provider": {
        "@type": "Organization",
        "name": "CesiumCyber Security",
      },
    },
  })),
};

const ServicesSection = () => {
  const navigate = useNavigate();
  const homepageServices = services.filter((service) => homepageServiceIds.includes(service.id));

  return (
    <section id="services" className="bg-[#0A0A0A] py-24" aria-labelledby="services-heading">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(servicesStructuredData)}</script>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="mb-14">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-[#D4AF37]" />
            <span className="font-tech text-[10px] tracking-[0.18em] text-white/55 uppercase">Cybersecurity services</span>
          </div>
          <h2 id="services-heading" className="font-display text-4xl md:text-5xl font-bold text-white tracking-[-0.03em] mb-4 leading-tight">
            Services built for
            <br />
            <span className="text-[#D4AF37]">small business risk.</span>
          </h2>
          <PretextText
            as="p"
            text="From vulnerability assessments to Microsoft 365 hardening and incident response, every service is designed to reduce real business risk without burying you in technical jargon."
            lineHeight={32}
            font={{ base: '400 18px "Space Grotesk"', md: '400 18px "Space Grotesk"' }}
            className="font-ui text-[18px] text-white/78 max-w-2xl leading-8"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {homepageServices.slice(0, 2).map((service) => (
            <Link
              key={service.id}
              id={service.id}
              to={service.link}
              className="group block bg-[#111111] border border-[#D4AF37]/25 hover:border-[#D4AF37]/55 transition-all duration-300 p-8 rounded-sm"
            >
              <div className="flex items-center justify-between mb-5">
                <span className="font-tech text-[10px] tracking-[0.14em] text-white/45">{service.file}</span>
                <span className="font-tech text-[9px] tracking-[0.12em] border border-[#D4AF37] text-[#D4AF37] px-2 py-1">
                  {service.status}
                </span>
              </div>
              <h3 className="font-display text-3xl font-bold text-white mb-4 group-hover:text-[#D4AF37] transition-colors duration-200 leading-tight">
                {formatTitle(service.title)}
              </h3>
              <PretextText
                as="p"
                text={service.description}
                lineHeight={32}
                font={{ base: '400 17px "Space Grotesk"', md: '400 17px "Space Grotesk"' }}
                className="font-ui text-[17px] text-white/76 leading-8 mb-6"
              />
              <span className="font-ui text-[16px] text-[#D4AF37] group-hover:text-[#FFD700] transition-colors font-medium">
                {service.cta} →
              </span>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          {homepageServices.slice(2).map((service) => (
            <Link
              key={service.id}
              id={service.id}
              to={service.link}
              className="bg-[#111111] p-7 border border-white/10 hover:border-[#D4AF37]/35 transition-all duration-200 group flex flex-col rounded-sm"
            >
              <div className="flex items-center justify-between gap-4 mb-4">
                <span className="font-tech text-[10px] text-white/45 tracking-[0.14em]">{service.file}</span>
                <span className={`font-tech text-[9px] tracking-[0.12em] border px-2 py-1 ${service.statusColor}`}>
                  {service.status}
                </span>
              </div>
              <h3 className="font-display text-2xl font-bold text-white mb-3 leading-tight group-hover:text-[#D4AF37] transition-colors">
                {formatTitle(service.title)}
              </h3>
              <PretextText
                as="p"
                text={service.description}
                lineHeight={28}
                font={{ base: '400 16px "Space Grotesk"', md: '400 16px "Space Grotesk"' }}
                className="font-ui text-[16px] text-white/74 leading-7 flex-1 mb-5"
              />
              <span className="font-ui text-[15px] text-[#D4AF37] font-medium group-hover:text-[#FFD700] transition-colors">
                {service.cta} →
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-12 flex items-center gap-6">
          <div className="h-px flex-1 bg-[#D4AF37]/10" />
          <button
            onClick={() => navigate('/services')}
            className="font-ui text-[16px] border border-[#D4AF37]/40 text-[#D4AF37] px-8 py-3 hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-colors duration-200"
          >
            View all services
          </button>
          <div className="h-px flex-1 bg-[#D4AF37]/10" />
        </div>

      </div>
    </section>
  );
};

export default ServicesSection;
