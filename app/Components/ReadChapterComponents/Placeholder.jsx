import React from 'react';

const Placeholder = ({ isDark = true, layout = "horizontal" }) => {
  const isVertical = layout === "vertical";
  
  return (
    <div 
      role="status" 
      className={`
        ${isVertical 
          ? "w-full  max-w-[1280px] aspect-[9/16] px-4 md:px-0" 
          : "w-full min-w-[350px] relative  max-w-[55%]  md:max-w-[400px] h-[60vh] md:h-[87vh]"
        }
      `}
    >
      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.9; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
      <div
        className={`
          w-full h-full rounded-lg flex justify-center items-center
          transition-all duration-700 ease-in-out backdrop-blur-2xl
          animate-pulse-slow
          ${isDark 
            ? 'bg-gradient-to-br from-gray-800/60 to-gray-900/60' 
            : 'bg-gradient-to-br from-gray-200/60 to-gray-300/60 border border-gray-300'
          }
        `}
      >
        <div className="text-center">
          <div className={`
            w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 mx-auto mb-3 md:mb-4 rounded-full 
            flex items-center justify-center
          `}>
            <svg 
              className={`w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 ${isDark ? 'stroke-gray-400' : 'stroke-gray-600'}`}
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              strokeWidth={2}
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
              />
            </svg>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Placeholder;