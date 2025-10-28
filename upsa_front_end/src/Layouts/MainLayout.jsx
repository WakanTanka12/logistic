import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";

/**
 * MainLayout
 * Mantiene la estructura general: header + contenido + footer.
 * El <Outlet /> representa las rutas internas (Department, Employee, etc.)
 */

const MainLayout = () => {
    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            {/* 🔹 Header global */}
            <Header />

            {/* 🔹 Contenido dinámico */}
            <main className="flex-fill container py-4">
                <Outlet />
            </main>

            {/* 🔹 Footer global */}
            <Footer />
        </div>
    );
};

export default MainLayout;
