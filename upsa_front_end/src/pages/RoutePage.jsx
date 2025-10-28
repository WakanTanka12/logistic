import React from "react";
import { Routes, Route } from "react-router-dom";
import RouteList from "../components/Route/RouteList";
import RouteForm from "../components/Route/RouteForm";

/**
 * RoutePage — Gestiona rutas internas:
 * /routes, /routes/add, /routes/edit/:id
 */
const RoutePage = () => {
    return (
        <Routes>
            <Route index element={<RouteList />} />
            <Route path="add" element={<RouteForm />} />
            <Route path="edit/:id" element={<RouteForm />} />
        </Routes>
    );
};

export default RoutePage;
