// ThemeProviderClient.tsx (client component)
"use client";

import React, { useEffect, useState, ReactNode } from "react";
import { ThemeContext } from "./ThemeContext";

interface ThemeProviderClientProps {
    children: ReactNode;
}

export const ThemeProviderClient: React.FC<ThemeProviderClientProps> = ({
    children,
}) => {
    const [theme, setTheme] = useState<"light" | "dark">("dark");

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
        if (savedTheme) {
            setTheme(savedTheme);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <div
                className={theme === "dark" ? "bg-[#070920] text-white" : "bg-white text-black"}
                style={{
                    fontFamily: "'Poppins', sans-serif",
                    lineHeight: "1.6",
                    WebkitTextSizeAdjust: "100%",
                    WebkitFontSmoothing: "antialiased",
                    textRendering: "optimizeLegibility",
                    MozOsxFontSmoothing: "grayscale",
                    touchAction: "manipulation",
                    backgroundColor: theme === "dark" ? "#070920" : "white",
                    color: theme === "dark" ? "white" : "black",
                }}
            >
                <div
                    className={`pt-16 md:pt-20 relative `}
                >
                    <div className="fixed inset-0 pointer-events-none">
                        <div className="absolute z-10  inset-0 bg-[linear-gradient(rgba(255,255,255,.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.07)_1px,transparent_1px)] bg-[size:72px_72px]"></div>
                        <div className={`absolute z-20  inset-0 ${theme === "dark" ? "text-white bg-black/50" : "text-black bg-white/50"
                            }`}></div>
                    </div>
                    {children}
                </div>
            </div>
        </ThemeContext.Provider>
    );
};