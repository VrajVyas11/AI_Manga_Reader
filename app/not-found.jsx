"use client";
import {
  ArrowLeft,
  Home,
  MapPinXInside,
  RotateCcw,
  WifiOff,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "./providers/ThemeContext";

export default function Custom404() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme == "dark";

  const handleGoBack = () => {
    router.back();
  };

  const handleGoHome = () => {
    router.push("/manga-list");
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="h-[85vh] relative z-50 w-full flex items-center justify-center px-4 sm:px-6">
      <div className={`w-full max-w-3xl`}>
        <div className={`rounded-xl ${isDark ? "" : "shadow-xl overflow-hidden"}`}>
          {/* Terminal-style header */}
          <div
            className={`${isDark ? "bg-gray-950/50 border-gray-700" : "bg-white border-gray-200"
              } border rounded-t-xl px-4 sm:px-6 py-3 sm:py-4`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex gap-1.5 sm:gap-2">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
                </div>
                <span
                  className={`text-xs sm:text-sm font-mono ${isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                >
                  AI_Manga_Reader.com/404
                </span>
              </div>
              <WifiOff
                className={`w-4 h-4 sm:w-5 sm:h-5 ${isDark ? "text-red-400" : "text-red-500"
                  }`}
              />
            </div>
          </div>

          {/* Main content area */}
          <div
            className={`${isDark ? "bg-gray-900/60 border-gray-700" : "bg-white border-gray-200"
              } border-x border-b rounded-b-xl p-5 sm:p-7`}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 items-center">
              {/* Left - Status display */}
              <div className="flex flex-row blur-[2px] -mb-24 sm:mb-0 relative sm:blur-none sm:flex-col sm:space-y-6 space-x-6 sm:space-x-0 ">
                <div
                  className={`${isDark ? "bg-gray-900 border-gray-700" : "bg-gray-50 border-gray-200"
                    } border rounded-lg w-full flex flex-col justify-center items-center text-center p-4 sm:p-6`}
                >
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span
                      className={`text-xs sm:text-sm font-mono ${isDark ? "text-red-400" : "text-red-600"
                        }`}
                    >
                      ERROR
                    </span>
                  </div>
                  <div
                    className={`text-2xl sm:text-3xl font-mono font-bold ${isDark ? "text-white" : "text-gray-900"
                      }`}
                  >
                    404
                  </div>
                  <div
                    className={`text-xs sm:text-sm font-mono mt-1 sm:mt-2 ${isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                  >
                    NOT_FOUND
                  </div>
                </div>

                <div
                  className={`${isDark ? "bg-gray-900 border-gray-700" : "bg-gray-50 border-gray-200"
                    } border w-full rounded-lg flex flex-col justify-center items-center p-3 sm:p-4`}
                >
                  <div
                    className={`text-[10px] sm:text-xs font-mono ${isDark ? "text-gray-500" : "text-gray-500"
                      }`}
                  >
                    REQUEST_URL: /undefined
                    <br />
                    METHOD: GET
                    <br />
                    STATUS: FAILED
                  </div>
                </div>
              </div>

              {/* Center - Main message */}
              <div className="text-center space-y-5 sm:space-y-6">
                <div
                  className={`w-12 h-12 relative z-50 sm:w-16 sm:h-16 mx-auto rounded-full ${isDark ? "bg-purple-950/50" : "bg-purple-100"
                    } flex items-center justify-center`}
                >
                  <MapPinXInside
                    className={`w-6 h-6 sm:w-8 sm:h-8 ${isDark ? "text-white" : "text-purple-600"
                      }`}
                  />
                </div>

                <div>
                  <h1
                    className={`text-xl sm:text-2xl font-bold mb-2 sm:mb-3 ${isDark ? "text-white" : "text-gray-900"
                      }`}
                  >
                    Page Missing
                  </h1>
                  <p
                    className={`text-sm sm:text-base ${isDark ? "text-gray-400" : "text-gray-600"
                      } leading-relaxed`}
                  >
                    This page seems to have been lost in translation. Let's get you
                    back to reading some great manga.
                  </p>
                </div>
              </div>

              {/* Right - Actions */}
              <div className="space-x-3 flex flex-row justify-center items-center flex-wrap sm:space-y-4 sm:space-x-0">
                <button
                  onClick={handleGoHome}
                  className={` w-fit md:w-full flex items-center justify-center gap-2 sm:gap-3 py-3 sm:py-4 px-4 sm:px-6 backdrop-blur-md border rounded-lg font-semibold text-white
                    transition duration-300 ease-in-out
                    ${isDark
                      ? "bg-purple-950/70 border-purple-700 hover:bg-purple-950/90 hover:border-purple-500"
                      : "bg-purple-800/80 border-purple-600 hover:bg-purple-600/90 hover:border-purple-500"
                    }`}
                >
                  <Home className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">Home</span>
                </button>

                <button
                  onClick={handleGoBack}
                  className={`w-fit md:w-full flex items-center justify-center gap-2 sm:gap-3 py-3 sm:py-4 px-4 sm:px-6 backdrop-blur-md border rounded-lg font-semibold text-white
                    transition duration-300 ease-in-out
                    ${isDark
                      ? "bg-green-900/70 border-green-500 hover:bg-green-500/90 hover:border-green-400"
                      : "bg-green-700/80 border-green-400 hover:bg-green-400/90 hover:border-green-0"
                    }`}
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">Back</span>
                </button>

                <button
                  onClick={handleRefresh}
                  className={`w-fit md:w-full flex items-center justify-center gap-2 sm:gap-3 py-3 sm:py-4 px-4 sm:px-6 backdrop-blur-md border rounded-lg font-semibold text-white
                    transition duration-300 ease-in-out
                    ${isDark
                      ? "bg-red-900/70 border-red-600 hover:bg-red-600/90 hover:border-red-500"
                      : "bg-red-700/80 border-red-500 hover:bg-red-500/90 hover:border-red-400"
                    }`}
                >
                  <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">Retry</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Footer */}
        <div
          className={`text-center mt-4 sm:mt-6 text-xs sm:text-sm ${isDark ? "text-gray-500" : "text-gray-500"
            }`}
        >
          <span className="font-mono">
            If this error persists, try clearing your browser cache
          </span>
        </div>
      </div>
    </div>
  );
}