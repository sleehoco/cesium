
import React from "react";
import { Shield, ArrowUp, ArrowDown } from "lucide-react";
import { IMPACT_COLORS, NewsItem, PAGINATION_SIZE } from "./useCyberNews";

interface CyberNewsListProps {
  data: NewsItem[];
  pageStart: number;
  pageEnd: number;
  currentIdx: number;
  newsLength: number;
  currentPage: number;
  incrementPage: () => void;
  decrementPage: () => void;
  setCurrentIdx: (idx: number) => void;
  incrementIdx: () => void;
  decrementIdx: () => void;
}

const CyberNewsList: React.FC<CyberNewsListProps> = ({
  data,
  pageStart,
  pageEnd,
  currentIdx,
  newsLength,
  currentPage,
  incrementPage,
  decrementPage,
  setCurrentIdx,
  incrementIdx,
  decrementIdx,
}) => {
  return (
    <div>
      <div className="flex justify-between mb-3">
        <button
          className="rounded-full bg-cyber-light hover:bg-cyber px-3 py-1 flex items-center gap-1 disabled:opacity-50"
          aria-label="Page Up"
          onClick={decrementPage}
          disabled={currentPage === 0}
          type="button"
        >
          <ArrowUp className="h-4 w-4" /> Page Up
        </button>
        <span className="text-xs text-cesium-dark font-medium">
          Page {currentPage + 1} of {Math.ceil(newsLength / PAGINATION_SIZE)}
        </span>
        <button
          className="rounded-full bg-cyber-light hover:bg-cyber px-3 py-1 flex items-center gap-1 disabled:opacity-50"
          aria-label="Page Down"
          onClick={incrementPage}
          disabled={(currentPage + 1) * PAGINATION_SIZE >= newsLength}
          type="button"
        >
          Page Down <ArrowDown className="h-4 w-4" />
        </button>
      </div>
      <ul className="space-y-5 mb-2">
        {data.slice(pageStart, pageEnd).map((n, idx) => {
          const actualIdx = pageStart + idx;
          return (
            <li
              key={actualIdx}
              className={`rounded-lg border border-cyber/10 p-3 flex flex-col md:flex-row md:items-center gap-3 bg-cyber ${
                actualIdx === currentIdx ? "ring-2 ring-cesium" : ""
              }`}
              onClick={() => setCurrentIdx(actualIdx)}
              style={{ cursor: "pointer" }}
            >
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                  IMPACT_COLORS[n.impact] || "bg-gray-400 text-white"
                }`}
              >
                <Shield className="w-4 h-4 mr-1" />
                {n.impact} impact
              </span>
              <div className="flex-1">
                <a
                  href={n.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-cesium hover:underline"
                  onClick={e => e.stopPropagation()}
                >
                  {n.title}
                </a>
                <div className="text-gray-300 text-sm">{n.summary}</div>
                <div className="text-xs text-gray-400 mt-1">
                  Source: <span className="underline">{n.source}</span>
                </div>
              </div>
              <span className="text-[11px] text-cesium-dark font-medium ml-auto pr-2">
                {actualIdx + 1}/{newsLength}
              </span>
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
  );
};

export default CyberNewsList;
