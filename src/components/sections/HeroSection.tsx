import React from 'react';
import { useNavigate } from 'react-router-dom';
import PretextText from '@/components/utils/PretextText';

const trustItems = [
  'Plain-English security guidance',
  'Microsoft 365 hardening and monitoring',
  'Same-day help for urgent incidents',
  'Local team in Columbia, Maryland',
];

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0A0A0A] pt-24" aria-labelledby="home-hero-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">

          {/* ── Left: Main content (3/5) ── */}
          <div className="lg:col-span-3">
            <div className="relative border border-[#D4AF37]/22 bg-[linear-gradient(180deg,rgba(15,18,26,0.82),rgba(10,10,10,0.34))] px-6 py-7 md:px-8 md:py-8 mb-10">
              <div className="pointer-events-none absolute left-3 top-3 h-5 w-5 border-l border-t border-[#D4AF37]/55" />
              <div className="pointer-events-none absolute right-3 top-3 h-5 w-5 border-r border-t border-[#D4AF37]/55" />
              <div className="pointer-events-none absolute bottom-3 left-3 h-5 w-5 border-b border-l border-[#D4AF37]/55" />
              <div className="pointer-events-none absolute bottom-3 right-3 h-5 w-5 border-b border-r border-[#D4AF37]/55" />

              {/* Eyebrow label */}
              <div className="inline-flex items-center gap-3 mb-8">
                <div className="h-px w-8 bg-[#D4AF37]" />
                <span className="font-tech text-[11px] tracking-[0.16em] text-white/65 uppercase">
                  Small business cybersecurity services
                </span>
              </div>

              {/* Headline — maximum contrast */}
              <h1 id="home-hero-heading" className="font-display font-bold text-white leading-[0.98] tracking-[-0.04em] mb-8">
                <span className="block text-[3.2rem] md:text-7xl lg:text-[5.2rem]">Cybersecurity for</span>
                <span className="block text-[3.2rem] md:text-7xl lg:text-[5.2rem] text-[#D4AF37]">small businesses</span>
                <span className="block text-[3.2rem] md:text-7xl lg:text-[5.2rem]">that need real help.</span>
              </h1>

              {/* Gold rule */}
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px bg-[#D4AF37] w-16" />
                <span className="font-ui text-[15px] text-white/82 tracking-[0.01em]">
                  Columbia, Maryland based. Serving local and nationwide teams.
                </span>
              </div>

              {/* Body copy */}
              <PretextText
                as="p"
                text="Managed cybersecurity, security assessments, and incident response for small businesses."
                lineHeight={32}
                font={{ base: '400 19px "Space Grotesk"', md: '400 19px "Space Grotesk"' }}
                className="font-ui text-[19px] text-white/92 max-w-2xl mb-5 leading-8"
              />
              <PretextText
                as="p"
                text="Protect email, devices, Microsoft 365, and customer data without hiring a full internal security team. Get straightforward guidance, practical fixes, and fast support when something goes wrong."
                lineHeight={32}
                font={{ base: '400 18px "Space Grotesk"', md: '400 18px "Space Grotesk"' }}
                className="font-ui text-[18px] text-white/78 max-w-2xl leading-8"
              />
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mb-14">
              <button
                onClick={() => navigate('/contact')}
                className="font-tech text-[11px] tracking-[0.22em] bg-[#D4AF37] text-black px-8 py-3 hover:bg-[#FFD700] transition-colors duration-200 font-bold"
              >
                BOOK FREE CONSULTATION →
              </button>
              <button
                onClick={() => navigate('/services')}
                className="font-tech text-[11px] tracking-[0.22em] border border-white/20 text-white/70 px-8 py-3 hover:border-white/35 hover:text-white transition-colors duration-200"
              >
                [VIEW SERVICES]
              </button>
            </div>

            <p className="font-ui text-[15px] text-white/64 mb-12">
              Get a clear action plan in one consultation.
            </p>

            <div className="flex flex-wrap gap-2 mb-14">
              {[
                'Managed cybersecurity',
                'Security assessments',
                'Microsoft 365 security',
                'Incident response',
              ].map((item) => (
                <span
                  key={item}
                  className="font-ui border border-[#D4AF37]/20 px-4 py-2 text-[14px] text-white/80"
                >
                  {item}
                </span>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/08">
              {[
                { value: '24/7', label: 'Threat monitoring\ncoverage' },
                { value: '15+', label: 'Years of\nexperience' },
                { value: 'Same day', label: 'Incident support\nwhen urgent' },
              ].map((s) => (
                <div key={s.label}>
                  <div className="font-display text-3xl font-bold text-[#D4AF37] mb-1">{s.value}</div>
                  <div className="font-ui text-[12px] text-white/62 leading-snug whitespace-pre-line">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Trust panel (2/5) ── */}
          <div className="lg:col-span-2">
            <div className="border border-[#D4AF37]/25 bg-[#0F0F0F]">
              <div className="bg-[#D4AF37]/08 border-b border-[#D4AF37]/20 px-5 py-4">
                <span className="font-tech text-[10px] tracking-[0.18em] text-[#D4AF37]/85 uppercase">Why businesses call us</span>
              </div>

              <div className="px-5 py-6">
                <PretextText
                  as="h2"
                  text="Security support that is clear, responsive, and built for small teams."
                  lineHeight={40}
                  font={{
                    base: '700 30px "Space Grotesk"',
                    md: '700 36px "Space Grotesk"',
                  }}
                  className="font-display text-3xl md:text-4xl text-white font-bold leading-tight mb-4"
                />
                <PretextText
                  as="p"
                  text="No generic helpdesk. No 200-page reports you will never use. Just practical security work and a team you can reach when something matters."
                  lineHeight={28}
                  font={{ base: '400 16px "Space Grotesk"', md: '400 16px "Space Grotesk"' }}
                  className="font-ui text-[16px] text-white/74 leading-7 mb-6"
                />

                <div className="space-y-4 mb-7">
                  {trustItems.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <span className="mt-1 text-[#D4AF37]">•</span>
                      <span className="font-ui text-[16px] text-white/84 leading-7">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6 mb-7">
                  <div>
                    <div className="font-display text-3xl text-[#D4AF37] font-bold">24/7</div>
                    <div className="font-ui text-[14px] text-white/68 mt-1">monitoring coverage</div>
                  </div>
                  <div>
                    <div className="font-display text-3xl text-[#D4AF37] font-bold">Same day</div>
                    <div className="font-ui text-[14px] text-white/68 mt-1">incident help when urgent</div>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/contact')}
                  className="w-full font-ui text-[16px] bg-[#D4AF37] text-black py-3.5 font-semibold hover:bg-[#FFD700] transition-colors"
                >
                  Talk to a security consultant
                </button>
              </div>
            </div>

            <PretextText
              as="p"
              text="Speak with a real person about your risk, your tools, and the fastest way to improve protection."
              lineHeight={24}
              font={{ base: '400 14px "Space Grotesk"', md: '400 14px "Space Grotesk"' }}
              className="font-ui text-[14px] text-white/60 mt-4 leading-6"
            />
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
