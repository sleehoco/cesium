
import React from "react";
import { Newspaper, ChevronUp, ChevronDown } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../ui/card";
import CyberNewsItem from "./CyberNewsItem";
import CyberNewsList from "./CyberNewsList";
import { useCyberNews } from "./useCyberNews";

const CyberSecurityNewsBox: React.FC = () => {
  const {
    expanded, setExpanded,
    isLoading, error, data,
    refetch,
    newsLength, currentIdx, pageStart, pageEnd,
    incrementIdx, decrementIdx,
    incrementPage, decrementPage,
    setCurrentIdx,
    newsSnippet,
    currentPage,
  } = useCyberNews();

  // We lock scroll on expansion for body
  React.useEffect(() => {
    if (expanded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [expanded]);

  // Dynamically position:fixed over all if expanded, else float as before
  return (
    <>
      {expanded && (
        <div 
          className="fixed z-[49] inset-0 bg-black/60 transition-opacity duration-300"
          aria-label="Dim background"
        />
      )}
      <div
        className={`
          ${expanded
            ? "fixed z-50 inset-0 flex items-center justify-center w-screen h-screen md:items-center md:justify-center"
            : "fixed z-50 right-4 bottom-4 max-w-full md:max-w-md"
          }
          transition-all
        `}
        style={{ pointerEvents: "all" }}
        tabIndex={-1}
      >
        <Card
          className={`
            shadow-lg bg-gradient-to-br from-cyber-dark via-cyber to-cyber/90 border border-cesium/30
            transition-all duration-300 ease-in-out
            ${expanded ? "rounded-none w-full h-full max-h-[100vh] md:w-[30rem] md:h-[32rem] md:rounded-t-lg md:max-h-[95vh]" : "rounded-xl"}
            flex flex-col
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
          <CardContent className={`overflow-auto transition-all duration-300 flex-1 ${expanded ? "" : "max-h-32"}`}>
            {isLoading ? (
              <div className="text-gray-400 text-sm">Loading latest news...</div>
            ) : error ? (
              <div className="text-red-500 text-sm">Unable to load news. Please try again later.</div>
            ) : !expanded && newsSnippet ? (
              <CyberNewsItem
                news={newsSnippet}
                newsLength={newsLength}
                currentIdx={currentIdx}
                onPrev={decrementIdx}
                onNext={incrementIdx}
              />
            ) : expanded && data && newsLength > 0 ? (
              <CyberNewsList
                data={data}
                pageStart={pageStart}
                pageEnd={pageEnd}
                currentIdx={currentIdx}
                newsLength={newsLength}
                currentPage={currentPage}
                incrementPage={incrementPage}
                decrementPage={decrementPage}
                setCurrentIdx={setCurrentIdx}
                incrementIdx={incrementIdx}
                decrementIdx={decrementIdx}
              />
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
    </>
  );
};

export default CyberSecurityNewsBox;

