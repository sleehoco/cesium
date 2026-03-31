import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import MetaTags from "../components/utils/MetaTags";
import { useNavigate } from "react-router-dom";

const pentestingPoints = [
  "Source-aware testing for modern web applications",
  "Proof-based validation of exploitable risk",
  "Reproducible findings for remediation workflows",
  "Designed for fast-moving product and engineering teams",
];

const awarenessPoints = [
  "Controlled phishing simulations for approved environments",
  "Visibility into opens, clicks, submissions, and reporting",
  "Reporting by role, department, and campaign pattern",
  "Actionable recommendations for awareness improvement",
];

const reasons = [
  {
    title: "Validate real risk",
    description: "Focus on findings that can be demonstrated and verified instead of relying on theoretical alert volume.",
  },
  {
    title: "Assess systems and people",
    description: "Combine application security testing with controlled awareness simulation in one platform story.",
  },
  {
    title: "Work at delivery speed",
    description: "Bring repeatable security workflows closer to how engineering teams actually ship software today.",
  },
  {
    title: "Produce usable output",
    description: "Reports are built for remediation, leadership visibility, and program follow-up instead of shelfware.",
  },
];

const audiences = [
  "Application security teams",
  "Security engineering teams",
  "Internal red teams",
  "Engineering organizations with CI/CD workflows",
  "Security awareness and compliance programs",
];

const productSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Shannon++",
  "applicationCategory": "SecurityApplication",
  "operatingSystem": "Web",
  "description":
    "Shannon++ is an autonomous application security and phishing simulation product for authorized environments.",
  "brand": {
    "@type": "Brand",
    "name": "CesiumCyber Security",
  },
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "availability": "https://schema.org/PreOrder",
  },
};

