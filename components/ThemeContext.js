"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext({
  isDark: false,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem("sync-theme");
    if (saved) {
      setIsDark(saved === "dark");
    }
  }, []);

  // Update body class for global CSS access
  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark-mode');
      document.body.style.backgroundColor = '#0A0A0A';
      document.body.style.color = '#FFFFFF';
    } else {
      document.body.classList.remove('dark-mode');
      document.body.style.backgroundColor = '#F9F9F9';
      document.body.style.color = '#111111';
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem("sync-theme", next ? "dark" : "light");
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <div className={`contents ${isDark ? "dark" : ""}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
