
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "../ui/sonner";

// impact colors used in UI
export const IMPACT_COLORS: Record<string, string> = {
  low: "bg-green-500 text-white",
  medium: "bg-yellow-500 text-black",
  high: "bg-red-500 text-white",
};

export type NewsItem = {
  title: string;
  summary: string;
  source: string;
  url: string;
  impact: "low" | "medium" | "high";
};

export const PAGINATION_SIZE = 5;

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

export function useCyberNews() {
  const [expanded, setExpanded] = React.useState(false);
  const [currentIdx, setCurrentIdx] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState(0);

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["cyber-news-llm"],
    queryFn: fetchCyberNews,
    refetchInterval: 10 * 60 * 1000,
  });

  React.useEffect(() => {
    if (error) {
      toast.error("Could not fetch Cyber Security News");
    }
    setCurrentIdx(0);
    setCurrentPage(0);
  }, [error, data]);

  const newsLength = data && Array.isArray(data) ? data.length : 0;

  // Index up and down
  const incrementIdx = () => {
    if (!data) return;
    const nextIdx = currentIdx + 1;
    if (nextIdx < newsLength) {
      setCurrentIdx(nextIdx);
      setCurrentPage(Math.floor(nextIdx / PAGINATION_SIZE));
    }
  };
  const decrementIdx = () => {
    const prevIdx = currentIdx - 1;
    if (prevIdx >= 0) {
      setCurrentIdx(prevIdx);
      setCurrentPage(Math.floor(prevIdx / PAGINATION_SIZE));
    }
  };

  // Page up and down
  const pageStart = currentPage * PAGINATION_SIZE;
  const pageEnd = Math.min(pageStart + PAGINATION_SIZE, newsLength);

  const incrementPage = () => {
    if (pageEnd < newsLength) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      setCurrentIdx(nextPage * PAGINATION_SIZE);
    }
  };
  const decrementPage = () => {
    if (currentPage > 0) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      setCurrentIdx(prevPage * PAGINATION_SIZE);
    }
  };

  const newsSnippet =
    !isLoading && !error && data && newsLength > 0 ? data[currentIdx] : null;

  return {
    expanded,
    setExpanded,
    currentIdx,
    setCurrentIdx,
    currentPage,
    setCurrentPage,
    data,
    isLoading,
    error,
    refetch,
    newsLength,
    incrementIdx,
    decrementIdx,
    incrementPage,
    decrementPage,
    pageStart,
    pageEnd,
    newsSnippet,
  };
}
