import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type ResponseScenario = {
  id: string;
  label: string;
  severity: string;
  severityClass: string;
  summary: string;
  signals: string[];
  actions: string[];
  outcome: string;
};

const scenarios: ResponseScenario[] = [
  {
    id: "phishing",
    label: "Suspicious email",
    severity: "Medium",
    severityClass: "text-yellow-400 border-yellow-400/40",
    summary: "A finance or admin user received a suspicious email asking for credentials, payment changes, or urgent approval.",
    signals: [
      "Unexpected invoice or wire request",
      "M365 sign-in page or attachment link",
      "Sender name looks familiar but domain is off",
    ],
    actions: [
      "Quarantine the message and preserve headers",
      "Check whether the user clicked or entered credentials",
      "Reset passwords and review MFA and sign-in logs if interaction happened",
      "Block sender, domain, and lookalike variants across email security controls",
    ],
    outcome: "Best fit for businesses that want fast phishing triage and Microsoft 365 hardening.",
  },
  {
    id: "ransomware",
    label: "Possible ransomware",
    severity: "Critical",
    severityClass: "text-red-400 border-red-400/40",
    summary: "Files are inaccessible, renamed, or encrypted, and users are reporting unusual pop-ups or extortion notes.",
    signals: [
      "Sudden file extension changes",
      "Shared drive access failures",
      "Machines slowing down or locking up at the same time",
    ],
    actions: [
      "Isolate affected endpoints and shared storage immediately",
      "Stop lateral movement by disabling risky accounts and remote access paths",
      "Preserve evidence before restoration or cleanup starts",
      "Validate backup integrity and define the recovery order by business priority",
    ],
    outcome: "Best fit for incident response, containment, backup validation, and recovery planning.",
  },
  {
    id: "m365",
    label: "Microsoft 365 exposure",
    severity: "High",
    severityClass: "text-[#D4AF37] border-[#D4AF37]/40",
    summary: "The team uses Microsoft 365 heavily, but you are unsure if MFA, conditional access, sharing, alerts, and admin roles are locked down.",
    signals: [
      "Legacy auth still enabled",
      "External sharing feels too open",
      "No one is reviewing sign-in or mailbox alerts",
    ],
    actions: [
      "Review admin roles, MFA coverage, and conditional access",
      "Audit mailbox, Teams, SharePoint, and OneDrive sharing policies",
      "Enable alerting for risky sign-ins, forwarding rules, and suspicious access",
      "Prioritize the top fixes that reduce account takeover risk first",
    ],
    outcome: "Best fit for a Microsoft 365 assessment and a practical hardening plan.",
  },
  {
    id: "vendor",
    label: "Vendor or remote access risk",
    severity: "High",
    severityClass: "text-orange-400 border-orange-400/40",
    summary: "A vendor, contractor, MSP, or remote worker has broad access, but there is no clean view of how that access is controlled or monitored.",
    signals: [
      "Shared accounts or reused credentials",
      "Always-on remote access",
      "No separation between admin and day-to-day accounts",
    ],
    actions: [
      "Map who has external or privileged access and why",
      "Reduce standing privileges and require MFA everywhere possible",
      "Segment sensitive systems from broad remote access paths",
      "Create a simple review cadence for vendor and contractor access",
    ],
    outcome: "Best fit for access reviews, policy cleanup, and risk reduction without slowing operations down.",
  },
];

