"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = "classic" | "modern";
type Mode = "light" | "dark";

interface ThemeContextType {
    theme: Theme;
    mode: Mode;
    setTheme: (theme: Theme) => void;
    toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>("classic");
    const [mode, setMode] = useState<Mode>("dark");

    // Restore preferences on mount
    useEffect(() => {
        const savedTheme = (localStorage.getItem("pulsepost_theme") as Theme) || "classic";
        const savedMode = (localStorage.getItem("pulsepost_mode") as Mode) || "dark";
        setThemeState(savedTheme);
        setMode(savedMode);
        applyTheme(savedTheme, savedMode);
    }, []);

    function applyTheme(t: Theme, m: Mode) {
        const root = document.documentElement;
        root.setAttribute("data-theme", t);
        root.classList.toggle("dark", m === "dark");
    }

    function setTheme(t: Theme) {
        setThemeState(t);
        localStorage.setItem("pulsepost_theme", t);
        applyTheme(t, mode);
    }

    function toggleMode() {
        const next = mode === "dark" ? "light" : "dark";
        setMode(next);
        localStorage.setItem("pulsepost_mode", next);
        applyTheme(theme, next);
    }

    return (
        <ThemeContext.Provider value={{ theme, mode, setTheme, toggleMode }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
    return ctx;
}
