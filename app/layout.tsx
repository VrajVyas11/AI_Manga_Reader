
// RootLayout.tsx (server component)
import React, { Suspense } from "react";
import TanstackProvider from "@/app/providers/TanstackProvider";
import { MangaProvider } from "@/app/providers/MangaContext";
import LoadingSpinner from "./Components/LoadingSpinner";
import "./globals.css";
import TopNavbar from "./Components/TopNavbar";
import { ThemeProviderClient } from "./providers/ThemeProviderClient";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>{/* your scripts */}</head>
      <body cz-shortcut-listen="true">
        <Suspense fallback={<LoadingSpinner text="Please Wait..." />}>
          <TanstackProvider>
            <MangaProvider>
              <ThemeProviderClient>

                <TopNavbar />
                {children}

              </ThemeProviderClient>
            </MangaProvider>
          </TanstackProvider>
        </Suspense>
      </body>
    </html>
  );
}