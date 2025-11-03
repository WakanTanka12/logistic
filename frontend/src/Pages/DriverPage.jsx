import React from "react";
import { Routes, Route } from "react-router-dom";
import DriverList from "../components/Driver/DriverList";
import DriverForm from "../components/Driver/DriverForm";

const DriverPage = () => (
    <Routes>
        <Route index element={<DriverList />} />
        <Route path="add" element={<DriverForm />} />
        <Route path="edit/:id" element={<DriverForm />} />
    </Routes>
);

export default DriverPage;
