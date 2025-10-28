import React, { createContext, useContext, useState, useEffect, useMemo } from "react";

/**
 * AuthContext — Controla la autenticación global del sistema.
 * Compatible con Vite y listo para integrar JWT.
 */

const AuthContext = createContext(undefined);

function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    // 🔹 Verificar token en localStorage al iniciar la app
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsAuthenticated(true);
            setUser({ username: "demoUser" }); // Placeholder temporal
        }
    }, []);

    // 🔐 Simulación de inicio de sesión (reemplazar con API JWT)
    const login = async (username, password) => {
        if (username === "admin" && password === "admin") {
            const fakeToken = "demo-token-12345";
            localStorage.setItem("token", fakeToken);
            setIsAuthenticated(true);
            setUser({ username });
            return true;
        }
        return false;
    };

    // 🚪 Cerrar sesión
    const logout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setUser(null);
    };

    // 🧠 useMemo previene recrear funciones innecesariamente
    const value = useMemo(
        () => ({ isAuthenticated, user, login, logout }),
        [isAuthenticated, user]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

export { AuthProvider, useAuth };
