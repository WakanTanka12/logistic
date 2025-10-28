import React from "react";
import { Routes, Route } from "react-router-dom";
import PackageList from "../components/Package/PackageList";
import PackageForm from "../components/Package/PackageForm";

/**
 * PackagePage — Gestiona rutas internas:
 * /packages, /packages/add, /packages/edit/:id
 */
const PackagePage = () => {
    return (
        <Routes>
            <Route index element={<PackageList />} />
            <Route path="add" element={<PackageForm />} />
            <Route path="edit/:id" element={<PackageForm />} />
        </Routes>
    );
};

export default PackagePage;
