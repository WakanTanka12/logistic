import React from "react";
import { Routes, Route } from "react-router-dom";
import PackageList from "../components/Package/PackageList";
import PackageForm from "../components/Package/PackageForm";

const OrderPackagesPage = () => {
    return (
        <Routes>
            <Route index element={<PackageList />} />
            <Route path="add" element={<PackageForm />} />
            <Route path="edit/:id" element={<PackageForm />} />
        </Routes>
    );
};

export default OrderPackagesPage;
