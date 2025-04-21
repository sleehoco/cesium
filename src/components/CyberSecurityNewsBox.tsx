
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Shield, Newspaper } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "./ui/card";
import { toast } from "./ui/sonner";

const IMPACT_COLORS: Record<string, string> = {
  low: "bg-green-500 text-white",
  medium: "bg-yellow-500 text-black",
  high: "bg-red-500 text-white",
};

type NewsItem = {
  title: string;
  summary: string;
  source: string;
  url: string;
  impact: "low" | "medium" | "high";
};

const fetchCyberNews = async (): Promise<NewsItem[]> => {
  const res = await fetch(
    "https://rxlpulfotwjizohyfulc.supabase.co/functions/v1/cyber-news-llm"
  );
  if (!res.ok) {
    throw new Error("Failed to fetch cybersecurity news.");
  }
  const data = await res.json();
  if (!Array.isArray(data.news)) {
    throw new Error("Unexpected news format.");
  }
  return data.news;
};

export const CyberSecurityNewsBox: React.FC = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["cyber-news-llm"],
    queryFn: fetchCyberNews,
    refetchInterval: 10 * 60 * 1000, // Refresh every 10 minutes
  });

  React.useEffect(() => {
    if (error) {
      toast.error("Could not fetch CyberSecurity News");
    }
  }, [error]);

  return (
    <Card className="mb-8 shadow-lg bg-gradient-to-br from-cyber-dark via-cyber to-cyber/90 border border-cesium/20 max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center gap-3 pb-2">
        <Newspaper className="text-cesium h-7 w-7" />
        <CardTitle className="text-2xl">Cybersecurity News</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-gray-400 text-sm">Loading latest news...</div>
        ) : error ? (
          <div className="text-red-500 text-sm">Unable to load news. Please try again later.</div>
        ) : (data && data.length > 0) ? (
          <ul className="space-y-5">
            {data.map((n, i) => (
              <li key={i} className="rounded-lg border border-cyber/10 p-3 flex flex-col md:flex-row md:items-center gap-3 bg-cyber">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${IMPACT_COLORS[n.impact] || "bg-gray-400 text-white"}`}>
                  <Shield className="w-4 h-4 mr-1" />
                  {n.impact} impact
                </span>
                <div className="flex-1">
                  <a href={n.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-cesium hover:underline">
                    {n.title}
                  </a>
                  <div className="text-gray-300 text-sm">{n.summary}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    Source: <span className="underline">{n.source}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-xs text-gray-400">No news found at this time.</div>
        )}
        <button
          className="mt-4 px-4 py-1 rounded text-cyber-dark bg-cesium hover:bg-cesium-dark font-semibold transition-colors"
          onClick={() => refetch()}
        >
          Refresh
        </button>
      </CardContent>
      <CardDescription className="italic pt-2 text-xs text-gray-400">
        Powered by Gemini AI analysis – summarizing and classifying the latest cybersecurity news for business risk awareness.
      </CardDescription>
    </Card>
  );
};

export default CyberSecurityNewsBox;
