import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Finding {
  severity: "High" | "Medium" | "Low";
  type: "SourceMap" | "SourceReference" | "DebugArtifact";
  url: string;
  title: string;
  evidence: string;
}

const MAX_ASSET_CANDIDATES = 12;
const FETCH_TIMEOUT_MS = 8000;

const commonArtifactPaths = [
  "/cli.js.map",
  "/app.js.map",
  "/main.js.map",
  "/bundle.js.map",
  "/index.js.map",
  "/assets/index.js.map",
];

const sourceMapCommentPatterns = [
  /[#@]\s*sourceMappingURL=([^\s*]+)/g,
];

const normalizeUrl = (input: string) => {
  const withProtocol = /^https?:\/\//i.test(input) ? input : `https://${input}`;
  return new URL(withProtocol);
};

const fetchWithTimeout = async (url: string) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    return await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent": "CesiumCyber Debug Artifact Scanner",
        "Accept": "*/*",
      },
    });
  } finally {
    clearTimeout(timeout);
  }
};

const extractAssetUrls = (html: string, pageUrl: URL) => {
  const assetUrls = new Set<string>();
  const assetPattern = /<(?:script|link)[^>]+(?:src|href)=["']([^"']+)["'][^>]*>/gi;

  let match: RegExpExecArray | null;
  while ((match = assetPattern.exec(html)) !== null) {
    const raw = match[1];
    if (!raw || raw.startsWith("data:")) {
      continue;
    }

    if (!/\.js(\?|$)/i.test(raw) && !/modulepreload/i.test(match[0])) {
      continue;
    }

    try {
      assetUrls.add(new URL(raw, pageUrl).toString());
    } catch {
      continue;
    }

    if (assetUrls.size >= MAX_ASSET_CANDIDATES) {
      break;
    }
  }

  return Array.from(assetUrls);
};

const extractSourceMapUrls = (assetContents: string, assetUrl: string) => {
  const urls = new Set<string>();

  for (const pattern of sourceMapCommentPatterns) {
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(assetContents)) !== null) {
      try {
        urls.add(new URL(match[1], assetUrl).toString());
      } catch {
        continue;
      }
    }
  }

  return Array.from(urls);
};

const inspectSourceMap = async (mapUrl: string): Promise<Finding | null> => {
  try {
    const response = await fetchWithTimeout(mapUrl);
    if (!response.ok) {
      return null;
    }

    const body = await response.text();
    const looksLikeMap = body.includes('"sources"') || body.includes('"version"');
    if (!looksLikeMap) {
      return {
        severity: "Low",
        type: "DebugArtifact",
        url: mapUrl,
        title: "Public debug artifact",
        evidence: `HTTP ${response.status} response returned for a likely debug file.`,
      };
    }

    let evidence = `Accessible source map (${response.status}).`;
    let severity: Finding["severity"] = "Medium";

    try {
      const parsed = JSON.parse(body) as { sources?: string[]; sourcesContent?: string[] };
      if (Array.isArray(parsed.sourcesContent) && parsed.sourcesContent.some(Boolean)) {
        severity = "High";
        evidence = `Accessible source map includes embedded original sources for ${parsed.sourcesContent.length} files.`;
      } else if (Array.isArray(parsed.sources) && parsed.sources.length > 0) {
        evidence = `Accessible source map references ${parsed.sources.length} original source files.`;
      }
    } catch {
      evidence = "Accessible source map or debug JSON was returned, but it could not be parsed.";
    }

    return {
      severity,
      type: "SourceMap",
      url: mapUrl,
      title: "Publicly accessible source map",
      evidence,
    };
  } catch {
    return null;
  }
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    if (!url || typeof url !== "string") {
      return new Response(
        JSON.stringify({ error: "A URL is required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const targetUrl = normalizeUrl(url);
    const homepageResponse = await fetchWithTimeout(targetUrl.toString());

    if (!homepageResponse.ok) {
      return new Response(
        JSON.stringify({ error: `Target returned HTTP ${homepageResponse.status}.` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const html = await homepageResponse.text();
    const assetUrls = extractAssetUrls(html, targetUrl);
    const findings: Finding[] = [];
    const probedMaps = new Set<string>();

    for (const assetUrl of assetUrls) {
      try {
        const assetResponse = await fetchWithTimeout(assetUrl);
        if (!assetResponse.ok) {
          continue;
        }

        const assetContents = await assetResponse.text();
        const referencedMapUrls = extractSourceMapUrls(assetContents, assetUrl);

        if (referencedMapUrls.length > 0) {
          findings.push({
            severity: "Medium",
            type: "SourceReference",
            url: assetUrl,
            title: "JavaScript references a source map",
            evidence: `Asset contains sourceMappingURL comments pointing to ${referencedMapUrls.length} map file(s).`,
          });
        }

        const candidateMapUrls = new Set<string>([
          ...referencedMapUrls,
          `${assetUrl}.map`,
        ]);

        for (const mapUrl of candidateMapUrls) {
          if (probedMaps.has(mapUrl)) {
            continue;
          }
          probedMaps.add(mapUrl);

          const finding = await inspectSourceMap(mapUrl);
          if (finding) {
            findings.push(finding);
          }
        }
      } catch {
        continue;
      }
    }

    for (const artifactPath of commonArtifactPaths) {
      const artifactUrl = new URL(artifactPath, targetUrl).toString();
      if (probedMaps.has(artifactUrl)) {
        continue;
      }
      probedMaps.add(artifactUrl);

      const finding = await inspectSourceMap(artifactUrl);
      if (finding) {
        findings.push(finding);
      }
    }

    const overallRisk =
      findings.some((finding) => finding.severity === "High")
        ? "High"
        : findings.some((finding) => finding.severity === "Medium")
          ? "Medium"
          : findings.some((finding) => finding.severity === "Low")
            ? "Low"
            : "None";

    return new Response(
      JSON.stringify({
        target: targetUrl.toString(),
        overallRisk,
        assetCount: assetUrls.length,
        findingCount: findings.length,
        findings,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
