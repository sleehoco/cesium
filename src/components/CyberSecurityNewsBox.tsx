import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Shield, Newspaper, ChevronUp, ChevronDown, ArrowUp, ArrowDown } from "lucide-react";
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
  const [expanded, setExpanded] = React.useState(false);
  const [currentIdx, setCurrentIdx] = React.useState(0);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["cyber-news-llm"],
    queryFn: fetchCyberNews,
    refetchInterval: 10 * 60 * 1000,
  });

  React.useEffect(() => {
    if (error) {
      toast.error("Could not fetch Cyber Security News");
    }
    setCurrentIdx(0);
  }, [error, data]);

  const newsLength = data && Array.isArray(data) ? data.length : 0;

  const incrementIdx = () => {
    if (!data) return;
    setCurrentIdx((prev) => (prev + 1 < newsLength ? prev + 1 : prev));
  };
  const decrementIdx = () => {
    setCurrentIdx((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const PAGINATION_SIZE = 5;
  const pageStart = Math.floor(currentIdx / PAGINATION_SIZE) * PAGINATION_SIZE;
  const pageEnd = pageStart + PAGINATION_SIZE;

  const incrementPage = () => {
    const nextPageIdx = pageStart + PAGINATION_SIZE;
    if (nextPageIdx < newsLength) setCurrentIdx(nextPageIdx);
  };
  const decrementPage = () => {
    const prevPageIdx = pageStart - PAGINATION_SIZE;
    if (prevPageIdx >= 0) setCurrentIdx(prevPageIdx);
    else setCurrentIdx(0);
  };

  const newsSnippet = !isLoading && !error && data && newsLength > 0 ? data[currentIdx] : null;

  return (
    <div
      className={`
        fixed z-50 right-4 bottom-4 max-w-full md:max-w-md transition-all
        ${expanded ? "w-[95vw] md:w-[30rem] h-[32rem] md:h-[32rem]" : "w-[95vw] md:w-[22rem] h-auto"}
      `}
      style={{ pointerEvents: "all" }}
    >
      <Card
        className={`
          shadow-lg bg-gradient-to-br from-cyber-dark via-cyber to-cyber/90 border border-cesium/30
          transition-all duration-300 ease-in-out
          ${expanded ? "rounded-t-lg" : "rounded-xl"}
        `}
      >
        <CardHeader className="flex flex-row items-center gap-3 pb-2">
          <Newspaper className="text-cesium h-7 w-7" />
          <CardTitle className="text-2xl flex-1">Cybersecurity News</CardTitle>
          <button
            className="ml-2 rounded-full hover:bg-cyber-light p-1 transition-colors"
            aria-label={expanded ? "Collapse news" : "Expand news"}
            onClick={() => setExpanded(e => !e)}
          >
            {expanded ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
          </button>
        </CardHeader>
        <CardContent className={`overflow-auto transition-all duration-300 ${expanded ? "" : "max-h-32"}`}>
          {isLoading ? (
            <div className="text-gray-400 text-sm">Loading latest news...</div>
          ) : error ? (
            <div className="text-red-500 text-sm">Unable to load news. Please try again later.</div>
          ) : !expanded && newsSnippet ? (
            <div className="flex flex-row items-start gap-2">
              <div className="flex flex-col justify-center mr-2 gap-2">
                <button
                  className={`rounded-full p-1 disabled:opacity-50`}
                  aria-label="Previous news"
                  onClick={decrementIdx}
                  disabled={currentIdx === 0}
                  tabIndex={0}
                  type="button"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  className={`rounded-full p-1 disabled:opacity-50`}
                  aria-label="Next news"
                  onClick={incrementIdx}
                  disabled={currentIdx >= newsLength - 1}
                  tabIndex={0}
                  type="button"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
              </div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mt-1 ${IMPACT_COLORS[newsSnippet.impact] || "bg-gray-400 text-white"}`}>
                <Shield className="w-4 h-4 mr-1" />
                {newsSnippet.impact} impact
              </span>
              <div className="flex flex-col flex-1 min-w-0">
                <a href={newsSnippet.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-cesium hover:underline truncate">
                  {newsSnippet.title}
                </a>
                <div className="text-xs text-gray-400">
                  Source: <span className="underline">{newsSnippet.source}</span>
                </div>
                <span className="text-[11px] text-cesium-dark font-medium ml-auto pr-2">{currentIdx + 1}/{newsLength}</span>
              </div>
            </div>
          ) : expanded && data && newsLength > 0 ? (
            <div>
              <div className="flex justify-between mb-3">
                <button
                  className="rounded-full bg-cyber-light hover:bg-cyber px-3 py-1 flex items-center gap-1 disabled:opacity-50"
                  aria-label="Page Up"
                  onClick={decrementPage}
                  disabled={pageStart === 0}
                  type="button"
                >
                  <ArrowUp className="h-4 w-4" /> Page Up
                </button>
                <button
                  className="rounded-full bg-cyber-light hover:bg-cyber px-3 py-1 flex items-center gap-1 disabled:opacity-50"
                  aria-label="Page Down"
                  onClick={incrementPage}
                  disabled={pageEnd >= newsLength}
                  type="button"
                >
                  Page Down <ArrowDown className="h-4 w-4" />
                </button>
              </div>
              <ul className="space-y-5 mb-2">
                {data.slice(pageStart, Math.min(pageEnd, newsLength)).map((n, idx) => {
                  const actualIdx = pageStart + idx;
                  return (
                    <li
                      key={actualIdx}
                      className={`rounded-lg border border-cyber/10 p-3 flex flex-col md:flex-row md:items-center gap-3 bg-cyber ${actualIdx === currentIdx ? "ring-2 ring-cesium" : ""}`}
                    >
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
                      <span className="text-[11px] text-cesium-dark font-medium ml-auto pr-2">{actualIdx + 1}/{newsLength}</span>
                    </li>
                  );
                })}
              </ul>
              <div className="flex justify-between mb-1">
                <button
                  className="rounded-full bg-cyber-light hover:bg-cyber px-3 py-1 flex items-center gap-1 disabled:opacity-50"
                  aria-label="Previous news"
                  onClick={decrementIdx}
                  disabled={currentIdx === 0}
                  type="button"
                >
                  <ArrowUp className="h-4 w-4" /> Previous
                </button>
                <button
                  className="rounded-full bg-cyber-light hover:bg-cyber px-3 py-1 flex items-center gap-1 disabled:opacity-50"
                  aria-label="Next news"
                  onClick={incrementIdx}
                  disabled={currentIdx >= newsLength - 1}
                  type="button"
                >
                  Next <ArrowDown className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-xs text-gray-400">No news found at this time.</div>
          )}
          <div className={`flex justify-end ${expanded ? "" : "hidden"}`}>
            <button
              className="mt-2 px-4 py-1 rounded text-cyber-dark bg-cesium hover:bg-cesium-dark font-semibold transition-colors"
              onClick={() => refetch()}
              type="button"
            >
              Refresh
            </button>
          </div>
        </CardContent>
        {expanded && (
          <CardDescription className="italic pt-2 text-xs text-gray-400 px-6 pb-3">
            Powered by Gemini AI analysis – summarizing and classifying the latest cybersecurity news for business risk awareness.
          </CardDescription>
        )}
      </Card>
    </div>
  );
};

export default CyberSecurityNewsBox;