const SecurityRobotSection = () => {
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState(scenarios[0].id);

  const activeScenario = useMemo(
    () => scenarios.find((scenario) => scenario.id === activeId) ?? scenarios[0],
    [activeId]
  );

  const handlePlanRequest = () => {
    navigate("/contact", {
      state: {
        prefillMessage: `I want a response plan for this issue: ${activeScenario.label}. ${activeScenario.summary}`,
      },
    });
  };

  return (
    <section
      id="security-robot"
      className="bg-[#0A0A0A] py-24 font-mono border-t border-[#D4AF37]/10"
      aria-labelledby="security-robot-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-10 items-start">
          <div>
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-[#D4AF37]" />
              <span className="font-tech text-[10px] tracking-[0.2em] text-white/55 uppercase">Interactive incident guide</span>
            </div>

            <h2 id="security-robot-heading" className="font-display text-4xl md:text-5xl font-bold text-white tracking-[-0.03em] mb-5">
              Try the
              <br />
              <span className="text-[#D4AF37]">incident response guide.</span>
            </h2>

            <p className="font-ui text-[16px] text-white/74 leading-8 max-w-xl mb-8">
              This guided tool helps visitors understand how CesiumCyber approaches real security incidents. Pick a scenario and see what gets checked first, what gets prioritized, and where businesses usually lose time.
            </p>

            <div className="space-y-3">
              {scenarios.map((scenario) => {
                const isActive = scenario.id === activeScenario.id;

                return (
                  <button
                    key={scenario.id}
                    type="button"
                    onClick={() => setActiveId(scenario.id)}
                    className={`w-full text-left border px-5 py-4 transition-colors ${
                      isActive
                        ? "border-[#D4AF37] bg-[#D4AF37]/6"
                        : "border-white/10 bg-[#0F0F0F] hover:border-[#D4AF37]/30"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <span className="font-ui text-[15px] text-white/92">{scenario.label}</span>
                      <span className={`font-tech text-[9px] tracking-[0.15em] border px-2 py-0.5 ${scenario.severityClass}`}>
                        {scenario.severity}
                      </span>
                    </div>
                    <p className="font-ui text-[14px] text-white/66 leading-6">{scenario.summary}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border border-[#D4AF37]/20 bg-[#0D0D0D]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#D4AF37]/15 bg-[#D4AF37]/5">
              <span className="font-tech text-[10px] tracking-[0.24em] text-[#D4AF37]/75">ROBOT RESPONSE SEQUENCE</span>
              <span className="font-tech text-[9px] tracking-[0.15em] text-green-400/80">GUIDED MODE</span>
            </div>

            <div className="px-5 py-6 border-b border-[#D4AF37]/10">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="font-tech text-[10px] tracking-[0.16em] text-white/35">SELECTED SCENARIO</span>
                <span className="font-ui text-[15px] text-white/92">{activeScenario.label}</span>
                <span className={`font-tech text-[9px] tracking-[0.15em] border px-2 py-0.5 ${activeScenario.severityClass}`}>
                  {activeScenario.severity}
                </span>
              </div>
              <p className="font-ui text-[15px] text-white/76 leading-7">{activeScenario.summary}</p>
            </div>

            <div className="px-5 py-6 border-b border-[#D4AF37]/10">
              <div className="font-tech text-[10px] tracking-[0.18em] text-white/35 mb-4">WHAT THE ROBOT LOOKS FOR</div>
              <div className="space-y-3">
                {activeScenario.signals.map((signal, index) => (
                  <div key={signal} className="flex items-start gap-3">
                    <span className="font-tech text-[10px] text-[#D4AF37] pt-0.5">{String(index + 1).padStart(2, "0")}</span>
                    <span className="font-ui text-[15px] text-white/78 leading-7">{signal}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-5 py-6 border-b border-[#D4AF37]/10">
              <div className="font-tech text-[10px] tracking-[0.18em] text-white/35 mb-4">FIRST RESPONSE ACTIONS</div>
              <div className="space-y-3">
                {activeScenario.actions.map((action) => (
                  <div key={action} className="flex items-start gap-3">
                    <span className="text-[#D4AF37]">[→]</span>
                    <span className="font-ui text-[15px] text-white/78 leading-7">{action}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-5 py-6">
              <div className="font-tech text-[10px] tracking-[0.18em] text-white/35 mb-3">WHY THIS IS USEFUL</div>
              <p className="font-ui text-[15px] text-white/76 leading-7 mb-6">{activeScenario.outcome}</p>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handlePlanRequest}
                  className="font-tech bg-[#D4AF37] text-black px-6 py-3 text-[11px] tracking-[0.18em] font-bold hover:bg-[#FFD700] transition-colors"
                >
                  GET MY RESPONSE PLAN
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/m365-security-assessment")}
                  className="font-tech border border-white/15 text-white/70 px-6 py-3 text-[11px] tracking-[0.18em] hover:border-white/30 hover:text-white transition-colors"
                >
                  OPEN SECURITY CHECK
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecurityRobotSection;
