import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();

    // Mientras verifica sesión
    if (loading) {
        return (
            <div className="d-flex flex-column justify-content-center align-items-center vh-100 text-muted">
                <div className="spinner-border text-primary mb-3" role="status" />
                <p className="mb-0">Verificando sesión...</p>
            </div>
        );
    }

    // No autenticada → al login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Autenticada → deja pasar
    return children;
}
