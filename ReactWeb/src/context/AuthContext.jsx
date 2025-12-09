// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";


const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);             // datos del usuario
    const [token, setToken] = useState(
        localStorage.getItem("token") || null
    );
    const [loading, setLoading] = useState(true);

    // 🟢 Al montar la app, intento restaurar la sesión
    useEffect(() => {
        const init = async () => {
            try {
                const storedToken = localStorage.getItem("token");
                const storedUser = localStorage.getItem("user");

                if (!storedToken) {
                    setLoading(false);
                    return;
                }

                setToken(storedToken);

                if (storedUser) {
                    // ya tengo usuario guardado
                    setUser(JSON.parse(storedUser));
                    setLoading(false);
                    return;
                }

                // (opcional) si tienes /auth/me, podrías llamar aquí
                // const res = await api.get("/auth/me");
                // setUser(res.data);
                // localStorage.setItem("user", JSON.stringify(res.data));

                setLoading(false);
            } catch (err) {
                console.warn("Sesión inválida, limpiando...", err);
                logout(false);
            }
        };

        init();
    }, []);

    // 🟢 Login: guardar token y usuario
    const login = (newToken, userData) => {
        setToken(newToken);
        setUser(userData);

        localStorage.setItem("token", newToken);
        if (userData) {
            localStorage.setItem("user", JSON.stringify(userData));
        }
    };

    // 🔴 Logout: limpiar todo
    const logout = (redirect = true) => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
        if (redirect) {
            window.location.href = "/login";
        }
    };

    const value = {
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