const ShannonPlusPlus = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#0A0A0A] min-h-screen">
      <MetaTags
        title="Shannon++ | Autonomous Application Security and Phishing Simulation"
        description="Shannon++ helps security and engineering teams test authorized web applications, run controlled phishing simulations, and generate proof-based findings across technical and human risk."
        keywords="autonomous pentesting, application security platform, phishing simulation, security awareness training, proof-based security testing, Shannon++"
        url="https://cesiumcyber.com/shannon-plus-plus"
        canonical="https://cesiumcyber.com/shannon-plus-plus"
        schema={productSchema}
      />

      <Navbar />

      <main className="pt-24">
        <section className="border-b border-[#D4AF37]/10 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-3 mb-8">
                <div className="h-px w-8 bg-[#D4AF37]" />
                <span className="font-tech text-[10px] tracking-[0.18em] text-white/55 uppercase">
                  Product spotlight
                </span>
              </div>

              <h1 className="font-display text-5xl md:text-7xl font-bold text-white tracking-[-0.04em] leading-[0.96] mb-6">
                Shannon++
              </h1>
              <p className="font-display text-3xl md:text-4xl text-[#D4AF37] font-semibold tracking-[-0.03em] leading-tight mb-6">
                Autonomous application security and phishing simulation for authorized environments.
              </p>
              <p className="font-ui text-[20px] text-white/84 leading-8 max-w-3xl mb-10">
                Shannon++ helps security and engineering teams validate exploitable application risk, measure human risk, and generate proof-based findings across web applications and security awareness workflows.
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <button
                  onClick={() =>
                    navigate("/contact", {
                      state: {
                        prefillMessage:
                          "I want to book a demo for Shannon++ and learn how it fits our security program.",
                      },
                    })
                  }
                  className="font-ui bg-[#D4AF37] text-black px-7 py-3.5 text-[16px] font-semibold hover:bg-[#FFD700] transition-colors"
                >
                  Book a demo
                </button>
                <button
                  onClick={() =>
                    navigate("/contact", {
                      state: {
                        prefillMessage:
                          "I want to talk to sales about Shannon++ for our security team.",
                      },
                    })
                  }
                  className="font-ui border border-white/20 text-white/82 px-7 py-3.5 text-[16px] hover:border-white/35 hover:text-white transition-colors"
                >
                  Talk to sales
                </button>
              </div>

              <p className="font-ui text-[15px] text-white/62">
                Authorized use only. Designed for defensive testing and controlled awareness exercises in systems you own or are explicitly authorized to assess.
              </p>
            </div>
          </div>
        </section>

        <section className="py-20 border-b border-[#D4AF37]/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span className="font-tech text-[10px] tracking-[0.18em] text-white/55 uppercase">
                Platform overview
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-white tracking-[-0.03em] mt-4 mb-4">
                One platform, two security workflows.
              </h2>
              <p className="font-ui text-[18px] text-white/78 leading-8">
                Security teams are expected to move faster than annual pentests, one-off awareness exercises, and fragmented tooling allow. Shannon++ brings application security testing and controlled phishing simulation into one platform story.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <article className="bg-[#111111] border border-[#D4AF37]/20 p-8 rounded-sm">
                <span className="font-tech text-[10px] tracking-[0.16em] text-[#D4AF37]/70 uppercase">
                  Module 1
                </span>
                <h3 className="font-display text-3xl font-bold text-white mt-4 mb-4">
                  Application Pentesting
                </h3>
                <p className="font-ui text-[17px] text-white/78 leading-8 mb-6">
                  Source-aware testing for web applications you own or are explicitly authorized to assess.
                </p>
                <ul className="space-y-3 mb-8">
                  {pentestingPoints.map((point) => (
                    <li key={point} className="flex items-start gap-3">
                      <span className="text-[#D4AF37] mt-1">•</span>
                      <span className="font-ui text-[16px] text-white/82 leading-7">{point}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() =>
                    navigate("/contact", {
                      state: {
                        prefillMessage:
                          "I want to see the Shannon++ application pentesting workflow.",
                      },
                    })
                  }
                  className="font-ui text-[16px] text-[#D4AF37] hover:text-[#FFD700] transition-colors"
                >
                  See pentesting workflow →
                </button>
              </article>

              <article className="bg-[#111111] border border-[#D4AF37]/20 p-8 rounded-sm">
                <span className="font-tech text-[10px] tracking-[0.16em] text-[#D4AF37]/70 uppercase">
                  Module 2
                </span>
                <h3 className="font-display text-3xl font-bold text-white mt-4 mb-4">
                  Security Awareness Simulation
                </h3>
                <p className="font-ui text-[17px] text-white/78 leading-8 mb-6">
                  Authorized phishing simulations for employee resilience and awareness measurement.
                </p>
                <ul className="space-y-3 mb-8">
                  {awarenessPoints.map((point) => (
                    <li key={point} className="flex items-start gap-3">
                      <span className="text-[#D4AF37] mt-1">•</span>
                      <span className="font-ui text-[16px] text-white/82 leading-7">{point}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() =>
                    navigate("/contact", {
                      state: {
                        prefillMessage:
                          "I want to see the Shannon++ security awareness simulation workflow.",
                      },
                    })
                  }
                  className="font-ui text-[16px] text-[#D4AF37] hover:text-[#FFD700] transition-colors"
                >
                  See awareness workflow →
                </button>
              </article>
            </div>
          </div>
        </section>

        <section className="py-20 border-b border-[#D4AF37]/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span className="font-tech text-[10px] tracking-[0.18em] text-white/55 uppercase">
                Why teams use Shannon++
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-white tracking-[-0.03em] mt-4 mb-4">
                Built for modern security teams.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {reasons.map((reason) => (
                <article key={reason.title} className="bg-[#111111] border border-white/10 p-7 rounded-sm">
                  <h3 className="font-display text-2xl font-bold text-white mb-3">{reason.title}</h3>
                  <p className="font-ui text-[16px] text-white/78 leading-7">{reason.description}</p>
                </article>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8">
              <div className="bg-[#111111] border border-white/10 p-8 rounded-sm">
                <h3 className="font-display text-3xl font-bold text-white mb-4">
                  Built for teams that need more than occasional testing.
                </h3>
                <p className="font-ui text-[17px] text-white/78 leading-8">
                  Shannon++ fits organizations that want repeatable application security workflows, measurable awareness exercises, and stronger proof before issues reach production or become incidents.
                </p>
              </div>

              <div className="bg-[#111111] border border-white/10 p-8 rounded-sm">
                <h3 className="font-display text-2xl font-bold text-white mb-5">
                  Who it’s for
                </h3>
                <ul className="space-y-3">
                  {audiences.map((audience) => (
                    <li key={audience} className="flex items-start gap-3">
                      <span className="text-[#D4AF37] mt-1">•</span>
                      <span className="font-ui text-[16px] text-white/82 leading-7">{audience}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 border-b border-[#D4AF37]/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <article className="bg-[#111111] border border-white/10 p-8 rounded-sm">
                <span className="font-tech text-[10px] tracking-[0.16em] text-white/45 uppercase">
                  Available option
                </span>
                <h3 className="font-display text-3xl font-bold text-white mt-4 mb-4">Shannon Lite</h3>
                <p className="font-ui text-[17px] text-white/78 leading-8">
                  Open-source autonomous pentesting framework for source-available applications.
                </p>
              </article>

              <article className="bg-[#111111] border border-[#D4AF37]/20 p-8 rounded-sm">
                <span className="font-tech text-[10px] tracking-[0.16em] text-[#D4AF37]/70 uppercase">
                  Commercial platform
                </span>
                <h3 className="font-display text-3xl font-bold text-white mt-4 mb-4">Shannon++</h3>
                <p className="font-ui text-[17px] text-white/78 leading-8">
                  Commercial platform for autonomous application security, phishing simulation, and enterprise-ready workflows.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="font-tech text-[10px] tracking-[0.18em] text-white/55 uppercase">
              Authorized use only
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white tracking-[-0.03em] mt-4 mb-5">
              See how Shannon++ fits your security program.
            </h2>
            <p className="font-ui text-[18px] text-white/78 leading-8 max-w-3xl mx-auto mb-10">
              Shannon++ is designed for defensive security testing, controlled awareness exercises, and assessment workflows in systems you own or are explicitly authorized to test.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() =>
                  navigate("/contact", {
                    state: {
                      prefillMessage:
                        "I want to see how Shannon++ fits our security program.",
                    },
                  })
                }
                className="font-ui bg-[#D4AF37] text-black px-7 py-3.5 text-[16px] font-semibold hover:bg-[#FFD700] transition-colors"
              >
                Book a demo
              </button>
              <button
                onClick={() =>
                  navigate("/contact", {
                    state: {
                      prefillMessage:
                        "I want to talk to sales about Shannon++ for our organization.",
                      },
                    })
                  }
                className="font-ui border border-white/20 text-white/82 px-7 py-3.5 text-[16px] hover:border-white/35 hover:text-white transition-colors"
              >
                Talk to sales
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ShannonPlusPlus;
