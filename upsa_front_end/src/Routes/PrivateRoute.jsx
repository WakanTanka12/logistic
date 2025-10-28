import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * PrivateRoute — Protege rutas internas del sistema.
 * Si no hay usuario autenticado, redirige a /login.
 * Cuando JWT esté implementado, leerá el token desde localStorage.
 */

const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();

    // Simulación inicial: si no hay token, se redirige a login.
    const token = localStorage.getItem("token");
    const isLoggedIn = isAuthenticated || !!token;

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default PrivateRoute;
