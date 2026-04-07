import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type Severity = "Critical" | "High" | "Medium" | "Low";

interface CompromiseRule {
  packageName: string;
  compromisedVersions: string[];
  severity: Severity;
  title: string;
  description: string;
  impact: string;
  references: string[];
  remediation: string[];
}

interface CheckRequest {
  packageName?: string;
  packageVersion?: string;
  lockfileText?: string;
}

interface Finding {
  packageName: string;
  version: string;
  severity: Severity;
  title: string;
  description: string;
  impact: string;
  references: string[];
  remediation: string[];
}

const compromiseRules: CompromiseRule[] = [
  {
    packageName: "axios",
    compromisedVersions: ["1.14.1", "0.30.4"],
    severity: "Critical",
    title: "Compromised axios release",
    description:
      "These axios npm releases were reported as malicious after a maintainer account compromise and should be treated as supply-chain exposure, not just a vulnerable dependency.",
    impact:
      "Installing the poisoned release could execute attacker-controlled code on developer workstations or CI runners and expose local secrets, tokens, and build environments.",
    references: [
      "https://www.stepsecurity.io/blog/axios-compromised-on-npm-malicious-versions-drop-remote-access-trojan",
      "https://snyk.io/es/blog/axios-npm-package-compromised-supply-chain-attack-delivers-cross-platform/",
    ],
    remediation: [
      "Replace the affected axios version with a known-safe release immediately.",
      "Assume any machine or CI runner that installed the compromised version may be hostile.",
      "Rotate npm tokens, CI secrets, cloud credentials, and any environment secrets exposed to the affected runner.",
      "Review lockfile and install logs to determine when the compromised package was pulled.",
    ],
  },
  {
    packageName: "plain-crypto-js",
    compromisedVersions: ["4.2.1"],
    severity: "Critical",
    title: "Known malicious transitive dependency",
    description:
      "This package version was reported as the malicious transitive dependency used in the axios compromise chain.",
    impact:
      "Its presence in a lockfile is a strong indicator that an affected install path may have been resolved during the compromise window.",
    references: [
      "https://www.stepsecurity.io/blog/axios-compromised-on-npm-malicious-versions-drop-remote-access-trojan",
      "https://snyk.io/es/blog/axios-npm-package-compromised-supply-chain-attack-delivers-cross-platform/",
    ],
    remediation: [
      "Remove the malicious dependency and regenerate the lockfile from a known-good state.",
      "Rebuild on a fresh machine or CI runner.",
      "Rotate secrets that may have been available to the installation environment.",
    ],
  },
];

const severityScore: Record<Severity, number> = {
  Critical: 90,
  High: 70,
  Medium: 45,
  Low: 20,
};

const extractMatchesFromLockfile = (lockfileText: string, packageName: string): string[] => {
  const matches = new Set<string>();
  const escapedPackage = packageName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns = [
    new RegExp(`"${escapedPackage}"\\s*:\\s*"([^"]+)"`, "g"),
    new RegExp(`"${escapedPackage}"\\s*:\\s*\\{[^}]*"version"\\s*:\\s*"([^"]+)"`, "gs"),
    new RegExp(`"${escapedPackage}@[^"]*"\\s*:\\s*\\{[^}]*version:\\s*"?([^"\\n]+)"?`, "gs"),
    new RegExp(`${escapedPackage}@([^:\\s"']+)`, "g"),
    new RegExp(`node_modules/${escapedPackage}"\\s*:\\s*\\{[^}]*"version"\\s*:\\s*"([^"]+)"`, "gs"),
  ];

  for (const pattern of patterns) {
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(lockfileText)) !== null) {
      const version = match[1]?.trim();
      if (version) {
        matches.add(version.replace(/^[^\d]*/, ""));
      }
    }
  }

  return Array.from(matches);
};

const matchRule = (packageName: string, version: string): CompromiseRule | null => {
  return (
    compromiseRules.find(
      (rule) =>
        rule.packageName === packageName &&
        rule.compromisedVersions.includes(version),
    ) ?? null
  );
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { packageName, packageVersion, lockfileText }: CheckRequest = await req.json();

    if (!packageName && !lockfileText) {
      return new Response(
        JSON.stringify({ error: "Provide a package/version or paste lockfile text." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const findings: Finding[] = [];

    if (packageName && packageVersion) {
      const normalizedName = packageName.trim().toLowerCase();
      const normalizedVersion = packageVersion.trim();
      const matchedRule = matchRule(normalizedName, normalizedVersion);

      if (matchedRule) {
        findings.push({
          packageName: normalizedName,
          version: normalizedVersion,
          severity: matchedRule.severity,
          title: matchedRule.title,
          description: matchedRule.description,
          impact: matchedRule.impact,
          references: matchedRule.references,
          remediation: matchedRule.remediation,
        });
      }
    }

    if (lockfileText) {
      for (const rule of compromiseRules) {
        const versions = extractMatchesFromLockfile(lockfileText, rule.packageName);
        for (const version of versions) {
          if (!rule.compromisedVersions.includes(version)) {
            continue;
          }

          findings.push({
            packageName: rule.packageName,
            version,
            severity: rule.severity,
            title: rule.title,
            description: rule.description,
            impact: rule.impact,
            references: rule.references,
            remediation: rule.remediation,
          });
        }
      }
    }

    const dedupedFindings = Array.from(
      new Map(
        findings.map((finding) => [
          `${finding.packageName}@${finding.version}`,
          finding,
        ]),
      ).values(),
    );

    const highestSeverity =
      dedupedFindings.sort((a, b) => severityScore[b.severity] - severityScore[a.severity])[0]?.severity ?? "Low";

    const overallRisk = dedupedFindings.length === 0 ? "None" : highestSeverity;

    return new Response(
      JSON.stringify({
        success: true,
        overallRisk,
        findingCount: dedupedFindings.length,
        findings: dedupedFindings,
        guidance: dedupedFindings.length === 0
          ? [
              "No seeded compromised-package matches were found in this check.",
              "Keep using pinned lockfiles, reviewed dependency updates, and isolated CI runners.",
            ]
          : [
              "Treat compromised package installation as possible host compromise, not only dependency risk.",
              "Rotate secrets that may have been exposed to affected machines or runners.",
              "Rebuild from a known-good lockfile on a clean environment.",
            ],
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
