import React, { Suspense } from 'react';
import TanstackProvider from '@/app/providers/TanstackProvider';
import { MangaProvider } from '@/app/providers/MangaContext';
import LoadingSpinner from './Components/LoadingSpinner';
import './globals.css';
import TopNavbar from './Components/TopNavbar';
import { ThemeProvider } from './providers/ThemeContext';
import { cookies } from "next/headers";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const theme = (await cookieStore).get("theme")?.value || "dark"; // default to dark

  // Now you can conditionally set styles/classes based on theme
  const isDark = theme === "dark";

  return (
    <html lang="en">
      <head>
        {/* your scripts */}
      </head>
      <body
        style={{
          fontFamily: "'Poppins', sans-serif",
          lineHeight: "1.6",
          WebkitTextSizeAdjust: "100%",
          WebkitFontSmoothing: "antialiased",
          textRendering: "optimizeLegibility",
          MozOsxFontSmoothing: "grayscale",
          touchAction: "manipulation",
          backgroundColor: isDark ? "#070920" : "white",
          color: isDark ? "white" : "black",
        }}
        cz-shortcut-listen="true"
        className={isDark ? "bg-[#070920] text-white" : "bg-white text-black"}
      >
        <TanstackProvider>
          <MangaProvider>
            <ThemeProvider>
              <Suspense fallback={<LoadingSpinner text="Please Wait..." />}>
                <TopNavbar />
                <div
                  className={`pt-16 md:pt-20 ${
                    isDark ? "text-white bg-black/50" : "text-black bg-white/50"
                  }`}
                >
                  <div className="fixed inset-0 pointer-events-none -z-10">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.07)_1px,transparent_1px)] bg-[size:72px_72px]"></div>
                  </div>
                  {children}
                </div>
              </Suspense>
            </ThemeProvider>
          </MangaProvider>
        </TanstackProvider>
      </body>
    </html>
  );
}