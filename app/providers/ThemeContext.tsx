"use client"
import React, {
  createContext,
  useEffect,
  useState,
  ReactNode,
  FC,
  useContext,
} from "react";

// Define the shape of the context value
interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

// Create the context with undefined initial value
export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  // On mount, read theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as
      | "light"
      | "dark"
      | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // When theme changes, save to localStorage
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};