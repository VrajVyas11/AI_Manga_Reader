import React from "react";
import { Loader2 } from "lucide-react";

const ScanningOverlay = ({ isDark = true, type = "else" }) => {
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm rounded-lg">
      <style jsx>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan {
          animation: scan 2s ease-in-out infinite;
        }
      `}</style>
      
      <div className="relative w-full h-full overflow-hidden">
        {/* Animated scan line */}
        <div 
          className={`absolute left-0 right-0 h-0.5 animate-scan ${
            type === "translate" ? "bg-yellow-400" : "bg-purple-400"
          } shadow-lg`}
          style={{
            boxShadow: `0 0 20px ${type === "translate" ? "#facc15" : "#c084fc"}, 0 0 40px ${type === "translate" ? "#facc15" : "#c084fc"}`
          }}
        />
        
        {/* Grid overlay for tech effect */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(${isDark ? '#ffffff22' : '#00000022'} 1px, transparent 1px),
                             linear-gradient(90deg, ${isDark ? '#ffffff22' : '#00000022'} 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}
        />
      </div>
      
      {/* Status text */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center px-4">
        <Loader2 strokeWidth={3} className={`w-10 h-10 sm:w-12 sm:h-12 mb-3 mx-auto animate-spin ${
          type === "translate" ? "text-yellow-400" : "text-purple-400"
        }`} />
        <p className={`text-xs sm:text-sm font-semibold tracking-wider ${
          isDark ? "text-white" : "text-gray-100"
        }`}>
          {type === "translate" ? "ANALYZING TEXT..." : "READING TEXT..."}
        </p>
        <div className="flex gap-1 mt-2 justify-center">
          <span 
            className={`w-2 h-2 rounded-full animate-pulse ${
              type === "translate" ? "bg-yellow-400" : "bg-purple-400"
            }`}
            style={{animationDelay: '0ms'}} 
          />
          <span 
            className={`w-2 h-2 rounded-full animate-pulse ${
              type === "translate" ? "bg-yellow-400" : "bg-purple-400"
            }`}
            style={{animationDelay: '150ms'}} 
          />
          <span 
            className={`w-2 h-2 rounded-full animate-pulse ${
              type === "translate" ? "bg-yellow-400" : "bg-purple-400"
            }`}
            style={{animationDelay: '300ms'}} 
          />
        </div>
      </div>
    </div>
  );
};

export default ScanningOverlay;