import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Detectar preferencia del sistema
    useEffect(() => {
        const root = document.documentElement;

        if(isDarkMode) {
            root.setAttribute("data-bs-tbeme", "dark");
        } else {
            root.setAttribute("data-bs-tbeme", "light");
        }
    }, [isDarkMode]);

    // Aplicar clase global al body
    useEffect(() => {
        document.body.className = isDarkMode ? "bg-dark text-light" : "bg-light text-dark";
    }, [isDarkMode]);

    const toggleTheme = () => setIsDarkMode((prev) => !prev);

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
