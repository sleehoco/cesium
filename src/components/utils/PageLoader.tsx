
import { useEffect, useState } from "react";

const PageLoader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-cyber-dark z-[9999] flex items-center justify-center">
      <div className="relative">
        <svg className="w-16 h-16" viewBox="0 0 100 100">
          <circle
            className="text-cesium/20"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r="42"
            cx="50"
            cy="50"
          />
          <circle
            className="text-cesium animate-[dash_1.5s_ease-in-out_infinite,rotate_2s_linear_infinite]"
            strokeWidth="8"
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="42"
            cx="50"
            cy="50"
            style={{
              strokeDasharray: 264,
              strokeDashoffset: 125,
            }}
          />
        </svg>
        <div className="mt-4 text-center text-cesium font-bold">CesiumCyber</div>
      </div>
    </div>
  );
};

export default PageLoader;
