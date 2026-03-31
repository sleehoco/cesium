
import { useState } from "react";

const reports = [
  {
    id: "RPT-001",
    source: "Sarah Johnson",
    title: "CTO, TechFront Solutions",
    assessment: "CesiumCyber transformed our approach to cybersecurity. Their vulnerability assessment uncovered critical issues we weren't aware of, and their remediation plan was clear and actionable. Engagement exceeded all expectations.",
    classification: "VERIFIED",
  },
  {
    id: "RPT-002",
    source: "Michael Chen",
    title: "IT Director, Global Finance Corp",
    assessment: "The penetration testing services identified vulnerabilities our previous security provider missed completely. Findings were documented with precise technical detail and business-level impact summaries. Highly effective.",
    classification: "VERIFIED",
  },
  {
    id: "RPT-003",
    source: "David Rodriguez",
    title: "CISO, HealthTech Innovations",
    assessment: "Working with CesiumCyber has been a game-changer. Their proactive threat detection and continuous monitoring posture gives us operational confidence we didn't have before. The team is technically rigorous.",
    classification: "VERIFIED",
  },
];

const TestimonialSection = () => {
  const [current, setCurrent] = useState(0);
  const report = reports[current];

  return (
    <div className="bg-[#0D0D0D] py-24 font-mono border-t border-[#D4AF37]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="flex items-center gap-4 mb-14">
          <div className="h-px flex-1 max-w-xs bg-[#D4AF37]/15" />
          <span className="text-[10px] tracking-[0.3em] text-white/20">SECTION 05 // WHAT CLIENTS SAY</span>
          <div className="h-px flex-1 max-w-xs bg-[#D4AF37]/15" />
        </div>

        <div className="max-w-4xl">

          {/* Report document */}
          <div className="border border-[#D4AF37]/20">

            {/* Report header */}
            <div className="bg-[#D4AF37]/5 border-b border-[#D4AF37]/15 px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-6">
                <span className="text-[#D4AF37] text-[11px] tracking-[0.3em] font-bold">{report.id}</span>
                <span className="text-[9px] tracking-[0.25em] border border-green-400/40 text-green-400 px-2 py-0.5">
                  {report.classification}
                </span>
              </div>
              <span className="text-[9px] text-white/20 tracking-[0.2em]">
                {current + 1} OF {reports.length}
              </span>
            </div>

            {/* Source metadata */}
            <div className="border-b border-[#D4AF37]/08 px-6 py-4 grid grid-cols-2 gap-4">
              <div>
                <div className="text-[9px] tracking-[0.25em] text-white/20 mb-1">SOURCE</div>
                <div className="text-[12px] text-white/65 tracking-wide">{report.source}</div>
              </div>
              <div>
                <div className="text-[9px] tracking-[0.25em] text-white/20 mb-1">POSITION</div>
                <div className="text-[12px] text-white/65 tracking-wide">{report.title}</div>
              </div>
            </div>

            {/* Assessment body */}
            <div className="px-6 py-8">
              <div className="text-[9px] tracking-[0.25em] text-white/20 mb-4">ASSESSMENT</div>
              <p className="text-[13px] text-white/50 leading-loose">
                "{report.assessment}"
              </p>
            </div>

            {/* Navigation */}
            <div className="border-t border-[#D4AF37]/10 px-6 py-4 flex items-center justify-between">
              <button
                onClick={() => setCurrent((c) => (c === 0 ? reports.length - 1 : c - 1))}
                className="text-[10px] tracking-[0.25em] text-white/30 hover:text-[#D4AF37] transition-colors"
              >
                [← PREV REPORT]
              </button>

              <div className="flex gap-2">
                {reports.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`h-1 transition-all duration-200 ${
                      i === current ? 'w-6 bg-[#D4AF37]' : 'w-2 bg-white/15 hover:bg-white/30'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() => setCurrent((c) => (c === reports.length - 1 ? 0 : c + 1))}
                className="text-[10px] tracking-[0.25em] text-white/30 hover:text-[#D4AF37] transition-colors"
              >
                [NEXT REPORT →]
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default TestimonialSection;
