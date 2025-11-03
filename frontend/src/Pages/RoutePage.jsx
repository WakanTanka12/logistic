import React from "react";
import { Routes, Route } from "react-router-dom";
import RouteList from "../components/Route/RouteList";
import RouteForm from "../components/Route/RouteForm";

const RoutePage = () => (
    <Routes>
        <Route index element={<RouteList />} />
        <Route path="add" element={<RouteForm />} />
        <Route path="edit/:id" element={<RouteForm />} />
    </Routes>
);

export default RoutePage;
