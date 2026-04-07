
import PretextText from '@/components/utils/PretextText';

const facts = [
  { label: "Certifications", value: "CISSP, CEH, PenTest+" },
  { label: "Security partner", value: "Huntress — 24/7 threat monitoring" },
  { label: "Response time", value: "Same-day for active incidents" },
  { label: "Track record", value: "98% success rate, 350+ businesses" },
  { label: "Location", value: "Columbia, MD — serving nationwide" },
  { label: "AI capability", value: "OpenClaw autonomous security agents" },
];

const AboutSection = () => {
  return (
    <section id="about" className="bg-[#0D0D0D] py-24 border-t border-[#D4AF37]/10" aria-labelledby="about-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="inline-flex items-center gap-3 mb-14">
          <div className="h-px w-8 bg-[#D4AF37]" />
          <span className="font-tech text-[10px] tracking-[0.18em] text-white/55 uppercase">Who we are</span>
        </div>

        {/* Big number stats row */}
        <div className="grid grid-cols-3 gap-0 border border-[#D4AF37]/15 mb-16">
          {[
            { value: '98%', label: 'Client success rate' },
            { value: '350+', label: 'Businesses protected' },
            { value: '15+', label: 'Years of experience' },
          ].map((s, i) => (
            <div key={s.label} className={`px-8 py-8 text-center ${i < 2 ? 'border-r border-[#D4AF37]/15' : ''}`}>
              <div className="font-display text-5xl md:text-6xl font-bold text-[#D4AF37] mb-2">{s.value}</div>
              <div className="font-ui text-[14px] text-white/72">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left: Plain-language about */}
          <div>
            <div className="border-l-2 border-[#D4AF37] pl-6 mb-8">
              <PretextText
                text="A cybersecurity firm that actually explains things in plain English."
                lineHeight={28}
                font={{ base: '400 16px "Space Grotesk"', md: '400 16px "Space Grotesk"' }}
                className="font-ui text-[16px] text-white/76 leading-7"
              />
            </div>

            <h2 id="about-heading" className="font-display text-4xl md:text-5xl font-bold text-white tracking-[-0.03em] mb-8 leading-tight">
              Local team.
              <br />
              <span className="text-[#D4AF37]">Real accountability.</span>
            </h2>

            <div className="space-y-5">
              <PretextText
                as="p"
                text="We started CesiumCyber because too many small businesses were getting hurt by preventable cyber incidents and getting priced out of serious security help. That gap is still where we work best."
                lineHeight={32}
                font={{ base: '400 17px "Space Grotesk"', md: '400 17px "Space Grotesk"' }}
                className="font-ui text-[17px] text-white/80 leading-8"
              />
              <PretextText
                as="p"
                text="Our team is certified, experienced, and based in Columbia, Maryland. We support local companies and remote clients across the country with protection that is practical enough for lean teams."
                lineHeight={32}
                font={{ base: '400 17px "Space Grotesk"', md: '400 17px "Space Grotesk"' }}
                className="font-ui text-[17px] text-white/80 leading-8"
              />
              <PretextText
                as="p"
                text="You do not need to translate security jargon, manage five vendors, or guess which alert matters. We explain the risk, prioritize the fix, and stay reachable when decisions need to be made quickly."
                lineHeight={32}
                font={{ base: '400 17px "Space Grotesk"', md: '400 17px "Space Grotesk"' }}
                className="font-ui text-[17px] text-white/80 leading-8"
              />
            </div>

            <div className="mt-10 space-y-3">
              {[
                "No jargon. Clear explanations and direct recommendations.",
                "Flat-rate pricing with no surprise invoices",
                "Security plans sized for small and midsize businesses",
                "Reachable team in Maryland, not a generic helpdesk",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-px shrink-0">[✓]</span>
                  <span className="font-ui text-[16px] text-white/78 leading-7">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Quick facts table */}
          <div className="border border-[#D4AF37]/15">
            <div className="bg-[#D4AF37]/5 border-b border-[#D4AF37]/15 px-5 py-3 flex justify-between items-center">
              <span className="font-tech text-[10px] tracking-[0.16em] text-[#D4AF37]/70">QUICK FACTS</span>
              <span className="font-tech text-[9px] tracking-[0.14em] text-white/30">CESIUMCYBER SECURITY</span>
            </div>

            {facts.map((row, i) => (
              <div
                key={row.label}
                className={`flex items-start gap-4 px-5 py-4 border-b border-[#D4AF37]/08 transition-colors duration-150 hover:bg-[#D4AF37]/[0.03] ${
                  i % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.015]'
                }`}
              >
                <span className="font-tech text-[10px] tracking-[0.12em] text-white/35 w-32 shrink-0 pt-px">{row.label}</span>
                <PretextText
                  text={row.value}
                  lineHeight={28}
                  font={{ base: '400 16px "Space Grotesk"', md: '400 16px "Space Grotesk"' }}
                  className="font-ui text-[16px] text-white/82 leading-7"
                />
              </div>
            ))}

            <div className="px-5 py-4 flex items-center gap-3">
              <div className="h-1.5 w-1.5 bg-green-400 rounded-full animate-pulse" />
              <PretextText
                text="Available now. Response within 24 hours."
                lineHeight={24}
                font={{ base: '400 15px "Space Grotesk"', md: '400 15px "Space Grotesk"' }}
                className="font-ui text-[15px] text-green-400/80"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;
