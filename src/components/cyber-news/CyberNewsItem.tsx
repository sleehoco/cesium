
import React from "react";
import { Shield, ArrowUp, ArrowDown } from "lucide-react";
import { IMPACT_COLORS, NewsItem } from "./useCyberNews";

interface Props {
  news: NewsItem;
  newsLength: number;
  currentIdx: number;
  onPrev: () => void;
  onNext: () => void;
}

const CyberNewsItem: React.FC<Props> = ({
  news,
  newsLength,
  currentIdx,
  onPrev,
  onNext,
}) => {
  return (
    <div className="flex flex-row items-start gap-2">
      <div className="flex flex-col justify-center mr-2 gap-2">
        <button
          className="rounded-full p-1 disabled:opacity-50"
          aria-label="Previous news"
          onClick={onPrev}
          disabled={currentIdx === 0}
          tabIndex={0}
          type="button"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
        <button
          className="rounded-full p-1 disabled:opacity-50"
          aria-label="Next news"
          onClick={onNext}
          disabled={currentIdx >= newsLength - 1}
          tabIndex={0}
          type="button"
        >
          <ArrowDown className="h-4 w-4" />
        </button>
      </div>
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mt-1 ${
          IMPACT_COLORS[news.impact] || "bg-gray-400 text-white"
        }`}
      >
        <Shield className="w-4 h-4 mr-1" />
        {news.impact} impact
      </span>
      <div className="flex flex-col flex-1 min-w-0">
        <a
          href={news.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-cesium hover:underline truncate"
        >
          {news.title}
        </a>
        <div className="text-xs text-gray-400">
          Source: <span className="underline">{news.source}</span>
        </div>
        <span className="text-[11px] text-cesium-dark font-medium ml-auto pr-2">
          {currentIdx + 1}/{newsLength}
        </span>
      </div>
    </div>
  );
};

export default CyberNewsItem;
