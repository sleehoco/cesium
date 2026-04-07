
import PretextText from '@/components/utils/PretextText';

const phases = [
  {
    num: "01",
    title: "We start by listening.",
    plain: "Free consultation",
    description: "We schedule a call, learn about your business, and ask straightforward questions. No forms, no jargon. At the end, you'll know exactly where you stand and what needs attention.",
    status: "FREE",
    statusColor: "text-[#D4AF37] border-[#D4AF37]/40",
  },
  {
    num: "02",
    title: "We show you what we found.",
    plain: "Plain-English report",
    description: "We run a security scan and write up what we find in plain language — not a 200-page technical document. You'll understand what's at risk and why it matters for your specific business.",
    status: "INCLUDED",
    statusColor: "text-white/40 border-white/20",
  },
  {
    num: "03",
    title: "We fix it, together.",
    plain: "Hands-on protection",
    description: "We set up the right tools and controls for your business — antivirus, email security, backups, monitoring. You approve everything. We handle all the technical setup.",
    status: "INCLUDED",
    statusColor: "text-white/40 border-white/20",
  },
  {
    num: "04",
    title: "We keep watching.",
    plain: "Ongoing monitoring",
    description: "Once you're protected, we don't disappear. Our systems watch your network 24/7. If something looks wrong, we alert you immediately — and we handle it so you don't have to.",
    status: "ONGOING",
    statusColor: "text-green-400 border-green-400/40",
  },
];

const ApproachSection = () => {
  return (
    <section id="approach" className="bg-[#0A0A0A] py-24 border-t border-[#D4AF37]/10" aria-labelledby="approach-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="inline-flex items-center gap-3 mb-14">
          <div className="h-px w-8 bg-[#D4AF37]" />
          <span className="font-tech text-[10px] tracking-[0.18em] text-white/55 uppercase">How it works</span>
        </div>

        <div className="mb-10">
          <h2 id="approach-heading" className="font-display text-4xl md:text-5xl font-bold text-white tracking-[-0.03em] mb-3 leading-tight">
            A simple process for
            <br />
            <span className="text-[#D4AF37]">busy business owners.</span>
          </h2>
          <PretextText
            as="p"
            text="You do not need an internal security department to get this done. We guide the process, explain each step clearly, and keep the work focused on business risk."
            lineHeight={32}
            font={{ base: '400 18px "Space Grotesk"', md: '400 18px "Space Grotesk"' }}
            className="font-ui text-[18px] text-white/78 max-w-2xl leading-8 mt-4"
          />
        </div>

        {/* Steps */}
        <div className="border border-[#D4AF37]/15">
          <div className="hidden md:grid grid-cols-12 bg-[#D4AF37]/5 border-b border-[#D4AF37]/15 px-6 py-3">
            <span className="col-span-1 font-tech text-[9px] tracking-[0.14em] text-white/35">STEP</span>
            <span className="col-span-3 font-tech text-[9px] tracking-[0.14em] text-white/35">WHAT HAPPENS</span>
            <span className="col-span-6 font-tech text-[9px] tracking-[0.14em] text-white/35">WHAT IT MEANS FOR YOU</span>
            <span className="col-span-2 font-tech text-[9px] tracking-[0.14em] text-white/35 text-right">COST</span>
          </div>

          {phases.map((phase, i) => (
            <div
              key={phase.num}
              className={`grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-0 px-6 py-6 border-b border-[#D4AF37]/08 hover:bg-[#D4AF37]/[0.03] transition-colors duration-200 ${
                i % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.01]'
              }`}
            >
              <div className="md:col-span-1">
                <span className="font-display text-[#D4AF37] text-2xl font-bold">{phase.num}</span>
              </div>
              <div className="md:col-span-3">
                <PretextText
                  text={phase.title}
                  lineHeight={24}
                  font={{ base: '600 18px "Space Grotesk"', md: '600 18px "Space Grotesk"' }}
                  className="font-ui text-[18px] font-semibold text-white/92 leading-snug mb-1"
                />
                <PretextText
                  text={phase.plain}
                  lineHeight={20}
                  font={{ base: '400 15px "Space Grotesk"', md: '400 15px "Space Grotesk"' }}
                  className="font-ui text-[15px] text-white/62"
                />
              </div>
              <div className="md:col-span-6">
                <PretextText
                  as="p"
                  text={phase.description}
                  lineHeight={32}
                  font={{ base: '400 16px "Space Grotesk"', md: '400 16px "Space Grotesk"' }}
                  className="font-ui text-[16px] text-white/78 leading-8"
                />
              </div>
              <div className="md:col-span-2 md:text-right">
                <span className={`font-tech text-[9px] tracking-[0.12em] border px-2 py-1 ${phase.statusColor}`}>
                  {phase.status}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ApproachSection;
